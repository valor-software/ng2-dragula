import { Injectable, EventEmitter } from '@angular/core';
import { dragula } from './dragula.class';

@Injectable()
export class DragulaService {

  cancel = new EventEmitter<any[]>();
  cloned = new EventEmitter<any[]>();
  drag = new EventEmitter<any[]>();
  dragend = new EventEmitter<any[]>();
  drop = new EventEmitter<any[]>();
  out = new EventEmitter<any[]>();
  over = new EventEmitter<any[]>();
  remove = new EventEmitter<any[]>();
  shadow = new EventEmitter<any[]>();

  dropModel = new EventEmitter<[string, Element, Element[], Element[], any, any[], any[]]>();
  removeModel = new EventEmitter<any[]>();

  private events: string[] = [
    'cancel', 'cloned', 'drag', 'dragend', 'drop', 'out', 'over',
    'remove', 'shadow', 'dropModel', 'removeModel'
  ];
  private bags: any[] = [];

  add(name: string, drake: any): any {
    let bag = this.find(name);
    if (bag) {
      throw new Error('Bag named: "' + name + '" already exists.');
    }
    bag = {name, drake};
    this.bags.push(bag);
    if (drake.models) { // models to sync with (must have same structure as containers)
      this.handleModels(name, drake);
    }
    if (!bag.initEvents) {
      this.setupEvents(bag);
    }
    return bag;
  }

  find(name: string): any {
    for (const bag of this.bags) {
      if (bag.name === name) {
        return bag;
      }
    }
  }

  destroy(name: string): void {
    const bag = this.find(name);
    const i = this.bags.indexOf(bag);
    this.bags.splice(i, 1);
    bag.drake.destroy();
  }

  setOptions(name: string, options: any): void {
    const bag = this.add(name, dragula(options));
    this.handleModels(name, bag.drake);
  }

  private handleModels(name: string, drake: any): void {
    let dragElm: any;
    let dragIndex: number;
    let dropIndex: number;
    let sourceModel: any;
    drake.on('remove', (el: any, source: any) => {
      if (!drake.models) {
        return;
      }
      sourceModel = drake.models[drake.containers.indexOf(source)];
      sourceModel.splice(dragIndex, 1);
      // console.log('REMOVE');
      // console.log(sourceModel);
      this.removeModel.emit([name, el, source]);
    });
    drake.on('drag', (el: any, source: any) => {
      dragElm = el;
      dragIndex = this.domIndexOf(el, source);
    });
    drake.on('drop', (dropElm: any, target: any, source: any) => {
      if (!drake.models || !target) {
        return;
      }
      dropIndex = this.domIndexOf(dropElm, target);
      sourceModel = drake.models[drake.containers.indexOf(source)];
      let targetModel;
      const notCopy = dragElm === dropElm;
      const dropElmModel = notCopy ? sourceModel[dragIndex] : JSON.parse(JSON.stringify(sourceModel[dragIndex]));
      // console.log('DROP');
      // console.log(sourceModel);
      if (target === source) {
        sourceModel.splice(dropIndex, 0, sourceModel.splice(dragIndex, 1)[0]);
        targetModel = sourceModel;
      } else {
        targetModel = drake.models[drake.containers.indexOf(target)];

        if (notCopy) {
          sourceModel.splice(dragIndex, 1);
        }
        targetModel.splice(dropIndex, 0, dropElmModel);
        target.removeChild(dropElm); // element must be removed for ngFor to apply correctly
      }
      this.dropModel.emit([
        name,
        dropElm,
        target,
        source,
        dropElmModel,
        targetModel,
        sourceModel
      ]);
    });
  }

  private setupEvents(bag: any): void {
    bag.initEvents = true;
    const that: any = this;
    const emitter = (type: any) => {
      function replicate(): void {
        const args = Array.prototype.slice.call(arguments);
        that[type].emit([bag.name].concat(args));
      }

      bag.drake.on(type, replicate);
    };
    this.events.forEach(emitter);
  }

  private domIndexOf(child: any, parent: any): any {
    return Array.prototype.indexOf.call(parent.children, child);
  }
}
