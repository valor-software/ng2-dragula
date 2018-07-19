import { DrakeWithModels } from '../DrakeWithModels';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventTypes } from '../EventTypes';
import { DragulaOptions } from '../DragulaOptions';
import { DrakeFactory } from '../DrakeFactory';

export const MockDrakeFactory = new DrakeFactory((containers, options) => {
  return new MockDrake(containers, options);
});

export class MockDrake implements DrakeWithModels {
  /** ng2-dragula specific */
  constructor(
    public containers: Element[] = [],
    public options: DragulaOptions = {},
    // nonstandard, but useful for testing using new MockDrake directly
    public models?: any[][]
  ) {}

  /** This property will be true whenever an element is being dragged. */
  dragging: boolean = false;

  /** Enter drag mode without a shadow. This method is most useful when
   * providing complementary keyboard shortcuts to an existing drag and drop
   * solution. Even though a shadow won't be created at first, the user will
   * get one as soon as they click on item and start dragging it around. Note
   * that if they click and drag something else, .end will be called before
   * picking up the new item. */
  start(item: Element): void {
    throw new Error("Method not implemented.");
  }
  end(): void {
    throw new Error("Method not implemented.");
  }
  cancel(revert: boolean): void;
  cancel(): void;
  cancel(revert?: any) {
    this.dragging = false;
    // TODO: revert whatever you did
  }
  remove(): void {
    this.dragging = false;
  }
  emitter$ = new Subject<{ eventType: EventTypes, args: any[] }>();
  subs = new Subscription();
  on(event: string, callback: Function): void {
    this.subs.add(this.emitter$
      .pipe(
        filter(({ eventType }) => eventType === event)
      )
      .subscribe(({ args }) => {
        callback(...args);
      }));
  }
  /** https://github.com/bevacqua/dragula#drakeon-events */
  public emit(eventType: EventTypes, ...args: any[]) {
    this.emitter$.next({ eventType, args })
  }
  destroy(): void {
    this.subs.unsubscribe();
  }
}
