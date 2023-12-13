import ApiClient from './api-client/api-client';
import {RecipeModel} from "../models/recipe.model";

const RECIPES_ENDPOINT = '/recipes';

export const createRecipe = async (offer: RecipeModel): Promise<RecipeModel | null> => {
    return ApiClient.post(RECIPES_ENDPOINT, offer)
        .then(response => response.data)
        .then(data => new RecipeModel(data))
}

export const getRecipes = (query?: any): Promise<[any, RecipeModel[]] | null> => {
    
    const { ingredients, category, ...otherQueryParams } = query;

    const params = new URLSearchParams();

    if (category) {
        params.set('category', category);
    }

    if (ingredients && ingredients.length > 0) {
        ingredients.forEach((ingredientId, index) => {
            params.append(`ingredients[${index}][ingredient]`, ingredientId);
        });
    }

    Object.keys(otherQueryParams).forEach(key => {
        params.set(key, otherQueryParams[key]);
    });

    return ApiClient.get(`${RECIPES_ENDPOINT}?${params.toString()}`)
        .then(response => response.data)
        .then(data => [{
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
            totalResults: data.totalResults
        }, data.results.map((item: any) => new RecipeModel(item))]);
}



export const getRecipe = (recipeId: string): Promise<RecipeModel | null> => {
    return ApiClient.get(`${RECIPES_ENDPOINT}/${recipeId}`)
        .then(response => response.data)
        .then(data => new RecipeModel(data))
}

export const updateRecipe = async (recipeId: string, updateData: any): Promise<RecipeModel | null> => {
    return ApiClient.put(`${RECIPES_ENDPOINT}/${recipeId}`, updateData)
        .then(response => response.data)
        .then(data => new RecipeModel(data))
};

export const deleteRecipe = async (recipeId: string) => {
    return ApiClient.remove(`${RECIPES_ENDPOINT}/${recipeId}`)
        .then(response => response.data)
        .then()
}
