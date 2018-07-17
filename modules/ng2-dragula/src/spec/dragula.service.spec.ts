/// <reference path="../jasmine.d.ts" />
/// <reference path="../testdouble-jasmine.d.ts" />
import { } from 'jasmine';
import * as td from 'testdouble'
import * as tdJasmine from 'testdouble-jasmine';
const tdMatchers = tdJasmine.get(td);
import { TestBed, inject, async, ComponentFixture } from '@angular/core/testing';
import { DragulaDirective } from '../components/dragula.directive';
import { DragulaService } from '../components/dragula.service';
import { DrakeWithModels } from '../DrakeWithModels';
import { Bag } from '../Bag';
import { Component, ElementRef, EventEmitter } from "@angular/core";
import { TestHostComponent } from './test-host.component';
import dragula = require('dragula');
import { Subject, Subscription, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MockDrake, MockDrakeFactory } from './MockDrake';
import { EventTypes } from '../EventTypes';

const BAG_NAME = "BAG_NAME";

type SimpleDrake = Partial<DrakeWithModels>;

describe('DragulaService', () => {
  let service: DragulaService;

  beforeEach(() => {
    service = new DragulaService(MockDrakeFactory);
    jasmine.addMatchers(tdMatchers);
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
    service.add(BAG_NAME, dragula());
    let bag = service.find(BAG_NAME);
    expect(bag).toBeTruthy();
    expect(bag.name).toBe(BAG_NAME);
  });

  it('should add a bag with models', () => {
    service.add(BAG_NAME, dragula());
    let bag = service.find(BAG_NAME);
    expect(bag).toBeTruthy();
    expect(bag.name).toBe(BAG_NAME);
  });

  const subscribeSync = <T>(obs: Observable<T>, trigger: Function): T => {
    let called: T;
    let subs = obs.pipe(take(1)).subscribe(ev => called = ev);
    trigger();
    subs.unsubscribe();
    return called;
  };

  const buildList = (_root: string, _children: string[] = []) => {
    let root = document.createElement(_root);
    let children = _children
      .map(x => document.createElement(x))
    children.forEach(el => root.appendChild(el));
    return { root, children };
  }

  it('should fire drag when drake does', () => {
    const { root: ul, children } = buildList('ul', ['li']);
    const li = children[0];
    let mock = new MockDrake();
    service.add(BAG_NAME, mock);
    let ev = subscribeSync(service.drag(), () => {
      mock.emit(EventTypes.Drag, li, ul);
    });
    expect(ev).toBeTruthy();
    expect(ev.el).toBe(li);
    service.destroy(BAG_NAME);
  });

  it('should not fire drag for an irrelevant drag type', () => {
    const { root: ul, children } = buildList('ul', ['li']);
    const li = children[0];
    let mock = new MockDrake();
    service.add("MY_COOL_TYPE", mock);
    let ev = subscribeSync(service.drag("IRRELEVANT"), () => {
      mock.emit(EventTypes.Drag, li, ul);
    });
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
      service.add("EXISTENT", new MockDrake());
      service.add("EXISTENT", new MockDrake());
    }).toThrow();
    service.destroy("EXISTENT");
  });

  it('should create a drake when setting options', () => {
    service.setOptions("NEWLY", {});
    let drake = service.find("NEWLY");
    expect(drake).toBeTruthy();
    service.destroy("NEWLY");
  });

  it('should start listening to drake events when drake without models passed to add', () => {
    const { root: ul, children } = buildList('ul', ['li']);
    const li = children[0];
    let mock = new MockDrake([], {}, null);
    service.add("NOMODELS", mock);
    let ev = subscribeSync(service.drag("NOMODELS"), () => {
      mock.emit(EventTypes.Drag, li, ul);
    });
    expect(ev).toBeTruthy();
    service.destroy("NOMODELS");
  });

  it('should receive dropModel events', () => {
    const { root: ul, children } = buildList('ul', ['li', 'li']);
    const li = children[0];
    type Item = { my: string };
    let myItem = { my: 'li item' }
    let mock = new MockDrake(
      [ ul ],
      {},
      [ [myItem, { my: 'cat' }] ]
    );
    service.add("MODELS", mock);
    let ev = subscribeSync(service.dropModel<Item>("MODELS"), () => {
      mock.emit(EventTypes.Drag, li, ul);
      mock.emit(EventTypes.Drop, li, ul, ul, children[1]);
    });
    expect(ev).toBeTruthy('ev was falsy');
    expect(ev.item).toBe(myItem, 'ev did not have myItem');
    service.destroy("MODELS");
  });

  it('should not start listening to dropModel events when drake without models passed to add', () => {
    const { root: ul, children } = buildList('ul', ['li']);
    const li = children[0];
    let mock = new MockDrake([], {}, null);
    service.add("NOMODELS", mock);
    let ev = subscribeSync(service.dropModel("NOMODELS"), () => {
      mock.emit(EventTypes.Drag, li, ul);
      mock.emit(EventTypes.Drop, li, ul, ul, undefined);
    });
    expect(ev).not.toBeTruthy();
    service.destroy("NOMODELS");
  });

});
