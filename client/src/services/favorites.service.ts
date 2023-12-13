import ApiClient from './api-client/api-client';
import {UserModel} from "../models/user.model";

const FAVORITES_ENDPOINT = '/favorites';

export const addToFavorites = async (userId, recipeId) => {
  return ApiClient.post(`${FAVORITES_ENDPOINT}/${recipeId}`, { userId })
    .then((response) => response.data)
    .then((data) => new UserModel(data));
};

export const removeFromFavorites = async (userId:string, recipeId) => {
    return ApiClient.remove(`${FAVORITES_ENDPOINT}/${recipeId}`, { userId })
      .then((response) => response.data)
      .then();
  };
