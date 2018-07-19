import { Directive, Input, Output, ElementRef, OnInit, OnChanges, OnDestroy, SimpleChange, EventEmitter } from '@angular/core';
import { DragulaService } from './dragula.service';
import { DrakeWithModels } from '../DrakeWithModels';
import { Subscription } from 'rxjs';
import { Group } from '../Group';

@Directive({selector: '[dragula]'})
export class DragulaDirective implements OnChanges, OnDestroy {
  @Input() public dragula: string;
  @Input() public dragulaModel: any[];
  @Output() public dragulaModelChange = new EventEmitter<any[]>();

  private subs: Subscription;

  private container: any;
  private drake: DrakeWithModels;

  private el: ElementRef;
  private dragulaService: DragulaService;
  public constructor(el: ElementRef, dragulaService: DragulaService) {
    this.el = el;
    this.dragulaService = dragulaService;
    this.container = el.nativeElement;
  }

  public ngOnChanges(changes: {dragula?: SimpleChange, dragulaModel?: SimpleChange}): void {
    if (changes && changes.dragula) {
      const { previousValue: prev, currentValue: current, firstChange } = changes.dragula;
      let hadPreviousValue = !!prev;
      let hasNewValue = !!current;
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
    } else if (changes && changes.dragulaModel) {
      // this code only runs when you're not changing the group name
      // because if you're changing the group name, you'll be doing setup or teardown
      // it also only runs if there is a group name to attach to.
      const { previousValue: prev, currentValue: current, firstChange } = changes.dragulaModel;
      if (this.dragula && this.drake) {
        this.drake.models = this.drake.models || [];
        let prevIndex = this.drake.models.indexOf(prev);
        if (prevIndex !== -1) {
          // delete the previous
          this.drake.models.splice(prevIndex, 1);
          // maybe insert a new one at the same spot
          if (!!current) {
            this.drake.models.splice(prevIndex, 0, current);
          }
        } else if (!!current) {
          // no previous one to remove; just push this one.
          this.drake.models.push(current);
        }
      }
    }
  }

  // call ngOnInit 'setup' because we want to call it in ngOnChanges
  // and it would otherwise run twice
  public setup(): void {
    let group = this.dragulaService.find(this.dragula);
    let checkModel = () => {
      if (this.dragulaModel) {
        if (this.drake.models) {
          this.drake.models.push(this.dragulaModel);
        } else {
          this.drake.models = [this.dragulaModel];
        }
      }
    };
    if (group) {
      this.drake = group.drake;
      checkModel();
      this.drake.containers.push(this.container);
    } else {
      let options = {};
      this.drake = this.dragulaService.drakeFactory.build(
        [this.container],
        options
      );
      checkModel();
      let group = new Group(this.dragula, this.drake, options);
      this.dragulaService.add(group);
    }
    this.subscribe(this.dragula);
  }

  public subscribe(name: string) {
    this.subs = new Subscription();
    this.subs.add(
      this.dragulaService
      .dropModel(name)
      .subscribe(({ source, target, sourceModel, targetModel }) => {
        if (source === this.el.nativeElement) {
          // this.dragulaModel = sourceModel;
          this.dragulaModelChange.emit(sourceModel);
        } else if (target === this.el.nativeElement) {
          // this.dragulaModel = targetModel;
          this.dragulaModelChange.emit(targetModel);
        }
      })
    );
    this.subs.add(
      this.dragulaService
      .removeModel(name)
      .subscribe(({ source, sourceModel }) => {
        if (source === this.el.nativeElement) {
          this.dragulaModel = sourceModel;
          this.dragulaModelChange.emit(sourceModel);
        }
      })
    );
  }

  public teardown(groupName: string): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
    const group = this.dragulaService.find(groupName);
    if (group) {
      const itemToRemove = group.drake.containers.indexOf(this.el.nativeElement);
      if (itemToRemove !== -1) {
        group.drake.containers.splice(itemToRemove, 1);
      }
      if (this.dragulaModel && this.drake && this.drake.models) {
        let modelIndex = this.drake.models.indexOf(this.dragulaModel);
        if (modelIndex !== -1) {
          this.drake.models.splice(modelIndex, 1);
        }
      }
    }
  }

  public ngOnDestroy(): void {
    this.teardown(this.dragula);
  }

}
