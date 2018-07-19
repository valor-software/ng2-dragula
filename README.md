![Logo](https://raw.githubusercontent.com/bevacqua/dragula/master/resources/logo.png)

> Drag and drop so simple it hurts

Official **Angular2** wrapper for [`dragula`](https://github.com/bevacqua/dragula).

[![npm version](https://badge.fury.io/js/ng2-dragula.svg)](http://badge.fury.io/js/ng2-dragula) [![npm downloads](https://img.shields.io/npm/dm/ng2-dragula.svg)](https://npmjs.org/ng2-dragula) [![slack](https://ngx-slack.herokuapp.com/badge.svg)](https://ngx-slack.herokuapp.com)
[![Build Status](https://travis-ci.org/valor-software/ng2-dragula.svg?branch=master)](https://travis-ci.org/valor-software/ng2-dragula)
[![codecov](https://codecov.io/gh/valor-software/ng2-dragula/branch/master/graph/badge.svg)](https://codecov.io/gh/valor-software/ng2-dragula)
[![Dependency Status](https://david-dm.org/valor-software/ng2-dragula.svg)](https://david-dm.org/valor-software/ng2-dragula)

# Demo

![Demo](https://raw.githubusercontent.com/bevacqua/dragula/master/resources/demo.png)

Try out the [demo](http://valor-software.github.io/ng2-dragula/index.html)!

* [Install](#install)
* [Setup](#setup)
* [Usage](#usage)
    * [Directive](#directive)
    * [Grouping containers](#grouping-containers)
    * [dragulaModel](#dragulamodel)
    * [Drake options](#drake-options)
    * [Events](#events)
    * [Special events for ng2-dragula](#special-events-for-ng2-dragula)
    * [DragulaService](#dragulaservice)
* [Classic Blunders](#classic-blunders)
* [Development](#development)

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

## Grouping containers

You can group containers together by giving them the same group name. When you
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

## `dragulaModel`

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

## Drake options

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

# Classic Blunders

There are a number of very common issues filed against this repo. You will be
mocked terribly if you file a bug and it turns out you made one of these
blunders and it wasn't a bug at all.

### 1. Do not put `[dragula]` or `[dragulaModel]` on the same element as `*ngFor`.

**WRONG:**

```html
<div class="container">
  <div *ngFor="let x of list"
       dragula="WRONG" [dragulaModel]="list">...</div>
</div>
```

**RIGHT:**

```html
<div class="container" dragula="RIGHT" [dragulaModel]="list">
  <div *ngFor="let x of list">...</div>
</div>
```

### 2. Do not add any child elements that aren't meant to be draggable

**WRONG:**
```html
<div class="container" dragula="WRONG" [dragulaModel]="list">
  <h2>WRONG: This header will mess up everything, and you will
      get really weird bugs on drop</h2>
  <div *ngFor="let x of list">...</div>
</div>
```

**RIGHT:**
```html
<h2>This header will not be draggable or affect drags at all.</h2>
<div class="container" dragula="RIGHT" [dragulaModel]="list">
  <div *ngFor="let x of list">...</div>
</div>
```


# Development

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

TODO: put gh-pages updating in travis

## Credits

- `v1`: Nathan Walker (@NathanWalker)
- `v1.x`: Dmitriy Shekhovtsov (@valorkin)
- `v2`: Cormac Relf (@cormacrelf)

