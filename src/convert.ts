import { StageType } from 'brackets-model';
import { Database, toornament } from './types';

/**
 * Converts a Toornament stage type.
 * 
 * @param type Type of the stage.
 */
export function convertStageType(type: toornament.StageType): StageType {
    switch (type) {
        case 'pools':
            return 'round_robin';
        case 'single_elimination':
        case 'double_elimination':
            return type;
        default:
            throw Error('Stage type not supported.');
    }
}

/**
 * Converts Toornament data to brackets-viewer data.
 * 
 * @param data Data coming from Toornament put in a single object.
 */
export function convertData(data: toornament.RootObject): Database {
    const db: Database = {
        stage: [],
        match: [],
        match_game: [],
        participant: [],
    };

    for (const stage of data.stages) {
        db.stage.push({
            id: parseInt(stage.id),
            tournament_id: 0,
            name: stage.name,
            type: convertStageType(stage.type),
            number: stage.number,
            settings: {
                size: stage.settings.size,
            },
        });
    }

    return db;
}