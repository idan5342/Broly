import type { TLE } from "../../types/satellite.js";
import { getHeights, parseTLE } from "./propagation.js";

export const filterTLEs = (tles: TLE[], chosenTLE: TLE, maxDistance: number) => {
    const { perigee: chosenPerigee, apogee: chosenApogee } = getHeights(chosenTLE)
    return tles.filter(tle => {
        if (new Date().getTime() - parseTLE(tle).date.getTime() > 7 * 24 * 60 * 60 * 1000) return false
        
        const { perigee, apogee } = getHeights(tle)
        const farPerigee = chosenPerigee > apogee + maxDistance * 1.1
        const farApogee = chosenApogee < perigee - maxDistance * 1.1
        return !farPerigee && !farApogee
        })
}