import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as satellite from 'satellite.js'

// Gravitational constant for Earth (km^3 / sec^2)
const mu = 398600.4418;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the tle.json file
const tlePath = path.join(__dirname, '../../data/tles.json');
const tleData = JSON.parse(fs.readFileSync(tlePath, 'utf-8'));

// Get a random TLE from the data
const randomTle = tleData[Math.floor(Math.random() * tleData.length)];

console.log('Selected TLE:', randomTle);

const satRec =  satellite.twoline2satrec(randomTle.line1, randomTle.line2)

const {
  ecco,          // eccentricity
  no             // mean motion (rev/day)
} = satRec;

// console.log(satRec);

// Convert mean motion (rev/day) to radians/sec
// mean motion in rad/sec: no * 2π rad / (86400 sec)
console.log("Mean Motion (rev/day):", no);
const n_radPerSec = no * 2 * Math.PI / 86400;


// Semi-major axis (a) in km via Kepler’s Third Law:
// a = (μ / n^2)^(1/3)
const semiMajorAxisKm = Math.pow(mu / (n_radPerSec ** 2), 1 / 3);

// Perigee and Apogee:
const perigeeKm = semiMajorAxisKm * (1 - ecco);
const apogeeKm  = semiMajorAxisKm * (1 + ecco);

console.log("Semi-major Axis (km):", semiMajorAxisKm.toFixed(3));
console.log("Perigee (km):", perigeeKm.toFixed(3));
console.log("Apogee (km):", apogeeKm.toFixed(3));
