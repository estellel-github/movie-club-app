import "express";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        user_id: string;
        role: UserRoles;
      };
    }
  }
}

export interface UserRequest extends Express.Request {
  user?: {
    user_id: string;
    role: UserRoles;
  };
  params: {
    user_id: string;
  };
}

export interface UpdateUserBody {
  name?: string;
  username?: string;
  email?: string;
  intro_msg?: string;
}
