import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ex-app',
  template: `
    <div class="examples">
      <ex-01-basic></ex-01-basic>
      <ex-02-events></ex-02-events>
      <ex-03-spill></ex-03-spill>
      <ex-04-revert></ex-04-revert>
      <ex-05-copy></ex-05-copy>
      <ex-06-copy-model></ex-06-copy-model>
      <ex-07-handle></ex-07-handle>
      <ex-08-click></ex-08-click>
      <ex-09-ngfor></ex-09-ngfor>
      <ex-10-nested></ex-10-nested>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class DemoComponent {
}
