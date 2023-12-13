import ApiClient from './api-client/api-client';
import {UserModel} from "../models/user.model";

const USERS_ENDPOINT = '/users';

export const createUser = async (user: UserModel): Promise<UserModel | null> => {
    return ApiClient.post(USERS_ENDPOINT, user)
        .then(response => response.data)
        .then(data => new UserModel(data))
}

export const getUsers = (query?: any): Promise<[any, UserModel[]] | null> => {
    return ApiClient.get(USERS_ENDPOINT, query)
        .then(response => response.data)
        .then(data => [{
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
            totalResults: data.totalResults
        }, data.results.map((item:any) => new UserModel(item))])
}
export const getUser = (userId: string): Promise<UserModel | null> => {
    return ApiClient.get(`${USERS_ENDPOINT}/${userId}`)
        .then(response => response.data)
        .then(data => new UserModel(data))
}

export const updateUser = async (userId: string, updateData: any): Promise<UserModel | null> => {
    return ApiClient.put(`${USERS_ENDPOINT}/${userId}`, updateData)
        .then(response => response.data)
        .then(data => new UserModel(data))
};

export const deleteUser = async (userId:string) => {
    return ApiClient.remove(`${USERS_ENDPOINT}/${userId}`)
        .then(response => response.data)
        .then()
};
