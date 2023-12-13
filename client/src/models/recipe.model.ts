import {BaseModel} from "./base.model";
import {UserModel} from "./user.model";
import {CategoryModel} from "./category.model";
import {FileModel} from "./file.model";

export class RecipeModel extends BaseModel {

    // @ts-ignore
    id: string;
    // @ts-ignore
    title: string;
    // @ts-ignore
    ingredients: Array<{
        ingredient: string;
        measure: string;
    }>
    // @ts-ignore
    postedBy: UserModel;
    // @ts-ignore
    category: CategoryModel;
    // @ts-ignore
    preparationMethod: string;
    // @ts-ignore
    preparationTime: number;
    // @ts-ignore
    portionsNumber: number;
    // @ts-ignore
    picture: FileModel;
    // @ts-ignore
    dietaryPreferences: {
        vegan: boolean;
        halal: boolean;
        kosher: boolean;
        vegetarian: boolean;
        glutenFree: boolean;
    };

    comment:string;

    constructor(attributes?: any) {
        super();
        this.setAttributes(attributes);
    }
}