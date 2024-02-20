enum Position {
    mf = 'mf',
    df = 'df',
    fw = 'fw',
    gk = 'gk',

}

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
    user:  User;
    token: string;
}

export interface User {
    id:         string;
    first_name: string;
    last_name:  string;
    position:   string;
    email:      string;
    photo?:     string;
}

export interface Match {
    id:          string;
    organizer:   Organizer;
    date:        string;
    time:        string;
    description: string;
    location:    string;
    latitude:    number;
    longitude:   number;
    price:       number;
    num_players: number;
    min_players: number;
    max_players: number;
    players:     User[];
}

export interface Organizer {
    id:         string;
    first_name: string;
    last_name:  string;
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
    position:            string;
    photo:               null | string;
    secondary_positions: any[];
    rating:              null;
}