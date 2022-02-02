import { NgModule, ModuleWithProviders } from '@angular/core';
import { DragulaDirective } from './dragula.directive';
import { DragulaService } from './dragula.service';

@NgModule({
  exports: [DragulaDirective],
  declarations: [DragulaDirective],
  providers: [DragulaService]
})
export class DragulaModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: DragulaModule,
      providers: [DragulaService]
    }
  }
}
