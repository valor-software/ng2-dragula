import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { EXAMPLES } from './examples';
import { DragulaModule } from '../ng2-dragula';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [
    DemoComponent,
    EXAMPLES
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
