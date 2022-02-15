import { Component } from "@angular/core";
import { DragulaService } from "ng2-dragula";

const code = `
<div class="container" dragula="CLICKS">
  <div *ngFor="..." (click)="onclick(...)"></div>
</div>

export class ClickComponent {
  public clicked = {
    'one': false,
    'two': false,
    'three': false,
    'four': false,
    'five': false,
    'six': false,
    'seven': false
  };

  public onclick(key: any):void {
    this.clicked[key] = true;
    setTimeout(() => {
      this.clicked[key] = false;
    }, 2000);
  }
}
`;

type Key = {
  'one': boolean,
  'two': boolean,
  'three': boolean,
  'four': boolean,
  'five': boolean,
  'six': boolean,
  'seven': boolean
};

@Component({
  selector: 'ex-08-click',
  templateUrl: './08-click.component.html',
  styles: [`
  .container div {
    cursor: initial !important;
  }
  `]
})
export class ClickComponent {
  code = code;
  public clicked = {
    'one': false,
    'two': false,
    'three': false,
    'four': false,
    'five': false,
    'six': false,
    'seven': false
  };

  public onclick(key: any) {
    this.clicked[key as keyof Key] = true;
    setTimeout(() => {
      this.clicked[key as keyof Key] = false;
    }, 2000);
  }
}

