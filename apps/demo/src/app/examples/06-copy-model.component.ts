import { Component } from "@angular/core";
import { DragulaService } from "ng2-dragula";

const copyModelCode = `
<div class='container' dragula="PERSON" id="left" [(dragulaModel)]="left">
  <div *ngFor="let person of left">{{person | json}}</div>
</div>
<div class='container' dragula="PERSON" id="right" [(dragulaModel)]="right">
  <div *ngFor="let person of right">{{person | json}}</div>
</div>

let personId = 0;

class Person {
  id: number;
  constructor(public name: string) {
    this.id = personId++;
  }
}

export class CopyModelComponent {
  left = [
    new Person('Steven'),
    new Person('Paula'),
    new Person('Persephone'),
    new Person('Jacob'),
  ];
  right = [
    new Person('Delia'),
    new Person('Jackson'),
  ];

  constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup('PERSON', {
      copy: (el, source) => {
        return source.id === 'left';
      },
      copyItem: (person: Person) => {
        return new Person(person.name);
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target.id !== 'left';
      }
    });
  }

}
`;

let personId = 0;

class Person {
  id: number;
  constructor(public name: string) {
    this.id = personId++;
  }
}

@Component({
  selector: 'ex-06-copy-model',
  templateUrl: './06-copy-model.component.html'
})
export class CopyModelComponent {
  code = copyModelCode;

  left = [
    new Person('Steven'),
    new Person('Paula'),
    new Person('Persephone'),
    new Person('Jacob'),
  ];
  right = [
    new Person('Delia'),
    new Person('Jackson'),
  ];

  constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup('PERSON', {
      copy: (el, source) => {
        return source.id === 'left';
      },
      copyItem: (person: Person) => {
        return new Person(person.name);
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target.id !== 'left';
      }
    });
  }

}
