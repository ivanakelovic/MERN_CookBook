import {BaseModel} from "./base.model";
import { FileModel } from "./file.model";

export class UserModel extends BaseModel {
// @ts-ignore
    id: number;
    // @ts-ignore
    firstName: string;
    // @ts-ignore
    lastName: string;
    // @ts-ignore
    email: string;
    // @ts-ignore
    password: string;
    // @ts-ignore
    role: string;
    // @ts-ignore
    birthDate: Date;
    favorites: Record<string, boolean>;
    picture: FileModel;

    constructor(attributes?: any) {
        super();
        this.setAttributes(attributes);
    }

}