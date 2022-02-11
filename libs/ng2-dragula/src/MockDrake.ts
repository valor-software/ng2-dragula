import { Subject, Subscription } from 'rxjs';
import { DrakeWithModels } from './DrakeWithModels';
import { filter } from 'rxjs/operators';
import { EventTypes } from './EventTypes';
import { DragulaOptions } from './DragulaOptions';
import { DrakeFactory } from './DrakeFactory';

export const MockDrakeFactory = new DrakeFactory((containers, options) => {
  return new MockDrake(containers, options);
});

/** You can use MockDrake to simulate Drake events.
 *
 * The three methods that actually do anything are `on(event, listener)`,
 * `destroy()`, and a new method, `emit()`. Use `emit()` to manually emit Drake
 * events, and if you injected MockDrake properly with MockDrakeFactory or
 * mocked the DragulaService.find() method, then you can make ng2-dragula think
 * drags and drops are happening.
 *
 * Caveats:
 *
 * 1. YOU MUST MAKE THE DOM CHANGES YOURSELF.
 * 2. REPEAT: YOU MUST MAKE THE DOM CHANGES YOURSELF.
 *    That means `source.removeChild(el)`, and `target.insertBefore(el)`.
 * 3. None of the other methods do anything.
 *    That's ok, because ng2-dragula doesn't use them.
 */
export class MockDrake implements DrakeWithModels {
  // Basic but fully functional event emitter shim
  private emitter$ = new Subject<{ eventType: EventTypes, args: any[] }>();
  private subs = new Subscription();

  /**
   * @param containers A list of container elements.
   * @param options These will NOT be used. At all.
   * @param models Nonstandard, but useful for testing using `new MockDrake()` directly.
   *               Note, default value is undefined, like a real Drake. Don't change that.
   */
  constructor(
    public containers: Element[] = [],
    public options: DragulaOptions = {},
    public models?: any[][]
  ) {}

  /* Doesn't represent anything meaningful. */
  dragging = false;

  /* Does nothing useful. */
  start(item: Element): any {
    this.dragging = true;
  }
  /* Does nothing useful. */
  end(): any {
    this.dragging = false;
  }
  /* Does nothing useful. */
  cancel(revert: boolean): any;
  cancel(): any;
  cancel(revert?: any) {
    this.dragging = false;
  }
  /* Does nothing useful. */
  remove(): any {
    this.dragging = false;
  }

  on(event: string, callback: (...args: any)=> any): any {
    this.subs.add(this.emitter$
      .pipe(
        filter(({ eventType }) => eventType === event)
      )
      .subscribe(({eventType, args} ) => {
        if (eventType === EventTypes.Drag) {
          const argument = Array.from(args);
          const el = argument[0];
          const source = argument[1];
          //@ts-ignore
          callback(el, source);
          return;
        }

        if (eventType === EventTypes.Drop) {
          const argument = Array.from(args);
          const el = argument[0];
          const target = argument[1];
          const source = argument[2];
          const sibling = argument[3];
          //@ts-ignore
          callback(el, target, source, sibling);
          return;
        }

        if (eventType === EventTypes.Remove) {
          const argument = Array.from(args);
          const el = argument[0];
          const container = argument[1];
          const source = argument[2];
          //@ts-ignore
          callback(el, container, source);
          return;
        }
        callback(args);
      }));
  }

  destroy(): any {
    this.subs.unsubscribe();
  }

  /**
   * This is the most useful method. You can use it to manually fire events that would normally
   * be fired by a real drake.
   *
   * You're likely most interested in firing `drag`, `remove` and `drop`, the three events
   * DragulaService uses to implement [dragulaModel].
   *
   * See https://github.com/bevacqua/dragula#drakeon-events for what you should emit (and in what order).
   *
   * (Note also, firing dropModel and removeModel won't work. You would have to mock DragulaService for that.)
   */
  emit(eventType: EventTypes, ...args: any[]) {
    this.emitter$.next({ eventType, args });
  }

}
