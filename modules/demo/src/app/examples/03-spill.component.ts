import { Component } from "@angular/core";
import { DragulaService } from "ng2-dragula";

let code = `
<div dragula="SPILL"></div>

export class SpillComponent {
  public constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup("SPILL", {
      removeOnSpill: true
    });
  }
}
`;

@Component({
  selector: 'ex-03-spill',
  templateUrl: './03-spill.component.html'
})
export class SpillComponent {
  code = code;
  public constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup("SPILL", {
      removeOnSpill: true
    });
  }
}
