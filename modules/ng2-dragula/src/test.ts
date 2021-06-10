// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'core-js/es/reflect';
import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

var td = require('testdouble');
var tdJasmine = require('testdouble-jasmine');
tdJasmine.use(td); // make sure to call tdJasmine.use with td to register the matcher

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
