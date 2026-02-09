import type { Position, TLE } from "../../types/satellite.js";
import { getPosition, getSatRec } from "./propagation.js";

const calculateDistance = (pos1: Position, pos2: Position) => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
};

const timeTillCloser = (distance: number, relativeVelocity: number) => {
  return distance / relativeVelocity;
};

const stepsTillCloser = (
  distance: number,
  relativeVelocity: number, // in km/s
  step: number, // in seconds
) => {
  const time = timeTillCloser(distance, relativeVelocity);
  return Math.ceil(time / step);
};

export const calculateApproachesOneTLE = (
  chosenSatPositions: Position[],
  tle2: TLE,
  maxDistance: number,
  step: number, // in seconds
) => {
  const approaches: { tle2: TLE; time: Date; distance: number }[] = [];

  const tle2SatRec = getSatRec(tle2);

  if (chosenSatPositions.length === 0) {
    console.warn("No positions calculated for chosen satellite");
    return [];
  }
  let stepsToWait = 0;
  for (
    let currentStep = 0;
    currentStep < chosenSatPositions.length;
    currentStep++
  ) {
    if (stepsToWait > 0) {
      stepsToWait--;
      continue;
    }
    const chosenSatPosition = chosenSatPositions[currentStep];
    if (chosenSatPosition) {
      const tle2Position = getPosition(
        tle2SatRec,
        new Date(chosenSatPosition.time),
      );
      if (tle2Position) {
        const distance = calculateDistance(chosenSatPosition, tle2Position);
        if (distance < maxDistance * 1.05) {
          approaches.push({
            tle2: tle2,
            time: chosenSatPosition.time,
            distance,
          });
        } else {
          stepsToWait = stepsTillCloser(distance - maxDistance, 20, step) - 1;
        }
      }
    }
  }
  return approaches;
};

export const calculateApproaches = (
  chosenSatPositions: Position[],
  tles: TLE[],
  maxDistance: number,
  step: number, // in seconds
) => {
  const startTime = performance.now();

  const approaches = tles.reduce(
    (acc, tle) => {
      const currentApproaches = calculateApproachesOneTLE(
        chosenSatPositions,
        tle,
        maxDistance,
        step, // step in seconds
      );
      return acc.concat(currentApproaches);
    },
    [] as { tle2: TLE; time: Date; distance: number }[],
  );

  const endTime = performance.now();
  console.log(`Process took ${(endTime - startTime).toFixed(2)}ms`);
  console.log("Approaches found:", approaches?.length);

  return approaches;
};
