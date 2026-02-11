import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { filterTLEs } from "../utils/satellitesFilter.js";
import type { Timeframe } from "../../types/time.js";
import type { Position, TLE } from "../../types/satellite.js";
import { getSatellitePositions, getSatRec } from "../utils/propagation.js";
import type { Request, Response } from "express";

import os from "os";
import { Worker } from "worker_threads";

const CPU_COUNT = os.cpus().length;
const WORKERS = Math.max(1, CPU_COUNT - 1);

function chunk<T>(arr: T[], size: number): T[][] {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

// const tle = {
//   satellite: "STARLINK-36494",
//   line1:
//     "1 67331U 26002AC  26039.91670139  .00001888  00000+0  76265-4 0  9990",
//   line2:
//     "2 67331  43.0000 127.7974 0001682 313.5669 203.4882 15.28401517  6036",
// };

const timeframe: Timeframe = {
  start: new Date(),
  end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 week from now
};
const step = 10;

async function run(tles: TLE[], chosenTLE: TLE) {
  let approaches: { tle2: TLE; time: Date; distance: number }[] = [];

  const chosenSatPositions: Position[] = getSatellitePositions(
    getSatRec(chosenTLE),
    timeframe,
    step
  );

  const BATCH_SIZE = tles.length / 5;

  const batches = chunk(tles, BATCH_SIZE);
  let nextBatch = 0;

  function spawnWorker(): Promise<void> {
    return new Promise((resolve) => {
      if (nextBatch >= batches.length) return resolve();
      const __dirname = path.dirname(fileURLToPath(import.meta.url));

      const worker = new Worker(path.resolve(__dirname, "worker.js"));

      const batch = batches[nextBatch++];
      worker.postMessage({
        chosenSatPositions,
        batch,
        maxDistance: 100,
        step,
      });

      worker.on("message", (results) => {
        // Save to DB here
        console.log("Got", results.length, "approaches from worker");
        approaches = approaches.concat(results);
        worker.terminate();
        resolve();
      });
    });
  }

  const pool = Array.from({ length: WORKERS }, spawnWorker);
  await Promise.all(pool);

  return approaches;
}

export const getApproaches = async (req: Request, res: Response) => {
  try {
    const { tle: chosenTLE } = req.body;

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // Read the tle.json file
    const tlePath = path.join(__dirname, "../../../data/tles.json");
    const tleData = JSON.parse(fs.readFileSync(tlePath, "utf-8"));

    console.log("TLE data loaded:", tleData.length, "entries");

    const filteredTLEs = filterTLEs(tleData, chosenTLE, 100);

    console.log("Filtered TLEs:", filteredTLEs.length, "entries");

    if (filteredTLEs.length === 0) {
      console.warn("No TLEs found within the specified distance");
    }
    const approaches = await run(filteredTLEs, chosenTLE);
    res.json(approaches);
  } catch (error) {
    console.error("Error getting approaches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
