import {BaseModel} from "./base.model";

export class CategoryModel extends BaseModel{

    // @ts-ignore
    id:string;
    // @ts-ignore
    name:string;
    // @ts-ignore
    description:string;

    constructor(attributes?: any) {
        super();
        this.setAttributes(attributes);
    }
}