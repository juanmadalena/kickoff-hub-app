enum Position {
    mf = 'mf',
    df = 'df',
    fw = 'fw',
    gk = 'gk',

}

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
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
    username:   string;
    position:   string;
    email:      string;
    photo?:     string;
}