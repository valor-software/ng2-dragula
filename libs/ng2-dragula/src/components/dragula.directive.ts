import { Directive, Input, Output, ElementRef, OnInit, OnChanges, OnDestroy, SimpleChange, EventEmitter } from '@angular/core';
import { DragulaService } from './dragula.service';
import { DrakeWithModels } from '../DrakeWithModels';
import { Subscription } from 'rxjs';
import { Group } from '../Group';

@Directive({selector: '[dragula]'})
export class DragulaDirective implements OnChanges, OnDestroy {
  @Input() public dragula?: string;
  @Input() public dragulaModel?: any[];
  @Output() public dragulaModelChange = new EventEmitter<any[]>();

  private subs?: Subscription;

  private get container(): HTMLElement {
    return this.el && this.el.nativeElement;
  }
  private group?: Group;

  public constructor(private el: ElementRef, private dragulaService: DragulaService) {
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
      const drake = this.group?.drake;
      if (this.dragula && drake) {
        drake.models = drake.models || [];
        let prevIndex = drake.models.indexOf(prev);
        if (prevIndex !== -1) {
          // delete the previous
          drake.models.splice(prevIndex, 1);
          // maybe insert a new one at the same spot
          if (!!current) {
            drake.models.splice(prevIndex, 0, current);
          }
        } else if (!!current) {
          // no previous one to remove; just push this one.
          drake.models.push(current);
        }
      }
    }
  }

  // call ngOnInit 'setup' because we want to call it in ngOnChanges
  // and it would otherwise run twice
  public setup(): void {
    let checkModel = (group: Group) => {
      if (this.dragulaModel) {
        if (group.drake.models) {
          group.drake.models.push(this.dragulaModel);
        } else {
          group.drake.models = [this.dragulaModel];
        }
      }
    };

    // find or create a group
    if (!this.dragula) {
      return;
    }

    let group = this.dragulaService.find(this.dragula);
    if (!group) {
      let options = {};
      group = this.dragulaService.createGroup(this.dragula, options);
    }

    // ensure model and container element are pushed
    checkModel(group);
    group.drake.containers.push(this.container);
    this.subscribe(this.dragula);

    this.group = group;
  }

  public subscribe(name: string) {
    this.subs = new Subscription();
    this.subs.add(
      this.dragulaService
      .dropModel(name)
      .subscribe(({ source, target, sourceModel, targetModel }) => {
        if (source === this.el.nativeElement) {
          this.dragulaModelChange.emit(sourceModel);
        } else if (target === this.el.nativeElement) {
          this.dragulaModelChange.emit(targetModel);
        }
      })
    );
    this.subs.add(
      this.dragulaService
      .removeModel(name)
      .subscribe(({ source, sourceModel }) => {
        if (source === this.el.nativeElement) {
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
      if (this.dragulaModel && group.drake && group.drake.models) {
        let modelIndex = group.drake.models.indexOf(this.dragulaModel);
        if (modelIndex !== -1) {
          group.drake.models.splice(modelIndex, 1);
        }
      }
    }
  }

  public ngOnDestroy(): void {
    if (!this.dragula) {
      return;
    }

    this.teardown(this.dragula);
  }

}
