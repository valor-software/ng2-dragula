import { Component } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

const code = `
<div class="container" dragula="HANDLES" id="left">
  <div *ngFor="...">
    <span class="handle">...</span>
    <p>Other content<p>
  </div>
</div>

export class HandleComponent {
  public constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup("HANDLES", {
      moves: (el, container, handle) => {
        return handle?.className === 'handle';
      }
    });
  }
}
`;

@Component({
  selector: 'ex-07-handle',
  templateUrl: './07-handle.component.html',
  styles: [
    `
      .container div {
        cursor: initial !important;
      }
    `,
  ],
})
export class HandleComponent {
  code = code;
  public constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup('HANDLES', {
      moves: (el, container, handle) => {
        return handle?.className === 'handle';
      },
    });
  }
}
