import { Component } from "@angular/core";
import { DragulaService } from "ng2-dragula";

let copyModelCode = `
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

@Component({ ... })
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
`;

let personId = 0;

class Person {
  id: number;
  constructor(public name: string) {
    this.id = personId++;
  }
}

@Component({
  selector: 'copy-model-example',
  template: `
<div class='parent'>
    <label for='hy'>You must provide a <code>copyItem</code> function if you're using <code>copy</code> with <code>[dragulaModel]</code>.</label>
    <div class='wrapper'>
        <div class='container' dragula="PERSON" id="left" [(dragulaModel)]="left">
          <div *ngFor="let person of left">{{person | json}}</div>
        </div>
        <div class='container' dragula="PERSON" id="right" [(dragulaModel)]="right">
          <div *ngFor="let person of right">{{person | json}}</div>
        </div>
    </div>
    <pre><code>{{ code }}</code></pre>
</div>
  `
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
