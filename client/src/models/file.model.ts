import {BaseModel} from "./base.model";
import {UserModel} from "./user.model";

export class FileModel extends BaseModel {
    id: string;
    originalName: string;
    fileName: string;
    fileType: string;
    fileSize: string;
    createdBy: UserModel;
    constructor(attributes?: any) {
        super();
        this.setAttributes(attributes);
    }
}