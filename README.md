![Logo](https://raw.githubusercontent.com/bevacqua/dragula/master/resources/logo.png)

> Drag and drop so simple it hurts

Official **Angular2** wrapper for [`dragula`](https://github.com/bevacqua/dragula). [![npm version](https://badge.fury.io/js/ng2-dragula.svg)](http://badge.fury.io/js/ng2-dragula) [![npm downloads](https://img.shields.io/npm/dm/ng2-dragula.svg)](https://npmjs.org/ng2-dragula) [![slack](https://ngx-slack.herokuapp.com/badge.svg)](https://ngx-slack.herokuapp.com)

[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)
[![Build Status](https://travis-ci.org/valor-software/ng2-dragula.svg?branch=master)](https://travis-ci.org/valor-software/ng2-dragula)
[![codecov](https://codecov.io/gh/valor-software/ng2-dragula/branch/master/graph/badge.svg)](https://codecov.io/gh/valor-software/ng2-dragula)
[![Dependency Status](https://david-dm.org/valor-software/ng2-dragula.svg)](https://david-dm.org/valor-software/ng2-dragula)

[![NPM](https://nodei.co/npm/ng2-dragula.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/ng2-dragula)
[![NPM](https://nodei.co/npm-dl/ng2-dragula.png?height=3&months=3)](https://npmjs.org/ng2-dragula)


# Demo

![Demo](https://raw.githubusercontent.com/bevacqua/dragula/master/resources/demo.png)

Try out the [demo](http://valor-software.github.io/ng2-dragula/index.html)!

* [Install](#install)
* [Setup](#setup)
* [Setup for Angular Docs 5 Min Quickstart guide and various seed projects](https://github.com/valor-software/ng2-dragula/wiki)
* [Usage](#usage)

# Install

You can get it on npm.

```shell
npm install ng2-dragula --save
```

# Setup

### 1. Important: add the following line to your `polyfills.ts`:

```ts
(window as any).global = window;
```

This is a temporary workaround for
[#849](https://github.com/valor-software/ng2-dragula/issues/849), while upstream
dragula still relies on `global`.

### 2. You'll need to add `DragulaModule` to your application module.

```typescript
import { DragulaModule } from 'ng2-dragula';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    DragulaModule,
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}

```

### 3. Add the CSS to your project

You'll also need to add Dragula's CSS stylesheet `dragula.css` to your
application (e.g. in `styles.scss`). The following is **slightly better** than
`node_modules/dragula/dist/dragula.css` (it includes `pointer-events: none`
([#508](https://github.com/valor-software/ng2-dragula/issues/508)) and
[this fix](https://github.com/bevacqua/dragula/issues/373)),
but you may wish to make your own modifications.

```scss
/* in-flight clone */
.gu-mirror {
  position: fixed !important;
  margin: 0 !important;
  z-index: 9999 !important;
  opacity: 0.8;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
  filter: alpha(opacity=80);
  pointer-events: none;
}
/* high-performance display:none; helper */
.gu-hide {
  left: -9999px !important;
}
/* added to mirrorContainer (default = body) while dragging */
.gu-unselectable {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}
/* added to the source element while its mirror is dragged */
.gu-transit {
  opacity: 0.2;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
  filter: alpha(opacity=20);
}
```

### Then you're ready to go

```typescript
@Component({
  selector: "sample",
  template:`
  <div>
    <div class="wrapper">
      <div class="container" dragula="DRAGULA_FACTS">
        <div>You can move these elements between these two containers</div>
        <div>Moving them anywhere else isn't quite possible</div>
        <div>There's also the possibility of moving elements around in the same container, changing their position</div>
      </div>
      <div class="container" dragula="DRAGULA_FACTS">
        <div>This is the default use case. You only need to specify the containers you want to use</div>
        <div>More interactive use cases lie ahead</div>
        <div>Make sure to check out the <a href="https://github.com/bevacqua/dragula#readme">documentation on GitHub!</a></div>
      </div>
    </div>
  </div>
  `
})
class Sample {}
```

# Usage

This package isn't very different from `dragula` itself. I'll mark the differences here, but please refer to the documentation for [dragula](https://github.com/bevacqua/dragula) if you need to learn more about `dragula` itself.

## Directive

There's a `dragula` directive that makes a container's direct children
draggable. You must supply a string. Both syntaxes, `dragula="VAMPIRES"` or
`[dragula]="'VAMPIRES'"`, work equally well.

```html
<ul dragula="VAMPIRES">
  <li>Dracula</li>
  <li>Kurz</li>
  <li>Vladislav</li>
  <li>Deacon</li>
</ul>
```

## Grouping containers by type

You can group containers together by giving them the same type. When you
do, the children of each container can be dragged to any container in the same
group.

```html
<div dragula="VAMPIRES">
  <!-- vamps in here -->
</div>
<div dragula="VAMPIRES">
  <!-- vamps in here -->
</div>

<div dragula="ZOMBIES">
  <!-- but zombies in here! -->
</div>
```

If you want to make sure you are using the same type string in different places,
use the `[dragula]` syntax to pass a string variable from your component:

```html
<div [dragula]="Vampires"></div>
<div [dragula]="Vampires"></div>
```
```ts
class MyComponent {
  Vampires = "VAMPIRES";
}
```

### `dragulaModel`

If your container's children are rendered using `ngFor`, you may wish to have it synced. If you provide the same array to the `dragulaModel` attribute on the container element, any changes will be synced back to the array.

```html
<ul dragula="VAMPIRES" [dragulaModel]="vampires">
  <li *ngFor="let vamp of vampires">
    {{ vamp.name }} likes {{ vamp.favouriteColor }}
  </li>
</ul>
```

Note: **DO NOT** put any other elements inside the container. The library relies
on having the index of a DOM element inside a container mapping directly to
their associated items in the array. Everything will be messed up if you do
this.

On top of the normal Dragula events, when `[dragulaModel]` is provided, there are two extra events: `dropModel` and `removeModel`. Further details are available under `Events`

### `drake` options

If you need to configure the `drake` _(there's exactly one `drake` per `group`)_, you can use the `DragulaService`.

```ts
import { DragulaService } from 'ng2-dragula';

class ConfigExample {
  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions("VAMPIRES", {
      removeOnSpill: true
    });
  }
}
```

You can also set your options by binding an options object to the `dragulaOptions` attribute.

```ts
options: any = {
  removeOnSpill: true
}
```

```html
<div dragula="REMOVABLE" [dragulaOptions]="options"></div>
<div dragula="REMOVABLE" [dragulaOptions]="options"></div>
```

Note that any modifications you make after the directive is initialized will not
be applied.

## Events

Whenever a `drake` instance is created with the `dragula` directive, there are
several events you can subscribe to via `DragulaService`. Each event emits an
`Array` where the first item is the type string used by the group. The remaining
items depend on the event. The sample below illustrates how you can use
destructuring to assign the values from the event. Refer to
https://github.com/bevacqua/dragula#drakeon-events

```html
<div dragula="VAMPIRES"></div>
```

```ts
export class EventExample {

  constructor(private dragulaService: DragulaService) {
    dragulaService.drag.subscribe((value) => {
      console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value) => {
      console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      console.log(`out: ${value[0]}`);
      this.onOut(value.slice(1));
    });
  }

  private onDrag(args) {
    let [e, el] = args;
    // do something
  }

  private onDrop(args) {
    let [e, el] = args;
    // do something
  }

  private onOver(args) {
    let [e, el, container] = args;
    // do something
  }

  private onOut(args) {
    let [e, el, container] = args;
    // do something
  }
}
```

## Special Events for ng2-dragula

| Event Name      | Listener Arguments          | Event Description                                                                        |
| :-------------: | :-------------------------: | ---------------------------------------------------------------------------------------- |
| dropModel       | type, el, target, source    | same as normal drop, but model was synced, just available with the use of dragulaModel   |
| removeModel     | type, el, container         | same as normal remove, but model was synced, just available with the use of dragulaModel |

## `DragulaService`

This service exposes a few different methods with which you can interact with `dragula`.

### `dragulaService.add(name, drake)`

Creates a `group` identified by `name`. You should provide the entire `drake` instance. Typically, the directive takes care of this step.

### `dragulaService.setOptions(name, options)`

Sets the `options` used to instantiate a `drake`. Refer to the documentation for [dragula](https://github.com/bevacqua/dragula#readme) to learn more about the `options` themselves.

### `dragulaService.find(name)`

Returns a `{ name, drake }` for a group named 'name', if there is one. Contains the following properties.

- `name` is the name that identifies the drake
- `drake` is the raw `drake` instance itself

### `dragulaService.destroy(name)`

Destroys a `drake` instance named `name`.

**PLEASE TAKE NOTE**

Destroying the drake instance (ie. your bag) does not unsubscribe from the dragularService. To correctly unsubscribe you need to explicilty unsubscribe from the service in the ngOnDestroy method of the component. The easiest way to do that is to use a destroy$ Subject, but note that this is NOT good RxJS practice (see below):

```
private destroy$ = new Subject();

constructor (private _dragulaService: DragulaService) {
  this._dragulaService.dropModel.asObservable()
    .takeUntil(this.destroy$).subscribe((result) => { ... }
}

ngOnDestroy() {
  this.destroy$.next();
}
```

The recommended way is not to subscribe directly to the dragulaService, but instead in the ngOnInit of your component setup a dragging$ Subject which is a propery on your component:

```
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/startWith';
import { Observable } from "rxjs/Observable";

// ...

ngOninit() {
  const started = this.ds.drag.asObservable().mapTo(true);
  const ended = this.ds.dragend.asObservable().mapTo(false);
  this.dragging$ = started.merge(ended).startWith(false);
}
```

This way you don't create any subscriptions that hang around and thus you don't need to destroy them. Ref [here](https://github.com/valor-software/ng2-dragula/issues/713#issuecomment-302937608).

## Contribution

Please read central `ng2` modules [readme](https://github.com/valor-software/ng2-plans) for details, plans and approach and welcome :)

## Development

You must use Yarn.

#### Setup:

```sh
yarn
(cd modules/ng2-dragula && yarn build)
```

#### run tests

```sh
(cd modules/ng2-dragula && yarn test)
# or
(cd modules/ng2-dragula && yarn test:headless)
```

#### run demo server

```sh
yarn watch # listens for changes in the library and rebuilds
(cd modules/demo && yarn start)
```

#### Publishing a new version

```
yarn lerna publish
```

#### TODO: put gh-pages updating in travis

## Credits
Crossbrowser testing sponsored by [Browser Stack](https://www.browserstack.com)
[<img src="https://camo.githubusercontent.com/a7b268f2785656ab3ca7b1cbb1633ee5affceb8f/68747470733a2f2f64677a6f7139623561736a67312e636c6f756466726f6e742e6e65742f70726f64756374696f6e2f696d616765732f6c61796f75742f6c6f676f2d6865616465722e706e67" alt="Browser Stack" height="31px" style="background: cornflowerblue;">](https://www.browserstack.com)
