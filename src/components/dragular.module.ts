import { NgModule, ModuleWithProviders } from '@angular/core';
import { DragulaDirective } from './dragula.directive';
import { DragulaService } from './dragula.provider';

@NgModule({
  exports: [DragulaDirective],
  declarations: [DragulaDirective]
})
export class DragulaModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: DragulaModule,
      providers: [DragulaService]
    };
  }
}
