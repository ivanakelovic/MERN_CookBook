import ApiClient from './api-client/api-client';
import { EvaluationModel } from '../models/evaluation.model';

const EVALUATIONS_ENDPOINT = '/evaluations';

export const createEvaluation = async (offer: EvaluationModel): Promise<EvaluationModel | null> => {
    return ApiClient.post(EVALUATIONS_ENDPOINT, offer)
        .then(response => response.data)
        .then(data => new EvaluationModel(data))
}

export const getEvaluations = (query): Promise<[any, EvaluationModel[]] | null> => {
    return ApiClient.get(EVALUATIONS_ENDPOINT,query)
        .then(response => response.data)
        .then(data => data.results)
        .then(data => data.map((item:any) => new EvaluationModel(item)))
}

export const getEvaluation = (evaluationId: string): Promise<EvaluationModel | null> => {
    return ApiClient.get(`${EVALUATIONS_ENDPOINT}/${evaluationId}`)
        .then(response => response.data)
        .then(data => new EvaluationModel(data))
}

export const updateEvaluation = async (evaluationId: string, updateData: any): Promise<EvaluationModel | null> => {
    return ApiClient.put(`${EVALUATIONS_ENDPOINT}/${evaluationId}`, updateData)
        .then(response => response.data)
        .then(data => new EvaluationModel(data))
};

export const deleteEvaluation = async (evaluationId:string) => {
    return ApiClient.remove(`${EVALUATIONS_ENDPOINT}/${evaluationId}`)
        .then(response => response.data)
        .then()
}
