import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';

import { DemoComponent } from './app.component';
import { BasicComponent } from './examples/01-basic.component';
import { EventsComponent } from './examples/02-events.component';
import { SpillComponent } from './examples/03-spill.component';
import { RevertComponent } from './examples/04-revert.component';
import { CopyComponent } from './examples/05-copy.component';
import { CopyModelComponent } from './examples/06-copy-model.component';
import { HandleComponent } from './examples/07-handle.component';
import { ClickComponent } from './examples/08-click.component';
import { NgForComponent } from './examples/09-ngfor.component';
import { NestedComponent } from './examples/10-nested.component';

@NgModule({
  declarations: [
    DemoComponent,
    BasicComponent,
    EventsComponent,
    SpillComponent,
    RevertComponent,
    CopyComponent,
    CopyModelComponent,
    HandleComponent,
    ClickComponent,
    NgForComponent,
    NestedComponent,
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
