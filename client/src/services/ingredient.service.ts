import ApiClient from './api-client/api-client';
import {IngredientModel} from "../models/ingredient.model";

const INGREDIENTS_ENDPOINT = '/ingredients';

export const createIngredient = async (offer: IngredientModel): Promise<IngredientModel | null> => {
    return ApiClient.post(INGREDIENTS_ENDPOINT, offer)
        .then(response => response.data)
        .then(data => new IngredientModel(data))
}

export const getIngredients = (query?: any,sort?: string): Promise<[any, IngredientModel[]] | null> => {
    
    const queryParams = {
        ...query,
        sortBy: sort || "name",
      };
    
    return ApiClient.get(INGREDIENTS_ENDPOINT, queryParams)
        .then(response => response.data)
        .then(data => [{
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
            totalResults: data.totalResults
        }, data.results.map((item:any) => new IngredientModel(item))])
}
export const getIngredient = (ingredientId: string): Promise<IngredientModel | null> => {
    return ApiClient.get(`${INGREDIENTS_ENDPOINT}/${ingredientId}`)
        .then(response => response.data)
        .then(data => new IngredientModel(data))
}

export const updateIngredient = async (ingredientId: string, updateData: any): Promise<IngredientModel | null> => {
    return ApiClient.put(`${INGREDIENTS_ENDPOINT}/${ingredientId}`, updateData)
        .then(response => response.data)
        .then(data => new IngredientModel(data))
};

export const deleteIngredient = async (ingredientId: string) => {
    return ApiClient.remove(`${INGREDIENTS_ENDPOINT}/${ingredientId}`)
        .then(response => response.data)
        .then()
}
