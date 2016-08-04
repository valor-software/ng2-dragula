import {enableProdMode} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';

const ENV_PROVIDERS:Array<any> = [];
// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'prod') {
  enableProdMode();
}

/*
 * App Component
 * our top level component that holds all of our components
 */
import {ExampleAppComponent} from './app/example-app';

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
document.addEventListener('DOMContentLoaded', function main():any {
  return bootstrap(ExampleAppComponent, [
    ...ENV_PROVIDERS
  ])
    .catch((err:any) => console.error(err));
});
