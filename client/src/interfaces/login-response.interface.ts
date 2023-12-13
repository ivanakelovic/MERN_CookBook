import { UserModel } from "../models/user.model";

export interface LoginResponse {
    user: UserModel;
    tokens: {
        access: Token;
        refresh: Token;
    };
}

export interface Token {
    token: string;
    expires: string;
}
