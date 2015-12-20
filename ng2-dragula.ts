import {Dragula} from './src/directives/dragula.directive';
import {DragulaService} from './src/providers/dragula.provider';

export * from './src/directives/dragula.directive';
export * from './src/providers/dragula.provider';

export default {
  directives: [Dragula],
  providers: [DragulaService]
}

