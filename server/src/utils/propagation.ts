import * as satellite from 'satellite.js'
import TLEParser from 'tle'
import type { TLE } from '../../types/satellite.js'
import { mu } from './consts.js'

export const getSatRec = (tle: TLE) => satellite.twoline2satrec(tle.line1, tle.line2)

export const propagate = (satRec: satellite.SatRec, time: Date) => {
    return satellite.propagate(satRec, time)
}

export const parseTLE = (tle: TLE) => {
    const strTLE = `${tle.satellite}\n${tle.line1}\n${tle.line2}`
    const parsed = TLEParser.parse(strTLE)
    return parsed
}

export const getHeights = (tle: TLE) => {
    const parsedTLE = parseTLE(tle)
    const meanMotion = parsedTLE.motion // in rev/day
    const eccentricity = parsedTLE.eccentricity
    const meanMotionRadsPerSec = (meanMotion * 2 * Math.PI) / 86400;
    const semiMajorAxis = Math.pow(mu / Math.pow(meanMotionRadsPerSec, 2), 1/3);
    const perigee = semiMajorAxis * (1 - eccentricity);
    const apogee = semiMajorAxis * (1 + eccentricity);
    return {
        semiMajorAxis,
        perigee,
        apogee
    }
}
