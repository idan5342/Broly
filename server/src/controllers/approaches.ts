import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { filterTLEs } from '../utils/satellitesFilter.js';

export const getApproaches = () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    // Read the tle.json file
    const tlePath = path.join(__dirname, '../../data/tles.json');
    const tleData = JSON.parse(fs.readFileSync(tlePath, 'utf-8'));

    console.log('TLE data loaded:', tleData.length, 'entries');

    const filteredTLEs = filterTLEs(tleData, tleData[0], 100);

    console.log('Filtered TLEs:', filteredTLEs.length, 'entries');
}

getApproaches()