import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { Comment } from "../models/comment.entity.js";

export class CommentService {
  private commentRepo: Repository<Comment>;

  constructor() {
    this.commentRepo = AppDataSource.getRepository(Comment);
  }

  async getCommentsByEvent(event_id: string): Promise<Comment[]> {
    return this.commentRepo.find({ where: { event_id } });
  }

  async createComment(data: Partial<Comment>): Promise<Comment> {
    const comment = this.commentRepo.create(data);
    return this.commentRepo.save(comment);
  }

  async updateComment(
    comment_id: string,
    user_id: string,
    content: string,
  ): Promise<Comment> {
    const comment = await this.commentRepo.findOneBy({ comment_id, user_id });
    if (!comment) throw new Error("Comment not found or unauthorized");
    comment.content = content;
    return this.commentRepo.save(comment);
  }

  async deleteComment(comment_id: string, user_id: string): Promise<void> {
    const comment = await this.commentRepo.findOneBy({ comment_id, user_id });
    if (!comment) throw new Error("Comment not found or unauthorized");
    await this.commentRepo.delete(comment_id);
  }
}
