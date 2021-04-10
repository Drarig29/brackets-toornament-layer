import { readFileSync, writeFileSync } from 'fs';
import { convertData } from './convert';

const data = JSON.parse(readFileSync('toornament.json', { encoding: 'utf-8' }));
const result = convertData(data);

writeFileSync('db.json', JSON.stringify(result.database, null, 4));
writeFileSync('mappings.json', JSON.stringify(result.mappings, null, 4));