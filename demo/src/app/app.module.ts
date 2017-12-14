import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';

import { EXAMPLES } from './examples';
import { CallbackparamsPipe } from './callback.pipe';
import { DemoComponent } from './app.component';

@NgModule({
  declarations: [
    CallbackparamsPipe,
    DemoComponent,
    ...EXAMPLES
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DragulaModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [DemoComponent]
})

export class DragulaDemoModule {
}
