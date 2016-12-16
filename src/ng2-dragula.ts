import { NgModule } from '@angular/core';
import { DragulaDirective } from './dragula.directive';
import { DragulaService } from './dragula.provider';

export * from './dragula.provider';
export * from './dragula.directive';

@NgModule({
  exports: [DragulaDirective],
  declarations: [DragulaDirective],
  providers: [DragulaService]
})
export class DragulaModule {
}
