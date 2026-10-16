import { Directive, Input, Output, ElementRef, OnChanges, OnDestroy, SimpleChange, EventEmitter } from '@angular/core';
import { DragulaService } from './dragula.service';
import { Subscription } from 'rxjs';
import { Group } from '../Group';
import { DrakeWithModels, ModelFilter } from '../DrakeWithModels';

type Model = NonNullable<DrakeWithModels['models']>[number];

@Directive({
    selector: '[dragula]',
    standalone: false
})
export class DragulaDirective implements OnChanges, OnDestroy {
  @Input() public dragula?: string;
  @Input() public dragulaModel?: any[];
  /**
   * When the container renders only some of `dragulaModel` (e.g. `@for (x of items | search)`),
   * pass the same test here. Drag and drop then update the full `dragulaModel`: a dropped item goes
   * right before the shown item it was dropped above, or right after the last shown item.
   */
  @Input() public dragulaModelFilter?: ModelFilter;
  @Output() public dragulaModelChange = new EventEmitter<any[]>();

  private subs?: Subscription;

  private get container(): HTMLElement {
    return this.el && this.el.nativeElement;
  }
  private group?: Group;

  public constructor(private el: ElementRef, private dragulaService: DragulaService) {
  }

  public ngOnChanges(changes: {dragula?: SimpleChange, dragulaModel?: SimpleChange, dragulaModelFilter?: SimpleChange}): void {
    if (changes && changes.dragula) {
      const { previousValue: prev, currentValue: current } = changes.dragula;
      const hadPreviousValue = !!prev;
      const hasNewValue = !!current;
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
      const drake = this.group?.drake;
      if (this.dragula && drake) {
        this.setModel(drake, changes.dragulaModel.currentValue);
      }
    }
    if (changes && changes.dragulaModelFilter && !changes.dragula) {
      const drake = this.group?.drake;
      if (this.dragula && drake) {
        this.setFilter(drake);
      }
    }
  }

  private setFilter(drake: DrakeWithModels): void {
    if (this.dragulaModelFilter) {
      const filters = drake.modelFilters ?? (drake.modelFilters = new Map());
      filters.set(this.container, this.dragulaModelFilter);
    } else {
      drake.modelFilters?.delete(this.container);
    }
  }

  /**
   * drake.models[i] belongs to drake.containers[i], so the model is always stored at this
   * container's index, including `undefined` while the container has no model (e.g. data still
   * loading). drake.models stays undefined until some container in the group has a model.
   */
  private setModel(drake: DrakeWithModels, model: Model | undefined): void {
    const index = drake.containers.indexOf(this.container);
    if (index === -1 || (!drake.models && !model)) {
      return;
    }
    const models = drake.models ?? (drake.models = []);
    while (models.length < drake.containers.length) {
      models.push(undefined as unknown as Model);
    }
    models[index] = model as Model;
  }

  // call ngOnInit 'setup' because we want to call it in ngOnChanges
  // and it would otherwise run twice
  public setup(): void {
    // find or create a group
    if (!this.dragula) {
      return;
    }

    let group = this.dragulaService.find(this.dragula);
    if (!group) {
      const options = {};
      group = this.dragulaService.createGroup(this.dragula, options);
    }

    // ensure container element and model are pushed, at the same index
    if (group.drake) {
      group.drake.containers.push(this.container);
      this.setModel(group.drake, this.dragulaModel);
      this.setFilter(group.drake);
    }
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
    this.subs?.unsubscribe();
    const drake = this.dragulaService.find(groupName)?.drake;
    if (drake) {
      // remove the container and its model together, so the pairs after it stay aligned
      const index = drake.containers.indexOf(this.el.nativeElement);
      if (index !== -1) {
        drake.containers.splice(index, 1);
        drake.models?.splice(index, 1);
      }
      drake.modelFilters?.delete(this.el.nativeElement);
    }
  }

  public ngOnDestroy(): void {
    if (!this.dragula) {
      return;
    }

    this.teardown(this.dragula);
  }

}
