import type { Request, Response } from "express";
import { CommentService } from "../services/comment.service.js";
import type { AuthenticatedRequest } from "types/express.js";

const commentService = new CommentService();

export const getCommentsByEvent = async (req: Request, res: Response) => {
  try {
    const comments = await commentService.getCommentsByEvent(
      req.params.eventId,
    );
    res.status(200).json(comments);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { content } = req.body;
    const user_id = req.user?.user_id; // Authenticated user ID
    const event_id = req.params.eventId;

    const newComment = await commentService.createComment({
      content,
      user_id,
      event_id,
    });
    res.status(201).json(newComment);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

export const updateComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { content } = req.body;
    const user_id = req.user?.user_id;

    if (!user_id) {
      throw new Error("User ID is required");
    }
    const { commentId: comment_id } = req.params;

    const updatedComment = await commentService.updateComment(
      comment_id,
      user_id,
      content,
    );

    res.status(200).json(updatedComment);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      throw new Error("User ID is required");
    }
    const { commentId: comment_id } = req.params;

    await commentService.deleteComment(comment_id, user_id);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};
