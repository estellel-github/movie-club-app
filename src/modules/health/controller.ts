import type { Request, Response } from "express";

export const getHealthStatus = (_: Request, res: Response) => {
  res.status(200).send("OK");
};
