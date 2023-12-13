import {BaseModel} from "./base.model";
import { RecipeModel } from "./recipe.model";
import { UserModel } from "./user.model";

export class EvaluationModel extends BaseModel {
// @ts-ignore
    id: number;
    // @ts-ignore
    rating: number;
    // @ts-ignore
   comment: string;
    // @ts-ignore
    recipeId: RecipeModel;
    // @ts-ignore
    evaluatedBy: UserModel;

    constructor(attributes?: any) {
        super();
        this.setAttributes(attributes);
    }

}