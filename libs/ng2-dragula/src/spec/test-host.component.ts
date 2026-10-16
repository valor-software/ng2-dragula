import { Component, Input, ViewChild, ElementRef, ChangeDetectionStrategy } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

import { DragulaDirective } from '../components/dragula.directive';

@Component({
    template: `
  <div #host [dragula]="group" [dragulaModel]="model" [dragulaModelFilter]="filter" (dragulaModelChange)="modelChange($event)">
  </div>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class TestHostComponent {
  @Input() group = "GROUP";
  // don't give model a default value
  // because the Asynchronous subclass setter would get called
  @Input() model?: any[];
  @Input() filter?: (item: any) => boolean;
  @ViewChild('host', {static: false}) host?: ElementRef<HTMLDivElement>;
  @ViewChild(DragulaDirective, {static: false}) directive?: DragulaDirective;
  modelChange(newModel: any[]) {
    this.model = newModel;
  }
}

@Component({
    template: `
  <div #host [dragula]="group" [(dragulaModel)]="model">
  </div>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TwoWay extends TestHostComponent { }

@Component({
    template: `
  <div #host [dragula]="group" [dragulaModel]="model$|async" (dragulaModelChange)="model$.next($event)" >
  </div>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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

/** Stands in for a third-party component that renders its list in its own template. */
@Component({
    selector: 'test-inner-list',
    template: `
  @if (show) {
    <ul class="inner"></ul>
  }
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class InnerList {
  @Input() show = true;
}

@Component({
    template: `
  <div #host [dragula]="group" [dragulaContainer]="container" [dragulaModel]="model" [dragulaModelFilter]="filter" (dragulaModelChange)="modelChange($event)">
    <test-inner-list [show]="showInner"></test-inner-list>
    <ol class="other"></ol>
  </div>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ChildContainer extends TestHostComponent {
  @Input() container?: string = '.inner';
  @Input() showInner = true;
}
