import { Component } from "@angular/core";
import { DragulaService } from "ng2-dragula";
import { Subscription } from "rxjs";

const nestedExampleCode = `
<div class="wrapper" dragula="COLUMNS" [(dragulaModel)]="groups">
    <div class="container" *ngFor="let group of groups">
      <span class="group-handle">{{group.name}}</span>
      <div class="container" dragula="ITEMS" [(dragulaModel)]="group.items">
        <div *ngFor="let item of group.items" [innerHtml]="item.name"></div>
      </div>
    </div>
</div>

export class NestedComponent {

  constructor(private dragulaService: DragulaService) {
    this.dragulaService.createGroup("COLUMNS", {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === "group-handle"
    });
  }

  public groups:Array<any> = [
    {
      name: 'Group A',
      items: [{name: 'Item A'}, {name: 'Item B'}, {name: 'Item C'}, {name: 'Item D'}]
    },
    {
      name: 'Group B',
      items: [{name: 'Item 1'}, {name: 'Item 2'}, {name: 'Item 3'}, {name: 'Item 4'}]
    }
  ];
}
`;

@Component({
  selector: 'ex-10-nested',
  templateUrl: './10-nested.component.html',
  styles: [`
  .container span {
    display: block;
    padding: 8px;
  }
  `]
})
export class NestedComponent {
  code = nestedExampleCode;

  constructor(private dragulaService: DragulaService) {
    this.dragulaService.createGroup("COLUMNS", {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === "group-handle"
    });
  }

  public groups:Array<any> = [
    {
      name: 'Group A',
      items: [{name: 'Item A'}, {name: 'Item B'}, {name: 'Item C'}, {name: 'Item D'}]
    },
    {
      name: 'Group B',
      items: [{name: 'Item 1'}, {name: 'Item 2'}, {name: 'Item 3'}, {name: 'Item 4'}]
    }
  ];
}
