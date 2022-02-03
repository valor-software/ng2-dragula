import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

import { DragulaDirective } from '../components/dragula.directive';

@Component({
  template: `
  <div #host [dragula]="group" [dragulaModel]="model" (dragulaModelChange)="modelChange($event)">
  </div>
  `
})

export class TestHostComponent {
  @Input() group = "GROUP";
  // don't give model a default value
  // because the Asynchronous subclass setter would get called
  @Input() model: any[];
  @ViewChild('host', {static: false}) host: ElementRef<HTMLDivElement>;
  @ViewChild(DragulaDirective, {static: false}) directive: DragulaDirective;
  modelChange(newModel: any[]) {
    this.model = newModel;
  }
}

@Component({
  template: `
  <div #host [dragula]="group" [(dragulaModel)]="model">
  </div>
  `
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TwoWay extends TestHostComponent { }

@Component({
  template: `
  <div #host [dragula]="group" [dragulaModel]="model$|async" (dragulaModelChange)="model$.next($event)" >
  </div>
  `
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class Asynchronous extends TestHostComponent {
  model$ = new BehaviorSubject<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @Input() set model(neu: any[]) {
    this.model$.next(neu);
  }
}
