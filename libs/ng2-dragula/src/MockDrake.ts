import { Subject, Subscription } from 'rxjs';
import { DrakeWithModels } from './DrakeWithModels';
import { filter } from 'rxjs/operators';
import { EventTypes } from './EventTypes';
import { DragulaOptions } from './DragulaOptions';
import { DrakeFactory } from './DrakeFactory';
import { Drake } from 'dragula';

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
  on(event: 'drag', listener: (el: Element, source: Element) => void): Drake;
  on(event: 'dragend', listener: (el: Element) => void): Drake;
  on(event: 'drop', listener: (el: Element, target: Element, source: Element, sibling: Element) => void): Drake;
  on(event: 'cancel' | 'remove' | 'shadow' | 'over' | 'out', listener: (el: Element, container: Element, source: Element) => void): Drake;
  on(event: 'cloned', listener: (clone: Element, original: Element, type: 'copy' | 'mirror') => void): Drake;
  on(event: 'dropModel', listener: ([el, target, source, sibling, item, sourceModel, targetModel, sourceIndex, targetIndex,]: [Element, Element, Element, Element, any, any[], any[], number, number]) => void): Drake;
  on(event: 'removeModel', listener: ([el, container, source, item, sourceModel, sourceIndex]: [Element, Element, Element, any, any[], number]) => void): Drake;
  
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
  canMove(item: Element) {
    return this.options.accepts ? this.options.accepts(item) : false;
  }

  /* Does nothing useful. */
  remove(): any {
    this.dragging = false;
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
