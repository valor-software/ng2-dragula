import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'example-app',
  template: `
    <div class="examples">
      <example-a></example-a>

      <example-b></example-b>

      <another-example></another-example>

      <such-example></such-example>

      <copy-example></copy-example>
      <copy-model-example></copy-model-example>

      <much-example></much-example>

      <wow-example></wow-example>

      <repeat-example></repeat-example>

      <nested-repeat-example></nested-repeat-example>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class DemoComponent {
}
