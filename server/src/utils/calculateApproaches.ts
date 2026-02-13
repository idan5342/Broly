import { get } from "node:http";
import type { Position, TLE } from "../../types/satellite.js";
import { Timeframe } from "../../types/time.js";
import {
  getPosition,
  getSatellitePositions,
  getSatRec,
} from "./propagation.js";

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
  chosenTLE: TLE,
  chosenSatPositions: Position[],
  tle2: TLE,
  maxDistance: number,
  step: number, // in seconds
) => {
  const approaches: { id: string; tle2: TLE; time: Date; distance: number }[] =
    [];

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
          const approach = getCloseApproach(
            chosenTLE,
            tle2,
            {
              start: new Date(
                new Date(chosenSatPosition.time).getTime() - (step - 1) * 1000,
              ),
              end: new Date(
                new Date(chosenSatPosition.time).getTime() + (step - 1) * 1000,
              ),
            },
            0.5,
          );
          if (!approaches.length) {
            approaches.push({
              id: `${tle2.satellite}-${approach.time.getTime()}`,
              tle2: tle2,
              time: approach.time,
              distance: approach.distance,
            });
          } else {
            const lastApproach = approaches[approaches.length - 1];
            if (
              lastApproach?.id !==
              `${tle2.satellite}-${approach.time.getTime()}`
            ) {
              approaches.push({
                id: `${tle2.satellite}-${approach.time.getTime()}`,
                tle2: tle2,
                time: approach.time,
                distance: approach.distance,
              });
            }
          }
        } else {
          stepsToWait = stepsTillCloser(distance - maxDistance, 20, step) - 1;
        }
      }
    }
  }
  return approaches;
};

export const calculateApproaches = (
  chosenTLE: TLE,
  chosenSatPositions: Position[],
  tles: TLE[],
  maxDistance: number,
  step: number, // in seconds
) => {
  const startTime = performance.now();

  const approaches = tles.reduce(
    (acc, tle) => {
      const currentApproaches = calculateApproachesOneTLE(
        chosenTLE,
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

const getCloseApproach = (
  chosenTLE: TLE,
  tle2: TLE,
  timeframe: Timeframe,
  step: number,
) => {
  const chosenSatRec = getSatRec(chosenTLE);
  const tle2SatRec = getSatRec(tle2);

  let closestApproach = { time: timeframe.start, distance: Infinity };

  for (
    let time = timeframe.start.getTime();
    time <= timeframe.end.getTime();
    time += step * 1000
  ) {
    const currentTime = new Date(time);
    const chosenSatPosition = getPosition(chosenSatRec, currentTime);
    const tle2Position = getPosition(tle2SatRec, currentTime);

    if (chosenSatPosition && tle2Position) {
      const distance = calculateDistance(chosenSatPosition, tle2Position);
      if (distance < closestApproach.distance) {
        closestApproach = { time: currentTime, distance: distance };
      }
    }
  }

  return closestApproach;
};
