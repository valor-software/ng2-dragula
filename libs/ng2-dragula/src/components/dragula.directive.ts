import { Directive, Input, Output, ElementRef, AfterViewInit, OnChanges, OnDestroy, SimpleChange, EventEmitter, isDevMode } from '@angular/core';
import { DragulaService } from './dragula.service';
import { Subscription } from 'rxjs';
import { Group } from '../Group';
import { DrakeWithModels } from '../DrakeWithModels';

type Model = NonNullable<DrakeWithModels['models']>[number];

@Directive({
    selector: '[dragula]',
    standalone: false
})
export class DragulaDirective implements OnChanges, AfterViewInit, OnDestroy {
  @Input() public dragula?: string;
  @Input() public dragulaModel?: any[];
  /**
   * CSS selector for a descendant of the host element to use as the container, for lists
   * rendered inside another component (e.g. the `tbody` of a table component). It is
   * resolved after the view initializes. When it is not set, the host element is the container.
   */
  @Input() public dragulaContainer?: string;
  @Output() public dragulaModelChange = new EventEmitter<any[]>();

  private subs?: Subscription;

  /** The element registered with the drake; undefined until setup has found it. */
  private container?: Element;
  private group?: Group;
  private viewInitialized = false;

  public constructor(private el: ElementRef, private dragulaService: DragulaService) {
  }

  public ngOnChanges(changes: {dragula?: SimpleChange, dragulaModel?: SimpleChange, dragulaContainer?: SimpleChange}): void {
    if (changes && (changes.dragula || changes.dragulaContainer)) {
      const prev = changes.dragula ? changes.dragula.previousValue : this.dragula;
      const hadPreviousValue = !!prev;
      const hasNewValue = !!this.dragula;
      // something -> null       =>  teardown only
      // something -> something  =>  teardown, then setup
      //      null -> something  =>  setup only
      //
      //      null -> null (only possible when dragulaContainer changes)  =>  nothing
      if (hadPreviousValue) {
        this.teardown(prev);
      }
      // a descendant container may not be rendered yet, so ngAfterViewInit sets it up instead
      if (hasNewValue && (!this.dragulaContainer || this.viewInitialized)) {
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
  }

  public ngAfterViewInit(): void {
    this.viewInitialized = true;
    if (this.dragulaContainer) {
      this.setup();
    }
  }

  /**
   * drake.models[i] belongs to drake.containers[i], so the model is always stored at this
   * container's index, including `undefined` while the container has no model (e.g. data still
   * loading). drake.models stays undefined until some container in the group has a model.
   */
  private setModel(drake: DrakeWithModels, model: Model | undefined): void {
    const index = this.container ? drake.containers.indexOf(this.container) : -1;
    if (index === -1 || (!drake.models && !model)) {
      return;
    }
    const models = drake.models ?? (drake.models = []);
    while (models.length < drake.containers.length) {
      models.push(undefined as unknown as Model);
    }
    models[index] = model as Model;
  }

  private findContainer(): Element | undefined {
    const host: HTMLElement = this.el.nativeElement;
    if (!this.dragulaContainer) {
      return host;
    }
    const container = host.querySelector(this.dragulaContainer);
    if (!container && isDevMode()) {
      console.warn(`ng2-dragula: no element matches [dragulaContainer]="${this.dragulaContainer}" inside [dragula]="${this.dragula}", so it was not added to the group.`);
    }
    return container ?? undefined;
  }

  // call ngOnInit 'setup' because we want to call it in ngOnChanges
  // and it would otherwise run twice
  public setup(): void {
    // find or create a group
    if (!this.dragula) {
      return;
    }

    const container = this.findContainer();
    if (!container) {
      return;
    }
    this.container = container;

    let group = this.dragulaService.find(this.dragula);
    if (!group) {
      const options = {};
      group = this.dragulaService.createGroup(this.dragula, options);
    }

    // ensure container element and model are pushed, at the same index
    if (group.drake) {
      group.drake.containers.push(container);
      this.setModel(group.drake, this.dragulaModel);
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
        if (source === this.container) {
          this.dragulaModelChange.emit(sourceModel);
        } else if (target === this.container) {
          this.dragulaModelChange.emit(targetModel);
        }
      })
    );
    this.subs.add(
      this.dragulaService
      .removeModel(name)
      .subscribe(({ source, sourceModel }) => {
        if (source === this.container) {
          this.dragulaModelChange.emit(sourceModel);
        }
      })
    );
  }

  public teardown(groupName: string): void {
    this.subs?.unsubscribe();
    const drake = this.dragulaService.find(groupName)?.drake;
    if (drake && this.container) {
      // remove the container and its model together, so the pairs after it stay aligned
      const index = drake.containers.indexOf(this.container);
      if (index !== -1) {
        drake.containers.splice(index, 1);
        drake.models?.splice(index, 1);
      }
    }
    this.container = undefined;
  }

  public ngOnDestroy(): void {
    if (!this.dragula) {
      return;
    }

    this.teardown(this.dragula);
  }

}
