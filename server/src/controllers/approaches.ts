import { filterTLEs, getTLEsFromJSON } from "../utils/satellitesFilter.js";
import type { Request, Response } from "express";
import { runWorkersForApproaches } from "./workersManager.js";
import { Timeframe } from "../../types/time.js";

export const getApproaches = async (req: Request, res: Response) => {
  try {
    const { tle: chosenTLE, step, distance } = req.body;

    const timeframe: Timeframe = {
      start: new Date(),
      end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    };

    const tleData = getTLEsFromJSON()
    const filteredTLEs = filterTLEs(tleData, chosenTLE, distance);

    console.log(`Calculating approaches for ${chosenTLE.satellite} against ${filteredTLEs.length} TLEs (filtered from ${tleData.length})`);

    if (filteredTLEs.length === 0) {
      console.warn("No TLEs found within the specified distance");
    }
    const approaches = await runWorkersForApproaches(filteredTLEs, chosenTLE, timeframe, step, distance);
    res.json(approaches);
  } catch (error) {
    console.error("Error getting approaches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
