import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';

import { EXAMPLES } from './examples';
import { DemoComponent } from './app.component';

@NgModule({
  declarations: [
    DemoComponent,
    ...EXAMPLES
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DragulaModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [DemoComponent]
})

export class DragulaDemoModule {
}
