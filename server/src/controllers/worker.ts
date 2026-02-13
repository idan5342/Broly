import { parentPort } from "worker_threads";
import { calculateApproaches } from "../utils/calculateApproaches.js";

if (!parentPort) {
  throw new Error("Not a worker");
}

parentPort.on("message", (msg) => {
  const { chosenTLE, chosenSatPositions, batch, maxDistance, step } = msg;

  const results = calculateApproaches(
    chosenTLE,
    chosenSatPositions,
    batch,
    maxDistance,
    step,
  );

  parentPort!.postMessage(results);
});
