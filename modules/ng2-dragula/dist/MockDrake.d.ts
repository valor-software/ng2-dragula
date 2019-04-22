import { DrakeWithModels } from './DrakeWithModels';
import { EventTypes } from './EventTypes';
import { DragulaOptions } from './DragulaOptions';
import { DrakeFactory } from './DrakeFactory';
export declare const MockDrakeFactory: DrakeFactory;
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
export declare class MockDrake implements DrakeWithModels {
    containers: Element[];
    options: DragulaOptions;
    models: any[][];
    /**
     * @param containers A list of container elements.
     * @param options These will NOT be used. At all.
     * @param models Nonstandard, but useful for testing using `new MockDrake()` directly.
     *               Note, default value is undefined, like a real Drake. Don't change that.
     */
    constructor(containers?: Element[], options?: DragulaOptions, models?: any[][]);
    dragging: boolean;
    start(item: Element): any;
    end(): any;
    cancel(revert: boolean): any;
    cancel(): any;
    remove(): any;
    private emitter$;
    private subs;
    on(event: string, callback: Function): any;
    destroy(): any;
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
    emit(eventType: EventTypes, ...args: any[]): void;
}
