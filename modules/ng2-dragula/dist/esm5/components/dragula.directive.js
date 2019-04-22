/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import { DragulaService } from './dragula.service';
import { Subscription } from 'rxjs';
var DragulaDirective = /** @class */ (function () {
    function DragulaDirective(el, dragulaService) {
        this.el = el;
        this.dragulaService = dragulaService;
        this.dragulaModelChange = new EventEmitter();
    }
    Object.defineProperty(DragulaDirective.prototype, "container", {
        get: /**
         * @return {?}
         */
        function () {
            return this.el && this.el.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    DragulaDirective.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes && changes.dragula) {
            var _a = changes.dragula, prev = _a.previousValue, current = _a.currentValue, firstChange = _a.firstChange;
            /** @type {?} */
            var hadPreviousValue = !!prev;
            /** @type {?} */
            var hasNewValue = !!current;
            // something -> null       =>  teardown only
            // something -> something  =>  teardown, then setup
            //      null -> something  =>  setup only
            //
            //      null -> null (precluded by fact of change being present)
            if (hadPreviousValue) {
                this.teardown(prev);
            }
            if (hasNewValue) {
                this.setup();
            }
        }
        else if (changes && changes.dragulaModel) {
            var _b = changes.dragulaModel, prev = _b.previousValue, current = _b.currentValue, firstChange = _b.firstChange;
            var drake = this.group.drake;
            if (this.dragula && drake) {
                drake.models = drake.models || [];
                /** @type {?} */
                var prevIndex = drake.models.indexOf(prev);
                if (prevIndex !== -1) {
                    // delete the previous
                    drake.models.splice(prevIndex, 1);
                    // maybe insert a new one at the same spot
                    if (!!current) {
                        drake.models.splice(prevIndex, 0, current);
                    }
                }
                else if (!!current) {
                    // no previous one to remove; just push this one.
                    drake.models.push(current);
                }
            }
        }
    };
    /**
     * @return {?}
     */
    DragulaDirective.prototype.setup = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var checkModel = function (group) {
            if (_this.dragulaModel) {
                if (group.drake.models) {
                    group.drake.models.push(_this.dragulaModel);
                }
                else {
                    group.drake.models = [_this.dragulaModel];
                }
            }
        };
        /** @type {?} */
        var group = this.dragulaService.find(this.dragula);
        if (!group) {
            /** @type {?} */
            var options = {};
            group = this.dragulaService.createGroup(this.dragula, options);
        }
        // ensure model and container element are pushed
        checkModel(group);
        group.drake.containers.push(this.container);
        this.subscribe(this.dragula);
        this.group = group;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DragulaDirective.prototype.subscribe = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        var _this = this;
        this.subs = new Subscription();
        this.subs.add(this.dragulaService
            .dropModel(name)
            .subscribe(function (_a) {
            var source = _a.source, target = _a.target, sourceModel = _a.sourceModel, targetModel = _a.targetModel;
            if (source === _this.el.nativeElement) {
                _this.dragulaModelChange.emit(sourceModel);
            }
            else if (target === _this.el.nativeElement) {
                _this.dragulaModelChange.emit(targetModel);
            }
        }));
        this.subs.add(this.dragulaService
            .removeModel(name)
            .subscribe(function (_a) {
            var source = _a.source, sourceModel = _a.sourceModel;
            if (source === _this.el.nativeElement) {
                _this.dragulaModelChange.emit(sourceModel);
            }
        }));
    };
    /**
     * @param {?} groupName
     * @return {?}
     */
    DragulaDirective.prototype.teardown = /**
     * @param {?} groupName
     * @return {?}
     */
    function (groupName) {
        if (this.subs) {
            this.subs.unsubscribe();
        }
        /** @type {?} */
        var group = this.dragulaService.find(groupName);
        if (group) {
            /** @type {?} */
            var itemToRemove = group.drake.containers.indexOf(this.el.nativeElement);
            if (itemToRemove !== -1) {
                group.drake.containers.splice(itemToRemove, 1);
            }
            if (this.dragulaModel && group.drake && group.drake.models) {
                /** @type {?} */
                var modelIndex = group.drake.models.indexOf(this.dragulaModel);
                if (modelIndex !== -1) {
                    group.drake.models.splice(modelIndex, 1);
                }
            }
        }
    };
    /**
     * @return {?}
     */
    DragulaDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.teardown(this.dragula);
    };
    DragulaDirective.decorators = [
        { type: Directive, args: [{ selector: '[dragula]' },] }
    ];
    /** @nocollapse */
    DragulaDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: DragulaService }
    ]; };
    DragulaDirective.propDecorators = {
        dragula: [{ type: Input }],
        dragulaModel: [{ type: Input }],
        dragulaModelChange: [{ type: Output }]
    };
    return DragulaDirective;
}());
export { DragulaDirective };
function DragulaDirective_tsickle_Closure_declarations() {
    /** @type {?} */
    DragulaDirective.prototype.dragula;
    /** @type {?} */
    DragulaDirective.prototype.dragulaModel;
    /** @type {?} */
    DragulaDirective.prototype.dragulaModelChange;
    /** @type {?} */
    DragulaDirective.prototype.subs;
    /** @type {?} */
    DragulaDirective.prototype.group;
    /** @type {?} */
    DragulaDirective.prototype.el;
    /** @type {?} */
    DragulaDirective.prototype.dragulaService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ3VsYS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYmVsb3VjY2lvL25nMi1kcmFndWxhLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9kcmFndWxhLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBOEMsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9ILE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVuRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs4QkFnQlAsRUFBYyxFQUFVLGNBQThCO1FBQXRELE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7a0NBVDNDLElBQUksWUFBWSxFQUFTOzswQkFJbkQsdUNBQVM7Ozs7O1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDOzs7Ozs7Ozs7SUFPbkMsc0NBQVc7Ozs7Y0FBQyxPQUE4RDtRQUMvRSxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDL0IsMEJBQVEsdUJBQW1CLEVBQUUseUJBQXFCLEVBQUUsNEJBQVcsQ0FBcUI7O1lBQ3BGLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzs7WUFDOUIsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7Ozs7O1lBTTVCLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNyQjtZQUNELEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNkO1NBQ0Y7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBSTNDLCtCQUFRLHVCQUFtQixFQUFFLHlCQUFxQixFQUFFLDRCQUFXLENBQTBCO1lBQ2pGLElBQUEsd0JBQUssQ0FBZ0I7WUFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDOztnQkFDbEMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O29CQUVyQixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7O29CQUVsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDZCxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO3FCQUM1QztpQkFDRjtnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7O29CQUVyQixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDNUI7YUFDRjtTQUNGOzs7OztJQUtJLGdDQUFLOzs7Ozs7UUFDVixJQUFJLFVBQVUsR0FBRyxVQUFDLEtBQVk7WUFDNUIsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDdkIsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDNUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQzFDO2FBQ0Y7U0FDRixDQUFDOztRQUdGLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O1lBQ1gsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2hFOztRQUdELFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQixLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTdCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOzs7Ozs7SUFHZCxvQ0FBUzs7OztjQUFDLElBQVk7O1FBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FDWCxJQUFJLENBQUMsY0FBYzthQUNsQixTQUFTLENBQUMsSUFBSSxDQUFDO2FBQ2YsU0FBUyxDQUFDLFVBQUMsRUFBNEM7Z0JBQTFDLGtCQUFNLEVBQUUsa0JBQU0sRUFBRSw0QkFBVyxFQUFFLDRCQUFXO1lBQ3BELEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxLQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDM0M7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUMzQztTQUNGLENBQUMsQ0FDSCxDQUFDO1FBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQ1gsSUFBSSxDQUFDLGNBQWM7YUFDbEIsV0FBVyxDQUFDLElBQUksQ0FBQzthQUNqQixTQUFTLENBQUMsVUFBQyxFQUF1QjtnQkFBckIsa0JBQU0sRUFBRSw0QkFBVztZQUMvQixFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzNDO1NBQ0YsQ0FBQyxDQUNILENBQUM7Ozs7OztJQUdHLG1DQUFROzs7O2NBQUMsU0FBaUI7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3pCOztRQUNELElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O1lBQ1YsSUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDM0UsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNoRDtZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7O2dCQUMzRCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUMvRCxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUMxQzthQUNGO1NBQ0Y7Ozs7O0lBR0ksc0NBQVc7Ozs7UUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7OztnQkFoSS9CLFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUM7Ozs7Z0JBTkMsVUFBVTtnQkFDcEMsY0FBYzs7OzBCQU9wQixLQUFLOytCQUNMLEtBQUs7cUNBQ0wsTUFBTTs7MkJBVlQ7O1NBT2EsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgT3V0cHV0LCBFbGVtZW50UmVmLCBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBTaW1wbGVDaGFuZ2UsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRHJhZ3VsYVNlcnZpY2UgfSBmcm9tICcuL2RyYWd1bGEuc2VydmljZSc7XG5pbXBvcnQgeyBEcmFrZVdpdGhNb2RlbHMgfSBmcm9tICcuLi9EcmFrZVdpdGhNb2RlbHMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBHcm91cCB9IGZyb20gJy4uL0dyb3VwJztcblxuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbZHJhZ3VsYV0nfSlcbmV4cG9ydCBjbGFzcyBEcmFndWxhRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBwdWJsaWMgZHJhZ3VsYTogc3RyaW5nO1xuICBASW5wdXQoKSBwdWJsaWMgZHJhZ3VsYU1vZGVsOiBhbnlbXTtcbiAgQE91dHB1dCgpIHB1YmxpYyBkcmFndWxhTW9kZWxDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueVtdPigpO1xuXG4gIHByaXZhdGUgc3ViczogU3Vic2NyaXB0aW9uO1xuXG4gIHByaXZhdGUgZ2V0IGNvbnRhaW5lcigpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuZWwgJiYgdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICB9XG4gIHByaXZhdGUgZ3JvdXA6IEdyb3VwO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIGRyYWd1bGFTZXJ2aWNlOiBEcmFndWxhU2VydmljZSkge1xuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IHtkcmFndWxhPzogU2ltcGxlQ2hhbmdlLCBkcmFndWxhTW9kZWw/OiBTaW1wbGVDaGFuZ2V9KTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMgJiYgY2hhbmdlcy5kcmFndWxhKSB7XG4gICAgICBjb25zdCB7IHByZXZpb3VzVmFsdWU6IHByZXYsIGN1cnJlbnRWYWx1ZTogY3VycmVudCwgZmlyc3RDaGFuZ2UgfSA9IGNoYW5nZXMuZHJhZ3VsYTtcbiAgICAgIGxldCBoYWRQcmV2aW91c1ZhbHVlID0gISFwcmV2O1xuICAgICAgbGV0IGhhc05ld1ZhbHVlID0gISFjdXJyZW50O1xuICAgICAgLy8gc29tZXRoaW5nIC0+IG51bGwgICAgICAgPT4gIHRlYXJkb3duIG9ubHlcbiAgICAgIC8vIHNvbWV0aGluZyAtPiBzb21ldGhpbmcgID0+ICB0ZWFyZG93biwgdGhlbiBzZXR1cFxuICAgICAgLy8gICAgICBudWxsIC0+IHNvbWV0aGluZyAgPT4gIHNldHVwIG9ubHlcbiAgICAgIC8vXG4gICAgICAvLyAgICAgIG51bGwgLT4gbnVsbCAocHJlY2x1ZGVkIGJ5IGZhY3Qgb2YgY2hhbmdlIGJlaW5nIHByZXNlbnQpXG4gICAgICBpZiAoaGFkUHJldmlvdXNWYWx1ZSkge1xuICAgICAgICB0aGlzLnRlYXJkb3duKHByZXYpO1xuICAgICAgfVxuICAgICAgaWYgKGhhc05ld1ZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0dXAoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNoYW5nZXMgJiYgY2hhbmdlcy5kcmFndWxhTW9kZWwpIHtcbiAgICAgIC8vIHRoaXMgY29kZSBvbmx5IHJ1bnMgd2hlbiB5b3UncmUgbm90IGNoYW5naW5nIHRoZSBncm91cCBuYW1lXG4gICAgICAvLyBiZWNhdXNlIGlmIHlvdSdyZSBjaGFuZ2luZyB0aGUgZ3JvdXAgbmFtZSwgeW91J2xsIGJlIGRvaW5nIHNldHVwIG9yIHRlYXJkb3duXG4gICAgICAvLyBpdCBhbHNvIG9ubHkgcnVucyBpZiB0aGVyZSBpcyBhIGdyb3VwIG5hbWUgdG8gYXR0YWNoIHRvLlxuICAgICAgY29uc3QgeyBwcmV2aW91c1ZhbHVlOiBwcmV2LCBjdXJyZW50VmFsdWU6IGN1cnJlbnQsIGZpcnN0Q2hhbmdlIH0gPSBjaGFuZ2VzLmRyYWd1bGFNb2RlbDtcbiAgICAgIGNvbnN0IHsgZHJha2UgfSA9IHRoaXMuZ3JvdXA7XG4gICAgICBpZiAodGhpcy5kcmFndWxhICYmIGRyYWtlKSB7XG4gICAgICAgIGRyYWtlLm1vZGVscyA9IGRyYWtlLm1vZGVscyB8fCBbXTtcbiAgICAgICAgbGV0IHByZXZJbmRleCA9IGRyYWtlLm1vZGVscy5pbmRleE9mKHByZXYpO1xuICAgICAgICBpZiAocHJldkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgcHJldmlvdXNcbiAgICAgICAgICBkcmFrZS5tb2RlbHMuc3BsaWNlKHByZXZJbmRleCwgMSk7XG4gICAgICAgICAgLy8gbWF5YmUgaW5zZXJ0IGEgbmV3IG9uZSBhdCB0aGUgc2FtZSBzcG90XG4gICAgICAgICAgaWYgKCEhY3VycmVudCkge1xuICAgICAgICAgICAgZHJha2UubW9kZWxzLnNwbGljZShwcmV2SW5kZXgsIDAsIGN1cnJlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghIWN1cnJlbnQpIHtcbiAgICAgICAgICAvLyBubyBwcmV2aW91cyBvbmUgdG8gcmVtb3ZlOyBqdXN0IHB1c2ggdGhpcyBvbmUuXG4gICAgICAgICAgZHJha2UubW9kZWxzLnB1c2goY3VycmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBjYWxsIG5nT25Jbml0ICdzZXR1cCcgYmVjYXVzZSB3ZSB3YW50IHRvIGNhbGwgaXQgaW4gbmdPbkNoYW5nZXNcbiAgLy8gYW5kIGl0IHdvdWxkIG90aGVyd2lzZSBydW4gdHdpY2VcbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuICAgIGxldCBjaGVja01vZGVsID0gKGdyb3VwOiBHcm91cCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJhZ3VsYU1vZGVsKSB7XG4gICAgICAgIGlmIChncm91cC5kcmFrZS5tb2RlbHMpIHtcbiAgICAgICAgICBncm91cC5kcmFrZS5tb2RlbHMucHVzaCh0aGlzLmRyYWd1bGFNb2RlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ3JvdXAuZHJha2UubW9kZWxzID0gW3RoaXMuZHJhZ3VsYU1vZGVsXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBmaW5kIG9yIGNyZWF0ZSBhIGdyb3VwXG4gICAgbGV0IGdyb3VwID0gdGhpcy5kcmFndWxhU2VydmljZS5maW5kKHRoaXMuZHJhZ3VsYSk7XG4gICAgaWYgKCFncm91cCkge1xuICAgICAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgICAgIGdyb3VwID0gdGhpcy5kcmFndWxhU2VydmljZS5jcmVhdGVHcm91cCh0aGlzLmRyYWd1bGEsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIGVuc3VyZSBtb2RlbCBhbmQgY29udGFpbmVyIGVsZW1lbnQgYXJlIHB1c2hlZFxuICAgIGNoZWNrTW9kZWwoZ3JvdXApO1xuICAgIGdyb3VwLmRyYWtlLmNvbnRhaW5lcnMucHVzaCh0aGlzLmNvbnRhaW5lcik7XG4gICAgdGhpcy5zdWJzY3JpYmUodGhpcy5kcmFndWxhKTtcblxuICAgIHRoaXMuZ3JvdXAgPSBncm91cDtcbiAgfVxuXG4gIHB1YmxpYyBzdWJzY3JpYmUobmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdWJzID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICB0aGlzLmRyYWd1bGFTZXJ2aWNlXG4gICAgICAuZHJvcE1vZGVsKG5hbWUpXG4gICAgICAuc3Vic2NyaWJlKCh7IHNvdXJjZSwgdGFyZ2V0LCBzb3VyY2VNb2RlbCwgdGFyZ2V0TW9kZWwgfSkgPT4ge1xuICAgICAgICBpZiAoc291cmNlID09PSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICB0aGlzLmRyYWd1bGFNb2RlbENoYW5nZS5lbWl0KHNvdXJjZU1vZGVsKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQgPT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgIHRoaXMuZHJhZ3VsYU1vZGVsQ2hhbmdlLmVtaXQodGFyZ2V0TW9kZWwpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIHRoaXMuZHJhZ3VsYVNlcnZpY2VcbiAgICAgIC5yZW1vdmVNb2RlbChuYW1lKVxuICAgICAgLnN1YnNjcmliZSgoeyBzb3VyY2UsIHNvdXJjZU1vZGVsIH0pID0+IHtcbiAgICAgICAgaWYgKHNvdXJjZSA9PT0gdGhpcy5lbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgdGhpcy5kcmFndWxhTW9kZWxDaGFuZ2UuZW1pdChzb3VyY2VNb2RlbCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyB0ZWFyZG93bihncm91cE5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN1YnMpIHtcbiAgICAgIHRoaXMuc3Vicy51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBjb25zdCBncm91cCA9IHRoaXMuZHJhZ3VsYVNlcnZpY2UuZmluZChncm91cE5hbWUpO1xuICAgIGlmIChncm91cCkge1xuICAgICAgY29uc3QgaXRlbVRvUmVtb3ZlID0gZ3JvdXAuZHJha2UuY29udGFpbmVycy5pbmRleE9mKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICBpZiAoaXRlbVRvUmVtb3ZlICE9PSAtMSkge1xuICAgICAgICBncm91cC5kcmFrZS5jb250YWluZXJzLnNwbGljZShpdGVtVG9SZW1vdmUsIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZHJhZ3VsYU1vZGVsICYmIGdyb3VwLmRyYWtlICYmIGdyb3VwLmRyYWtlLm1vZGVscykge1xuICAgICAgICBsZXQgbW9kZWxJbmRleCA9IGdyb3VwLmRyYWtlLm1vZGVscy5pbmRleE9mKHRoaXMuZHJhZ3VsYU1vZGVsKTtcbiAgICAgICAgaWYgKG1vZGVsSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgZ3JvdXAuZHJha2UubW9kZWxzLnNwbGljZShtb2RlbEluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnRlYXJkb3duKHRoaXMuZHJhZ3VsYSk7XG4gIH1cblxufVxuIl19