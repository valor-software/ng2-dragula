import {Dragula} from './src/app/directives/dragula.directive';
import {DragulaService} from './src/app/providers/dragula.provider';

export * from './src/app/directives/dragula.directive';
export * from './src/app/providers/dragula.provider';

export default {
  directives: [Dragula],
  providers: [DragulaService]
};
