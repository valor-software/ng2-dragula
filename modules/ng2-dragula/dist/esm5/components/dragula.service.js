/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable, Optional } from '@angular/core';
import { Group } from '../Group';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventTypes, AllEvents } from '../EventTypes';
import { DrakeFactory } from '../DrakeFactory';
/** @type {?} */
var filterEvent = function (eventType, filterDragType, projector) { return function (input) {
    return input.pipe(filter(function (_a) {
        var event = _a.event, name = _a.name;
        return event === eventType
            && (filterDragType === undefined || name === filterDragType);
    }), map(function (_a) {
        var name = _a.name, args = _a.args;
        return projector(name, args);
    }));
}; };
var ɵ0 = filterEvent;
/** @type {?} */
var elContainerSourceProjector = function (name, _a) {
    var _b = tslib_1.__read(_a, 3), el = _b[0], container = _b[1], source = _b[2];
    return ({ name: name, el: el, container: container, source: source });
};
var ɵ1 = elContainerSourceProjector;
var DragulaService = /** @class */ (function () {
    function DragulaService(drakeFactory) {
        if (drakeFactory === void 0) { drakeFactory = null; }
        var _this = this;
        this.drakeFactory = drakeFactory;
        this.dispatch$ = new Subject();
        this.drag = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.Drag, groupName, function (name, _a) {
            var _b = tslib_1.__read(_a, 2), el = _b[0], source = _b[1];
            return ({ name: name, el: el, source: source });
        })); };
        this.dragend = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.DragEnd, groupName, function (name, _a) {
            var _b = tslib_1.__read(_a, 1), el = _b[0];
            return ({ name: name, el: el });
        })); };
        this.drop = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.Drop, groupName, function (name, _a) {
            var _b = tslib_1.__read(_a, 4), el = _b[0], target = _b[1], source = _b[2], sibling = _b[3];
            return { name: name, el: el, target: target, source: source, sibling: sibling };
        })); };
        this.elContainerSource = function (eventType) {
            return function (groupName) {
                return _this.dispatch$.pipe(filterEvent(eventType, groupName, elContainerSourceProjector));
            };
        };
        this.cancel = this.elContainerSource(EventTypes.Cancel);
        this.remove = this.elContainerSource(EventTypes.Remove);
        this.shadow = this.elContainerSource(EventTypes.Shadow);
        this.over = this.elContainerSource(EventTypes.Over);
        this.out = this.elContainerSource(EventTypes.Out);
        this.cloned = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.Cloned, groupName, function (name, _a) {
            var _b = tslib_1.__read(_a, 3), clone = _b[0], original = _b[1], cloneType = _b[2];
            return { name: name, clone: clone, original: original, cloneType: cloneType };
        })); };
        this.dropModel = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.DropModel, groupName, function (name, _a) {
            var _b = tslib_1.__read(_a, 9), el = _b[0], target = _b[1], source = _b[2], sibling = _b[3], item = _b[4], sourceModel = _b[5], targetModel = _b[6], sourceIndex = _b[7], targetIndex = _b[8];
            return { name: name, el: el, target: target, source: source, sibling: sibling, item: item, sourceModel: sourceModel, targetModel: targetModel, sourceIndex: sourceIndex, targetIndex: targetIndex };
        })); };
        this.removeModel = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.RemoveModel, groupName, function (name, _a) {
            var _b = tslib_1.__read(_a, 6), el = _b[0], container = _b[1], source = _b[2], item = _b[3], sourceModel = _b[4], sourceIndex = _b[5];
            return { name: name, el: el, container: container, source: source, item: item, sourceModel: sourceModel, sourceIndex: sourceIndex };
        })); };
        this.groups = {};
        if (this.drakeFactory === null) {
            this.drakeFactory = new DrakeFactory();
        }
    }
    /**
     * Public mainly for testing purposes. Prefer `createGroup()`.
     * @param {?} group
     * @return {?}
     */
    DragulaService.prototype.add = /**
     * Public mainly for testing purposes. Prefer `createGroup()`.
     * @param {?} group
     * @return {?}
     */
    function (group) {
        /** @type {?} */
        var existingGroup = this.find(group.name);
        if (existingGroup) {
            throw new Error('Group named: "' + group.name + '" already exists.');
        }
        this.groups[group.name] = group;
        this.handleModels(group);
        this.setupEvents(group);
        return group;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DragulaService.prototype.find = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return this.groups[name];
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DragulaService.prototype.destroy = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        /** @type {?} */
        var group = this.find(name);
        if (!group) {
            return;
        }
        group.drake && group.drake.destroy();
        delete this.groups[name];
    };
    /**
     * Creates a group with the specified name and options.
     *
     * Note: formerly known as `setOptions`
     * @template T
     * @param {?} name
     * @param {?} options
     * @return {?}
     */
    DragulaService.prototype.createGroup = /**
     * Creates a group with the specified name and options.
     *
     * Note: formerly known as `setOptions`
     * @template T
     * @param {?} name
     * @param {?} options
     * @return {?}
     */
    function (name, options) {
        return this.add(new Group(name, this.drakeFactory.build([], options), options));
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    DragulaService.prototype.handleModels = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var _this = this;
        var name = _a.name, drake = _a.drake, options = _a.options;
        /** @type {?} */
        var dragElm;
        /** @type {?} */
        var dragIndex;
        /** @type {?} */
        var dropIndex;
        drake.on('remove', function (el, container, source) {
            if (!drake.models) {
                return;
            }
            /** @type {?} */
            var sourceModel = drake.models[drake.containers.indexOf(source)];
            sourceModel = sourceModel.slice(0);
            /** @type {?} */
            var item = sourceModel.splice(dragIndex, 1)[0];
            // console.log('REMOVE');
            // console.log(sourceModel);
            // console.log('REMOVE');
            // console.log(sourceModel);
            _this.dispatch$.next({
                event: EventTypes.RemoveModel,
                name: name,
                args: [el, container, source, item, sourceModel, dragIndex]
            });
        });
        drake.on('drag', function (el, source) {
            if (!drake.models) {
                return;
            }
            dragElm = el;
            dragIndex = _this.domIndexOf(el, source);
        });
        drake.on('drop', function (dropElm, target, source, sibling) {
            if (!drake.models || !target) {
                return;
            }
            dropIndex = _this.domIndexOf(dropElm, target);
            /** @type {?} */
            var sourceModel = drake.models[drake.containers.indexOf(source)];
            /** @type {?} */
            var targetModel = drake.models[drake.containers.indexOf(target)];
            /** @type {?} */
            var item;
            if (target === source) {
                sourceModel = sourceModel.slice(0);
                item = sourceModel.splice(dragIndex, 1)[0];
                sourceModel.splice(dropIndex, 0, item);
                // this was true before we cloned and updated sourceModel,
                // but targetModel still has the old value
                targetModel = sourceModel;
            }
            else {
                /** @type {?} */
                var isCopying = dragElm !== dropElm;
                item = sourceModel[dragIndex];
                if (isCopying) {
                    if (!options.copyItem) {
                        throw new Error("If you have enabled `copy` on a group, you must provide a `copyItem` function.");
                    }
                    item = options.copyItem(item);
                }
                if (!isCopying) {
                    sourceModel = sourceModel.slice(0);
                    sourceModel.splice(dragIndex, 1);
                }
                targetModel = targetModel.slice(0);
                targetModel.splice(dropIndex, 0, item);
                if (isCopying) {
                    try {
                        target.removeChild(dropElm);
                    }
                    catch (e) { }
                }
            }
            _this.dispatch$.next({
                event: EventTypes.DropModel,
                name: name,
                args: [dropElm, target, source, sibling, item, sourceModel, targetModel, dragIndex, dropIndex]
            });
        });
    };
    /**
     * @param {?} group
     * @return {?}
     */
    DragulaService.prototype.setupEvents = /**
     * @param {?} group
     * @return {?}
     */
    function (group) {
        var _this = this;
        if (group.initEvents) {
            return;
        }
        group.initEvents = true;
        /** @type {?} */
        var name = group.name;
        /** @type {?} */
        var that = this;
        /** @type {?} */
        var emitter = function (event) {
            group.drake.on(event, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.dispatch$.next({ event: event, name: name, args: args });
            });
        };
        AllEvents.forEach(emitter);
    };
    /**
     * @param {?} child
     * @param {?} parent
     * @return {?}
     */
    DragulaService.prototype.domIndexOf = /**
     * @param {?} child
     * @param {?} parent
     * @return {?}
     */
    function (child, parent) {
        return Array.prototype.indexOf.call(parent.children, child);
    };
    DragulaService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    DragulaService.ctorParameters = function () { return [
        { type: DrakeFactory, decorators: [{ type: Optional }] }
    ]; };
    return DragulaService;
}());
export { DragulaService };
function DragulaService_tsickle_Closure_declarations() {
    /** @type {?} */
    DragulaService.prototype.dispatch$;
    /** @type {?} */
    DragulaService.prototype.drag;
    /** @type {?} */
    DragulaService.prototype.dragend;
    /** @type {?} */
    DragulaService.prototype.drop;
    /** @type {?} */
    DragulaService.prototype.elContainerSource;
    /** @type {?} */
    DragulaService.prototype.cancel;
    /** @type {?} */
    DragulaService.prototype.remove;
    /** @type {?} */
    DragulaService.prototype.shadow;
    /** @type {?} */
    DragulaService.prototype.over;
    /** @type {?} */
    DragulaService.prototype.out;
    /** @type {?} */
    DragulaService.prototype.cloned;
    /** @type {?} */
    DragulaService.prototype.dropModel;
    /** @type {?} */
    DragulaService.prototype.removeModel;
    /** @type {?} */
    DragulaService.prototype.groups;
    /** @type {?} */
    DragulaService.prototype.drakeFactory;
}
export { ɵ0, ɵ1 };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ3VsYS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJlbG91Y2Npby9uZzItZHJhZ3VsYS8iLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZHJhZ3VsYS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUVqQyxPQUFPLEVBQUUsT0FBTyxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQUsvQyxJQUFNLFdBQVcsR0FBRyxVQUNsQixTQUFxQixFQUNyQixjQUFrQyxFQUNsQyxTQUE2QixJQUMxQixPQUFBLFVBQUMsS0FBMkI7SUFDL0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ2YsTUFBTSxDQUFDLFVBQUMsRUFBZTtZQUFiLGdCQUFLLEVBQUUsY0FBSTtRQUNuQixNQUFNLENBQUMsS0FBSyxLQUFLLFNBQVM7ZUFDbkIsQ0FBQyxjQUFjLEtBQUssU0FBUyxJQUFJLElBQUksS0FBSyxjQUFjLENBQUMsQ0FBQztLQUNsRSxDQUFDLEVBQ0YsR0FBRyxDQUFDLFVBQUMsRUFBYztZQUFaLGNBQUksRUFBRSxjQUFJO1FBQU8sT0FBQSxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztJQUFyQixDQUFxQixDQUFDLENBQy9DLENBQUM7Q0FDSCxFQVJJLENBUUosQ0FBQTs7O0FBRUQsSUFBTSwwQkFBMEIsR0FDOUIsVUFBQyxJQUFZLEVBQUUsRUFBb0Q7UUFBcEQsMEJBQW9ELEVBQW5ELFVBQUUsRUFBRSxp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QU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7O1FBQ3hCLElBQUksSUFBSSxHQUFRLElBQUksQ0FBQzs7UUFDckIsSUFBSSxPQUFPLEdBQUcsVUFBQyxLQUFpQjtZQUM5QixLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUU7Z0JBQUMsY0FBYztxQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO29CQUFkLHlCQUFjOztnQkFDbkMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxDQUFDLENBQUM7YUFDNUMsQ0FBQyxDQUFDO1NBQ0osQ0FBQztRQUNGLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Ozs7Ozs7SUFHckIsbUNBQVU7Ozs7O2NBQUMsS0FBVSxFQUFFLE1BQVc7UUFDeEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7Z0JBeE4vRCxVQUFVOzs7O2dCQXZCRixZQUFZLHVCQTBHTCxRQUFROzt5QkFoSHhCOztTQThCYSxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdyb3VwIH0gZnJvbSAnLi4vR3JvdXAnO1xuaW1wb3J0IHsgRHJhZ3VsYU9wdGlvbnMgfSBmcm9tICcuLi9EcmFndWxhT3B0aW9ucyc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEV2ZW50VHlwZXMsIEFsbEV2ZW50cyB9IGZyb20gJy4uL0V2ZW50VHlwZXMnO1xuaW1wb3J0IHsgRHJha2VGYWN0b3J5IH0gZnJvbSAnLi4vRHJha2VGYWN0b3J5JztcblxudHlwZSBGaWx0ZXJQcm9qZWN0b3I8VCBleHRlbmRzIHsgbmFtZTogc3RyaW5nOyB9PiA9IChuYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSA9PiBUO1xudHlwZSBEaXNwYXRjaCA9IHsgZXZlbnQ6IEV2ZW50VHlwZXM7IG5hbWU6IHN0cmluZzsgYXJnczogYW55W107IH07XG5cbmNvbnN0IGZpbHRlckV2ZW50ID0gPFQgZXh0ZW5kcyB7IG5hbWU6IHN0cmluZzsgfT4oXG4gIGV2ZW50VHlwZTogRXZlbnRUeXBlcyxcbiAgZmlsdGVyRHJhZ1R5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgcHJvamVjdG9yOiBGaWx0ZXJQcm9qZWN0b3I8VD5cbikgPT4gKGlucHV0OiBPYnNlcnZhYmxlPERpc3BhdGNoPik6IE9ic2VydmFibGU8VD4gPT4ge1xuICByZXR1cm4gaW5wdXQucGlwZShcbiAgICBmaWx0ZXIoKHsgZXZlbnQsIG5hbWUgfSkgPT4ge1xuICAgICAgcmV0dXJuIGV2ZW50ID09PSBldmVudFR5cGVcbiAgICAgICAgICAmJiAoZmlsdGVyRHJhZ1R5cGUgPT09IHVuZGVmaW5lZCB8fCBuYW1lID09PSBmaWx0ZXJEcmFnVHlwZSk7XG4gICAgfSksXG4gICAgbWFwKCh7IG5hbWUsIGFyZ3MgfSkgPT4gcHJvamVjdG9yKG5hbWUsIGFyZ3MpKVxuICApO1xufVxuXG5jb25zdCBlbENvbnRhaW5lclNvdXJjZVByb2plY3RvciA9XG4gIChuYW1lOiBzdHJpbmcsIFtlbCwgY29udGFpbmVyLCBzb3VyY2VdOiBbRWxlbWVudCwgRWxlbWVudCwgRWxlbWVudF0pID0+XG4gICAgKHsgbmFtZSwgZWwsIGNvbnRhaW5lciwgc291cmNlIH0pO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRHJhZ3VsYVNlcnZpY2Uge1xuXG4gIC8qIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXZhY3F1YS9kcmFndWxhI2RyYWtlb24tZXZlbnRzICovXG5cbiAgcHJpdmF0ZSBkaXNwYXRjaCQgPSBuZXcgU3ViamVjdDxEaXNwYXRjaD4oKTtcblxuICBwdWJsaWMgZHJhZyA9IChncm91cE5hbWU/OiBzdHJpbmcpID0+IHRoaXMuZGlzcGF0Y2gkLnBpcGUoXG4gICAgZmlsdGVyRXZlbnQoXG4gICAgICBFdmVudFR5cGVzLkRyYWcsXG4gICAgICBncm91cE5hbWUsXG4gICAgICAobmFtZSwgW2VsLCBzb3VyY2VdOiBbRWxlbWVudCwgRWxlbWVudF0pID0+ICh7IG5hbWUsIGVsLCBzb3VyY2UgfSlcbiAgICApXG4gICk7XG5cbiAgcHVibGljIGRyYWdlbmQgPSAoZ3JvdXBOYW1lPzogc3RyaW5nKSA9PiB0aGlzLmRpc3BhdGNoJC5waXBlKFxuICAgIGZpbHRlckV2ZW50KFxuICAgICAgRXZlbnRUeXBlcy5EcmFnRW5kLFxuICAgICAgZ3JvdXBOYW1lLFxuICAgICAgKG5hbWUsIFtlbF06IFtFbGVtZW50XSkgPT4gKHsgbmFtZSwgZWwgfSlcbiAgICApXG4gICk7XG5cbiAgcHVibGljIGRyb3AgPSAoZ3JvdXBOYW1lPzogc3RyaW5nKSA9PiB0aGlzLmRpc3BhdGNoJC5waXBlKFxuICAgIGZpbHRlckV2ZW50KFxuICAgICAgRXZlbnRUeXBlcy5Ecm9wLFxuICAgICAgZ3JvdXBOYW1lLFxuICAgICAgKG5hbWUsIFtcbiAgICAgICAgZWwsIHRhcmdldCwgc291cmNlLCBzaWJsaW5nXG4gICAgICBdOiBbRWxlbWVudCwgRWxlbWVudCwgRWxlbWVudCwgRWxlbWVudF0pID0+IHtcbiAgICAgICAgcmV0dXJuIHsgbmFtZSwgZWwsIHRhcmdldCwgc291cmNlLCBzaWJsaW5nIH07XG4gICAgICB9KVxuICApO1xuXG4gIHByaXZhdGUgZWxDb250YWluZXJTb3VyY2UgPVxuICAgIChldmVudFR5cGU6IEV2ZW50VHlwZXMpID0+XG4gICAgKGdyb3VwTmFtZT86IHN0cmluZykgPT5cbiAgICB0aGlzLmRpc3BhdGNoJC5waXBlKFxuICAgICAgZmlsdGVyRXZlbnQoZXZlbnRUeXBlLCBncm91cE5hbWUsIGVsQ29udGFpbmVyU291cmNlUHJvamVjdG9yKVxuICAgICk7XG5cbiAgcHVibGljIGNhbmNlbCA9IHRoaXMuZWxDb250YWluZXJTb3VyY2UoRXZlbnRUeXBlcy5DYW5jZWwpO1xuICBwdWJsaWMgcmVtb3ZlID0gdGhpcy5lbENvbnRhaW5lclNvdXJjZShFdmVudFR5cGVzLlJlbW92ZSk7XG4gIHB1YmxpYyBzaGFkb3cgPSB0aGlzLmVsQ29udGFpbmVyU291cmNlKEV2ZW50VHlwZXMuU2hhZG93KTtcbiAgcHVibGljIG92ZXIgPSB0aGlzLmVsQ29udGFpbmVyU291cmNlKEV2ZW50VHlwZXMuT3Zlcik7XG4gIHB1YmxpYyBvdXQgPSB0aGlzLmVsQ29udGFpbmVyU291cmNlKEV2ZW50VHlwZXMuT3V0KTtcblxuICBwdWJsaWMgY2xvbmVkID0gKGdyb3VwTmFtZT86IHN0cmluZykgPT4gdGhpcy5kaXNwYXRjaCQucGlwZShcbiAgICBmaWx0ZXJFdmVudChcbiAgICAgIEV2ZW50VHlwZXMuQ2xvbmVkLFxuICAgICAgZ3JvdXBOYW1lLFxuICAgICAgKG5hbWUsIFtcbiAgICAgICAgY2xvbmUsIG9yaWdpbmFsLCBjbG9uZVR5cGVcbiAgICAgIF06IFtFbGVtZW50LCBFbGVtZW50LCAnbWlycm9yJyB8ICdjb3B5J10pID0+IHtcbiAgICAgICAgcmV0dXJuIHsgbmFtZSwgY2xvbmUsIG9yaWdpbmFsLCBjbG9uZVR5cGUgfVxuICAgICAgfSlcbiAgKTtcblxuICBwdWJsaWMgZHJvcE1vZGVsID0gPFQgPSBhbnk+KGdyb3VwTmFtZT86IHN0cmluZykgPT4gdGhpcy5kaXNwYXRjaCQucGlwZShcbiAgICBmaWx0ZXJFdmVudChcbiAgICAgIEV2ZW50VHlwZXMuRHJvcE1vZGVsLFxuICAgICAgZ3JvdXBOYW1lLFxuICAgICAgKG5hbWUsIFtcbiAgICAgICAgZWwsIHRhcmdldCwgc291cmNlLCBzaWJsaW5nLCBpdGVtLCBzb3VyY2VNb2RlbCwgdGFyZ2V0TW9kZWwsIHNvdXJjZUluZGV4LCB0YXJnZXRJbmRleFxuICAgICAgXTogW0VsZW1lbnQsIEVsZW1lbnQsIEVsZW1lbnQsIEVsZW1lbnQsIFQsIFRbXSwgVFtdLCBudW1iZXIsIG51bWJlcl0pID0+IHtcbiAgICAgICAgcmV0dXJuIHsgbmFtZSwgZWwsIHRhcmdldCwgc291cmNlLCBzaWJsaW5nLCBpdGVtLCBzb3VyY2VNb2RlbCwgdGFyZ2V0TW9kZWwsIHNvdXJjZUluZGV4LCB0YXJnZXRJbmRleCB9XG4gICAgICB9KVxuICApO1xuXG4gIHB1YmxpYyByZW1vdmVNb2RlbCA9IDxUID0gYW55Pihncm91cE5hbWU/OiBzdHJpbmcpID0+IHRoaXMuZGlzcGF0Y2gkLnBpcGUoXG4gICAgZmlsdGVyRXZlbnQoXG4gICAgICBFdmVudFR5cGVzLlJlbW92ZU1vZGVsLFxuICAgICAgZ3JvdXBOYW1lLFxuICAgICAgKG5hbWUsIFtcbiAgICAgICAgZWwsIGNvbnRhaW5lciwgc291cmNlLCBpdGVtLCBzb3VyY2VNb2RlbCwgc291cmNlSW5kZXhcbiAgICAgIF06IFtFbGVtZW50LCBFbGVtZW50LCBFbGVtZW50LCBULCBUW10sIG51bWJlcl0pID0+IHtcbiAgICAgICAgcmV0dXJuIHsgbmFtZSwgZWwsIGNvbnRhaW5lciwgc291cmNlLCBpdGVtLCBzb3VyY2VNb2RlbCwgc291cmNlSW5kZXggfVxuICAgICAgfVxuICAgIClcbiAgKTtcblxuICBwcml2YXRlIGdyb3VwczogeyBbazogc3RyaW5nXTogR3JvdXAgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yIChAT3B0aW9uYWwoKSBwcml2YXRlIGRyYWtlRmFjdG9yeTogRHJha2VGYWN0b3J5ID0gbnVsbCkge1xuICAgIGlmICh0aGlzLmRyYWtlRmFjdG9yeSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5kcmFrZUZhY3RvcnkgPSBuZXcgRHJha2VGYWN0b3J5KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFB1YmxpYyBtYWlubHkgZm9yIHRlc3RpbmcgcHVycG9zZXMuIFByZWZlciBgY3JlYXRlR3JvdXAoKWAuICovXG4gIHB1YmxpYyBhZGQoZ3JvdXA6IEdyb3VwKTogR3JvdXAge1xuICAgIGxldCBleGlzdGluZ0dyb3VwID0gdGhpcy5maW5kKGdyb3VwLm5hbWUpO1xuICAgIGlmIChleGlzdGluZ0dyb3VwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dyb3VwIG5hbWVkOiBcIicgKyBncm91cC5uYW1lICsgJ1wiIGFscmVhZHkgZXhpc3RzLicpO1xuICAgIH1cbiAgICB0aGlzLmdyb3Vwc1tncm91cC5uYW1lXSA9IGdyb3VwO1xuICAgIHRoaXMuaGFuZGxlTW9kZWxzKGdyb3VwKTtcbiAgICB0aGlzLnNldHVwRXZlbnRzKGdyb3VwKTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH1cblxuICBwdWJsaWMgZmluZChuYW1lOiBzdHJpbmcpOiBHcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdXBzW25hbWVdO1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3kobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGdyb3VwID0gdGhpcy5maW5kKG5hbWUpO1xuICAgIGlmICghZ3JvdXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZ3JvdXAuZHJha2UgJiYgZ3JvdXAuZHJha2UuZGVzdHJveSgpO1xuICAgIGRlbGV0ZSB0aGlzLmdyb3Vwc1tuYW1lXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZ3JvdXAgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgYW5kIG9wdGlvbnMuXG4gICAqXG4gICAqIE5vdGU6IGZvcm1lcmx5IGtub3duIGFzIGBzZXRPcHRpb25zYFxuICAgKi9cbiAgcHVibGljIGNyZWF0ZUdyb3VwPFQgPSBhbnk+KG5hbWU6IHN0cmluZywgb3B0aW9uczogRHJhZ3VsYU9wdGlvbnM8VD4pOiBHcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuYWRkKG5ldyBHcm91cChcbiAgICAgIG5hbWUsXG4gICAgICB0aGlzLmRyYWtlRmFjdG9yeS5idWlsZChbXSwgb3B0aW9ucyksXG4gICAgICBvcHRpb25zXG4gICAgKSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZU1vZGVscyh7IG5hbWUsIGRyYWtlLCBvcHRpb25zIH06IEdyb3VwKTogdm9pZCB7XG4gICAgbGV0IGRyYWdFbG06IGFueTtcbiAgICBsZXQgZHJhZ0luZGV4OiBudW1iZXI7XG4gICAgbGV0IGRyb3BJbmRleDogbnVtYmVyO1xuICAgIGRyYWtlLm9uKCdyZW1vdmUnLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAoIWRyYWtlLm1vZGVscykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQgc291cmNlTW9kZWwgPSBkcmFrZS5tb2RlbHNbZHJha2UuY29udGFpbmVycy5pbmRleE9mKHNvdXJjZSldO1xuICAgICAgc291cmNlTW9kZWwgPSBzb3VyY2VNb2RlbC5zbGljZSgwKTsgLy8gY2xvbmUgaXRcbiAgICAgIGNvbnN0IGl0ZW0gPSBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKVswXTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdSRU1PVkUnKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHNvdXJjZU1vZGVsKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2gkLm5leHQoe1xuICAgICAgICBldmVudDogRXZlbnRUeXBlcy5SZW1vdmVNb2RlbCxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgYXJnczogWyBlbCwgY29udGFpbmVyLCBzb3VyY2UsIGl0ZW0sIHNvdXJjZU1vZGVsLCBkcmFnSW5kZXggXVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZHJha2Uub24oJ2RyYWcnLCAoZWw6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGlmICghZHJha2UubW9kZWxzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRyYWdFbG0gPSBlbDtcbiAgICAgIGRyYWdJbmRleCA9IHRoaXMuZG9tSW5kZXhPZihlbCwgc291cmNlKTtcbiAgICB9KTtcbiAgICBkcmFrZS5vbignZHJvcCcsIChkcm9wRWxtOiBhbnksIHRhcmdldDogRWxlbWVudCwgc291cmNlOiBFbGVtZW50LCBzaWJsaW5nPzogRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKCFkcmFrZS5tb2RlbHMgfHwgIXRhcmdldCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBkcm9wSW5kZXggPSB0aGlzLmRvbUluZGV4T2YoZHJvcEVsbSwgdGFyZ2V0KTtcbiAgICAgIGxldCBzb3VyY2VNb2RlbCA9IGRyYWtlLm1vZGVsc1tkcmFrZS5jb250YWluZXJzLmluZGV4T2Yoc291cmNlKV07XG4gICAgICBsZXQgdGFyZ2V0TW9kZWwgPSBkcmFrZS5tb2RlbHNbZHJha2UuY29udGFpbmVycy5pbmRleE9mKHRhcmdldCldO1xuICAgICAgLy8gY29uc29sZS5sb2coJ0RST1AnKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHNvdXJjZU1vZGVsKTtcbiAgICAgIGxldCBpdGVtOiBhbnk7XG4gICAgICBpZiAodGFyZ2V0ID09PSBzb3VyY2UpIHtcbiAgICAgICAgc291cmNlTW9kZWwgPSBzb3VyY2VNb2RlbC5zbGljZSgwKVxuICAgICAgICBpdGVtID0gc291cmNlTW9kZWwuc3BsaWNlKGRyYWdJbmRleCwgMSlbMF07XG4gICAgICAgIHNvdXJjZU1vZGVsLnNwbGljZShkcm9wSW5kZXgsIDAsIGl0ZW0pO1xuICAgICAgICAvLyB0aGlzIHdhcyB0cnVlIGJlZm9yZSB3ZSBjbG9uZWQgYW5kIHVwZGF0ZWQgc291cmNlTW9kZWwsXG4gICAgICAgIC8vIGJ1dCB0YXJnZXRNb2RlbCBzdGlsbCBoYXMgdGhlIG9sZCB2YWx1ZVxuICAgICAgICB0YXJnZXRNb2RlbCA9IHNvdXJjZU1vZGVsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGlzQ29weWluZyA9IGRyYWdFbG0gIT09IGRyb3BFbG07XG4gICAgICAgIGl0ZW0gPSBzb3VyY2VNb2RlbFtkcmFnSW5kZXhdO1xuICAgICAgICBpZiAoaXNDb3B5aW5nKSB7XG4gICAgICAgICAgaWYgKCFvcHRpb25zLmNvcHlJdGVtKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJZiB5b3UgaGF2ZSBlbmFibGVkIGBjb3B5YCBvbiBhIGdyb3VwLCB5b3UgbXVzdCBwcm92aWRlIGEgYGNvcHlJdGVtYCBmdW5jdGlvbi5cIilcbiAgICAgICAgICB9XG4gICAgICAgICAgaXRlbSA9IG9wdGlvbnMuY29weUl0ZW0oaXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQ29weWluZykge1xuICAgICAgICAgIHNvdXJjZU1vZGVsID0gc291cmNlTW9kZWwuc2xpY2UoMClcbiAgICAgICAgICBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXRNb2RlbCA9IHRhcmdldE1vZGVsLnNsaWNlKDApXG4gICAgICAgIHRhcmdldE1vZGVsLnNwbGljZShkcm9wSW5kZXgsIDAsIGl0ZW0pO1xuICAgICAgICBpZiAoaXNDb3B5aW5nKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVDaGlsZChkcm9wRWxtKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRpc3BhdGNoJC5uZXh0KHtcbiAgICAgICAgZXZlbnQ6IEV2ZW50VHlwZXMuRHJvcE1vZGVsLFxuICAgICAgICBuYW1lLFxuICAgICAgICBhcmdzOiBbIGRyb3BFbG0sIHRhcmdldCwgc291cmNlLCBzaWJsaW5nLCBpdGVtLCBzb3VyY2VNb2RlbCwgdGFyZ2V0TW9kZWwsIGRyYWdJbmRleCwgZHJvcEluZGV4IF1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cEV2ZW50cyhncm91cDogR3JvdXApOiB2b2lkIHtcbiAgICBpZiAoZ3JvdXAuaW5pdEV2ZW50cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBncm91cC5pbml0RXZlbnRzID0gdHJ1ZTtcbiAgICBjb25zdCBuYW1lID0gZ3JvdXAubmFtZTtcbiAgICBsZXQgdGhhdDogYW55ID0gdGhpcztcbiAgICBsZXQgZW1pdHRlciA9IChldmVudDogRXZlbnRUeXBlcykgPT4ge1xuICAgICAgZ3JvdXAuZHJha2Uub24oZXZlbnQsICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICB0aGlzLmRpc3BhdGNoJC5uZXh0KHsgZXZlbnQsIG5hbWUsIGFyZ3MgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIEFsbEV2ZW50cy5mb3JFYWNoKGVtaXR0ZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb21JbmRleE9mKGNoaWxkOiBhbnksIHBhcmVudDogYW55KTogYW55IHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChwYXJlbnQuY2hpbGRyZW4sIGNoaWxkKTtcbiAgfVxufVxuIl19