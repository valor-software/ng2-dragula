/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DrakeFactory } from './DrakeFactory';
/** @type {?} */
export var MockDrakeFactory = new DrakeFactory(function (containers, options) {
    return new MockDrake(containers, options);
});
/**
 * You can use MockDrake to simulate Drake events.
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
var /**
 * You can use MockDrake to simulate Drake events.
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
MockDrake = /** @class */ (function () {
    /**
     * @param containers A list of container elements.
     * @param options These will NOT be used. At all.
     * @param models Nonstandard, but useful for testing using `new MockDrake()` directly.
     *               Note, default value is undefined, like a real Drake. Don't change that.
     */
    function MockDrake(containers, options, models) {
        if (containers === void 0) { containers = []; }
        if (options === void 0) { options = {}; }
        this.containers = containers;
        this.options = options;
        this.models = models;
        /* Doesn't represent anything meaningful. */
        this.dragging = false;
        this.emitter$ = new Subject();
        this.subs = new Subscription();
    }
    /* Does nothing useful. */
    /**
     * @param {?} item
     * @return {?}
     */
    MockDrake.prototype.start = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        this.dragging = true;
    };
    /* Does nothing useful. */
    /**
     * @return {?}
     */
    MockDrake.prototype.end = /**
     * @return {?}
     */
    function () {
        this.dragging = false;
    };
    /**
     * @param {?=} revert
     * @return {?}
     */
    MockDrake.prototype.cancel = /**
     * @param {?=} revert
     * @return {?}
     */
    function (revert) {
        this.dragging = false;
    };
    /* Does nothing useful. */
    /**
     * @return {?}
     */
    MockDrake.prototype.remove = /**
     * @return {?}
     */
    function () {
        this.dragging = false;
    };
    /**
     * @param {?} event
     * @param {?} callback
     * @return {?}
     */
    MockDrake.prototype.on = /**
     * @param {?} event
     * @param {?} callback
     * @return {?}
     */
    function (event, callback) {
        this.subs.add(this.emitter$
            .pipe(filter(function (_a) {
            var eventType = _a.eventType;
            return eventType === event;
        }))
            .subscribe(function (_a) {
            var args = _a.args;
            callback.apply(void 0, tslib_1.__spread(args));
        }));
    };
    /**
     * @return {?}
     */
    MockDrake.prototype.destroy = /**
     * @return {?}
     */
    function () {
        this.subs.unsubscribe();
    };
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
     * @param {?} eventType
     * @param {...?} args
     * @return {?}
     */
    MockDrake.prototype.emit = /**
     * This is the most useful method. You can use it to manually fire events that would normally
     * be fired by a real drake.
     *
     * You're likely most interested in firing `drag`, `remove` and `drop`, the three events
     * DragulaService uses to implement [dragulaModel].
     *
     * See https://github.com/bevacqua/dragula#drakeon-events for what you should emit (and in what order).
     *
     * (Note also, firing dropModel and removeModel won't work. You would have to mock DragulaService for that.)
     * @param {?} eventType
     * @param {...?} args
     * @return {?}
     */
    function (eventType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.emitter$.next({ eventType: eventType, args: args });
    };
    return MockDrake;
}());
/**
 * You can use MockDrake to simulate Drake events.
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
export { MockDrake };
function MockDrake_tsickle_Closure_declarations() {
    /** @type {?} */
    MockDrake.prototype.dragging;
    /** @type {?} */
    MockDrake.prototype.emitter$;
    /** @type {?} */
    MockDrake.prototype.subs;
    /** @type {?} */
    MockDrake.prototype.containers;
    /** @type {?} */
    MockDrake.prototype.options;
    /** @type {?} */
    MockDrake.prototype.models;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9ja0RyYWtlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJlbG91Y2Npby9uZzItZHJhZ3VsYS8iLCJzb3VyY2VzIjpbIk1vY2tEcmFrZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTdDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUd4QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBRTlDLFdBQWEsZ0JBQWdCLEdBQUcsSUFBSSxZQUFZLENBQUMsVUFBQyxVQUFVLEVBQUUsT0FBTztJQUNuRSxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0NBQzNDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JIOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0lBQ0U7Ozs7O09BS0c7SUFDSCxtQkFDUyxZQUNBLFNBQ0E7OztRQUZBLGVBQVUsR0FBVixVQUFVO1FBQ1YsWUFBTyxHQUFQLE9BQU87UUFDUCxXQUFNLEdBQU4sTUFBTTs7d0JBSUssS0FBSzt3QkFzQk4sSUFBSSxPQUFPLEVBQTBDO29CQUV6RCxJQUFJLFlBQVksRUFBRTtLQTNCN0I7SUFLSiwwQkFBMEI7Ozs7O0lBQzFCLHlCQUFLOzs7O0lBQUwsVUFBTSxJQUFhO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0tBQ3RCO0lBQ0QsMEJBQTBCOzs7O0lBQzFCLHVCQUFHOzs7SUFBSDtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0tBQ3ZCOzs7OztJQUlELDBCQUFNOzs7O0lBQU4sVUFBTyxNQUFZO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0tBQ3ZCO0lBQ0QsMEJBQTBCOzs7O0lBQzFCLDBCQUFNOzs7SUFBTjtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0tBQ3ZCOzs7Ozs7SUFPRCxzQkFBRTs7Ozs7SUFBRixVQUFHLEtBQWEsRUFBRSxRQUFrQjtRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUTthQUN4QixJQUFJLENBQ0gsTUFBTSxDQUFDLFVBQUMsRUFBYTtnQkFBWCx3QkFBUztZQUFPLE9BQUEsU0FBUyxLQUFLLEtBQUs7UUFBbkIsQ0FBbUIsQ0FBQyxDQUMvQzthQUNBLFNBQVMsQ0FBQyxVQUFDLEVBQVE7Z0JBQU4sY0FBSTtZQUNoQixRQUFRLGdDQUFJLElBQUksR0FBRTtTQUNuQixDQUFDLENBQUMsQ0FBQztLQUNQOzs7O0lBRUQsMkJBQU87OztJQUFQO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUN6QjtJQUVEOzs7Ozs7Ozs7O09BVUc7Ozs7Ozs7Ozs7Ozs7OztJQUNILHdCQUFJOzs7Ozs7Ozs7Ozs7OztJQUFKLFVBQUssU0FBcUI7UUFBRSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLDZCQUFjOztRQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsV0FBQSxFQUFFLElBQUksTUFBQSxFQUFFLENBQUMsQ0FBQTtLQUN4QztvQkE5Rkg7SUFnR0MsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBckVELHFCQXFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRHJha2VXaXRoTW9kZWxzIH0gZnJvbSAnLi9EcmFrZVdpdGhNb2RlbHMnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRXZlbnRUeXBlcyB9IGZyb20gJy4vRXZlbnRUeXBlcyc7XG5pbXBvcnQgeyBEcmFndWxhT3B0aW9ucyB9IGZyb20gJy4vRHJhZ3VsYU9wdGlvbnMnO1xuaW1wb3J0IHsgRHJha2VGYWN0b3J5IH0gZnJvbSAnLi9EcmFrZUZhY3RvcnknO1xuXG5leHBvcnQgY29uc3QgTW9ja0RyYWtlRmFjdG9yeSA9IG5ldyBEcmFrZUZhY3RvcnkoKGNvbnRhaW5lcnMsIG9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIG5ldyBNb2NrRHJha2UoY29udGFpbmVycywgb3B0aW9ucyk7XG59KTtcblxuLyoqIFlvdSBjYW4gdXNlIE1vY2tEcmFrZSB0byBzaW11bGF0ZSBEcmFrZSBldmVudHMuXG4gKlxuICogVGhlIHRocmVlIG1ldGhvZHMgdGhhdCBhY3R1YWxseSBkbyBhbnl0aGluZyBhcmUgYG9uKGV2ZW50LCBsaXN0ZW5lcilgLFxuICogYGRlc3Ryb3koKWAsIGFuZCBhIG5ldyBtZXRob2QsIGBlbWl0KClgLiBVc2UgYGVtaXQoKWAgdG8gbWFudWFsbHkgZW1pdCBEcmFrZVxuICogZXZlbnRzLCBhbmQgaWYgeW91IGluamVjdGVkIE1vY2tEcmFrZSBwcm9wZXJseSB3aXRoIE1vY2tEcmFrZUZhY3Rvcnkgb3JcbiAqIG1vY2tlZCB0aGUgRHJhZ3VsYVNlcnZpY2UuZmluZCgpIG1ldGhvZCwgdGhlbiB5b3UgY2FuIG1ha2UgbmcyLWRyYWd1bGEgdGhpbmtcbiAqIGRyYWdzIGFuZCBkcm9wcyBhcmUgaGFwcGVuaW5nLlxuICpcbiAqIENhdmVhdHM6XG4gKlxuICogMS4gWU9VIE1VU1QgTUFLRSBUSEUgRE9NIENIQU5HRVMgWU9VUlNFTEYuXG4gKiAyLiBSRVBFQVQ6IFlPVSBNVVNUIE1BS0UgVEhFIERPTSBDSEFOR0VTIFlPVVJTRUxGLlxuICogICAgVGhhdCBtZWFucyBgc291cmNlLnJlbW92ZUNoaWxkKGVsKWAsIGFuZCBgdGFyZ2V0Lmluc2VydEJlZm9yZShlbClgLlxuICogMy4gTm9uZSBvZiB0aGUgb3RoZXIgbWV0aG9kcyBkbyBhbnl0aGluZy5cbiAqICAgIFRoYXQncyBvaywgYmVjYXVzZSBuZzItZHJhZ3VsYSBkb2Vzbid0IHVzZSB0aGVtLlxuICovXG5leHBvcnQgY2xhc3MgTW9ja0RyYWtlIGltcGxlbWVudHMgRHJha2VXaXRoTW9kZWxzIHtcbiAgLyoqXG4gICAqIEBwYXJhbSBjb250YWluZXJzIEEgbGlzdCBvZiBjb250YWluZXIgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBvcHRpb25zIFRoZXNlIHdpbGwgTk9UIGJlIHVzZWQuIEF0IGFsbC5cbiAgICogQHBhcmFtIG1vZGVscyBOb25zdGFuZGFyZCwgYnV0IHVzZWZ1bCBmb3IgdGVzdGluZyB1c2luZyBgbmV3IE1vY2tEcmFrZSgpYCBkaXJlY3RseS5cbiAgICogICAgICAgICAgICAgICBOb3RlLCBkZWZhdWx0IHZhbHVlIGlzIHVuZGVmaW5lZCwgbGlrZSBhIHJlYWwgRHJha2UuIERvbid0IGNoYW5nZSB0aGF0LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGNvbnRhaW5lcnM6IEVsZW1lbnRbXSA9IFtdLFxuICAgIHB1YmxpYyBvcHRpb25zOiBEcmFndWxhT3B0aW9ucyA9IHt9LFxuICAgIHB1YmxpYyBtb2RlbHM/OiBhbnlbXVtdXG4gICkge31cblxuICAvKiBEb2Vzbid0IHJlcHJlc2VudCBhbnl0aGluZyBtZWFuaW5nZnVsLiAqL1xuICBkcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qIERvZXMgbm90aGluZyB1c2VmdWwuICovXG4gIHN0YXJ0KGl0ZW06IEVsZW1lbnQpOiBhbnkge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuICB9XG4gIC8qIERvZXMgbm90aGluZyB1c2VmdWwuICovXG4gIGVuZCgpOiBhbnkge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuICAvKiBEb2VzIG5vdGhpbmcgdXNlZnVsLiAqL1xuICBjYW5jZWwocmV2ZXJ0OiBib29sZWFuKTogYW55O1xuICBjYW5jZWwoKTogYW55O1xuICBjYW5jZWwocmV2ZXJ0PzogYW55KSB7XG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICB9XG4gIC8qIERvZXMgbm90aGluZyB1c2VmdWwuICovXG4gIHJlbW92ZSgpOiBhbnkge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIEJhc2ljIGJ1dCBmdWxseSBmdW5jdGlvbmFsIGV2ZW50IGVtaXR0ZXIgc2hpbVxuICBwcml2YXRlIGVtaXR0ZXIkID0gbmV3IFN1YmplY3Q8eyBldmVudFR5cGU6IEV2ZW50VHlwZXMsIGFyZ3M6IGFueVtdIH0+KCk7XG5cbiAgcHJpdmF0ZSBzdWJzID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IGFueSB7XG4gICAgdGhpcy5zdWJzLmFkZCh0aGlzLmVtaXR0ZXIkXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKCh7IGV2ZW50VHlwZSB9KSA9PiBldmVudFR5cGUgPT09IGV2ZW50KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoeyBhcmdzIH0pID0+IHtcbiAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICB9KSk7XG4gIH1cblxuICBkZXN0cm95KCk6IGFueSB7XG4gICAgdGhpcy5zdWJzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgbW9zdCB1c2VmdWwgbWV0aG9kLiBZb3UgY2FuIHVzZSBpdCB0byBtYW51YWxseSBmaXJlIGV2ZW50cyB0aGF0IHdvdWxkIG5vcm1hbGx5XG4gICAqIGJlIGZpcmVkIGJ5IGEgcmVhbCBkcmFrZS5cbiAgICpcbiAgICogWW91J3JlIGxpa2VseSBtb3N0IGludGVyZXN0ZWQgaW4gZmlyaW5nIGBkcmFnYCwgYHJlbW92ZWAgYW5kIGBkcm9wYCwgdGhlIHRocmVlIGV2ZW50c1xuICAgKiBEcmFndWxhU2VydmljZSB1c2VzIHRvIGltcGxlbWVudCBbZHJhZ3VsYU1vZGVsXS5cbiAgICpcbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXZhY3F1YS9kcmFndWxhI2RyYWtlb24tZXZlbnRzIGZvciB3aGF0IHlvdSBzaG91bGQgZW1pdCAoYW5kIGluIHdoYXQgb3JkZXIpLlxuICAgKlxuICAgKiAoTm90ZSBhbHNvLCBmaXJpbmcgZHJvcE1vZGVsIGFuZCByZW1vdmVNb2RlbCB3b24ndCB3b3JrLiBZb3Ugd291bGQgaGF2ZSB0byBtb2NrIERyYWd1bGFTZXJ2aWNlIGZvciB0aGF0LilcbiAgICovXG4gIGVtaXQoZXZlbnRUeXBlOiBFdmVudFR5cGVzLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMuZW1pdHRlciQubmV4dCh7IGV2ZW50VHlwZSwgYXJncyB9KVxuICB9XG5cbn1cbiJdfQ==