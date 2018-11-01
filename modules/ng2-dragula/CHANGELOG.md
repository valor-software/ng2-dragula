# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.1.1"></a>
## [2.1.1](https://github.com/valor-software/ng2-dragula/compare/v2.1.0...v2.1.1) (2018-11-01)


### Bug Fixes

* [@types](https://github.com/types)/dragula > MockDrake breakage. close [#912](https://github.com/valor-software/ng2-dragula/issues/912) close [#913](https://github.com/valor-software/ng2-dragula/issues/913) ([4897356](https://github.com/valor-software/ng2-dragula/commit/4897356))




<a name="2.1.0"></a>
# [2.1.0](https://github.com/valor-software/ng2-dragula/compare/v2.0.4...v2.1.0) (2018-09-06)


### Features

* include sourceIndex and targetIndex in model events ([ea5fb03](https://github.com/valor-software/ng2-dragula/commit/ea5fb03))




<a name="2.0.4"></a>
## [2.0.4](https://github.com/valor-software/ng2-dragula/compare/v2.0.3...v2.0.4) (2018-08-31)


### Bug Fixes

* **package:** make NPMJS.com readme link to GH ([c0e7b1b](https://github.com/valor-software/ng2-dragula/commit/c0e7b1b))




<a name="2.0.3"></a>
## [2.0.3](https://github.com/valor-software/ng2-dragula/compare/v2.0.2...v2.0.3) (2018-08-31)

### Bug Fixes

* shouldn't include jasmine/testdouble typings in published module ([ceccf3a](https://github.com/valor-software/ng2-dragula/commit/ceccf3a)), closes [#896](https://github.com/valor-software/ng2-dragula/issues/896)




<a name="2.0.2"></a>
## [2.0.2](https://github.com/valor-software/ng2-dragula/compare/v2.0.1...v2.0.2) (2018-07-25)

### Bug Fixes

* directive should only emit, not save on removeModel ([59783f0](https://github.com/valor-software/ng2-dragula/commit/59783f0))
* was doubling up on writes to drake.models, causing sometimes wrong model order ([f1b26cd](https://github.com/valor-software/ng2-dragula/commit/f1b26cd)), closes [#878](https://github.com/valor-software/ng2-dragula/issues/878)




<a name="2.0.1"></a>
## [2.0.1](https://github.com/valor-software/ng2-dragula/compare/v2.0.0...v2.0.1) (2018-07-20)


### Bug Fixes

* **types:** '[@types](https://github.com/types)/dragula' was a devDependency, not present in published version, closes [#876](https://github.com/valor-software/ng2-dragula/issues/876) ([eaef778](https://github.com/valor-software/ng2-dragula/commit/eaef778))




<a name="2.0.0"></a>
# [2.0.0](https://github.com/valor-software/ng2-dragula/compare/v1.5.0...v2.0.0) (2018-07-19)

Version 2.0.0 is big. It has lots of breaking API changes are bundled into one
release. (Thankfully, it also gains a hefty test suite.) Rather than reading all
the changes here, maybe check out the [V2 migration
guide](../../MIGRATION-v2.md).

### Bug Fixes

* `@types/dragula` DragulaOptions.copy only taking boolean ([ec282c0](https://github.com/valor-software/ng2-dragula/commit/ec282c0))
* build with Angular Package Format via ng-packagr ([c362bd8](https://github.com/valor-software/ng2-dragula/commit/c362bd8))
* DragulaService.handleModels called twice (intro'd by c5b1d40) ([d4df88c](https://github.com/valor-software/ng2-dragula/commit/d4df88c))
* dropModel event not ever firing if models is initially null/undefined. fix [#307](https://github.com/valor-software/ng2-dragula/issues/307) ([c5b1d40](https://github.com/valor-software/ng2-dragula/commit/c5b1d40))
* export EventTypes, document MockDrake much more ([10249ab](https://github.com/valor-software/ng2-dragula/commit/10249ab))
* memory leaks and containers/dragulaModels hanging around in drakes after destroy or setting null ([2d2c890](https://github.com/valor-software/ng2-dragula/commit/2d2c890)), closes [#794](https://github.com/valor-software/ng2-dragula/issues/794) [#852](https://github.com/valor-software/ng2-dragula/issues/852) [#784](https://github.com/valor-software/ng2-dragula/issues/784)
* Mismatch of on remove parameter values. Thanks @Thanatos-elNyx, fix [#842](https://github.com/valor-software/ng2-dragula/issues/842) and [#855](https://github.com/valor-software/ng2-dragula/issues/855) ([7cb1889](https://github.com/valor-software/ng2-dragula/commit/7cb1889))
* more types on DragulaService ([927cad5](https://github.com/valor-software/ng2-dragula/commit/927cad5))
* redo confusing DragulaService methods (setOptions => createGroup) ([f50d37a](https://github.com/valor-software/ng2-dragula/commit/f50d37a))
* remove [dragulaOptions] ([d2886c3](https://github.com/valor-software/ng2-dragula/commit/d2886c3))
* fix target.removeChild(dropElm). ([766285a](https://github.com/valor-software/ng2-dragula/commit/766285a)), closes [#596](https://github.com/valor-software/ng2-dragula/issues/596)


### Features

* Custom copyItem to clone model objects ([78f3f9f](https://github.com/valor-software/ng2-dragula/commit/78f3f9f))
* DragulaModule.forRoot(), with plain DragulaModule on child NgModules. ([b739f9b](https://github.com/valor-software/ng2-dragula/commit/b739f9b)), closes [#805](https://github.com/valor-software/ng2-dragula/issues/805) [#187](https://github.com/valor-software/ng2-dragula/issues/187)
* dropModel and removeModel get item, sourceModel/targetModel props ([572c1ba](https://github.com/valor-software/ng2-dragula/commit/572c1ba))
* enable two-way binding of [(dragulaModel)] ([53f8d41](https://github.com/valor-software/ng2-dragula/commit/53f8d41))
* new strongly typed events API with type (aka 'bag') filtering ([6339fc4](https://github.com/valor-software/ng2-dragula/commit/6339fc4))


### BREAKING CHANGES

#### Package

* **Requires Angular 6**. This is because of the Angular Package Format
changes, and also RxJS 6's breaking changes.
* **Requires RxJS 6.** If you are still using Angular 5, which
requires RxJs 5, and you can't upgrade yet (even though the CLI upgrade
tools are excellent), you might be able to use
`rxjs@5.6.0-forward-compat.5`. This has not been tested.
* Requires importing `DragulaModule.forRoot()` in your root NgModule, and
plain DragulaModule in child modules. This is so you can break your app
into lazy loaded modules and not experience problems with having more
than 1 DragulaService.

#### Directive

* **`dragulaModel` no longer modifies arrays internally. You have to use
`[(dragulaModel)]="myModel"`** if you want to save the changes the library
makes. In most cases, this will be an easy change. However, if you were
relying on the arrays being modified directly, that will no longer
work.
* Removes `[dragulaOptions]` from the directive. It is **not a neater API**
(still have to import DragulaOptions, why not just import DragulaService),
and it is **misleading** (changing the object does not get reflected merely
because it uses Angular binding; you can't change options once set).

#### DragulaService

* **All the events available on DragulaService are now functions**
with an optional `groupName?: string` argument that narrows the stream
down to events from drags of a particular group. (Groups are formerly
known as 'bags'). E.g: `this.dragulaService.drag("DOG").subscribe(...)`.
* DragulaService events are now proper Observables, not EventEmitters.
* DragulaService events no longer output arrays directly from Dragula.js;
**they are now strongly typed objects**.
You can migrate by just swapping square braces for curly ones, if you
used the same names: `.subscribe(([el, source]) => {})` becomes
`.subscribe(({el, source}) => {})`
* `DragulaService.add` now takes a `Group`. You probably don't want to use it.
* `DragulaService.setOptions` is now called `createGroup`. This is much
clearer. It was not obvious that setOptions actually created groups
before; it was even less obvious that you couldn't call it again later
to change behaviour.
* If you are using `copy` with `[dragulaModel]`, you must now provide your
own `copyItem` function. The old one was `JSON.parse(JSON.stringify(x))`,
which was terrible.



<a name="1.5.0"></a>
# [1.5.0](https://github.com/valor-software/ng2-dragula/compare/v1.3.1...v1.5.0) (2017-05-21)



<a name="1.3.1"></a>
## [1.3.1](https://github.com/valor-software/ng2-dragula/compare/v1.3.0...v1.3.1) (2017-04-10)


### Bug Fixes

* **dragule:** use named exports ([#574](https://github.com/valor-software/ng2-dragula/issues/574)) ([828a434](https://github.com/valor-software/ng2-dragula/commit/828a434)), closes [#530](https://github.com/valor-software/ng2-dragula/issues/530)


### Features

* **package:** relaxed peer dependencies to allow ng v4 ([94f5e2b](https://github.com/valor-software/ng2-dragula/commit/94f5e2b))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/valor-software/ng2-dragula/compare/v1.2.2...v1.3.0) (2017-01-17)


### Bug Fixes

* **demo:** make AoT compatible ([8667689](https://github.com/valor-software/ng2-dragula/commit/8667689))


### Features

* **package:** v1.3.0 upgrade to ng v2.3+ ([b8ce361](https://github.com/valor-software/ng2-dragula/commit/b8ce361))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/valor-software/ng2-dragula/compare/v1.2.2-0...v1.2.2) (2016-12-16)


### Features

* **package:** build upgrage + AoT support ([#494](https://github.com/valor-software/ng2-dragula/issues/494)) ([0a3e929](https://github.com/valor-software/ng2-dragula/commit/0a3e929))



<a name="1.2.2-0"></a>
## [1.2.2-0](https://github.com/valor-software/ng2-dragula/compare/v1.2.1...v1.2.2-0) (2016-10-19)


### Features

* **package:** added module metadata extraction for Angular AoT compiler ([0deed74](https://github.com/valor-software/ng2-dragula/commit/0deed74)), closes [#417](https://github.com/valor-software/ng2-dragula/issues/417)



<a name="1.2.1"></a>
## [1.2.1](https://github.com/valor-software/ng2-dragula/compare/v1.2.0...v1.2.1) (2016-09-21)


### Features

* **ng2:** Update to angular2 final ([#414](https://github.com/valor-software/ng2-dragula/issues/414)) ([1f872dd](https://github.com/valor-software/ng2-dragula/commit/1f872dd))
* **package:** update dragula tp 3.7.2 ([#405](https://github.com/valor-software/ng2-dragula/issues/405)) ([99b3808](https://github.com/valor-software/ng2-dragula/commit/99b3808)), closes [#404](https://github.com/valor-software/ng2-dragula/issues/404)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/valor-software/ng2-dragula/compare/v1.1.10...v1.2.0) (2016-09-07)


### Bug Fixes

* **demo:** the error in the demo move `}` to the bottom([#329](https://github.com/valor-software/ng2-dragula/issues/329))  ([c20e699](https://github.com/valor-software/ng2-dragula/commit/c20e699))
* **demo:** update ngFor syntax ([e3c870a](https://github.com/valor-software/ng2-dragula/commit/e3c870a))


### Features

* **package:** added main entry point to package.json ([#319](https://github.com/valor-software/ng2-dragula/issues/319)) ([a53bf7b](https://github.com/valor-software/ng2-dragula/commit/a53bf7b))
* **package:** upgrade to angular 2.0.0-rc.2 ([#299](https://github.com/valor-software/ng2-dragula/issues/299)) ([e275b99](https://github.com/valor-software/ng2-dragula/commit/e275b99))



<a name="1.1.10"></a>
## [1.1.10](https://github.com/valor-software/ng2-dragula/compare/v1.1.9...v1.1.10) (2016-06-06)


### Bug Fixes

* **package:** install ng2-dracula in a project without typings.json ([#277](https://github.com/valor-software/ng2-dragula/issues/277)) ([9bebfed](https://github.com/valor-software/ng2-dragula/commit/9bebfed))



<a name="1.1.9"></a>
## [1.1.9](https://github.com/valor-software/ng2-dragula/compare/v1.1.8...v1.1.9) (2016-05-13)


### Bug Fixes

* **publish:** enabled .d.ts files generation ([a7366c8](https://github.com/valor-software/ng2-dragula/commit/a7366c8))



<a name="1.1.8"></a>
## [1.1.8](https://github.com/valor-software/ng2-dragula/compare/v1.1.7...v1.1.8) (2016-05-13)


### Bug Fixes

* **publish:** ng2-dragula publish flow fixed ([61a6bec](https://github.com/valor-software/ng2-dragula/commit/61a6bec))



<a name="1.1.7"></a>
## [1.1.7](https://github.com/valor-software/ng2-dragula/compare/326d198...v1.1.7) (2016-05-12)


### Bug Fixes

* **dragula:** compatible with webpack and other loaders. no more window.dragula ([e6830ca](https://github.com/valor-software/ng2-dragula/commit/e6830ca))
* **dragula:** use require. also update to beta.6 ([b0a9ca3](https://github.com/valor-software/ng2-dragula/commit/b0a9ca3))
* **dragula:** using typings and removed require usage ([feaf945](https://github.com/valor-software/ng2-dragula/commit/feaf945))
* **dragulaModel:** model sync works properly now ([326d198](https://github.com/valor-software/ng2-dragula/commit/326d198))
* **removeModel:** issue with callback ([c19c676](https://github.com/valor-software/ng2-dragula/commit/c19c676))
* **require:** removing require ([b033e85](https://github.com/valor-software/ng2-dragula/commit/b033e85))
* **require:** removing usage of require ([0f7ee40](https://github.com/valor-software/ng2-dragula/commit/0f7ee40))


### Features

* **package:** Upgrade to angular 2.0.0-rc.1 ([f3ff82c](https://github.com/valor-software/ng2-dragula/commit/f3ff82c)), closes [#239](https://github.com/valor-software/ng2-dragula/issues/239)
