export type Position = 'GK' | 'DF' | 'MF' | 'ST';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    position: Position;
    email: string;
    password: string;
}

export interface LoginResponse {
    user:  Player;
    token: string;
}

export interface User {
    id:         string;
    first_name: string;
    last_name:  string;
    position:   string;
    email:      string;
    photo?:     string;
    rating?:    number;
}

export interface Match {
    id:          string;
    organizer?:   Player;
    date:        string;
    time:        string;
    duration:    string;
    description: string;
    location:    string;
    address:     string;
    latitude:    number;
    longitude:   number;
    price:       number;
    num_players: number;
    min_players: number;
    max_players: number;
    players:     Player[];
}

export interface Organizer {
    id:         string;
    first_name: string;
    last_name:  string;
    photo:      string;
}

export interface MatchesResponse {
    matches: Match[];
}

export interface MatchResponse {
    match: Match;
}

export interface ErrorResponse {
    message: string;
    input?: string;
}


export interface PlayersResponse {
    players: Player[];
}

export interface Player {
    id:                  string;
    first_name:          string;
    last_name:           string;
    position:            Position;
    photo?:               null | string;
    secondary_positions?: any[];
    rating:              null;
    email?:               string;
}

export interface MatchesPlayedResponse {
    matches: MatchPlayed[];
}

export interface MatchPlayed {
    title: string;
    data:  MatchesPlayedData[];
}

export interface MatchesPlayedData {
    id:          string;
    date:        string;
    time:        string;
    duration:    string;
    location:    string;
    address:     string;
    price:       number;
    num_players: number;
    min_players: number;
    max_players: number;
}

export interface UserDataResponse {
    user:             Player;
    matchesPlayed:    MatchesCount;
    matchesOrganized: MatchesCount;
    lastMatchPlayed:  Match;
}

export interface MatchesCount {
    count: string;
}