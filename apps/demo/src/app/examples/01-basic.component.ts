import { Component } from "@angular/core";
import { DragulaService } from "ng2-dragula";

@Component({
    selector: 'ex-01-basic',
    template: `
<div class='parent'>
  <label for='hy'>Move stuff between these two containers. Note how the stuff gets inserted near the mouse pointer?
      Great stuff.</label>
  <div class='wrapper'>
    <div class='container' dragula="DRAGULA_FACTS">
      <div>You can move these elements between these two containers</div>
      <div>Moving them anywhere else isn't quite possible</div>
      <div>There's also the possibility of moving elements around in the same container, changing their position
      </div>
    </div>
    <div class='container' dragula="DRAGULA_FACTS">
      <div>This is the default use case. You only need to specify the containers you want to use</div>
      <div>More interactive use cases lie ahead</div>
      <div>Make sure to check out the <a href='https://github.com/bevacqua/dragula#readme'>documentation on
          GitHub!</a></div>
    </div>
  </div>
  <pre><code>{{ code }}</code></pre>
</div>
  `,
    standalone: false
})
export class BasicComponent {
  code = `
  <div dragula="DRAGULA_FACTS">
    <div>...</div>
    <div>...</div>
  </div>
  <div dragula="DRAGULA_FACTS">
    <div>...</div>
    <div>...</div>
  </div>
  `;
}

