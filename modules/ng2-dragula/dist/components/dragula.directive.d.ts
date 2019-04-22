import { ElementRef, OnChanges, OnDestroy, SimpleChange, EventEmitter } from '@angular/core';
import { DragulaService } from './dragula.service';
export declare class DragulaDirective implements OnChanges, OnDestroy {
    private el;
    private dragulaService;
    dragula: string;
    dragulaModel: any[];
    dragulaModelChange: EventEmitter<any[]>;
    private subs;
    private readonly container;
    private group;
    constructor(el: ElementRef, dragulaService: DragulaService);
    ngOnChanges(changes: {
        dragula?: SimpleChange;
        dragulaModel?: SimpleChange;
    }): void;
    setup(): void;
    subscribe(name: string): void;
    teardown(groupName: string): void;
    ngOnDestroy(): void;
}
