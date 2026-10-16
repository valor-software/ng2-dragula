import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DragulaDirective } from '../components/dragula.directive';
import { DragulaService } from '../components/dragula.service';
import { DrakeFactory } from '../DrakeFactory';
import { EventTypes } from '../EventTypes';
import { MockDrake, MockDrakeFactory } from '../MockDrake';

// renders the way the README recommends, so each shown item sits next to an `@if` comment anchor
@Component({
    template: `
  <ul dragula="LIST" [(dragulaModel)]="items" [dragulaModelFilter]="matches">
    @for (item of items; track item) {
      @if (matches(item)) {<li>{{item}}</li>}
    }
  </ul>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class FilteredList {
  search = '';
  items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
  matches = (item: string) => item.toLowerCase().includes(this.search);
}

describe('filtered list rendered with @for and @if', () => {
  let fixture: ComponentFixture<FilteredList>;
  let component: FilteredList;
  let drake: MockDrake;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DragulaDirective, FilteredList],
      providers: [
        DragulaService,
        { provide: DrakeFactory, useValue: MockDrakeFactory },
      ]
    });
    fixture = TestBed.createComponent(FilteredList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    drake = TestBed.inject(DragulaService).find('LIST').drake as MockDrake;
  });

  afterEach(() => fixture.destroy());

  const ul = () => fixture.nativeElement.querySelector('ul') as HTMLUListElement;
  const rendered = () => Array.from(ul().children).map(li => li.textContent?.trim());
  const li = (text: string) => Array.from(ul().children).find(el => el.textContent?.trim() === text) as Element;

  const search = (value: string) => {
    component.search = value;
    fixture.detectChanges();
  };

  // what dragula does: move the element itself, then report the drop
  const drag = (text: string, { above, below }: { above?: string, below?: string }) => {
    const el = li(text);
    drake.emit(EventTypes.Drag, el, ul());
    const sibling = above ? li(above) : (li(below as string).nextElementSibling);
    ul().insertBefore(el, sibling);
    drake.emit(EventTypes.Drop, el, ul(), ul(), sibling);
    fixture.detectChanges();
  };

  const expectRenderedToMatchModel = () => {
    expect(rendered()).toEqual(component.items.filter(component.matches));
  };

  it('should place the item by its shown neighbours', () => {
    search('e');
    drag('Grape', { above: 'Cherry' });
    expect(component.items).toEqual(['Apple', 'Banana', 'Grape', 'Cherry', 'Date', 'Elderberry', 'Fig']);
    expectRenderedToMatchModel();
  });

  it('should keep rendering in model order through random drags and filter changes', () => {
    let seed = 7;
    const random = (n: number) => (seed = (seed * 1103515245 + 12345) % 2147483648) % n;
    const searches = ['', 'e', 'a', 'r', 'an'];
    for (let i = 0; i < 200; i++) {
      search(searches[random(searches.length)]);
      expectRenderedToMatchModel();
      const shown = rendered() as string[];
      const [text, other] = [shown[random(shown.length)], shown[random(shown.length)]];
      if (shown.length < 2 || text === other) {
        continue;
      }
      drag(text, random(2) ? { above: other } : { below: other });
      expectRenderedToMatchModel();
    }
    search('');
    expectRenderedToMatchModel();
  });
});
