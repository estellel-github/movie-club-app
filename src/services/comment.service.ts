import type { Repository, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { Comment } from "../models/comment.entity.js";
import { CustomError } from "../utils/customError.js";
import { ActivityLogService } from "../services/activity.service.js";
import { Like } from "typeorm";
import { User } from "../models/user.entity.js";
import { Event } from "../models/event.entity.js";

type CommentFilters = {
  event_id?: string;
  user_id?: string;
  search?: string;
};

export class CommentService {
  private commentRepo: Repository<Comment>;
  private activityLogService: ActivityLogService;
  private userRepo: Repository<User>;
  private eventRepo: Repository<Event>;

  constructor() {
    this.commentRepo = AppDataSource.getRepository(Comment);
    this.eventRepo = AppDataSource.getRepository(Event);
    this.userRepo = AppDataSource.getRepository(User);
    this.activityLogService = new ActivityLogService();
  }

  // Fetch paginated and filtered comments
  async getFilteredComments(
    page: number,
    limit: number,
    filters: CommentFilters,
  ): Promise<{
    comments: Comment[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const where: FindOptionsWhere<Comment> = {};

      // Apply filters
      if (filters.event_id) {
        where.event_id = filters.event_id;
      }
      if (filters.user_id) {
        where.user_id = filters.user_id;
      }
      if (filters.search) {
        where.content = Like(`%${filters.search}%`); // Search in the comment content
      }

      // Fetch comments with pagination
      const [comments, total] = await this.commentRepo.findAndCount({
        where,
        order: { created_at: "DESC" },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        comments,
        total,
        page,
        limit,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve filtered comments", 500);
    }
  }

  async createComment(
    eventId: string,
    userId: string,
    content: string,
  ): Promise<Comment> {
    try {
      // Create and save the comment
      const comment = this.commentRepo.create({
        event_id: eventId,
        user_id: userId,
        content,
      });

      const savedComment = await this.commentRepo.save(comment);

      // Fetch user nickname and event title
      const user = await this.userRepo.findOneBy({ user_id: userId });
      const event = await this.eventRepo.findOneBy({ event_id: eventId });

      if (!user || !user.username) {
        throw new CustomError("User not found", 404);
      }

      if (!event || !event.title) {
        throw new CustomError("Event not found", 404);
      }

      const username = user.username;
      const eventTitle = event.title;

      // Log the comment addition
      await this.activityLogService.logCommentAdded(
        eventId,
        userId,
        content,
        username,
        eventTitle,
      );

      return savedComment;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to create comment", 500);
    }
  }

  async updateComment(
    comment_id: string,
    user_id: string,
    content: string,
  ): Promise<Comment> {
    try {
      const comment = await this.commentRepo.findOneBy({ comment_id, user_id });

      if (!comment) {
        throw new CustomError("Comment not found", 404);
      }

      comment.content = content;
      const updatedComment = await this.commentRepo.save(comment);

      return updatedComment;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to update comment", 500);
    }
  }

  async deleteComment(comment_id: string, user_id: string): Promise<void> {
    try {
      const comment = await this.commentRepo.findOneBy({ comment_id, user_id });

      if (!comment) {
        throw new CustomError("Comment not found", 404);
      }

      await this.commentRepo.delete(comment_id);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to delete comment", 500);
    }
  }
}
