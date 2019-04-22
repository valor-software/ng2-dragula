import { DragulaOptions } from './DragulaOptions';
import { DrakeWithModels } from './DrakeWithModels';
export declare const dragula: (containers?: any, options?: any) => any;
export declare type DrakeBuilder = (containers: any[], options: DragulaOptions) => DrakeWithModels;
export declare class DrakeFactory {
    build: DrakeBuilder;
    constructor(build?: DrakeBuilder);
}
