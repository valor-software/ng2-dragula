import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragulaModule } from '../ng2-dragula';

const html = ``;

describe('Component: ng2-dragula', () => {
  let fixture:ComponentFixture<any>;
  let context:TestNGDragulaComponent;
  let element:any;
  let clean:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestNGDragulaComponent],
      imports: [DragulaModule]
    });
    TestBed.overrideComponent(TestNGDragulaComponent, {set: {template: html}});
    fixture = TestBed.createComponent(TestNGDragulaComponent);
    context = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('#c1');
    clean = fixture.nativeElement.querySelector('#c2');
    fixture.detectChanges();
  });

  it('fixture should not be null', () => {
    expect(fixture).not.toBeNull();
  });
});

@Component({
  selector: 'dragula-test',
  template: ''
})
class TestNGDragulaComponent {
}
