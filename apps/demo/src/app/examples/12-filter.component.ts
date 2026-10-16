import { Component, ChangeDetectionStrategy } from "@angular/core";

const filterCode = `
<input [(ngModel)]="search" placeholder="Filter…">
<div class="container" dragula="FILTERED" [(dragulaModel)]="items" [dragulaModelFilter]="matches">
  @for (item of items; track item) {
    @if (matches(item)) {<div>{{item}}</div>}
  }
</div>

export class FilterComponent {
  search = '';
  items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
  // the same test decides what is rendered and what dragula sees
  matches = (item: string) => item.toLowerCase().includes(this.search.toLowerCase());
}
`;

@Component({
    selector: 'ex-12-filter',
    templateUrl: './12-filter.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FilterComponent {
  code = filterCode;
  search = 'e';
  items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
  matches = (item: string) => item.toLowerCase().includes(this.search.toLowerCase());
}
