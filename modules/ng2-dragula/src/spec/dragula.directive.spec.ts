/// <reference path="../jasmine.d.ts" />
/// <reference path="../testdouble-jasmine.d.ts" />
import { } from 'jasmine';
import * as td from 'testdouble'
import * as tdJasmine from 'testdouble-jasmine';
const tdMatchers = tdJasmine.get(td);
import { Component } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { DragulaDirective, DragulaService } from '..';
import { DrakeWithModels } from '../DrakeWithModels';

const BAG_NAME = "BAG_NAME";

describe('In the ng2-dragula app', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        DragulaService
      ]
    })
      .compileComponents();
  }));

  describe('Directive: DragulaDirective', () => {
    let dragulaDir: DragulaDirective;
    let dragServ: DragulaService;
    let nativeElement: HTMLDivElement = document.createElement('div');

    beforeEach(inject([DragulaService], (dragService: DragulaService) => {
      let elRef = {
        nativeElement: nativeElement
      };

      dragServ = dragService;
      elRef.nativeElement.innerHTML = '<div>item 1</div><div>item 2</div>';

      dragulaDir = new DragulaDirective(elRef, dragServ);
      dragulaDir.dragula = BAG_NAME;

      jasmine.addMatchers(tdMatchers);
    }));

    afterEach(() => {
      td.reset();
    })

    // ngOnInit AND checkModel
    // checkModel: no dragulaModel
    it('should initialize with new drake', () => {
      td.replace(dragServ, 'add');
      dragulaDir.ngOnInit();

      expect().toVerify(dragServ.add(BAG_NAME, td.matchers.isA(Object)));
    });

    // ngOnInit AND checkModel
    // checkModel: dragulaModel, drake, add new drake.models
    it('should initialize with new drake, with local mirror container', () => {
      dragulaDir.dragulaLocalMirror = true;
      dragulaDir.dragulaModel = [ { someVar: 'text' } ]
      dragulaDir.ngOnInit();

      expect(dragulaDir.dragulaOptions.mirrorContainer).toEqual(nativeElement);
    });

    // ngOnInit
    // checkModel: dragulaModel, drake, push to drake.models
    it('should initialize and add to existing drake', () => {
      let bagObj = {
        drake: {
          containers: [document.createElement('div')],
          models: [{}]
        }
      };

      dragulaDir.dragulaModel = [ { someVar: 'text' } ]
      const find = td.function();
      td.when(find(BAG_NAME)).thenReturn(bagObj);
      td.replace(dragServ, 'find', find);

      dragulaDir.ngOnInit();

      expect(bagObj.drake.containers.length).toBe(2);
      expect(bagObj.drake.models.length).toBe(2);
    });

    // ngOnChanges
    it('should do nothing for no model changes', () => {
      dragulaDir.ngOnChanges({});
      // TODO: actually test this
    });

    // ngOnChanges
    it('should do nothing for if there is no drake', () => {
      let changes = {
        dragulaModel: {
          isFirstChange: () => false,
          firstChange: false,
          previousValue: "something",
          currentValue: "something new"
        }
      };
      dragulaDir.ngOnChanges(changes);
      // TODO: actually test this
    });

    // ngOnChanges
    it('should update the model value on existing drake.models', () => {
      let bagObj = {
          drake: {
            containers: [document.createElement('div')],
            models: ["something"]
          }
        },
        changes = {
          dragulaModel: {
            isFirstChange: () => false,
            firstChange: false,
            previousValue: "something",
            currentValue: "something new"
          }
        };

      const find = td.function();
      td.when(find(BAG_NAME)).thenReturn(bagObj);
      td.replace(dragServ, 'find', find);
      // create an existing drake with models
      dragulaDir.ngOnInit();
      dragulaDir.ngOnChanges(changes);

      expect(bagObj.drake.models[0]).toEqual("something new");
    });

    // ngOnChanges
    it('should update the model value on an existing drake, with no models', () => {
      let bagObj = {
        drake: {
          containers: [document.createElement('div')],
        } as Partial<DrakeWithModels>,
      }, changes = {
        dragulaModel: {
          isFirstChange: () => false,
          firstChange: false,
          previousValue: "something",
          currentValue: "something new"
        }
      };

      const find = td.function();
      td.when(find(BAG_NAME)).thenReturn(bagObj);
      td.replace(dragServ, 'find', find);
      // create an existing drake with no models
      dragulaDir.ngOnInit();
      dragulaDir.ngOnChanges(changes);

      expect(bagObj.drake.models[0]).toEqual("something new");
    });
  });
});
