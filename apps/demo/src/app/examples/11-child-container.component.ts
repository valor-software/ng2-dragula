import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

const childContainerCode = `
<!-- a component that renders its own <tbody>, so [dragula] can't go on it -->
<ex-people-table dragula="PEOPLE" dragulaContainer="tbody" [(dragulaModel)]="people"
                 [people]="people"></ex-people-table>

@Component({
  selector: 'ex-people-table',
  template: \`
  <table>
    <thead><tr><th>Name</th><th>Role</th></tr></thead>
    <tbody>
      @for (person of people; track person) {
        <tr><td>{{person.name}}</td><td>{{person.role}}</td></tr>
      }
    </tbody>
  </table>
  \`
})
export class PeopleTableComponent {
  @Input() people: Person[] = [];
}

export class ChildContainerComponent {
  public people = [
    { name: 'Ada', role: 'Engineer' },
    { name: 'Grace', role: 'Admiral' },
    { name: 'Linus', role: 'Maintainer' },
    { name: 'Margaret', role: 'Director' },
  ];
}
`;

interface Person {
  name: string;
  role: string;
}

/** Stands in for a third-party table component whose rows we can't put [dragula] on. */
@Component({
    selector: 'ex-people-table',
    template: `
  <table>
    <thead><tr><th>Name</th><th>Role</th></tr></thead>
    <tbody>
      @for (person of people; track person) {
        <tr><td>{{person.name}}</td><td>{{person.role}}</td></tr>
      }
    </tbody>
  </table>
  `,
    styles: [`
  table { width: 100%; border-collapse: collapse; background-color: rgba(0, 0, 0, 0.2); }
  th, td { padding: 10px; text-align: left; }
  tbody tr { background-color: rgba(0, 0, 0, 0.2); cursor: move; }
  tbody tr + tr { border-top: 1px solid rgba(255, 255, 255, 0.1); }
  `],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PeopleTableComponent {
  @Input() people: Person[] = [];
}

@Component({
    selector: 'ex-11-child-container',
    templateUrl: './11-child-container.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ChildContainerComponent {
  code = childContainerCode;
  public people: Person[] = [
    { name: 'Ada', role: 'Engineer' },
    { name: 'Grace', role: 'Admiral' },
    { name: 'Linus', role: 'Maintainer' },
    { name: 'Margaret', role: 'Director' },
  ];
}
