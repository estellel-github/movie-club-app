import type { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: {
    user_id: string;
    role: string;
  };
}
