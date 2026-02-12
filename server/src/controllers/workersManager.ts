import * as path from "path";
import { fileURLToPath } from "url";
import type { Timeframe } from "../../types/time.js";
import type { Position, TLE } from "../../types/satellite.js";
import { getSatellitePositions, getSatRec } from "../utils/propagation.js";
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



export async function runWorkersForApproaches(
    tles: TLE[],
    chosenTLE: TLE,
    timeframe: Timeframe,
    step: number,
    maxDistance: number
) {
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
        maxDistance,
        step,
      });

      worker.on("message", (results) => {
        // console.log("Got", results.length, "approaches from worker");
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