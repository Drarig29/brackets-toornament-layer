import { Participant, ParticipantResult, StageType, Status } from 'brackets-model';
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

export function convertParticipant(participant: toornament.Participant): Participant {
    return {
        id: parseInt(participant.id),
        name: participant.name,
        tournament_id: 0,
    }
}

export function convertParticipantResult(result: toornament.Opponent): ParticipantResult {
    return {
        id: parseInt(result.participant.id),
        score: result.score,
        forfeit: result.forfeit,
        result: result.result,
        position: result.position, // TODO: Not sure about that
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

    const participants: { [id: number]: Participant } = {};

    for (const match of data.matches) {
        const opponent1 = convertParticipant(match.opponents[0].participant);
        const opponent2 = convertParticipant(match.opponents[1].participant);

        if (!participants[opponent1.id])
            participants[opponent1.id] = opponent1

        if (!participants[opponent2.id])
            participants[opponent2.id] = opponent2

        db.match.push({
            id: parseInt(match.id),
            stage_id: parseInt(match.stage_id),
            group_id: parseInt(match.group_id),
            round_id: parseInt(match.round_id),
            number: match.number,
            child_count: 0, // TODO: Also get match games with Toornament API
            status: convertMatchStatus(match.status),
            opponent1: convertParticipantResult(match.opponents[0]),
            opponent2: convertParticipantResult(match.opponents[1]),
        });
    }

    Object.values(participants).forEach(participant => db.participant.push(participant));

    return db;
}