import * as dragula from 'dragula';
import {Injectable, EventEmitter} from 'angular2/core';

@Injectable()
export class DragulaService {
  public cancel:      EventEmitter<any> = new EventEmitter();
  public cloned:      EventEmitter<any> = new EventEmitter();
  public drag:        EventEmitter<any> = new EventEmitter();
  public dragend:     EventEmitter<any> = new EventEmitter();
  public drop:        EventEmitter<any> = new EventEmitter();
  public out:         EventEmitter<any> = new EventEmitter();
  public over:        EventEmitter<any> = new EventEmitter();
  public remove:      EventEmitter<any> = new EventEmitter();
  public shadow:      EventEmitter<any> = new EventEmitter();
  public dropModel:   EventEmitter<any> = new EventEmitter();
  public removeModel: EventEmitter<any> = new EventEmitter();
  private events: Array<string> = [
    'cancel',
    'cloned',
    'drag',
    'dragend',
    'drop',
    'out',
    'over',
    'remove',
    'shadow',
    'dropModel',
    'removeModel'
  ];
  private bags: Array<any> = [];

  public add(name: string, drake: any): any {
    let bag = this.find(name);
    if (bag) {
      throw new Error('Bag named: "' + name + '" already exists.');
    }
    bag = {
      name: name,
      drake: drake
    };
    this.bags.push(bag);
    if (drake.models) { // models to sync with (must have same structure as containers)
      this.handleModels(name, drake);
    }
    if (!bag.initEvents) {
      this.setupEvents(bag);
    }
    return bag;
  }

  public find(name: string): any {
    for (var i = 0; i < this.bags.length; i++) {
      if (this.bags[i].name === name) {
        return this.bags[i];
      }
    }
  }

  public destroy(name: string): void {
    let bag = this.find(name);
    let i = this.bags.indexOf(bag);
    this.bags.splice(i, 1);
    bag.drake.destroy();
  }

  public setOptions(name: string, options: any) {
    let bag = this.add(name, dragula(options));
    this.handleModels(name, bag.drake);
  }

  private handleModels(name: string, drake: any) {
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
      // console.log('DROP');
      // console.log(sourceModel);
      if (target === source) {
        sourceModel.splice(dropIndex, 0, sourceModel.splice(dragIndex, 1)[0]);
      } else {
        let notCopy = dragElm === dropElm;
        let targetModel = drake.models[drake.containers.indexOf(target)];
        let dropElmModel = notCopy ? sourceModel[dragIndex] : JSON.parse(JSON.stringify(sourceModel[dragIndex]));

        if (notCopy) {
          sourceModel.splice(dragIndex, 1);
        }
        targetModel.splice(dropIndex, 0, dropElmModel);
        target.removeChild(dropElm); // element must be removed for ngFor to apply correctly
      }
      this.dropModel.emit([name, dropElm, target, source]);
    });
  }

  private setupEvents(bag: any) {
    bag.initEvents = true;
    let that: any = this;
    let emitter = (type: any) => {
      function replicate () {
        let args = Array.prototype.slice.call(arguments);
        that[type].emit([bag.name].concat(args));
      }
      bag.drake.on(type, replicate);
    };
    this.events.forEach(emitter);
  }

  private domIndexOf(child: any, parent: any) {
    return Array.prototype.indexOf.call(parent.children, child);
  }
}
