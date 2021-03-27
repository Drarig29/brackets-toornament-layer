import { readFileSync, writeFileSync } from 'fs';
import { convertData } from './convert';

const data = readFileSync('toornament.json', { encoding: 'utf-8' });
const matches = JSON.parse(data);
const converted = convertData(matches);
const database = JSON.stringify(converted, null, 4);

writeFileSync('db.json', database);