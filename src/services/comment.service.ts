import type { Repository } from "typeorm";
import { AppDataSource } from "@/config/database.js";
import { Comment } from "@/models/comment.entity.js";
import { CustomError } from "../utils/customError.js";
import { ActivityLogService } from "./activity.service.js"; // Import ActivityLogService
import { UserService } from "./user.service.js";

const userService = new UserService();

export class CommentService {
  private commentRepo: Repository<Comment>;
  private activityLogService: ActivityLogService;

  constructor() {
    this.commentRepo = AppDataSource.getRepository(Comment);
    this.activityLogService = new ActivityLogService();
  }

  async getCommentsByEvent(event_id: string): Promise<Comment[]> {
    try {
      const comments = await this.commentRepo.find({ where: { event_id } });
      if (!comments || comments.length === 0) throw new CustomError("No comments found for this event or event id is not valid", 404);
      return comments;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve comments", 500);
    }
  }

  async createComment(data: Partial<Comment>): Promise<Comment> {
    try {
      const comment = this.commentRepo.create(data);
      const savedComment = await this.commentRepo.save(comment);

      await this.activityLogService.logCommentAdded(
        savedComment.event_id,
        savedComment.user_id,
        savedComment.content,
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
        throw new CustomError("Comment not found or unauthorized", 404);
      }

      // Check if the authenticated user is the owner of the comment
      if (comment.user_id !== user_id) {
        throw new CustomError("You are not authorized to update this comment", 403); // Forbidden
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
      const user = await userService.getUserById(user_id);

      if (!comment) {
        throw new CustomError("Comment not found or unauthorized", 404);
      }

      // Check if the authenticated user is the owner or an admin
      if (comment.user_id !== user_id && user.role !== "admin") {
        throw new CustomError("You are not authorized to delete this comment", 403); // Forbidden
      }

      // Later, optionally, log the comment deletion activity (if needed)

      await this.commentRepo.delete(comment_id);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to delete comment", 500);
    }
  }
}
