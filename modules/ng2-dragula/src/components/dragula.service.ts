import { Injectable, EventEmitter, Optional } from '@angular/core';
import { DrakeWithModels } from '../DrakeWithModels';
import { Bag } from '../Bag';
import { DragulaOptions } from 'dragula';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventTypes, AllEvents } from '../EventTypes';
import { DrakeFactory } from '../DrakeFactory';

type FilterProjector<T extends { type: string; }> = (type: string, args: any[]) => T;
type Dispatch = { event: EventTypes; type: string; args: any[]; };

const filterEvent = <T extends { type: string; }>(
  eventType: EventTypes,
  filterDragType: string | undefined,
  projector: FilterProjector<T>
) => (input: Observable<Dispatch>): Observable<T> => {
  return input.pipe(
    filter(({ event, type }) => {
      return event === eventType
          && (filterDragType === undefined || type === filterDragType);
    }),
    map(({ type, args }) => projector(type, args))
  );
}

const elContainerSourceProjector =
  (type: string, [el, container, source]: [Element, Element, Element]) =>
    ({ type, el, container, source });

@Injectable()
export class DragulaService {

  /* https://github.com/bevacqua/dragula#drakeon-events */

  private dispatch$ = new Subject<Dispatch>();

  public drag = (filterType?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.Drag,
      filterType,
      (type, [el, source]: [Element, Element]) => ({ type, el, source })
    )
  );

  public dragend = (filterType?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.DragEnd,
      filterType,
      (type, [el]: [Element]) => ({ type, el })
    )
  );

  public drop = (filterType?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.Drop,
      filterType,
      (type, [
        el, target, source, sibling
      ]: [Element, Element, Element, Element]) => {
        return { type, el, target, source, sibling };
      })
  );

  private elContainerSource =
    (eventType: EventTypes) =>
    (filterType?: string) =>
    this.dispatch$.pipe(
      filterEvent(EventTypes.Cancel, filterType, elContainerSourceProjector)
    );

  public cancel = this.elContainerSource(EventTypes.Cancel);
  public remove = this.elContainerSource(EventTypes.Remove);
  public shadow = this.elContainerSource(EventTypes.Shadow);
  public over = this.elContainerSource(EventTypes.Over);
  public out = this.elContainerSource(EventTypes.Out);

  public cloned = (filterType?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.Cloned,
      filterType,
      (type, [
        clone, original, cloneType
      ]: [Element, Element, 'mirror' | 'copy']) => {
        return { type, clone, original, cloneType }
      })
  );

  public dropModel = <T = any>(filterType?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.DropModel,
      filterType,
      (type, [
        el, target, source, sibling, item, sourceModel, targetModel
      ]: [Element, Element, Element, Element, T, T[], T[]]) => {
        return { type, el, target, source, sibling, item, sourceModel, targetModel }
      })
  );

  public removeModel = <T = any>(filterType?: string) => this.dispatch$.pipe(
    filterEvent(
      EventTypes.RemoveModel,
      filterType,
      (type, [
        el, container, source, item, sourceModel
      ]: [Element, Element, Element, T, T[]]) => {
        return { type, el, container, source, item, sourceModel }
      }
    )
  );

  private bags: Bag[] = [];

  constructor (@Optional() public drakeFactory: DrakeFactory = null) {
    if (this.drakeFactory === null) {
      this.drakeFactory = new DrakeFactory();
    }
  }

  public add(name: string, drake: DrakeWithModels): any {
    let bag = this.find(name);
    if (bag) {
      throw new Error('Bag named: "' + name + '" already exists.');
    }
    bag = {name, drake};
    this.bags.push(bag);
    if (drake.models) { // models to sync with (must have same structure as containers)
      this.handleModels(name, drake);
    }
    this.setupEvents(bag);
    return bag;
  }

  public find(name: string): Bag {
    for (let bag of this.bags) {
      if (bag.name === name) {
        return bag;
      }
    }
  }

  public destroy(name: string): void {
    let bag = this.find(name);
    if (!bag) {
      return;
    }
    let i = this.bags.indexOf(bag);
    if (i === -1) {
      return;
    }
    this.bags.splice(i, 1);
    bag.drake && bag.drake.destroy();
  }

  public setOptions(name: string, options: DragulaOptions): void {
    let bag = this.add(
      name,
      this.drakeFactory.build([], options)
    );
    this.handleModels(name, bag.drake);
  }

  private handleModels(name: string, drake: DrakeWithModels): void {
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
      drake.models[drake.containers.indexOf(source)] = sourceModel;
      // console.log('REMOVE');
      // console.log(sourceModel);
      this.dispatch$.next({
        event: EventTypes.RemoveModel,
        type: name,
        args: [ el, container, source, item, sourceModel ]
      });
    });
    drake.on('drag', (el: any, source: any) => {
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
        drake.models[drake.containers.indexOf(source)] = sourceModel;
        // this was true before we cloned and updated sourceModel,
        // but targetModel still has the old value
        targetModel = sourceModel;
      } else {
        let notCopy = dragElm === dropElm;
        let dropElmModel = notCopy
          ? sourceModel[dragIndex]
          // TODO: BURN WITH FIRE
          : JSON.parse(JSON.stringify(sourceModel[dragIndex]));
        item = dropElmModel;

        if (notCopy) {
          sourceModel = sourceModel.slice(0)
          sourceModel.splice(dragIndex, 1);
        }
        targetModel = targetModel.slice(0)
        targetModel.splice(dropIndex, 0, dropElmModel);
        drake.models[drake.containers.indexOf(source)] = sourceModel;
        drake.models[drake.containers.indexOf(target)] = targetModel;

        // TODO: remove line?
        target.removeChild(dropElm); // element must be removed for ngFor to apply correctly
      }
      this.dispatch$.next({
        event: EventTypes.DropModel,
        type: name,
        args: [ dropElm, target, source, sibling, item, sourceModel, targetModel ]
      });
    });
  }

  private setupEvents(bag: any): void {
    if (bag.initEvents) {
      return;
    }
    bag.initEvents = true;
    const type = bag.name;
    let that: any = this;
    let emitter = (event: EventTypes) => {
      bag.drake.on(event, (...args: any[]) => {
        this.dispatch$.next({ event, type, args });
      });
    };
    AllEvents.forEach(emitter);
  }

  private domIndexOf(child: any, parent: any): any {
    return Array.prototype.indexOf.call(parent.children, child);
  }
}
