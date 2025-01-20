import type { Request, Response, NextFunction } from "express";
import { CommentService } from "@/services/comment.service.js";
import { CustomError } from "@/utils/customError.js";

const commentService = new CommentService();

export const getCommentsByEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const comments = await commentService.getCommentsByEvent(
      req.params.eventId,
    );
    res.status(200).json(comments);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to get comments", 500),
    );
  }
};

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { content } = req.body;
    const user_id = req.user?.user_id;
    const event_id = req.params.eventId;

    if (!content || !user_id || !event_id) {
      throw new CustomError("Missing required fields", 400);
    }

    const newComment = await commentService.createComment({
      content,
      user_id,
      event_id,
    });
    res.status(201).json(newComment);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to create comment", 500),
    );
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { content } = req.body;
    const user_id = req.user?.user_id;

    if (!user_id) {
      throw new CustomError("User ID is required", 401);
    }

    const { commentId: comment_id } = req.params;

    if (!content || !comment_id) {
      throw new CustomError("Missing required fields", 400);
    }

    const updatedComment = await commentService.updateComment(
      comment_id,
      user_id,
      content,
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to update comment", 500),
    );
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.user_id;
    const { commentId: comment_id } = req.params;

    if (!user_id || !comment_id) {
      throw new CustomError("Missing required fields", 400);
    }

    await commentService.deleteComment(comment_id, user_id);
    res.status(204).send();
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to delete comment", 500),
    );
  }
};
