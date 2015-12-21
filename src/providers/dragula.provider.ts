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
  
  public add(name, drake): any {
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
  
  public find(name): any {
    for (var i = 0; i < this.bags.length; i++) {
      if (this.bags[i].name === name) {
        return this.bags[i];
      }
    }
  }
  
  public destroy(name): void {
    let bag = this.find(name);
    let i = this.bags.indexOf(bag);
    this.bags.splice(i, 1);
    bag.drake.destroy();
  }
  
  public setOptions(name, options) {
    let bag = this.add(name, window['dragula'](options));
    this.handleModels(name, bag.drake);
  }
  
  private handleModels(name, drake) {
    let dragElm;
    let dragIndex;
    let dropIndex;
    let sourceModel;
    drake.on('remove',function removeModel (el, source) {
      if (!drake.models) {
        return;
      }
      sourceModel = drake.models[drake.containers.indexOf(source)];
      sourceModel.splice(dragIndex, 1);
      this.removeModel.emit([name, el, source]);
    });
    drake.on('drag', (el, source) => {
      dragElm = el;
      dragIndex = this.domIndexOf(el, source);
    });
    drake.on('drop', (dropElm, target, source) => {
      if (!drake.models) {
        return;
      }
      dropIndex = this.domIndexOf(dropElm, target);
      sourceModel = drake.models[drake.containers.indexOf(source)];
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
  
  private setupEvents(bag) {
    bag.initEvents = true;
    let that = this;
    let emitter = (type) => {
      function replicate () {
        let args = Array.prototype.slice.call(arguments);
        that[type].emit([bag.name].concat(args));  
      }
      bag.drake.on(type, replicate);
    };
    this.events.forEach(emitter);
  }
  
  private domIndexOf(child, parent) {
    return Array.prototype.indexOf.call(parent.children, child);
  }
}
