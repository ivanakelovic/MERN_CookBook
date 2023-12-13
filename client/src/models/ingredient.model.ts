import {BaseModel} from "./base.model";

export class IngredientModel extends BaseModel {

    // @ts-ignore
    id: string;
    // @ts-ignore
    name: string;
    // @ts-ignore
    vegan: boolean;
    // @ts-ignore
    glutenFree: boolean;
    // @ts-ignore
    vegetarian: boolean;
    // @ts-ignore
    halal: boolean;
    // @ts-ignore
    kosher: boolean;
    calories:number;

    constructor(attributes?: any) {
        super();
        this.setAttributes(attributes);
    }
}