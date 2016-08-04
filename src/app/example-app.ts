import {Component, ViewEncapsulation} from '@angular/core';
import {EXAMPLES} from './examples';

@Component({
  selector: 'example-app',
  template: require('./example-app.html'),
  encapsulation: ViewEncapsulation.None,
  directives: [EXAMPLES]
})
export class ExampleAppComponent {}
