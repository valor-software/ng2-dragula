import { Component } from "@angular/core";
import { DragulaService } from "ng2-dragula";

const code = `
<div class='container' dragula="COPYABLE" id="left">
  <div>...</div>
</div>
<div class='container' dragula="COPYABLE" id="right">
  <div>...</div>
</div>

export class CopyComponent {
  constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup('COPYABLE', {
      copy: (el, source) => {
        return source?.id === 'left';
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target?.id !== 'left';
      }
    });
  }
}
`;

@Component({
    selector: 'ex-05-copy',
    templateUrl: './05-copy.component.html',
    standalone: false
})
export class CopyComponent {
  code = code;

  constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup('COPYABLE', {
      copy: (el, source) => {
        return source.id === 'left';
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target?.id !== 'left';
      }
    });
  }
}

