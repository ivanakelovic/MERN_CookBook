import ApiClient from './api-client/api-client';
import {CategoryModel} from "../models/category.model";

const CATEGORY_ENDPOINT = '/categories';

export const createCategory = async (offer: CategoryModel): Promise<CategoryModel | null> => {
    return ApiClient.post(CATEGORY_ENDPOINT, offer)
        .then(response => response.data)
        .then(data => new CategoryModel(data))
}

export const getCategories = (query?: any,sort?: string): Promise<[any, CategoryModel[]] | null> => {
    const queryParams = {
        ...query,
        sortBy: sort || "name",
      };
   
    return ApiClient.get(CATEGORY_ENDPOINT, queryParams)
        .then(response => response.data)
        .then(data => [{
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
            totalResults: data.totalResults
        }, data.results.map((item:any) => new CategoryModel(item))])
}
export const getCategory = (categoryId: string): Promise<CategoryModel | null> => {
    return ApiClient.get(`${CATEGORY_ENDPOINT}/${categoryId}`)
        .then(response => response.data)
        .then(data => new CategoryModel(data))
}

export const updateCategory = async (categoryId: string, updateData: any): Promise<CategoryModel | null> => {
    return ApiClient.put(`${CATEGORY_ENDPOINT}/${categoryId}`, updateData)
        .then(response => response.data)
        .then(data => new CategoryModel(data))
};

export const deleteCategory = async (categoryId: string) => {
    return ApiClient.remove(`${CATEGORY_ENDPOINT}/${categoryId}`)
        .then(response => response.data)
        .then()
}
