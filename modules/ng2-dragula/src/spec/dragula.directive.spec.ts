/// <reference path="../jasmine.d.ts" />
/// <reference path="../testdouble-jasmine.d.ts" />
import { } from 'jasmine';
import * as td from 'testdouble'
import { TestBed, inject, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DragulaDirective } from '../components/dragula.directive';
import { DragulaService } from '../components/dragula.service';
import { DrakeWithModels } from '../DrakeWithModels';
import { Group } from '../Group';
import { DrakeFactory } from '../DrakeFactory';
import { EventTypes } from '../EventTypes';
import { MockDrake, MockDrakeFactory } from './MockDrake';
import { Component, ElementRef } from "@angular/core";
import { TestHostComponent, TwoWay, Asynchronous } from './test-host.component';
import { Subject, BehaviorSubject, Observable, empty } from 'rxjs';
import { DragulaOptions } from '../DragulaOptions';
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
    td.reset();
    service.clear();
  });

  const mockMultipleDrakes = (...pairs: [Partial<DrakeWithModels>, string][]) => {
    const find = td.function();
    pairs.forEach(([drake, name]) => {
      let group = new Group(name, drake as any as DrakeWithModels, {});
      td.when(find(name)).thenReturn(group);
    });
    td.replace(service, 'find', find);
    return find;
  };
  const mockDrake = (drake: Partial<DrakeWithModels>, name = GROUP) => {
    return mockMultipleDrakes([drake, name]);
  };

  const simpleDrake = (containers: Element[] = [], models: any[][] = []) => {
    return { containers, models } as SimpleDrake;
  }

  const expectFindsInSequence = (find: any, seq: any[]) => {
    let captor = td.matchers.captor();
    td.verify(find(captor.capture()));
    let i = 0;
    expect(captor.values.length).toBe(seq.length);
    seq.forEach(val => expect(captor.values[i++]).toBe(val));
  }

  // ngOnInit AND checkModel
  it('should initialize with new drake and call DragulaService.createGroup', () => {
    component.group = GROUP;
    component.model = [];
    fixture.detectChanges();

    let group = service.find(GROUP);
    expect(group).toBeTruthy('group not created');
    expect(group.drake.models).toBeTruthy('group.drake should have models');
  });

  // checkModel: no dragulaModel
  it('should not setup with drake.models when dragulaModel == null', () => {
    component.group = GROUP;
    component.model = null;
    fixture.detectChanges();
    let group = service.find(GROUP);
    expect(group.drake.models).toBeFalsy();
  });

  // ngOnInit
  // checkModel: dragulaModel, drake, push to drake.models
  it('should initialize and add to existing drake', () => {
    let theirs = [ { someVar: 'theirs' } ];
    let mine = [ { someVar: 'mine' } ];
    let drake = simpleDrake([document.createElement('div')], [ theirs ]);
    mockDrake(drake);

    component.model = mine;
    fixture.detectChanges();

    expect(drake.containers.length).toBe(2);
    expect(drake.models.length).toBe(2);
  });

  // ngOnChanges
  // there is no way to mock direct array mutation of a drake's models
  // it('should do nothing for no model changes', () => {
  // });

  // ngOnChanges
  it('should update the model value on existing drake.models', () => {
    let myModel = [ 'something' ];
    let newModel = [ 'something new' ];
    let drake = simpleDrake([document.createElement('div')], [myModel]);
    mockDrake(drake);

    component.model = myModel;
    fixture.detectChanges();
    component.model = newModel;
    fixture.detectChanges();

    expect(drake.models[0]).toEqual(newModel);
  });

  // ngOnChanges
  it('should update the model value on an existing drake, with no models', () => {
    let drake = simpleDrake();
    mockDrake(drake);
    let myModel = ["something"];
    let newModel = ["something new"];

    component.model = myModel;
    fixture.detectChanges();
    component.model = newModel;
    fixture.detectChanges();

    expect(drake.models[0]).toEqual(newModel);
  });

  // ngOnChanges
  it('should add a container and a model on init, take 2', () => {
    let theirModel = [ "someone else's model" ];
    let myModel = [ "something" ];
    // create an existing drake with models
    let drake = simpleDrake([document.createElement('div')], [theirModel]);
    mockDrake(drake);

    component.model = myModel;
    fixture.detectChanges();

    expect(drake.containers.length).toBe(2);
    expect(drake.containers).toContain(component.host.nativeElement);
    expect(drake.models).toContain(myModel);
  });

  // ngOnChanges
  it('should do nothing if there is no bag name', () => {
    // if DragulaDirective is initialized, it tries to find the bag
    let drake = simpleDrake();
    let find = mockDrake(drake)

    component.group = null;
    component.model = [];
    fixture.detectChanges();

    expect().toVerify({ called: find(), times: 0, ignoreExtraArgs: true });
  });

  // ngOnChanges
  it('should cleanly move to another drake when bag name changes', () => {
    let CAT = "CAT", DOG = "DOG";
    let catDrake = simpleDrake();
    let dogDrake = simpleDrake();
    let find = mockMultipleDrakes([catDrake, CAT], [dogDrake, DOG])

    component.group = CAT;
    component.model = [ { animal: 'generic four-legged creature' } ];
    fixture.detectChanges();
    component.group = DOG;
    fixture.detectChanges();

    // setup CAT, teardown CAT, setup DOG
    expectFindsInSequence(find, [CAT, CAT, DOG])

    // clean move to another drake
    expect(catDrake.models.length).toBe(0);
    expect(catDrake.containers.length).toBe(0);
    expect(dogDrake.models.length).toBe(1);
    expect(dogDrake.models).toContain(component.model);
    expect(dogDrake.containers.length).toBe(1);
    expect(dogDrake.containers).toContain(component.host.nativeElement);
  });

  // ngOnChanges
  it('should clean up when un-setting bag name', () => {
    let drake = simpleDrake();
    let find = mockDrake(drake);

    component.group = GROUP;
    component.model = [];
    fixture.detectChanges();
    component.group = null;
    fixture.detectChanges();

    // setup, then teardown
    expectFindsInSequence(find, [ GROUP, GROUP ]);

    expect(drake.models.length).toBe(0);
    expect(drake.containers.length).toBe(0);
  });

  const testUnsettingModel = (drake: SimpleDrake) => {
    let find = mockDrake(drake);
    const initialContainers = drake.containers.length;
    const initialModels = drake.models.length;
    let firstModel = [{ first: 'model' }];
    let nextModel = [{ next: 'model' }];

    component.group = GROUP;
    component.model = firstModel;
    fixture.detectChanges();
    component.model = null;
    fixture.detectChanges();

    // setup, then teardown
    expectFindsInSequence(find, [ GROUP ]);

    expect(drake.models).not.toContain(firstModel, 'old model not removed');
    expect(drake.containers).toContain(component.host.nativeElement, 'newly added container should still be there');

    component.model = nextModel;
    fixture.detectChanges();

    expect(drake.models).not.toContain(firstModel, 'old model not removed');
    expect(drake.models).toContain(nextModel, 'new model not inserted');

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
    let fn = td.function();
    let evts = new Subject();
    td.when(fn(GROUP)).thenReturn(evts)
    td.replace(service, 'dropModel', fn);
    return evts;
  };

  it('should fire dragulaModelChange on dropModel', () => {
    let dropModel = mockServiceEvent(EventTypes.DropModel);
    // called via (dragulaModelChange)="modelChange($event)" in the test component
    let modelChange = td.replace(component, 'modelChange');
    let item = { a: 'dragged' };
    let myModel = [{ a: 'static' }];
    let theirModel = [item];
    component.group = GROUP;
    component.model = myModel;
    fixture.detectChanges();

    let source = document.createElement('ul');
    let target = component.host.nativeElement;
    let myNewModel = myModel.slice(0);
    myNewModel.push(item);
    let theirNewModel: any[] = [];
    dropModel.next({
      name: GROUP,
      source,
      target,
      sourceModel: theirNewModel,
      targetModel: myNewModel
    });

    expect().toVerify(modelChange(myNewModel));
  });

  it('should fire dragulaModelChange on removeModel', () => {
    let removeModel = mockServiceEvent(EventTypes.RemoveModel);
    // called via (dragulaModelChange)="modelChange($event)" in the test component
    let modelChange = td.replace(component, 'modelChange');
    let item = { a: 'to be removed' };
    let myModel = [item];
    component.group = GROUP;
    component.model = myModel;
    fixture.detectChanges();

    let source = component.host.nativeElement;
    let myNewModel: any[] = [];
    removeModel.next({
      name: GROUP,
      item,
      source,
      sourceModel: myNewModel
    });

    expect().toVerify(modelChange(myNewModel));
  });

  const testModelChange = <T extends TestHostComponent | TwoWay | Asynchronous>(
    componentClass: { new(...args: any[]): T},
    saveToComponent = true,
  ) => {
    let fixture = TestBed.createComponent(componentClass);
    let component = fixture.componentInstance;
    let removeModel = mockServiceEvent(EventTypes.RemoveModel);
    let same = { a: 'same' };
    let same2 = { same2: '2' };
    let item = { a: 'to be removed' };
    let myModel = [same, item, same2];
    component.group = GROUP;
    component.model = myModel;
    fixture.detectChanges();

    let bag = service.find(GROUP);
    // if(componentClass === Asynchronous) console.log( bag.drake )
    expect(bag).toBeTruthy('bag not truthy');
    expect(bag.drake.models).toBeTruthy('bag.drake.models not truthy');
    expect(bag.drake.models && bag.drake.models[0]).toBe(myModel);

    let source = component.host.nativeElement;
    let myNewModel: any[] = [same, same2];
    bag.drake.models[0] = myNewModel; // simulate the drake.on(remove) handler
    removeModel.next({
      name: GROUP,
      item,
      source,
      sourceModel: myNewModel
    });

    if (saveToComponent) {
      expect(component.model).toBe(
        myNewModel,
        "[(dragulaModel)] didn't save model to component"
      );
    }

    // now test whether the new array causes a teardown/setup cycle
    let setup = td.replace(component.directive, 'setup');
    let teardown = td.replace(component.directive, 'teardown');

    // before change detection
    expect(component.directive.dragulaModel).not.toBe(myNewModel, "directive didn't save the new model");

    // now propagate dragulaModelChange to the directive
    fixture.detectChanges();

    // after change detection
    if (saveToComponent) {
      expect(component.model).toBe(myNewModel, "component didn't save model");
    }
    expect(component.directive.dragulaModel).toBe(myNewModel);
    // the directive shouldn't trigger a teardown/re-up
    expect().toVerify({ called: teardown(), times: 0, ignoreExtraArgs: true });
    expect().toVerify({ called: setup(), times: 0, ignoreExtraArgs: true });
    expect(bag.drake.models[0]).toBe(myNewModel);

  };

  describe('(dragulaModelChange)', () => {
    it('should work with (event) binding', () => {
      testModelChange(TestHostComponent);
    });
    it('should work with two-way binding', () => {
      testModelChange(TwoWay);
    });
    it('should work with an async pipe', () => {
      testModelChange(Asynchronous, false);
    });
  });

});
