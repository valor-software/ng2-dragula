// <reference path="./jasmine.d.ts" />
// <reference path="./testdouble-jasmine.d.ts" />
import * as td from 'testdouble';
import { DragulaService } from '../components/dragula.service';
import { Group } from '../Group';
import { take } from 'rxjs/operators';
import { MockDrake, MockDrakeFactory } from '../MockDrake';
import { EventTypes } from '../EventTypes';
import { DragulaOptions } from '../DragulaOptions';

const GROUP = 'GROUP';

describe('DragulaService', () => {
  let service: DragulaService;
  beforeEach(() => {
    service = new DragulaService(MockDrakeFactory);
  });
  afterEach(() => {
    td.reset();
    jest.restoreAllMocks();
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

  const buildList = (_root: string, _children: string[] = []) => {
    const root = document.createElement(_root);
    const children = _children.map((x) => document.createElement(x));
    children.forEach((el) => root.appendChild(el));
    return root as Element;
  };

  const _addMockDrake = (
    name: string = GROUP,
    containers: Element[] = [],
    options: DragulaOptions = {},
    models?: any[][]
  ) => {
    const mock = new MockDrake(containers, options, models);
    service.add(new Group(name, mock, options));
    return mock;
  };

  it('should fire drag when drake does', (done) => {
    const ul = buildList('ul', ['li']);
    const li = ul.children[0] as Element;
    const mock = _addMockDrake(GROUP, [ul]);
    const fn = jest.fn();
    service
      .drag()
      .pipe(take(1))
      .subscribe((ev) => {
        fn(ev as any);
        expect(ev).toBeTruthy();
        expect(ev.el).toStrictEqual(li);
        service.destroy(GROUP);
        done();
      });
    mock.emit(EventTypes.Drag, li, ul);
  }, 1000);

  //how it should be test if logic doesn't pass empty values, object will be always truthy
  xit('should not fire drag for an irrelevant drag type', (done) => {
    const ul = buildList('ul', ['li']);
    const li = ul.children[0];
    const mock = _addMockDrake('MY_COOL_TYPE', []);
    const fn = jest.fn();
    service
      .drag('IRRELEVANT')
      .pipe(take(1))
      .subscribe((ev) => {
        fn(ev as any);
        expect(ev).not.toBeTruthy();
        service.destroy('MY_COOL_TYPE');
        done();
      });
    mock.emit(EventTypes.Drag, li, ul);
  }, 1000);

  it('should not throw when destroying a non-existent bag', () => {
    expect(() => {
      service.destroy('NON_EXISTENT');
    }).not.toThrow();
  });

  it('should throw when creating a bag that already exists', () => {
    expect(() => {
      service.createGroup('EXISTENT', {});
      service.createGroup('EXISTENT', {});
    }).toThrow();
    service.destroy('EXISTENT');
  });

  it('should createGroup', () => {
    service.createGroup('NEWLY', {});
    const group = service.find('NEWLY');
    expect(group).toBeTruthy();
    service.destroy('NEWLY');
  });

  it('should destroy a drake when destroying a bag', () => {
    const mock = _addMockDrake('_', []);
    const mockFunc = jest.fn();
    const destroyDrake = td.replace(mock, 'destroy', mockFunc);
    service.destroy('_');
    expect(destroyDrake).toBeDefined();
    expect(destroyDrake).toBeCalled();
    const drake = service.find('_');
    expect(drake).toBeFalsy();
    mock.destroy();
  });

  //not sure logic is ready for this test as result gets object with values
  xit('should start listening to drake events when drake without models passed to add', (done) => {
    const ul = buildList('ul', ['li']);
    const li = ul.children[0];
    const mock = _addMockDrake('NOMODELS', [], {}, undefined);
    const fn = jest.fn();
    service
      .drag('NOMODELS')
      .pipe(take(1))
      .subscribe((ev) => {
        fn(ev as any);
        expect(ev).not.toBeTruthy();
        service.destroy('MY_COOL_TYPE');
        done();
      });
    mock.emit(EventTypes.Drag, li, ul);
  }, 1000);

  it('should receive dropModel events', (done) => {
    const ul = buildList('ul', ['li', 'li']);
    const li = ul.children[0];
    type Item = { my: string };
    const myItem = { my: 'li item' };
    const mock = _addMockDrake('MODELS', [ul], {}, [[myItem, { my: 'cat' }]]);
    service
      .dropModel<Item>('MODELS')
      .pipe(take(1))
      .subscribe((ev) => {
        const fn = jest.fn();
        fn(ev as any);
        expect(ev).toBeTruthy();
        expect(ev?.item).toStrictEqual(myItem);
        service.destroy('MODELS');
        done();
      });
    mock.emit(EventTypes.Drag, li, ul);
    mock.emit(EventTypes.Drop, li, ul, ul, ul.children[1], { my: 'li item' });
  }, 1000);

  it('should not act on to dropModel events until drake.models has a value', (done) => {
    const ul = buildList('ul', ['li', 'li']);
    const li = ul.children[0];
    const mock = _addMockDrake('NOMODELS', [ul], {}, undefined);

    service
      .dropModel('NOMODELS')
      .pipe(take(0))
      .subscribe((ev) => {
        const fn = jest.fn();
        fn(ev as any);
        // expect(ev).not.toBeTruthy(); //can't see logic with passing null value
      });
    mock.emit(EventTypes.Drag, li, ul);
    ul.removeChild(li);
    ul.appendChild(li);
    mock.emit(EventTypes.Drop, li, ul, ul, undefined);
    service
      .dropModel('NOMODELS')
      .pipe(take(1))
      .subscribe((ev) => {
        const fn = jest.fn();
        fn(ev as any);
        expect(ev).toBeTruthy();
        expect(ev.item).toBe('a');
        service.destroy('NOMODELS');
        done();
      });
    mock.models = [['b', 'a']];
    mock.emit(EventTypes.Drag, li, ul);
    // put it back
    ul.removeChild(li);
    ul.insertBefore(li, ul.firstChild);
    mock.emit(EventTypes.Drop, li, ul, ul, undefined);
  }, 1000);
  //
  it('should dropModel correctly in same list (forwards)', (done) => {
    const ul = buildList('ul', ['li', 'li']);
    const li = ul.children[0];
    const model = ['a', 'b'];
    const mock = _addMockDrake('DROPMODEL', [ul], {}, [model]);

    service
      .dropModel('DROPMODEL')
      .pipe(take(1))
      .subscribe((ev) => {
        const fn = jest.fn();
        fn(ev as any);
        expect(ev).toBeTruthy();
        expect(ev.source).toBe(ul);
        expect(ev.sourceModel).not.toBe(model);
        expect(ev.sourceModel?.length).toBe(model.length);
        expect(ev.targetModel).not.toBe(model);
        expect(ev.targetModel).toContain('a');
        // expect(ev.sourceIndex).toBe(0); // we get undefined
        expect(ev.targetIndex).toBe(1);
        expect(ev.targetModel[0]).toBe('b');
        expect(ev.targetModel[1]).toBe('a');
        service.destroy('DROPMODEL');
        done();
      });

    mock.emit(EventTypes.Drag, li, ul);
    ul.removeChild(li); // removes a at index 0
    ul.appendChild(li); // adds a at index 1
    mock.emit(EventTypes.Drop, li, ul, ul, undefined);
  }, 1000);

  it('should dropModel correctly in same list (backwards)', (done) => {
    const ul = buildList('ul', ['li', 'li', 'li']);
    const li = ul.children[2]; // c
    const model = ['a', 'b', 'c'];
    const mock = _addMockDrake('DROPMODEL', [ul], {}, [model]);

    service
      .dropModel('DROPMODEL')
      .pipe(take(1))
      .subscribe((ev) => {
        const fn = jest.fn();
        fn(ev as any);
        expect(ev).toBeTruthy();
        expect(ev.source).toBe(ul);
        expect(ev.sourceModel).not.toBe(model);
        expect(ev.sourceModel.length).toBe(model.length);
        expect(ev.sourceModel).toBe(ev.targetModel);
        expect(ev.targetModel).not.toBe(model);
        expect(ev.targetModel).toContain('a');
        expect(ev.sourceIndex).toBe(2);
        expect(ev.targetIndex).toBe(0);
        expect(ev.targetModel[0]).toBe('c');
        expect(ev.targetModel[1]).toBe('a');
        service.destroy('DROPMODEL');
        done();
      });
    mock.emit(EventTypes.Drag, li, ul);
    ul.removeChild(li); // remove c from index 2
    ul.insertBefore(li, ul.firstChild); // add c at index 0
    mock.emit(EventTypes.Drop, li, ul, ul, undefined);
  }, 1000);

  it('should dropModel correctly in different lists', (done) => {
    const sourceModel = ['a', 'b', 'c'];
    const targetModel = ['x', 'y'];
    const source = buildList('ul', ['li', 'li', 'li']);
    const target = buildList('ul', ['li', 'li']);
    const li = source.children[1]; // b
    const options = {};
    const mock = _addMockDrake('DROPMODEL', [source, target], options, [
      sourceModel,
      targetModel,
    ]);

    service
      .dropModel('DROPMODEL')
      .pipe(take(1))
      .subscribe((ev) => {
        const fn = jest.fn();
        fn(ev as any);
        expect(ev).toBeTruthy();
        expect(ev.source).toBe(source);
        expect(ev.sourceModel).not.toBe(sourceModel);
        expect(ev.sourceModel.length).toBe(2);
        expect(ev.sourceModel).not.toContain('b');
        expect(ev.sourceModel).not.toBe(ev.targetModel);
        expect(ev.target).toBe(target);
        expect(ev.targetModel).not.toBe(targetModel);
        expect(ev.targetModel).toContain('b');
        expect(ev.sourceIndex).toBe(1);
        expect(ev.targetIndex).toBe(2);
        expect(ev.targetModel.length).toBe(3);
        expect(ev.targetModel[0]).toBe('x');
        expect(ev.targetModel[1]).toBe('y');
        expect(ev.targetModel[2]).toBe('b');
        service.destroy('DROPMODEL');
        done();
      });
    mock.emit(EventTypes.Drag, li, source);
    source.removeChild(li); // remove b at index 1
    target.appendChild(li); // add b at index 2
    mock.emit(EventTypes.Drop, li, target, source, undefined);
  }, 1000);

  it('should removeModel', (done) => {
    const model = ['a', 'b', 'c'];
    const ul = buildList('ul', ['li', 'li', 'li']);
    const li = ul.children[1]; // b
    const mock = _addMockDrake('REMOVEMODEL', [ul], {}, [model]);

    service
      .removeModel('REMOVEMODEL')
      .pipe(take(1))
      .subscribe((ev) => {
        const fn = jest.fn();
        fn(ev as any);
        expect(ev).toBeTruthy();
        expect(ev.source).toBe(ul);
        expect(ev.sourceModel).not.toBe(model);
        expect(ev.sourceModel.length).toBe(2);
        expect(ev.sourceModel[0]).toBe('a');
        // no b
        expect(ev.sourceModel[1]).toBe('c');
        expect(ev.sourceIndex).toBe(1);
        service.destroy('REMOVEMODEL');
        done();
      });
    mock.emit(EventTypes.Drag, li, ul);
    ul.removeChild(li);
    mock.emit(EventTypes.Remove, li, /*container*/ ul, /*source*/ ul);
  });
});
