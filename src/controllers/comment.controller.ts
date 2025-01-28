import type { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service.js";
import { CustomError } from "../utils/customError.js";

const commentService = new CommentService();

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page = 1, limit = 0, event_id, user_id, search } = req.query;

    const result = await commentService.getFilteredComments(
      Number(page),
      Number(limit),
      {
        event_id: event_id as string,
        user_id: user_id as string,
        search: search as string,
      },
    );

    res.status(200).json(result);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to retrieve comments", 500),
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
    const eventId = req.params.event_id;
    const targetUserId = req.params.target_user_id;

    const newComment = await commentService.createComment(
      eventId,
      targetUserId,
      content,
    );
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { comment_id, target_user_id } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      throw new CustomError("Content is required", 400);
    }

    const updatedComment = await commentService.updateComment(
      comment_id,
      target_user_id,
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
    const { comment_id, target_user_id } = req.params;

    await commentService.deleteComment(comment_id, target_user_id);
    res.status(204).send();
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to delete comment", 500),
    );
  }
};
