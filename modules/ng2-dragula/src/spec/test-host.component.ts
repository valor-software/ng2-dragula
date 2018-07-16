import { Component, Input, ViewChild, ElementRef } from "@angular/core";

import { DragulaDirective } from '../components/dragula.directive';

@Component({
  template: `
  <div #host [dragula]="bagName" [dragulaModel]="model" [dragulaLocalMirror]="localMirror">
  </div>
  `
})
export class TestHostComponent {
  @Input() bagName = "BAG_NAME";
  @Input() model: any[] = [];
  @Input() localMirror = false;
  @ViewChild('host') host: ElementRef<HTMLDivElement>;
  @ViewChild(DragulaDirective) directive: DragulaDirective;
}

