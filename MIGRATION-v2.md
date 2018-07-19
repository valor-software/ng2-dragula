# Steps to migrate v1 to v2

### 1. Make sure you are using Angular 6 and RxJS 6.

The library is moving with the times. Follow the [Angular update
guide](https://update.angular.io/)'s recommendations.

### 2. Add `forRoot()` to your NgModule imports

```diff
@NgModule(
   imports: [
     ...
-    DragulaModule,
+    DragulaModule.forRoot(),
   ]
 )
```

### 2. Add two-way binding brackets to `[(dragulaModel)]`

```diff
-<div dragula="VAMPIRES" [dragulaModel]="myList">
+<div dragula="VAMPIRES" [(dragulaModel)]="myList">
```

`ng2-dragula` will no longer mutate arrays internally. Instead, you have to save
the results of drag/drop manipulation using one of these methods:

1. Two-way binding of `[(dragulaModel)]="myList"`, which is roughly a drop-in
   replacement for mutation
2. Listening to changes relevant to a particular list with
   `(dragulaModelChange)="..."` and saving the modifications manually (... or do
   any number of things with it).
3. Listening to the newly minted
   `DragulaService.dropModel("GROUP")/removeModel("GROUP")` directly -- you will
   be notified when any item is dropped or removed in any container in your
   group. These events are much improved, and now contain model data, which is
   ideal for triggering `@ngrx/store` actions.

### 3. Replace `setOptions` and `[dragulaOptions]` with `DragulaService.createGroup`

```diff
 constructor(private dragulaService: DragulaService) {
-  this.dragulaService.setOptions("first-bag", {
+  this.dragulaService.createGroup("VAMPIRES", {
     revertOnSpill: true,
   });
 }
```

'Bags' are now called 'Groups', in the code and the documentation. This is much
easier to understand. In line with that:

- `setOptions` has been *renamed* to `createGroup` to reduce confusion: the
  former terminology implies the group already exists, but you can only
  `createGroup` when the group does NOT already exist.
- `[dragulaOptions]` has been removed to reduce confusion; you can't
  update an entire options object (that would do nothing), but the Angular
  binding incorrectly suggests that you can.

You might also like to take the opportunity to give your groups descriptive
names. A lot of users filing issues are still using `"first-bag"`, `"second-bag"`,
etc.

### 3. Use the new events API

```diff
 subs = new Subscription();

 constructor(private dragulaService: DragulaService) {
-  this.subs.add(this.dragulaService.drag.asObservable().subscribe((values: any[]) => {
-    if (values[0] === "VAMPIRES") {
-      const [el, source] = values.slice(1);
-      // You now have el: any, source: any
-    }
-  }));
+  this.subs.add(this.dragulaService.drag("VAMPIRES")
+   .subscribe(({ el, source }) => {
+     // Note the curly braces
+     // You now have el: Element, source: Element
+    })
+  );
 }

 ngOnDestroy() { this.subs.unsubscribe(); }
```

The new API is much more helpful. There are three notable changes:

1. **Events are functions that return observables now.** You can optionally
   provide a group name to filter events by. You pretty much always want to do
   this.
2. The Dragula event data in the Observable is placed into nicely typed objects
   for you. You can use curly braces to destructure them into the data you need.
3. `dropModel` and `removeModel` WAY more powerful. Check out the `sourceModel`,
   `targetModel` and `item` props on those two events.

There is much more info in the README.

### If you are using `copy` with `[(dragulaModel)]`, provide a `copyItem` function.

```diff
interface MyItem {
  name: string;
}
 constructor(private dragulaService: DragulaService) {
   this.dragulaService.createGroup("VAMPIRES", {
     copy: true,
     // or copy: (el, source) => source.id === ...,
+    copyItem: (item: MyItem) => ({ ...item })
   });
 }
```

The implementation in v1 was awful; it was literally
`JSON.parse(JSON.stringify(x))`. A number of users asked to be able to customise
this. However, the implementation is so bug-prone that I decided to make it
mandatory to provide your own.

- If you have basic objects like `MyItem` above, a shallow clone with the spread
  operator might suffice.
- If you have custom classes you are dragging around, maybe make a `clone()` method
  and call it.
- If you are using `Immutable.js` or similar... you know what you're doing. Just
  don't spit the same object back.

If you want a worked example with a custom class and incrementing IDs, check out
[the
demo](https://github.com/valor-software/ng2-dragula/blob/master/modules/demo/src/app/examples/06-copy-model.component.ts).

### That's it!

Take a breather. And while you're here: [I built another drag and drop library,
`angular-skyhook`!][asky]. I've been maintaining `ng2-dragula` even though
I haven't been using it -- the sortable lists paradigm just isn't powerful
enough sometimes. I poured a lot of effort into it, so check out the examples,
give it a whirl and see if you can find a use for it.

[asky]: https://cormacrelf.github.io/angular-skyhook/
