import { NgModule, ModuleWithProviders } from '@angular/core';
import { DragulaDirective } from './dragula.directive';
import { DragulaService } from './dragula.service';

@NgModule({
  exports: [DragulaDirective],
  declarations: [DragulaDirective],
})
export class DragulaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DragulaModule,
      providers: [DragulaService]
    }
  }
}
