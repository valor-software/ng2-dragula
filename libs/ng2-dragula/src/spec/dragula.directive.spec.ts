// <reference path="./jasmine.d.ts" />
// <reference path="./testdouble-jasmine.d.ts" />

import * as td from 'testdouble';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DragulaDirective } from '../components/dragula.directive';
import { DragulaService } from '../components/dragula.service';
import { DrakeWithModels } from '../DrakeWithModels';
import { Group } from '../Group';
import { DrakeFactory } from '../DrakeFactory';
import { EventTypes } from '../EventTypes';
import { MockDrakeFactory } from '../MockDrake';
import { TestHostComponent, TwoWay, Asynchronous } from './test-host.component';
import { Subject } from 'rxjs';
import { StaticService } from './StaticService';

const GROUP = "GROUP";

type SimpleDrake = Partial<DrakeWithModels>;

describe('DragulaDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let service: StaticService;

  beforeEach(() => {
    service = new StaticService();
    TestBed.configureTestingModule({
      declarations: [ DragulaDirective, TestHostComponent, TwoWay, Asynchronous ],
      providers: [
        { provide: DrakeFactory, useValue: MockDrakeFactory },
        { provide: DragulaService, useValue: service }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.group = GROUP;
  });

  afterEach(() => {
    fixture.destroy();
    jest.restoreAllMocks();
    service.clear();
  });

  const mockMultipleDrakes = (...pairs: [Partial<DrakeWithModels>, string][]) => {
    let find = jest.fn();
    pairs.forEach(([drake, name]) => {
      const group = new Group(name, drake as any as DrakeWithModels, {});
      find = find.mockImplementation((name) => group);
    });
    td.replace(service, 'find', find);
    return find;
  };
  const mockDrake = (drake: Partial<DrakeWithModels>, name = GROUP) => {
    return mockMultipleDrakes([drake, name]);
  };

  const simpleDrake = (containers: Element[] = [], models: any = []) => {
    return { containers, models } as SimpleDrake;
  };

  const expectFindsInSequence = (find: any, seq: any[]) => {
    const captor = td.matchers.captor();
    td.verify(find(captor.capture()));
    let i = 0;
    expect(captor?.values?.length).toBe(seq.length);
    seq.forEach(val => expect(captor?.values?.[i++]).toBe(val));
  };

  // ngOnInit AND checkModel
  it('should initialize with new drake and call DragulaService.createGroup', () => {
    component.group = GROUP;
    component.model = [];
    fixture.detectChanges();

    const group = service.find(GROUP);
    expect(group).toBeTruthy();
    expect(group.drake.models).toBeTruthy();
  });

  // checkModel: no dragulaModel
  it('should not setup with drake.models when dragulaModel == null', () => {
    component.group = GROUP;
    component.model = [];
    fixture.detectChanges();
    const group = service.find(GROUP);
    expect(group.drake.models).toStrictEqual([[]]);
  });

  // ngOnInit
  // checkModel: dragulaModel, drake, push to drake.models
  it('should initialize and add to existing drake', () => {
    const theirs = [ { someVar: 'theirs' } ];
    const mine = [ { someVar: 'mine' } ];
    const drake = simpleDrake([document.createElement('div')], theirs);
    mockDrake(drake);

    component.model = mine;
    fixture.detectChanges();
    expect(drake?.containers?.length).toBe(2);
    expect(drake.models?.length).toBe(2);
  });

  // ngOnChanges
  // there is no way to mock direct array mutation of a drake's models
  // it('should do nothing for no model changes', () => {
  // });

  // ngOnChanges
  it('should update the model value on existing drake.models', () => {
    const myModel = [ 'something' ];
    const newModel = [ 'something new' ];
    let drake = simpleDrake([document.createElement('div')], [myModel]);
    mockDrake(drake);

    component.model = myModel;
    fixture.detectChanges();
    drake = simpleDrake([document.createElement('div')], [newModel]);
    mockDrake(drake);
    component.model = newModel;
    fixture.detectChanges();

    expect(drake.models?.[0]).toEqual(newModel);
  });

  // ngOnChanges
  it('should update the model value on an existing drake, with no models', () => {
    const drake = simpleDrake();
    // const mockedDrake = jest.fn().mockImplementation((drake) => GROUP);
    const find = mockDrake(drake);
    fixture.detectChanges();
    const myModel = ["something"];
    const newModel = ['something new'];

    component.model = myModel;
    fixture.detectChanges();
    component.model = newModel;
    fixture.detectChanges();
    expect(drake.models?.[0]).toEqual(newModel);
  });

  // ngOnChanges
  it('should add a container and a model on init, take 2', () => {
    const theirModel = [ "someone else's model" ];
    const myModel = [ "something" ];
    // create an existing drake with models
    const drake = simpleDrake([document.createElement('div')], theirModel);
    mockDrake(drake);

    component.model = myModel;
    fixture.detectChanges();
    expect(drake?.containers?.length).toBe(2);
    expect(drake.containers).toContain(component.host?.nativeElement);
    expect(drake.models).toContain(myModel);
  });

  // ngOnChanges
  it('should do nothing if there is no bag name', () => {
    // if DragulaDirective is initialized, it tries to find the bag
    const drake = simpleDrake();
    const find = jest.fn(()=> GROUP);
    component.group = '';
    component.model = [];
    fixture.detectChanges();
    expect(find).toHaveBeenCalledTimes(0);
  });

  // ngOnChanges
  it('should cleanly move to another drake when bag name changes', () => {
    const CAT = "CAT", DOG = "DOG";
    const catDrake = simpleDrake();
    const dogDrake = simpleDrake();
    const find = mockMultipleDrakes([catDrake, CAT], [dogDrake, DOG]);

    component.group = CAT;
    component.model = [ { animal: 'generic four-legged creature' } ];
    fixture.detectChanges();
    component.group = DOG;
    fixture.detectChanges();

    // setup CAT, teardown CAT, setup DOG
    // expectFindsInSequence(find, [CAT, CAT, DOG]);

    // clean move to another drake
    expect(catDrake.models?.length).toBe(0);
    expect(catDrake.containers?.length).toBe(0);
    expect(dogDrake.models?.length).toBe(1);
    expect(dogDrake.models).toContain(component.model);
    expect(dogDrake.containers?.length).toBe(1);
    expect(dogDrake.containers).toContain(component.host?.nativeElement);
  });

  // ngOnChanges
  it('should clean up when un-setting bag name', () => {
    const drake = simpleDrake();
    const find = mockDrake(drake);
    component.group = GROUP;
    component.model = [];
    fixture.detectChanges();
    component.group = '';
    fixture.detectChanges();

    // setup, then teardown
    // expectFindsInSequence(find, [ GROUP, GROUP ]);

    expect(drake.models?.length).toBe(0);
    expect(drake.containers?.length).toBe(0);
  });

  const testUnsettingModel = (drake: SimpleDrake) => {
    const find = mockDrake(drake);
    const initialContainers = drake.containers?.length;
    const initialModels = drake.models?.length;
    const firstModel = [{ first: 'model' }];
    const nextModel = [{ next: 'model' }];

    component.group = GROUP;
    component.model = firstModel;
    fixture.detectChanges();
    component.model = [];
    fixture.detectChanges();

    // setup, then teardown
    // expectFindsInSequence(find, [ GROUP ]);

    expect(drake.models).not.toContain(firstModel);
    expect(drake.containers).toContain(component.host?.nativeElement);

    component.model = nextModel;
    fixture.detectChanges();

    expect(drake.models).not.toContain(firstModel);
    expect(drake.models).toContain(nextModel);

  };

  // ngOnChanges
  it('should clean up when un-setting the model, with no other members', () => {
    const drake = simpleDrake();
    testUnsettingModel(drake);
  });

  // ngOnChanges
  it('should clean up when un-setting the model, with other active models in the drake', () => {
    const existingContainer = document.createElement('div');
    const existingModel = [{ existing: 'model' }];
    const drake = simpleDrake([existingContainer], [existingModel]);
    testUnsettingModel(drake);
    expect(drake.containers).toContain(existingContainer);
    expect(drake.models).toContain(existingModel);
  });

  // set up fake event subscription so we can fire events manually
  const mockServiceEvent = (eventName: EventTypes) => {
    const fn = td.function();
    const evts = new Subject();
    td.when(fn(GROUP)).thenResolve(evts);
    td.replace(service, 'dropModel', fn);
    return evts;
  };

  xit('should fire dragulaModelChange on dropModel', () => {
    const dropModel = mockServiceEvent(EventTypes.DropModel);
    // called via (dragulaModelChange)="modelChange($event)" in the test component
    const modelChange = td.replace(component, 'modelChange');
    const item = { a: 'dragged' };
    const myModel = [{ a: 'static' }];
    const theirModel = [item];
    component.group = GROUP;
    component.model = myModel;
    fixture.detectChanges();

    const source = document.createElement('ul');
    const target = component.host?.nativeElement;
    const myNewModel = myModel.slice(0);
    myNewModel.push(item);
    const theirNewModel: any[] = [];
    dropModel.next({
      name: GROUP,
      source,
      target,
      sourceModel: theirNewModel,
      targetModel: myNewModel
    });

    expect(modelChange(myNewModel)).toBeCalled();
  });

  xit('should fire dragulaModelChange on removeModel', () => {
    const removeModel = mockServiceEvent(EventTypes.RemoveModel);
    // called via (dragulaModelChange)="modelChange($event)" in the test component
    const modelChange = td.replace(component, 'modelChange');
    const item = { a: 'to be removed' };
    const myModel = [item];
    component.group = GROUP;
    component.model = myModel;
    fixture.detectChanges();

    const source = component.host?.nativeElement;
    const myNewModel: any[] = [];
    removeModel.next({
      name: GROUP,
      item,
      source,
      sourceModel: myNewModel
    });

    expect(modelChange(myNewModel)).toBeCalled();
  });

  const testModelChange = <T extends TestHostComponent | TwoWay | Asynchronous>(
    componentClass: { new(...args: any[]): T},
    saveToComponent = true,
  ) => {
    const fixture = TestBed.createComponent(componentClass);
    const component = fixture.componentInstance;
    const removeModel = mockServiceEvent(EventTypes.RemoveModel);
    const same = { a: 'same' };
    const same2 = { same2: '2' };
    const item = { a: 'to be removed' };
    const myModel = [same, item, same2];
    component.group = GROUP;
    component.model = myModel;
    fixture.detectChanges();

    const bag = service.find(GROUP);
    // if(componentClass === Asynchronous) console.log( bag.drake )
    expect(bag).toBeTruthy();
    expect(bag.drake.models).toBeTruthy();
    expect(bag.drake.models && bag.drake.models[0]).toBe(myModel);

    const source = component.host?.nativeElement;
    const myNewModel: any[] = [same, same2];
    if (bag.drake.models) {
      bag.drake.models[0] = myNewModel; // simulate the drake.on(remove) handler
    }
    removeModel.next({
      name: GROUP,
      item,
      source,
      sourceModel: myNewModel
    });

    if (saveToComponent) {
      expect(component.model).toBe(
        myNewModel
      );
    }

    // now test whether the new array causes a teardown/setup cycle
    const setup = td.replace(component.directive || '', 'setup');
    const teardown = td.replace(component.directive || {}, 'teardown');

    // before change detection
    expect(component.directive?.dragulaModel).not.toBe(myNewModel);

    // now propagate dragulaModelChange to the directive
    fixture.detectChanges();

    // after change detection
    if (saveToComponent) {
      expect(component.model).toBe(myNewModel);
    }
    expect(component.directive?.dragulaModel).toBe(myNewModel);
    // the directive shouldn't trigger a teardown/re-up
    expect(teardown).toHaveBeenCalledTimes(0);
    expect(setup).toHaveBeenCalledTimes(0);
    expect(bag.drake.models?.[0]).toBe(myNewModel);

  };

  describe('(dragulaModelChange)', () => {
    xit('should work with (event) binding', () => {
      testModelChange(TestHostComponent);
    });
    xit('should work with two-way binding', () => {
      testModelChange(TwoWay);
    });
    xit('should work with an async pipe', () => {
      testModelChange(Asynchronous, false);
    });
  });

});
