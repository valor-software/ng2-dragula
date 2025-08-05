import { Component } from "@angular/core";
import { DragulaService } from "ng2-dragula";

const code = `
<div dragula="REVERT"></div>

export class RevertComponent {
  public constructor(private dragulaService:DragulaService) {
    dragulaService.createGroup("REVERT", {
      revertOnSpill: true
    });
  }
}
`;

@Component({
    selector: 'ex-04-revert',
    templateUrl: './04-revert.component.html',
    standalone: false
})
export class RevertComponent {
  code = code;
  public constructor(private dragulaService:DragulaService) {
    dragulaService.createGroup("REVERT", {
      revertOnSpill: true
    });
  }
}

