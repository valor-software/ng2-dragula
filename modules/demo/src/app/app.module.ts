import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';

import { EXAMPLES } from './examples';
import { CopyModelComponent } from './examples/copy-model.component';
import { DemoComponent } from './app.component';

@NgModule({
  declarations: [
    DemoComponent,
    CopyModelComponent,
    ...EXAMPLES
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DragulaModule.forRoot(),
    CommonModule
  ],
  providers: [],
  bootstrap: [DemoComponent]
})

export class DragulaDemoModule {
}
