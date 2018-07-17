import { Component, Input, ViewChild, ElementRef } from "@angular/core";

import { DragulaDirective } from '../components/dragula.directive';

@Component({
  template: `
  <div #host [dragula]="bagName" [dragulaModel]="model" [dragulaLocalMirror]="localMirror" (dragulaModelChange)="modelChange($event)">
  </div>
  `
})
export class TestHostComponent {
  @Input() bagName = "BAG_NAME";
  @Input() model: any[] = [];
  @Input() localMirror = false;
  @ViewChild('host') host: ElementRef<HTMLDivElement>;
  @ViewChild(DragulaDirective) directive: DragulaDirective;
  modelChange(newModel: any[]) {
    this.model = newModel;
  }
}

@Component({
  template: `
  <div #host [dragula]="bagName" [(dragulaModel)]="model" [dragulaLocalMirror]="localMirror">
  </div>
  `
})
export class TwoWay extends TestHostComponent { }

import { Subject } from 'rxjs';

@Component({
  template: `
  <div #host [dragula]="bagName" [dragulaModel]="model$|async" (dragulaModelChange)="model$.next($event)" [dragulaLocalMirror]="localMirror">
  </div>
  `
})
export class Asynchronous extends TestHostComponent {
  model$ = new Subject<any[]>();
  ngOnInit() {
    this.model$.next(this.model);
  }
}
