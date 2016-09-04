import {NgModule} from '@angular/core';
import {Dragula} from './src/app/directives/dragula.directive';
import {DragulaService} from './src/app/providers/dragula.provider';

@NgModule({
  exports: [ Dragula ],
  declarations: [ Dragula ],
  providers: [ DragulaService ]
})
export default class DragulaModule {}
