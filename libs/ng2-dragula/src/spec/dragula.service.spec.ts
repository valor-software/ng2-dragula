// <reference path="./jasmine.d.ts" />
// <reference path="./testdouble-jasmine.d.ts" />
import { } from 'jasmine';
import * as td from 'testdouble';
import { DragulaService } from '../components/dragula.service';
import { DrakeWithModels } from '../DrakeWithModels';
import { Group } from '../Group';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MockDrake, MockDrakeFactory } from '../MockDrake';
import { EventTypes } from '../EventTypes';
import { DragulaOptions } from '../DragulaOptions';

const GROUP = "GROUP";

describe('DragulaService', () => {
  let service: DragulaService;

  beforeEach(() => {
    service = new DragulaService(MockDrakeFactory);
  });

  afterEach(() => {
    td.reset();
  });

  // ngOnInit AND checkModel
  // checkModel: no dragulaModel
  it('should initialize with new drake and call DragulaService.add', () => {
    expect(true).toBe(true);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });


  it('should add a bag', () => {
    service.createGroup(GROUP, {});
    const bag = service.find(GROUP);
    expect(bag).toBeTruthy();
    expect(bag.name).toBe(GROUP);
  });

  const subscribeSync = <T>(obs: Observable<T>, trigger: ()=> any, n = 1): T => {
    let called: T;
    const fn = td.function();
    const subs = obs.pipe(take(n > 0 ? n : 1)).subscribe(ev => {
      fn(ev);
      called = ev;
    });
    trigger();
    subs.unsubscribe();
    expect().toVerify({ called: fn(td.matchers.isA(Object)), times: n });
    return called;
  };

  const buildList = (_root: string, _children: string[] = []) => {
    const root = document.createElement(_root);
    const children = _children
      .map(x => document.createElement(x));
    children.forEach(el => root.appendChild(el));
    return root;
  };

  const _addMockDrake = (
    name: string = GROUP,
    containers: Element[] = [],
    options: DragulaOptions = {},
    models: any[][] = undefined
  ) => {
    const mock = new MockDrake(containers, options, models);
    service.add(new Group(name, mock, options));
    return mock;
  };

  it('should fire drag when drake does', () => {
    const ul = buildList('ul', ['li']);
    const li = ul.children[0];
    const mock = _addMockDrake(GROUP, [ul]);
    const ev = subscribeSync(service.drag(), () => {
      mock.emit(EventTypes.Drag, li, ul);
    });
    expect(ev).toBeTruthy();
    expect(ev.el).toBe(li);
    service.destroy(GROUP);
  });

  it('should not fire drag for an irrelevant drag type', () => {
    const ul = buildList('ul', ['li']);
    const li = ul.children[0];
    const mock = _addMockDrake("MY_COOL_TYPE", []);
    const ev = subscribeSync(service.drag("IRRELEVANT"), () => {
      mock.emit(EventTypes.Drag, li, ul);
    }, 0);
    expect(ev).not.toBeTruthy();
    service.destroy("MY_COOL_TYPE");
  });

  it('should not throw when destroying a non-existent bag', () => {
    expect(() => {
      service.destroy("NON_EXISTENT");
    }).not.toThrow();
  });

  it('should throw when creating a bag that already exists', () => {
    expect(() => {
      service.createGroup("EXISTENT", {});
      service.createGroup("EXISTENT", {});
    }).toThrow();
    service.destroy("EXISTENT");
  });

  it('should createGroup', () => {
    service.createGroup("NEWLY", {});
    const group = service.find("NEWLY");
    expect(group).toBeTruthy();
    service.destroy("NEWLY");
  });

  it('should destroy a drake when destroying a bag', () => {
    const mock = _addMockDrake("_", []);
    const destroyDrake = td.replace(mock, 'destroy');

    service.destroy("_");
    expect().toVerify(destroyDrake());

    const drake = service.find("_");
    expect(drake).toBeFalsy('bag/drake not properly removed');

    mock.destroy();
  });

  it('should start listening to drake events when drake without models passed to add', () => {
    const ul = buildList('ul', ['li']);
    const li = ul.children[0];
    const mock = _addMockDrake("NOMODELS", [], {}, null);
    const ev = subscribeSync(service.drag("NOMODELS"), () => {
      mock.emit(EventTypes.Drag, li, ul);
    });
    expect(ev).toBeTruthy();
    service.destroy("NOMODELS");
  });

  it('should receive dropModel events', () => {
    const ul = buildList('ul', ['li', 'li']);
    const li = ul.children[0];
    type Item = { my: string };
    const myItem = { my: 'li item' };
    const mock = _addMockDrake(
      "MODELS",
      [ul],
      {},
      [ [myItem, { my: 'cat' }] ]
    );
    const ev = subscribeSync(service.dropModel<Item>("MODELS"), () => {
      mock.emit(EventTypes.Drag, li, ul);
      mock.emit(EventTypes.Drop, li, ul, ul, ul.children[1]);
    });
    expect(ev).toBeTruthy('ev was falsy');
    expect(ev.item).toBe(myItem, 'ev did not have myItem');
    service.destroy("MODELS");
  });

  it('should not act on to dropModel events until drake.models has a value', () => {
    const ul = buildList('ul', ['li', 'li']);
    const li = ul.children[0];
    const mock = _addMockDrake("NOMODELS", [ul], {}, null);
    let ev = subscribeSync(service.dropModel("NOMODELS"), () => {
      mock.emit(EventTypes.Drag, li, ul);
      ul.removeChild(li);
      ul.appendChild(li);
      mock.emit(EventTypes.Drop, li, ul, ul, undefined);
    }, 0);
    expect(ev).not.toBeTruthy("dropModel shouldn't have fired without drake.models being set");

    // assume directive sets this
    mock.models = [['b', 'a']];
    ev = subscribeSync(service.dropModel("NOMODELS"), () => {
      mock.emit(EventTypes.Drag, li, ul);
      // put it back
      ul.removeChild(li);
      ul.insertBefore(li, ul.firstChild);
      mock.emit(EventTypes.Drop, li, ul, ul, undefined);
    });
    expect(ev).toBeTruthy("didn't receive dropModel event after setting drake.models");
    expect(ev.item).toBe('a', "ev.item wrong");

    service.destroy("NOMODELS");
  });

  it('should dropModel correctly in same list (forwards)', () => {
    const ul = buildList('ul', ['li', 'li']);
    const li = ul.children[0];
    const model = ['a', 'b'];
    const mock = _addMockDrake("DROPMODEL", [ ul ], {}, [ model ]);

    const ev = subscribeSync(service.dropModel("DROPMODEL"), () => {
      mock.emit(EventTypes.Drag, li, ul);
      ul.removeChild(li); // removes a at index 0
      ul.appendChild(li); // adds a at index 1
      mock.emit(EventTypes.Drop, li, ul, ul, undefined);
    });

    expect(ev).toBeTruthy();
    expect(ev.source).toBe(ul);
    expect(ev.sourceModel).not.toBe(model, 'model array not cloned');
    expect(ev.sourceModel.length).toBe(model.length);
    expect(ev.targetModel).not.toBe(model, 'targetModel not cloned');
    expect(ev.targetModel).toContain('a');
    expect(ev.sourceIndex).toBe(0, 'sourceIndex');
    expect(ev.targetIndex).toBe(1, 'targetIndex');

    expect(ev.targetModel[0]).toBe('b');
    expect(ev.targetModel[1]).toBe('a');

    service.destroy("DROPMODEL");
  });

  it('should dropModel correctly in same list (backwards)', () => {
    const ul = buildList('ul', ['li', 'li', 'li']);
    const li = ul.children[2]; // c
    const model = ['a', 'b', 'c'];
    const mock = _addMockDrake("DROPMODEL", [ ul ], {}, [ model ]);

    const ev = subscribeSync(service.dropModel("DROPMODEL"), () => {
      mock.emit(EventTypes.Drag, li, ul);
      ul.removeChild(li); // remove c from index 2
      ul.insertBefore(li, ul.firstChild); // add c at index 0
      mock.emit(EventTypes.Drop, li, ul, ul, undefined);
    });

    expect(ev).toBeTruthy();
    expect(ev.source).toBe(ul);
    expect(ev.sourceModel).not.toBe(model, 'model array not cloned');
    expect(ev.sourceModel.length).toBe(model.length);
    expect(ev.sourceModel).toBe(ev.targetModel, 'sourceModel !== targetModel');
    expect(ev.targetModel).not.toBe(model, 'targetModel not cloned');
    expect(ev.targetModel).toContain('a');
    expect(ev.sourceIndex).toBe(2, 'sourceIndex');
    expect(ev.targetIndex).toBe(0, 'targetIndex');

    expect(ev.targetModel[0]).toBe('c');
    expect(ev.targetModel[1]).toBe('a');

    service.destroy("DROPMODEL");
  });

  it('should dropModel correctly in different lists', () => {
    const sourceModel = ['a', 'b', 'c'];
    const targetModel = ['x', 'y'];
    const source = buildList('ul', ['li', 'li', 'li']);
    const target = buildList('ul', ['li', 'li']);
    const li = source.children[1]; // b
    const options = {};
    const mock = _addMockDrake("DROPMODEL", [ source, target ], options, [ sourceModel, targetModel ]);

    const ev = subscribeSync(service.dropModel("DROPMODEL"), () => {
      mock.emit(EventTypes.Drag, li, source);
      source.removeChild(li); // remove b at index 1
      target.appendChild(li); // add b at index 2
      mock.emit(EventTypes.Drop, li, target, source, undefined);
    });

    expect(ev).toBeTruthy();
    expect(ev.source).toBe(source, 'source wasn\'t source');
    expect(ev.sourceModel).not.toBe(sourceModel, 'sourceModel array not cloned');
    expect(ev.sourceModel.length).toBe(2, 'ev.sourceModel should have removed b');
    expect(ev.sourceModel).not.toContain('b', 'ev.sourceModel should have removed b');

    expect(ev.sourceModel).not.toBe(ev.targetModel, 'sourceModel === targetModel');
    expect(ev.target).toBe(target, 'target wasn\'t target');
    expect(ev.targetModel).not.toBe(targetModel, 'targetModel not cloned');
    expect(ev.targetModel).toContain('b', 'targetModel should have b in it');

    expect(ev.sourceIndex).toBe(1, 'sourceIndex');
    expect(ev.targetIndex).toBe(2, 'targetIndex');

    expect(ev.targetModel.length).toBe(3);
    expect(ev.targetModel[0]).toBe('x');
    expect(ev.targetModel[1]).toBe('y');
    expect(ev.targetModel[2]).toBe('b', 'b at position 3');

    service.destroy("DROPMODEL");
  });

  it('should removeModel', () => {
    const model = ['a', 'b', 'c'];
    const ul = buildList('ul', ['li', 'li', 'li']);
    const li = ul.children[1]; // b
    const mock = _addMockDrake("REMOVEMODEL", [ ul ], {}, [ model ]);

    const ev = subscribeSync(service.removeModel("REMOVEMODEL"), () => {
      mock.emit(EventTypes.Drag, li, ul);
      ul.removeChild(li);
      mock.emit(EventTypes.Remove, li, /*container*/ul, /*source*/ul);
    });

    expect(ev).toBeTruthy();
    expect(ev.source).toBe(ul);
    expect(ev.sourceModel).not.toBe(model, 'model array not cloned');
    expect(ev.sourceModel.length).toBe(2);
    expect(ev.sourceModel[0]).toBe('a');
    // no b
    expect(ev.sourceModel[1]).toBe('c');
    expect(ev.sourceIndex).toBe(1, 'sourceIndex');

    service.destroy("REMOVEMODEL");
  });

});
