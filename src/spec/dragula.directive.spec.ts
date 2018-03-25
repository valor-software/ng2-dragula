import { } from 'jasmine';
import * as sinon from 'sinon';
import { Component } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { DragulaDirective, DragulaService } from '../ng2-dragula';

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
    let sandbox: any;
    let nativeElement: HTMLDivElement = document.createElement('div');

    beforeEach(inject([DragulaService], (dragService: DragulaService) => {
      let elRef = {
          nativeElement: nativeElement
        };

      sandbox = sinon.sandbox.create();
      dragServ = dragService;
      elRef.nativeElement.innerHTML = '<div>item 1</div><div>item 2</div>';

      dragulaDir = new DragulaDirective(elRef, dragServ);
    }));

    // ngOnInit AND checkModel
    // checkModel: no dragulaModel
    it('should initialize with new drake', () => {
      let addStub = sandbox.stub(dragServ, 'add');

      dragulaDir.ngOnInit();

      expect(addStub.calledOnce).toBeTruthy();
    });

    // ngOnInit AND checkModel
    // checkModel: dragulaModel, drake, add new drake.models
    it('should initialize with new drake, with local mirror container', () => {
      dragulaDir.dragulaLocalMirror = true;
      dragulaDir.dragulaModel = { somevar: 'text' };
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

      dragulaDir.dragulaModel = { somevar: 'text' };
      sandbox.stub(dragServ, 'find').returns(bagObj);

      dragulaDir.ngOnInit();

      expect(bagObj.drake.containers.length).toBe(2);
      expect(bagObj.drake.models.length).toBe(2);
    });
    
    // ngOnChanges
    it('should do nothing for no model changes', () => {
      dragulaDir.ngOnChanges({});
    });
    
    // ngOnChanges
    it('should do nothing for if there is no drake', () => {
      let changes = {
        dragulaModel: {
          isFirstChange: () => false,
          previousValue: "something",
          currentValue: "something new"
        }
      };
      dragulaDir.ngOnChanges(changes);
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
            previousValue: "something",
            currentValue: "something new"
          }
        };
      
      sandbox.stub(dragServ, 'find').returns(bagObj);
      // create an existing drake with models
      dragulaDir.ngOnInit();
      dragulaDir.ngOnChanges(changes);

      expect(bagObj.drake.models[0]).toEqual("something new");
    });
    
    // ngOnChanges
    it('should update the model value on an existing drake, with no models', () => {
      let bagObj = {
          drake: {
            containers: [document.createElement('div')]
          }
        },
        changes = {
          dragulaModel: {
            isFirstChange: () => false,
            previousValue: "something",
            currentValue: "something new"
          }
        };
      
      sandbox.stub(dragServ, 'find').returns(bagObj);
      // create an existing drake with no models
      dragulaDir.ngOnInit();
      dragulaDir.ngOnChanges(changes);

      expect(bagObj.drake['models'][0]).toEqual("something new");
    });
  });
});
