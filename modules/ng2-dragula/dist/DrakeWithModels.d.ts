/// <reference types="dragula" />
import { Drake } from 'dragula';
export interface DrakeWithModels extends Drake {
    models?: any[][];
}
