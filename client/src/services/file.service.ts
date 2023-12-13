import ApiClient from './api-client/api-client';
import {FileModel} from "../models/file.model";

const FILES_ENDPOINT = '/files';
/*
export const createFile = async (files, createdBy) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('documents', file);
    });
    formData.append('createdBy', createdBy);
    return ApiClient.post(FILES_ENDPOINT, formData)
        .then(response => response.data)
        .then(data => new FileModel(data))
}
*/

export const createFile = async (formData: FormData): Promise<FormData | null> => {
    return ApiClient.postFormData(FILES_ENDPOINT, formData)
        .then(response => response.data)
}

export const getFiles = async (query?: any): Promise<FileModel[] | null> => {
    try {
        const allResults = [];

        let page = 1;
        while (true) {
            const response = await ApiClient.get(FILES_ENDPOINT, {...query, page});
            const data = response.data;

            if (data.results.length > 0) {
                allResults.push(...data.results.map(item => new FileModel(item)));
                page++;
            } else {
                break;
            }
        }

        return allResults;
    } catch (error) {
        console.error('Error occurred while fetching data', error);
        return null;
    }
};

export const getFile = async ( fileId: string ): Promise<FileModel | null> => {
    return ApiClient.get(`${FILES_ENDPOINT}/${fileId}`)
        .then(response => response.data)
        .then(data => new FileModel(data))

}
/*
export const getFileContent = async (fileId: string ): Promise<Blob | null> => {
    return ApiClient.get(`${FILES_ENDPOINT}/${fileId}`)
        .then(response => new Blob([response.data], {}))

}
*/

/*export const getFileContent = async (fileId: string ): Promise<Blob | null> => {
    return ApiClient.get(`${FILES_ENDPOINT}/${fileId}`)
        .then(response => new Blob([response.data], {}))

}*/



