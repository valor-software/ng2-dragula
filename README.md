[![npm version](https://badge.fury.io/js/ng2-dragula.svg)](http://badge.fury.io/js/ng2-dragula) [![npm downloads](https://img.shields.io/npm/dm/ng2-dragula.svg)](https://npmjs.org/ng2-dragula) [![slack](https://ngx-slack.herokuapp.com/badge.svg)](https://ngx-slack.herokuapp.com)
[![Build Status](https://travis-ci.org/valor-software/ng2-dragula.svg?branch=master)](https://travis-ci.org/valor-software/ng2-dragula)
[![codecov](https://codecov.io/gh/valor-software/ng2-dragula/branch/master/graph/badge.svg)](https://codecov.io/gh/valor-software/ng2-dragula)

![Logo](https://raw.githubusercontent.com/bevacqua/dragula/master/resources/logo.png)

> Drag and drop so simple it hurts

Official **Angular** wrapper for [`dragula`](https://github.com/bevacqua/dragula).
# Notice: v3 has been released

# Notice: v2 has been released

**It contains a number of breaking changes. Follow the [migration guide
here][migration] or read the [full changelog][changelog].**

[migration]: ./MIGRATION-v2.md
[changelog]: ./modules/ng2-dragula/CHANGELOG.md

# Demo

Try out the [demo](http://valor-software.github.io/ng2-dragula/index.html)!

Or play with [this starter in your browser][stackblitz] on StackBlitz.

[stackblitz]: https://stackblitz.com/edit/ng2-dragula-base?file=src/app/app.component.html

![Demo](https://raw.githubusercontent.com/bevacqua/dragula/master/resources/demo.png)

* [Install](#install)
* [Setup](#setup)
* [Usage](#usage)
  * [Directive](#directive)
  * [Grouping containers](#grouping-containers)
  * [Saving changes to arrays with dragulaModel](#saving-changes-to-arrays-with-dragulamodel)
  * [DragulaService](#dragulaservice)
  * [Drake options](#drake-options)
  * [Events](#events)
  * [Special events for ng2-dragula](#special-events-for-ng2-dragula)
* [Classic Blunders](#classic-blunders)
* [Development](#development)

# Dependencies

Latest version available for each version of Angular

| ng2-dragula | Angular |
| ---------- |---------|
| 2.1.1      | <= 9.x  |
| current    | ^14.x.x |

# Install

You can get it on npm.

```sh
npm install ng2-dragula
# or
yarn add ng2-dragula
```

# Setup

### 1. Important: add the following line to your `polyfills.ts`:

```ts
(window as any).global = window;
```

This is a temporary workaround for
[#849](https://github.com/valor-software/ng2-dragula/issues/849), while upstream
dragula still relies on `global`.

### 2. Add `DragulaModule.forRoot()` to your application module.

```typescript
import { DragulaModule } from 'ng2-dragula';
@NgModule({
  imports: [
    ...,
    DragulaModule.forRoot()
  ],
})
export class AppModule { }
```

On any child modules (like lazy loaded route modules), just use `DragulaModule`.

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

Here's a super quick sample to get you started:

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

This package isn't very different from `dragula` itself. I'll mark the
differences here, but please refer to the documentation for
[dragula](https://github.com/bevacqua/dragula) if you need to learn more about
`dragula` itself.

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

## Saving changes to arrays with `[(dragulaModel)]`

If your container's children are rendered using `ngFor`, you may wish to read what your users have done. If you provide the same array to the `[(dragulaModel)]` attribute on the **container** element, any changes will be synced back to the array.

**NOTE: v2 changes the behaviour of [dragulaModel]. It no longer mutates the arrays you give it, but will shallow clone them and give you the results.** Use two-way binding with `[(dragulaModel)]="..."`, or use the DragulaService `dropModel` and `removeModel` events to save the new models produced.

```html
<ul dragula="VAMPIRES" [(dragulaModel)]="vampires">
  <li *ngFor="let vamp of vampires">
    {{ vamp.name }} likes {{ vamp.favouriteColor }}
  </li>
</ul>
```

You do not, of course, *have* to sync the changes back. The `[(dragulaModel)]` syntax is equivalent to:

```html
<ul dragula="VAMPIRES" [dragulaModel]="vampires" (dragulaModelChange)="vampires = $event">
  ...
</ul>
```

Note: **DO NOT** put any other elements inside the container. The library relies
on having the index of a DOM element inside a container mapping directly to
their associated items in the array. Everything will be messed up if you do
this.

On top of the normal Dragula events, when `[(dragulaModel)]` is provided, there are two extra events: `dropModel` and `removeModel`. Further details are available under `Events`

## Drake options

If you need to configure the `drake` _(there's exactly one `drake` per `group`)_, you can use the `DragulaService`.

```ts
import { DragulaService } from 'ng2-dragula';

class ConfigExample {
  constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup("VAMPIRES", {
      removeOnSpill: true
    });
  }
}
```

See below for more info on options.

## `DragulaService`

This service exposes a few different methods with which you can interact with `dragula`.

### `dragulaService.createGroup(name, options)`

NOTE: formerly known as `setOptions()`

Creates a group named `name`, with an
[options](#dragulaoptions) object.

### `dragulaService.find(name: string)`

Returns a `Group` named `name`, if there is one. A `Group` contains the following
properties.

- `name` is the name that identifies the group
- `drake` is the raw `drake` instance itself
- `options` is the options object used to create the drake. Modifying it won't
  do anything useful.

### `dragulaService.destroy(name)`

Destroys a `Group` named `name` and its associated `drake` instance. Silently
returns if the group does not exist.

### DragulaOptions

Refer to the documentation for
[dragula](https://github.com/bevacqua/dragula#readme) to learn more about the
native options.

All of the native options work with ng2-dragula. However, there is one addition:

#### `copyItem: <T>(item: T) => T`

When you have:

* `[(dragulaModel)]`
* `copy` is `true` or a *function that returns true*

... ng2-dragula will have to create a clone of the JS object you picked up. In
previous versions of `ng2-dragula`, there was a terribly buggy,
one-size-fits-all clone function. From v2 onwards, you **MUST** provide your own
`copyItem` function.

If you have a simple object with no nested values, it could be as simple as:

```ts
{
  copy: ...,
  copyItem: (item: MyType) => ({ ...item })
}
```

There is a complete example using a `Person` class on the demo page.

## Events

Whenever a `drake` instance is created with the `dragula` directive, there are
several events you can subscribe to via `DragulaService`. Each event emits
a typed object, which you can use to get information about what happened.

Refer to [the Drake events
documentation](https://github.com/bevacqua/dragula#drakeon-events) for more
information about the different events available. Each event follows this
format:

```yml
Event named: 'drag'

Native dragula:
  Use: drake.on('drag', listener)
  Listener arguments: (el, source)

ng2-dragula:
  Method: DragulaService.drag(groupName?: string): Observable<...>
  Observable of: { name: string; el: Element; source: Element; }
```

Each supports an optional parameter, `groupName?: string`, which filters events
to the group you're interested in. This is usually better than getting all
groups in one observable.

The sample below illustrates how you can use destructuring to pull values from
the event, and unsubscribe when your component is destroyed.

```html
<div dragula="VAMPIRES"></div>
```

```ts
import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

export class MyComponent {
  // RxJS Subscription is an excellent API for managing many unsubscribe calls.
  // See note below about unsubscribing.
  subs = new Subscription();

  constructor(private dragulaService: DragulaService) {

    // These will get events limited to the VAMPIRES group.

    this.subs.add(this.dragulaService.drag("VAMPIRES")
      .subscribe(({ name, el, source }) => {
        // ...
      })
    );
    this.subs.add(this.dragulaService.drop("VAMPIRES")
      .subscribe(({ name, el, target, source, sibling }) => {
        // ...
      })
    );
    // some events have lots of properties, just pick the ones you need
    this.subs.add(this.dragulaService.dropModel("VAMPIRES")
      // WHOA
      // .subscribe(({ name, el, target, source, sibling, sourceModel, targetModel, item }) => {
      .subscribe(({ sourceModel, targetModel, item }) => {
        // ...
      })
    );

    // You can also get all events, not limited to a particular group
    this.subs.add(this.dragulaService.drop()
      .subscribe(({ name, el, target, source, sibling }) => {
        // ...
      })
    );
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.subs.unsubscribe();
  }
}

```

**NOTE: You should always unsubscribe each time you listen to an event.** This
is especially true for a component, which should tear itself down completely in
`ngOnDestroy`, including any subscriptions. It might not be necessary if you
have a global singleton service (which is never destroyed) doing the
subscribing.

You can also engineer your use of events to avoid subscribing in the first
place:

```ts
import { merge } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';

dragStart$ = this.dragulaService.drag("VAMPIRES").pipe(mapTo(true));
dragEnd$ = this.dragulaService.dragend("VAMPIRES").pipe(mapTo(false));
isDragging$ = merge(dragStart$, dragEnd$).pipe(startWith(false));

// html: [class.dragging]="isDragging$ | async"
```

## Special Events for `ng2-dragula`

The `dropModel(name?: string)` and `removeModel(name?: string)` events are only active when you have supplied `[dragulaModel]`.

| Event Name      | Listener Arguments                                           | Event Description                                                                        |
| :-------------- | :-------------------------:                                  | :--------------------------------------------------------------------------------------- |
| dropModel | { type, el, target, source, item, sourceModel, targetModel, sourceIndex, targetIndex } | same as normal drop, but with updated models + the item that was dropped |
| removeModel | { type, el, container, source, item, sourceModel, sourceIndex } | same as normal remove, but with updated model + the item that got removed |

# Classic Blunders

There are a number of very common issues filed against this repo. You will be
mocked terribly if you file a bug and it turns out you made one of these
blunders and it wasn't a bug at all.

### 1. Do not put `[dragula]` or `[(dragulaModel)]` on the same element as `*ngFor`.

**WRONG:**

```html
<div class="container">
  <div *ngFor="let x of list"
       dragula="WRONG" [(dragulaModel)]="list">...</div>
</div>
```

**RIGHT:**

```html
<div class="container" dragula="RIGHT" [(dragulaModel)]="list">
  <div *ngFor="let x of list">...</div>
</div>
```

### 2. Do not add any child elements that aren't meant to be draggable

**WRONG:**
```html
<div class="container" dragula="WRONG" [(dragulaModel)]="list">
  <h2>WRONG: This header will mess up everything, and you will
      get really weird bugs on drop</h2>
  <div *ngFor="let x of list">...</div>
</div>
```

**RIGHT:**
```html
<h2>This header will not be draggable or affect drags at all.</h2>
<div class="container" dragula="RIGHT" [(dragulaModel)]="list">
  <div *ngFor="let x of list">...</div>
</div>
```

# Alternatives

There are hundreds of other libraries that do this. Some notable ones:

- [@angular-skyhook](https://cormacrelf.github.io/angular-skyhook/examples/), specifically with the sortable. Also by me (@cormacrelf).
- [@angular/cdk/drag-drop](https://material.angular.io/cdk/categories) -- no documentation yet, but will presumably be well-supported.

# Development

- Please use [Conventional Commits](https://conventionalcommits.org/) in your commit messages.

#### setup

```sh
npm i ng2-dragula
```

#### run tests

```sh
npm run test
```

#### run demo server

```sh
npm run start
```

## Credits

- `v1`: Nathan Walker (@NathanWalker)
- `v1.x`: Dmitriy Shekhovtsov (@valorkin)
- `v2`: Cormac Relf (@cormacrelf)

