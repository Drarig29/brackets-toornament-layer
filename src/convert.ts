import { Participant, ParticipantResult, RoundRobinMode, StageSettings, StageType, Status } from 'brackets-model';
import { ConvertResult, Database, Mapping, toornament } from './types';

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

export function convertStageSettings(settings: toornament.StageSettings): StageSettings {
    return {
        size: settings.size,
        groupCount: settings.nb_groups,
        grandFinal: settings.grand_final,
        skipFirstRound: settings.skip_round1,
        consolationFinal: settings.third_decider,
        roundRobinMode: convertRoundRobinMode(settings.pairing_method),
    }
}

export function convertRoundRobinMode(method: toornament.PairingMethod): RoundRobinMode | undefined {
    switch (method) {
        case 'standard':
            return 'simple';
        case 'double_standard':
            return 'double';
        default:
            return undefined;
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

export function convertParticipant(id: number, participant: toornament.Participant): Participant {
    return {
        id,
        name: participant.name,
        tournament_id: 0,
    }
}

export function convertParticipantResult(id: number | null, result: toornament.Opponent): ParticipantResult {
    return {
        id,
        score: result.score !== null ? result.score : undefined,
        forfeit: result.forfeit || undefined,
        result: result.result || undefined,
    }
}

export function idFactory() {
    let currentId = 0;
    const ids: Mapping = {};

    const func = (id: string): number => {
        if (ids[id] === undefined) ids[id] = currentId++;
        return ids[id];
    };

    func.getMapping = () => ids;
    return func;
}

/**
 * Converts Toornament data to brackets-viewer data.
 * 
 * @param data Data coming from Toornament put in a single object.
 */
export function convertData(data: {
    stages: toornament.Stage[];
    matches: toornament.Match[];
}): ConvertResult {
    const db: Database = {
        stage: [],
        match: [],
        match_game: [],
        participant: [],
    };

    const stageId = idFactory();

    for (const stage of data.stages) {
        db.stage.push({
            id: stageId(stage.id),
            tournament_id: 0,
            name: stage.name,
            type: convertStageType(stage.type),
            number: stage.number,
            settings: convertStageSettings(stage.settings),
        });
    }

    const participants: { [id: number]: Participant } = {};

    const participantId = idFactory();
    const matchId = idFactory();
    const groupId = idFactory();
    const roundId = idFactory();

    for (const match of data.matches) {
        const [id1, id2] = match.opponents.map(opponent => opponent.participant?.id !== undefined ? participantId(opponent.participant.id) : null);

        if (id1 !== null && match.opponents[0].participant) {
            const opponent1 = convertParticipant(id1, match.opponents[0].participant);

            if (!participants[opponent1.id])
                participants[opponent1.id] = opponent1
        }

        if (id2 !== null && match.opponents[1].participant) {
            const opponent2 = convertParticipant(id2, match.opponents[1].participant);

            if (!participants[opponent2.id])
                participants[opponent2.id] = opponent2
        }

        db.match.push({
            id: matchId(match.id),
            stage_id: stageId(match.stage_id),
            group_id: groupId(match.group_id),
            round_id: roundId(match.round_id),
            number: match.number,
            child_count: 0,
            status: convertMatchStatus(match.status),
            opponent1: convertParticipantResult(id1, match.opponents[0]),
            opponent2: convertParticipantResult(id2, match.opponents[1]),
        });
    }

    Object.values(participants).forEach(participant => db.participant.push(participant));

    return {
        database: db,
        mappings: {
            participants: participantId.getMapping(),
            stages: stageId.getMapping(),
            groups: groupId.getMapping(),
            rounds: roundId.getMapping(),
            matches: matchId.getMapping(),
        }
    };
}