import { GrandFinalType, Match, MatchGame, Participant, Result, Stage } from 'brackets-model';

export interface ConvertResult {
    database: Database,
    mappings: Record<string, Mapping>,
}

export interface Database {
    stage: Stage[],
    match: Match[],
    match_game: MatchGame[],
    participant: Participant[],
}

export type Mapping = { [id: string]: number };

export namespace toornament {

    export type PairingMethod = 'manual' | 'standard' | 'double_standard';
    export type StageType = 'single_elimination' | 'double_elimination' | 'pools';
    export type Status = 'pending' | 'running' | 'completed';

    export interface StageSettings {
        size: number;
        nb_groups: number;
        pairing_method: PairingMethod;
        grand_final: GrandFinalType;
        third_decider?: boolean;
        skip_round1?: boolean;
    }

    export interface Stage {
        id: string;
        number: number;
        name: string;
        type: StageType;
        settings: StageSettings;
    }

    export interface Participant {
        id: string;
        name: string;
    }

    export interface Opponent {
        number: number;
        position: number;
        participant: Participant | null;
        result: Result | null;
        forfeit: boolean;
        score?: number | null;
    }


    export interface Match {
        id: string;
        stage_id: string;
        group_id: string;
        round_id: string;
        number: number;
        type: string;
        status: Status;
        opponents: Opponent[];
    }
}