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

You'll need to add `DragulaModule` to your application module.

```typescript
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

```typescript
@Component({
  selector: 'sample',
  template:`
  <div>
    <div class='wrapper'>
      <div class='container' [dragula]='"first-bag"'>
        <div>You can move these elements between these two containers</div>
        <div>Moving them anywhere else isn't quite possible</div>
        <div>There's also the possibility of moving elements around in the same container, changing their position</div>
      </div>
      <div class='container' [dragula]='"first-bag"'>
        <div>This is the default use case. You only need to specify the containers you want to use</div>
        <div>More interactive use cases lie ahead</div>
        <div>Make sure to check out the <a href='https://github.com/bevacqua/dragula#readme'>documentation on GitHub!</a></div>
      </div>
    </div>
  </div>
  `
})
class Sample {}
```

You'll also need to add Dragula's CSS stylesheet `dragula.min.css` to your application.  You can find this in `node_modules/dragula/dist/dragula.css`.

# Usage

This package isn't very different from `dragula` itself. I'll mark the differences here, but please refer to the documentation for [`dragula`](https://github.com/bevacqua/dragula) if you need to learn more about `dragula` itself.

## Directive

There's a `dragula` directive that allows you to group containers together. That grouping of containers is called a `bag`.

```html
<div [dragula]='"bag-one"'></div>
<div [dragula]='"bag-one"'></div>
<div [dragula]='"bag-two"'></div>
```

### `dragulaModel`

If your `ngFor` is compiled from array, you may wish to have it synced. For that purpose you need to provide model by setting the `dragulaModel` attribute on the bag element.

```html
<ul [dragula]='"bag-one"' [dragulaModel]='items'>
  <li *ngFor="let item of items"></li>
</ul>
```

The standard `drop` event is fired before the model is synced. For that purpose you need to use the `dropModel`. The same behavior exists in the `remove` event. Therefore is the `removeModel` event. Further details are available under `Events`

### `drake` options

If you need to configure the `drake` _(there's only one `drake` per `bag`)_, you can use the `DragulaService`.

```js
import { DragulaService } from 'ng2-dragula/ng2-dragula';

class ConfigExample {
  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('third-bag', {
      removeOnSpill: true
    });
  }
}
```

You can also set your options by binding an options object to the `dragulaOptions` attribute.

```js
options: any = {
  removeOnSpill: true
}
```

```html
<div [dragula]='"bag-one"' [dragulaOptions]="options"></div>
<div [dragula]='"bag-two"' [dragulaOptions]="options"></div>
```

## Events

Whenever a `drake` instance is created with the `dragula` directive, there are several events you can subscribe to via `DragulaService`. Each event emits an `Array` where the first item is the name of the bag. The remaining items depend on the event. The sample below illustrates how you can use destructuring to assign the values from the event. Refer to: https://github.com/bevacqua/dragula#drakeon-events

```html
<div [dragula]='"evented-bag"'></div>
```

```js
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

| Event Name |      Listener Arguments      |  Event Description |
| :-------------: |:-------------:| -----|
| dropModel | bagName, el, target, source | same as normal drop, but model was synced, just available with the use of dragulaModel |
| removeModel | bagName, el, container | same as normal remove, but model was synced, just available with the use of dragulaModel |

## `DragulaService`

This service exposes a few different methods with which you can interact with `dragula`.

### `dragulaService.add(name, drake)`

Creates a `bag` identified by `name`. You should provide the entire `drake` instance. Typically, the directive takes care of this step.

### `dragulaService.setOptions(name, options)`

Sets the `options` used to instantiate a `drake`. Refer to the documentation for [`dragula`](https://github.com/bevacqua/dragula#readme) to learn more about the `options` themselves.

### `dragulaService.find(name)`

Returns the `bag` for a `drake` instance. Contains the following properties.

- `name` is the name that identifies the bag under `scope`
- `drake` is the raw `drake` instance itself

### `dragulaService.destroy(name)`

Destroys a `drake` instance named `name`.

## Contribution

Please read central `ng2` modules [readme](https://github.com/valor-software/ng2-plans) for details, plans and approach and welcome :)

## Development

Run demo locally:
1. build lib `npm run build` (`npm run build.watch` to run build in watch mode)
2. link lib `npm run link`
3. run demo `npm start`

Publish
1. ./node_modules/.bin/ngm -p src version patch
2. ./node_modules/.bin/ngm -p src publish

Update demo (gh-pages)
1. npm run demo.build (or ./node_modules/.bin/ng build -prod)
2. npm run demo.deploy

## Credits
Crossbrowser testing sponsored by [Browser Stack](https://www.browserstack.com)
[<img src="https://camo.githubusercontent.com/a7b268f2785656ab3ca7b1cbb1633ee5affceb8f/68747470733a2f2f64677a6f7139623561736a67312e636c6f756466726f6e742e6e65742f70726f64756374696f6e2f696d616765732f6c61796f75742f6c6f676f2d6865616465722e706e67" alt="Browser Stack" height="31px" style="background: cornflowerblue;">](https://www.browserstack.com)
