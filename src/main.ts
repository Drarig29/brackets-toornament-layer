import { readFileSync, writeFileSync } from 'fs';
import { convertData } from './convert';

const data = readFileSync('toornament.json', { encoding: 'utf-8' });
const matches = JSON.parse(data);
const result = convertData(matches);

writeFileSync('db.json', JSON.stringify(result.database, null, 4));
writeFileSync('mappings.json', JSON.stringify(result.mappings, null, 4));