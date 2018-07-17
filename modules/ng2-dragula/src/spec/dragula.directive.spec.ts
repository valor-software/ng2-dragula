/// <reference path="../jasmine.d.ts" />
/// <reference path="../testdouble-jasmine.d.ts" />
import { } from 'jasmine';
import * as td from 'testdouble'
import { TestBed, inject, async, ComponentFixture } from '@angular/core/testing';
import { DragulaDirective } from '../components/dragula.directive';
import { DragulaService } from '../components/dragula.service';
import { DrakeWithModels } from '../DrakeWithModels';
import { Bag } from '../Bag';
import { Component, ElementRef } from "@angular/core";
import { TestHostComponent } from './test-host.component';

const BAG_NAME = "BAG_NAME";

type SimpleDrake = Partial<DrakeWithModels>;

describe('In the ng2-dragula app', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DragulaDirective,
        TestHostComponent
      ],
      providers: [
        DragulaService
      ]
    })
      .compileComponents();
  }));

  describe('DragulaDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let dragServ: DragulaService;
    let nativeElement: HTMLDivElement = document.createElement('div');

    const mockMultipleDrakes = (...pairs: [Partial<DrakeWithModels>, string][]) => {
      const find = td.function();
      pairs.forEach(([drake, name]) => {
        let bag: Bag = { name, drake: drake as any as DrakeWithModels };
        td.when(find(name)).thenReturn(bag);
      });
      td.replace(dragServ, 'find', find);
      return find;
    };
    const mockDrake = (drake: Partial<DrakeWithModels>, name = BAG_NAME) => {
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

    beforeEach(inject([DragulaService], (dragService: DragulaService) => {
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      component.bagName = BAG_NAME;

      dragServ = dragService;
    }));

    afterEach(() => {
      fixture.destroy();
      td.reset();
      if (dragServ.find(BAG_NAME)) {
        dragServ.destroy(BAG_NAME);
      }
    });

    // ngOnInit AND checkModel
    // checkModel: no dragulaModel
    it('should initialize with new drake and call DragulaService.add', () => {
      td.replace(dragServ, 'add');

      component.bagName = BAG_NAME;
      component.model = [];
      fixture.detectChanges();

      expect().toVerify(dragServ.add(BAG_NAME, td.matchers.isA(Object)));
    });

    // ngOnInit AND checkModel
    // checkModel: dragulaModel, drake, add new drake.models
    it('should initialize with new drake, with local mirror container', () => {
      component.bagName = BAG_NAME;
      component.model = [];
      component.localMirror = true;
      fixture.detectChanges();

      let directive = component.directive;
      expect(directive.dragulaLocalMirror).toBe(true);

      expect(directive.dragulaOptions.mirrorContainer).toEqual(component.host.nativeElement);
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

      component.bagName = null;
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

      component.bagName = CAT;
      component.model = [ { animal: 'generic four-legged creature' } ];
      fixture.detectChanges();
      component.bagName = DOG;
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

      component.bagName = BAG_NAME;
      component.model = [];
      fixture.detectChanges();
      component.bagName = null;
      fixture.detectChanges();

      // setup, then teardown
      expectFindsInSequence(find, [ BAG_NAME, BAG_NAME ]);

      expect(drake.models.length).toBe(0);
      expect(drake.containers.length).toBe(0);
    });

    const testUnsettingModel = (drake: SimpleDrake) => {
      let find = mockDrake(drake);
      const initialContainers = drake.containers.length;
      const initialModels = drake.models.length;
      let firstModel = [{ first: 'model' }];
      let nextModel = [{ next: 'model' }];

      component.bagName = BAG_NAME;
      component.model = firstModel;
      fixture.detectChanges();
      component.model = null;
      fixture.detectChanges();

      // setup, then teardown
      expectFindsInSequence(find, [ BAG_NAME ]);

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

  });
});
