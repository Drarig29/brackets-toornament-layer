import { StageType, Status } from 'brackets-model';
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
 * Converts a Toornament match status.
 * 
 * @param status Status of the match.
 */
export function convertMatchStatus(status: toornament.Status): Status {
    switch (status) {
        case 'pending':
            // Use waiting because it ressembles to the name.
            return Status.Waiting;
        case 'running':
            return Status.Running;
        case 'completed':
            // Use completed because it ressembles to the name.
            return Status.Completed;
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

    for (const match of data.matches) {
        db.match.push({
            id: parseInt(match.id),
            stage_id: parseInt(match.stage_id),
            group_id: parseInt(match.group_id),
            round_id: parseInt(match.round_id),
            number: match.number,
            child_count: 0, // Also get match games with Toornament API
            status: convertMatchStatus(match.status),
            opponent1: { id: null },
            opponent2: { id: null },
        });
    }

    return db;
}