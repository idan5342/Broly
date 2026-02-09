import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { filterTLEs } from '../utils/satellitesFilter.js';

export const getApproaches = () => {
    const tle = {
        satellite: "STARLINK-36494",
        line1: "1 67331U 26002AC  26039.91670139  .00001888  00000+0  76265-4 0  9990",
        line2: "2 67331  43.0000 127.7974 0001682 313.5669 203.4882 15.28401517  6036"
    }

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    // Read the tle.json file
    const tlePath = path.join(__dirname, '../../../data/tles.json');
    const tleData = JSON.parse(fs.readFileSync(tlePath, 'utf-8'));

    console.log('TLE data loaded:', tleData.length, 'entries');

    const filteredTLEs = filterTLEs(tleData, tle, 100);

    console.log('Filtered TLEs:', filteredTLEs.length, 'entries');
}

getApproaches()