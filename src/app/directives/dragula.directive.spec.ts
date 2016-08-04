import {Component} from '@angular/core';
import {it, expect, describe, inject, addProviders} from '@angular/core/testing';
import {ComponentFixture} from '@angular/compiler/testing';
import {DragulaDirective} from './dragula.directive';

describe('Directive: FileSelectDirective', () => {
  beforeEach(() => {
    addProviders([TestNGDragulaComponent]);
  });
  it('should be fine', inject([TestNGDragulaComponent], (fixture:ComponentFixture<TestNGDragulaComponent>) => {
    expect(fixture).not.toBeNull();
  }));
});

@Component({
  selector: 'dragula-test',
  directives: [DragulaDirective],
  template: ''
})

class TestNGDragulaComponent {

}