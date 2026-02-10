import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import type { Request, Response } from "express";

export const getTLEs = (req: Request, res: Response) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // Read the tle.json file
  const tlePath = path.join(__dirname, "../../../data/tles.json");
  const tleData = JSON.parse(fs.readFileSync(tlePath, "utf-8"));
  res.json(tleData);
};
