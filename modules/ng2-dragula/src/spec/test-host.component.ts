import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

import { DragulaDirective } from '../components/dragula.directive';

@Component({
  template: `
  <div #host [dragula]="bagName" [dragulaModel]="model" [dragulaLocalMirror]="localMirror" (dragulaModelChange)="modelChange($event)">
  </div>
  `
})
export class TestHostComponent {
  @Input() bagName = "BAG_NAME";
  // don't give model a default value
  // because the Asynchronous subclass setter would get called
  @Input() model: any[];
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

@Component({
  template: `
  <div #host [dragula]="bagName" [dragulaModel]="model$|async" (dragulaModelChange)="model$.next($event)" [dragulaLocalMirror]="localMirror">
  </div>
  `
})
export class Asynchronous extends TestHostComponent {
  model$ = new BehaviorSubject<any[]>([]);
  @Input() set model(neu: any[]) {
    this.model$.next(neu);
  }
}
