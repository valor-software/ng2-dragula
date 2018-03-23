import * as dragulaExpt from 'dragula';
import { Drake as DrakeExpt, DragulaOptions } from 'dragula';

export { DragulaOptions } from 'dragula';

export interface Drake extends DrakeExpt {
    models: any[];
}

export const dragula: (containers?: Element[]|DragulaOptions, options?: DragulaOptions) => Drake = (dragulaExpt as any).default || dragulaExpt;