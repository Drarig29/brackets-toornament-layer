import { GrandFinalType, Match, MatchGame, Participant, Result, Stage } from 'brackets-model';

export interface Database {
    stage: Stage[],
    match: Match[],
    match_game: MatchGame[],
    participant: Participant[],
}

export namespace toornament {

    export interface CalculatorOptions {
        win: number;
        draw: number;
        loss: number;
        forfeit?: number;
    }

    export interface Calculator {
        name: string;
        options: CalculatorOptions;
    }

    export interface Tiebreaker {
        name: string;
        options: unknown[];
    }

    export type PairingMethod = 'manual' | 'standard' | 'double_standard';

    export interface StageSettings {
        size: number;
        arrival: string;
        departure: string;
        nb_groups: number;
        calculators: Calculator[];
        tiebreakers: Tiebreaker[];
        group_naming: string;
        round_naming: string;
        pairing_method: PairingMethod;
        threshold?: number;
        grand_final: GrandFinalType;
        third_decider?: boolean;
        skip_round1?: boolean;
    }

    export type StageType = 'single_elimination' | 'double_elimination' | 'bracket_groups' | 'pools' | 'gauntlet' | 'league' | 'swiss' | 'simple' | 'ffa_single_elimination' | 'ffa_bracket_groups';

    export interface Stage {
        id: string;
        number: number;
        name: string;
        type: StageType;
        closed: boolean;
        settings: StageSettings;
    }

    export interface Participant {
        id: string;
        name: string;
        custom_user_identifier?: string;
        custom_fields: unknown;
    }

    export interface Opponent {
        number: number;
        position: number;
        participant: Participant;
        rank?: number;
        result: Result;
        forfeit: boolean;
        score?: number;
    }

    export type Status = 'pending' | 'running' | 'completed';

    export interface Match {
        id: string;
        stage_id: string;
        group_id: string;
        round_id: string;
        number: number;
        type: string;
        status: Status;
        settings: unknown;
        scheduled_datetime?: string;
        played_at?: Date;
        public_note: string;
        private_note?: string;
        report_closed: boolean;
        opponents: Opponent[];
    }

    export interface RootObject {
        stages: Stage[];
        matches: Match[];
    }
}