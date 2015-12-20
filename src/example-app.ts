import {Component, ViewEncapsulation} from 'angular2/core';
import {EXAMPLES} from './examples';

@Component({
  selector: 'example-app',
  templateUrl: './example-app.html',
  encapsulation: ViewEncapsulation.None,
  directives: [EXAMPLES]
})
export class ExampleApp {}
