import { DrakeWithModels } from "./DrakeWithModels";
import { DragulaOptions } from "./DragulaOptions";
export declare class Group {
    name: string;
    drake: DrakeWithModels;
    options: DragulaOptions;
    initEvents: boolean;
    constructor(name: string, drake: DrakeWithModels, options: DragulaOptions);
}
