import { DragulaOptions } from 'dragula';
import { DrakeWithModels } from './DrakeWithModels';
import * as dragulaExpt from 'dragula';
export const dragula: (containers?: any, options?: any) => any = (dragulaExpt as any).default || dragulaExpt;

export type DrakeBuilder = (containers: any[], options: DragulaOptions) => DrakeWithModels;

export class DrakeFactory {
  constructor (public build: DrakeBuilder = dragula) {}
}

