import type { TLE } from "../../types/satellite.js";
import { getHeights } from "./propagation.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

export const filterTLEs = (
  tles: TLE[],
  chosenTLE: TLE,
  maxDistance: number
) => {
  const { perigee: chosenPerigee, apogee: chosenApogee } =
    getHeights(chosenTLE);
  return tles.filter((tle) => {
    // if (new Date().getTime() - parseTLE(tle).date.getTime() > 7 * 24 * 60 * 60 * 1000) return false
    if (tle.satellite === chosenTLE.satellite) return false;
    const { perigee, apogee } = getHeights(tle);
    const farPerigee = chosenPerigee > apogee + maxDistance * 1.1;
    const farApogee = chosenApogee < perigee - maxDistance * 1.1;
    return !farPerigee && !farApogee;
  });
};

export const getTLEsFromJSON = () => {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
      const tlePath = path.join(__dirname, "../../../data/tles.json");
      const tleData = JSON.parse(fs.readFileSync(tlePath, "utf-8"));

      return tleData as TLE[];
}
