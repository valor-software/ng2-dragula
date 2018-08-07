import { Injectable, EventEmitter, Optional } from '@angular/core';
import { DrakeWithModels } from '../DrakeWithModels';
import { Group } from '../Group';
import { DragulaOptions } from '../DragulaOptions';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventTypes, AllEvents } from '../EventTypes';
import { DrakeFactory } from '../DrakeFactory';

type FilterProjector<T extends { name: string; }> = (name: string, args: any[]) => T;
type Dispatch = { event: EventTypes; name: string; args: any[]; };

const filterEvent = <T extends { name: string; }>(
  eventType: EventTypes,
  filterDragType: string | undefined,
  projector: FilterProjector<T>
) => (input: Observable<Dispatch>): Observable<T> => {
  return input.pipe(
    filter(({ event, name }) => {
      return event === eventType
          && (filterDragType === undefined || name === filterDragType);
    }),
    map(({ name, args }) => projector(name, args))
  );
}

const elContainerSourceProjector =
  (name: string, [el, container, source]: [Element, Element, Element]) =>
    ({ name, el, container, source });

@Injectable()
export class DragulaService {

  /* https://github.com/bevacqua/dragula#drakeon-events */

  private dispatch$ = new Subject<Dispatch>();

  public drag = (groupName?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.Drag,
      groupName,
      (name, [el, source]: [Element, Element]) => ({ name, el, source })
    )
  );

  public dragend = (groupName?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.DragEnd,
      groupName,
      (name, [el]: [Element]) => ({ name, el })
    )
  );

  public drop = (groupName?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.Drop,
      groupName,
      (name, [
        el, target, source, sibling
      ]: [Element, Element, Element, Element]) => {
        return { name, el, target, source, sibling };
      })
  );

  private elContainerSource =
    (eventType: EventTypes) =>
    (groupName?: string) =>
    this.dispatch$.pipe(
      filterEvent(eventType, groupName, elContainerSourceProjector)
    );

  public cancel = this.elContainerSource(EventTypes.Cancel);
  public remove = this.elContainerSource(EventTypes.Remove);
  public shadow = this.elContainerSource(EventTypes.Shadow);
  public over = this.elContainerSource(EventTypes.Over);
  public out = this.elContainerSource(EventTypes.Out);

  public cloned = (groupName?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.Cloned,
      groupName,
      (name, [
        clone, original, cloneType
      ]: [Element, Element, 'mirror' | 'copy']) => {
        return { name, clone, original, cloneType }
      })
  );

  public dropModel = <T = any>(groupName?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.DropModel,
      groupName,
      (name, [
        el, target, source, sibling, item, sourceModel, targetModel
      ]: [Element, Element, Element, Element, T, T[], T[]]) => {
        return { name, el, target, source, sibling, item, sourceModel, targetModel }
      })
  );

  public removeModel = <T = any>(groupName?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.RemoveModel,
      groupName,
      (name, [
        el, container, source, item, sourceModel
      ]: [Element, Element, Element, T, T[]]) => {
        return { name, el, container, source, item, sourceModel }
      }
    )
  );

  private groups: { [k: string]: Group } = {};

  constructor (@Optional() private drakeFactory: DrakeFactory = null) {
    if (this.drakeFactory === null) {
      this.drakeFactory = new DrakeFactory();
    }
  }

  /** Public mainly for testing purposes. Prefer `createGroup()`. */
  public add(group: Group): Group {
    let existingGroup = this.find(group.name);
    if (existingGroup) {
      throw new Error('Group named: "' + group.name + '" already exists.');
    }
    this.groups[group.name] = group;
    this.handleModels(group);
    this.setupEvents(group);
    return group;
  }

  public find(name: string): Group {
    return this.groups[name];
  }

  public destroy(name: string): void {
    let group = this.find(name);
    if (!group) {
      return;
    }
    group.drake && group.drake.destroy();
    delete this.groups[name];
  }

  /**
   * Creates a group with the specified name and options.
   *
   * Note: formerly known as `setOptions`
   */
  public createGroup<T = any>(name: string, options: DragulaOptions<T>): Group {
    return this.add(new Group(
      name,
      this.drakeFactory.build([], options),
      options
    ));
  }

  private handleModels({ name, drake, options }: Group): void {
    let dragElm: any;
    let dragIndex: number;
    let dropIndex: number;
    drake.on('remove', (el: any, container: any, source: any) => {
      if (!drake.models) {
        return;
      }
      let sourceModel = drake.models[drake.containers.indexOf(source)];
      sourceModel = sourceModel.slice(0); // clone it
      const item = sourceModel.splice(dragIndex, 1)[0];
      // console.log('REMOVE');
      // console.log(sourceModel);
      this.dispatch$.next({
        event: EventTypes.RemoveModel,
        name,
        args: [ el, container, source, item, sourceModel ]
      });
    });
    drake.on('drag', (el: any, source: any) => {
      if (!drake.models) {
        return;
      }
      dragElm = el;
      dragIndex = this.domIndexOf(el, source);
    });
    drake.on('drop', (dropElm: any, target: Element, source: Element, sibling?: Element) => {
      if (!drake.models || !target) {
        return;
      }
      dropIndex = this.domIndexOf(dropElm, target);
      let sourceModel = drake.models[drake.containers.indexOf(source)];
      let targetModel = drake.models[drake.containers.indexOf(target)];
      // console.log('DROP');
      // console.log(sourceModel);
      let item: any;
      if (target === source) {
        sourceModel = sourceModel.slice(0)
        item = sourceModel.splice(dragIndex, 1)[0];
        sourceModel.splice(dropIndex, 0, item);
        // this was true before we cloned and updated sourceModel,
        // but targetModel still has the old value
        targetModel = sourceModel;
      } else {
        let isCopying = dragElm !== dropElm;
        if (!sourceModel) return; 
        item = sourceModel[dragIndex];
        if (isCopying) {
          if (!options.copyItem) {
            throw new Error("If you have enabled `copy` on a group, you must provide a `copyItem` function.")
          }
          item = options.copyItem(item);
        }

        if (!isCopying) {
          sourceModel = sourceModel.slice(0)
          sourceModel.splice(dragIndex, 1);
        }
        targetModel = targetModel.slice(0)
        targetModel.splice(dropIndex, 0, item);
        if (isCopying) {
          try {
            target.removeChild(dropElm);
          } catch (e) {}
        }
      }
      this.dispatch$.next({
        event: EventTypes.DropModel,
        name,
        args: [ dropElm, target, source, sibling, item, sourceModel, targetModel ]
      });
    });
  }

  private setupEvents(group: Group): void {
    if (group.initEvents) {
      return;
    }
    group.initEvents = true;
    const name = group.name;
    let that: any = this;
    let emitter = (event: EventTypes) => {
      group.drake.on(event, (...args: any[]) => {
        this.dispatch$.next({ event, name, args });
      });
    };
    AllEvents.forEach(emitter);
  }

  private domIndexOf(child: any, parent: any): any {
    return Array.prototype.indexOf.call(parent.children, child);
  }
}
