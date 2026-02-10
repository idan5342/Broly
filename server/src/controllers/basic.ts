import type { Request, Response } from "express";

export const getHealth = (req: Request, res: Response) => {
  res.send("GOOD").status(200);
};