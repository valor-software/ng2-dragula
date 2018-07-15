declare module 'testdouble-jasmine' {
  import { CustomMatcherFactories } from 'jasmine-core';
  export function get(td: any): CustomMatcherFactories;
  export function use(td: any): any;
}

