import { NgModule } from '@angular/core';
import { DragulaDirective } from './components/dragula.directive';
import { DragulaService } from './components/dragula.provider';

export * from './components/dragula.provider';
export * from './components/dragula.directive';

@NgModule({
  exports: [DragulaDirective],
  declarations: [DragulaDirective],
  providers: [DragulaService]
})
export class DragulaModule {
}
