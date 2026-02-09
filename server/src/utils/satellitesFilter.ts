import type { TLE } from "../../types/satellite.js";
import { getHeights, parseTLE } from "./propagation.js";

export const filterTLEs = (tles: TLE[], chosenTLE: TLE, maxDistance: number) => {
    const { perigee: chosenPerigee, apogee: chosenApogee } = getHeights(chosenTLE)
    return tles.filter(tle => {
        if (new Date().getTime() - parseTLE(tle).date.getTime() > 7 * 24 * 60 * 60 * 1000) return false
        
        const { perigee, apogee } = getHeights(tle)
        const closePerigee = Math.abs(perigee - chosenPerigee) < maxDistance * 1.1
        const closepPerigeeToApogee = Math.abs(perigee - chosenApogee) < maxDistance * 1.1
        const closeApogee = Math.abs(apogee - chosenApogee) < maxDistance * 1.1
        const closeApogeeToPerigee = Math.abs(apogee - chosenPerigee) < maxDistance * 1.1
        return closePerigee || closepPerigeeToApogee || closeApogee || closeApogeeToPerigee
        })
}