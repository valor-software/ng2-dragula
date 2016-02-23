import {Component} from 'angular2/core';
import {Dragula} from './directives/dragula.directive';
import {DragulaService} from './providers/dragula.provider';

@Component({
  selector: 'example-a',
  directives: [Dragula],
  viewProviders: [DragulaService],
  template:`
  <div class='parent'>
    <label for='hy'>Move stuff between these two containers. Note how the stuff gets inserted near the mouse pointer? Great stuff.</label>
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
    <pre>
      <code>
&lt;div [dragula]=&#039;&quot;first-bag&quot;&#039;&gt;&lt;/div&gt;
&lt;div [dragula]=&#039;&quot;first-bag&quot;&#039;&gt;&lt;/div&gt;
      </code>
    </pre>
  </div>
  `
})
export class ExampleA {

}

@Component({
  selector: 'example-b',
  directives: [Dragula],
  viewProviders: [DragulaService],
  template: `
  <div class='parent'>
    <label for='hy'>There are plenty of events along the lifetime of a drag event. <a href='https://github.com/bevacqua/dragula#drakeon-events'>all of them</a> in the docs!</label>
    <div class='wrapper'>
      <div class='container' [dragula]='"second-bag"'>
        <div>As soon as you start dragging an element, a <code>drag</code> event is fired</div>
        <div>Whenever an element is cloned because <code>copy: true</code>, a <code>cloned</code> event fires</div>
        <div>The <code>shadow</code> event fires whenever the placeholder showing where an element would be dropped is moved to a different container or position</div>
        <div>A <code>drop</code> event is fired whenever an element is dropped anywhere other than its origin <em>(where it was initially dragged from)</em></div>
      </div>
      <div class='container' [dragula]='"second-bag"'>
        <div>If the element gets removed from the DOM as a result of dropping outside of any containers, a <code>remove</code> event gets fired</div>
        <div>A <code>cancel</code> event is fired when an element would be dropped onto an invalid target, but retains its original placement instead</div>
        <div>The <code>over</code> event fires when you drag something over a container, and <code>out</code> fires when you drag it away from the container</div>
        <div>Lastly, a <code>dragend</code> event is fired whenever a drag operation ends, regardless of whether it ends in a cancellation, removal, or drop</div>
      </div>
    </div>
    <pre>
      <code>
&lt;div [dragula]=&#039;&quot;second-bag&quot;&#039;&gt;&lt;/div&gt;
&lt;div [dragula]=&#039;&quot;second-bag&quot;&#039;&gt;&lt;/div&gt;

class ExampleB {

  constructor(private dragulaService: DragulaService) {
    dragulaService.drag.subscribe((value) => {
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value) => {
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      this.onOut(value.slice(1));
    });
  }

  private hasClass(el: any, name: string) {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  private addClass(el: any, name: string) {
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  private removeClass(el: any, name: string) {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }

  private onDrag(args) {
    let [e, el] = args;
    this.removeClass(e, 'ex-moved');
  }

  private onDrop(args) {
    let [e, el] = args;
    this.addClass(e, 'ex-moved');
  }

  private onOver(args) {
    let [e, el, container] = args;
    this.addClass(el, 'ex-over');
  }

  private onOut(args) {
    let [e, el, container] = args;
    this.removeClass(el, 'ex-over');
  }
}
      </code>
    </pre>
  </div>
  `
})
export class ExampleB {

  constructor(private dragulaService: DragulaService) {
    dragulaService.drag.subscribe((value) => {
      //console.log(`drag: ${value[0]}`); // value[0] will always be bag name
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      //console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value) => {
      //console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      //console.log(`out: ${value[0]}`);
      this.onOut(value.slice(1));
    });
  }

  private hasClass(el: any, name: string) {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  private addClass(el: any, name: string) {
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  private removeClass(el: any, name: string) {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }

  private onDrag(args) {
    let [e, el] = args;
    this.removeClass(e, 'ex-moved');
  }

  private onDrop(args) {
    let [e, el] = args;
    this.addClass(e, 'ex-moved');
  }

  private onOver(args) {
    let [e, el, container] = args;
    this.addClass(el, 'ex-over');
  }

  private onOut(args) {
    let [e, el, container] = args;
    this.removeClass(el, 'ex-over');
  }
}

@Component({
  selector: 'another-example',
  directives: [Dragula],
  viewProviders: [DragulaService],
  template:`
  <div class='parent'>
    <label for='hy'>Need to be able to quickly delete stuff when it spills out of the chosen containers? Note how you can easily sort the items in any containers by just dragging and dropping.</label>
    <div class='wrapper'>
      <div class='container' [dragula]='"third-bag"'>
        <div>Banana Boat</div>
        <div>Orange Juice</div>
        <div>Cuban Cigar</div>
        <div>Terrible Comedian</div>
        <div>Anxious Cab Driver</div>
        <div>Thriving Venture</div>
        <div>Calm Clam</div>
      </div>
    </div>
    <pre>
      <code>
&lt;div [dragula]=&#039;&quot;third-bag&quot;&#039;&gt;&lt;/div&gt;

class AnotherExample {
  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('third-bag', {
      removeOnSpill: true
    });
  }
}
      </code>
    </pre>
  </div>
  `
})
export class AnotherExample {
  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('third-bag', {
      removeOnSpill: true
    });
  }
}

@Component({
  selector: 'such-example',
  directives: [Dragula],
  viewProviders: [DragulaService],
  template:`
  <div class='parent'>
    <label for='hy'>By default, dropping an element outside of any known containers will keep the element in the last place it went over. You can make elements go back to origin if they're dropped outside of known containers, too.</label>
    <div class='wrapper'>
      <div class='container' [dragula]='"fourth-bag"'>
        <div>Moving items between containers works as usual</div>
        <div>If you try to drop an item outside of any containers, though, it'll retain its original position</div>
        <div>When that happens, a <code>cancel</code> event will be raised</div>
      </div>
      <div class='container' [dragula]='"fourth-bag"'>
        <div>Note that the dragged element will go back to the place you originally dragged it from, even if you move it over other containers</div>
        <div>This is useful if you want to ensure drop events only happen when the user intends for them to happen explicitly, avoiding surprises</div>
      </div>
    </div>
    <pre>
      <code>
&lt;div [dragula]=&#039;&quot;fourth-bag&quot;&#039;&gt;&lt;/div&gt;
&lt;div [dragula]=&#039;&quot;fourth-bag&quot;&#039;&gt;&lt;/div&gt;

class SuchExample {
  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('fourth-bag', {
      revertOnSpill: true
    });
  }
}
      </code>
    </pre>
  </div>
  `
})
export class SuchExample {
  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('fourth-bag', {
      revertOnSpill: true
    });
  }
}

@Component({
  selector: 'very-example',
  directives: [Dragula],
  viewProviders: [DragulaService],
  template:`
  <div class='parent'>
    <label for='hy'>Copying stuff is common too, so we made it easy for you.</label>
    <div class='wrapper'>
      <div class='container' [dragula]='"fifth-bag"'>
        <div>When elements are copyable, they can't be sorted in their origin container</div>
        <div>Copying prevents original elements from being dragged. A copy gets created and <em>that</em> gets dragged instead</div>
        <div>Whenever that happens, a <code>cloned</code> event is raised</div>
      </div>
      <div class='container' [dragula]='"fifth-bag"'>
        <div>Note that the clones get destroyed if they're not dropped into another container</div>
        <div>You'll be dragging a copy, so when they're dropped into another container you'll see the duplication.</div>
      </div>
    </div>
    <pre>
      <code>
&lt;div [dragula]=&#039;&quot;fifth-bag&quot;&#039;&gt;&lt;/div&gt;
&lt;div [dragula]=&#039;&quot;fifth-bag&quot;&#039;&gt;&lt;/div&gt;

class VeryExample {
  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('fifth-bag', {
      copy: true
    });
  }
}
      </code>
    </pre>
  </div>
  `
})
export class VeryExample {
  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('fifth-bag', {
      copy: true
    });
  }
}

@Component({
  selector: 'much-example',
  directives: [Dragula],
  viewProviders: [DragulaService],
  template:`
  <div class='parent'>
    <label for='hy'>Drag handles float your cruise?</label>
    <div class='wrapper'>
      <div class='container' [dragula]='"sixth-bag"'>
        <div><span class='handle'>+</span>Move me, but you can use the plus sign to drag me around.</div>
        <div><span class='handle'>+</span>Note that <code>handle</code> element in the <code>moves</code> handler is just the original event target.</div>
      </div>
      <div class='container' [dragula]='"sixth-bag"'>
        <div><span class='handle'>+</span>This might also be useful if you want multiple children of an element to be able to trigger a drag event.</div>
        <div><span class='handle'>+</span>You can also use the <code>moves</code> option to determine whether an element can be dragged at all from a container, <em>drag handle or not</em>.</div>
      </div>
    </div>
    <pre>
      <code>
&lt;div [dragula]=&#039;&quot;sixth-bag&quot;&#039;&gt;&lt;/div&gt;
&lt;div [dragula]=&#039;&quot;sixth-bag&quot;&#039;&gt;&lt;/div&gt;

class MuchExample {
  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('sixth-bag', {
      moves: function (el, container, handle) {
        return handle.className === 'handle';
      }
    });
  }
}
      </code>
    </pre>
    <div>There are a few similar mechanisms to determine whether an element can be dragged from a certain container <a href='https://github.com/bevacqua/dragula#optionsmoves'>(<code>moves</code>)</a>, whether an element can be dropped into a certain container at a certain position <a href='https://github.com/bevacqua/dragula#optionsaccepts'>(<code>accepts</code>)</a>, and whether an element is able to originate a drag event <a href='https://github.com/bevacqua/dragula#optionsinvalid'>(<code>invalid</code>)</a>.</div>
  </div>
  `
})
export class MuchExample {
  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('sixth-bag', {
      moves: function (el, container, handle) {
        return handle.className === 'handle';
      }
    });
  }
}

@Component({
  selector: 'wow-example',
  directives: [Dragula],
  viewProviders: [DragulaService],
  template:`
  <div class='parent'>
    <label><strong>Click or Drag!</strong> Fires a click when the mouse button is released before a <code>mousemove</code> event, otherwise a drag event is fired. No extra configuration is necessary.</label>
    <div class='wrapper'>
      <div class='container' [dragula]='"seventh-bag"'>
        <div (click)='onclick("one")'>{{clicked.one ? "Clicked!" : "Clicking on these elements triggers a regular click event you can listen to."}}</div>
        <div (click)='onclick("two")'>{{clicked.two ? "Clicked!" : "Try dragging or clicking on this element."}}</div>
        <div (click)='onclick("three")'>{{clicked.three ? "Clicked!" : "Note how you can click normally?"}}</div>
        <div (click)='onclick("four")'>{{clicked.four ? "Clicked!" : "Drags don't trigger click events."}}</div>
        <div (click)='onclick("five")'>{{clicked.five ? "Clicked!" : "Clicks don't end up in a drag, either."}}</div>
        <div (click)='onclick("six")'>{{clicked.six ? "Clicked!" : "This is useful if you have elements that can be both clicked or dragged."}}</div>
        <div (click)='onclick("seven")'>{{clicked.seven ? "ZOMG, THAT TICKLES! PLEASE. STOP." : "Business as usual."}}</div>
      </div>
    </div>
    <pre>
      <code>
&lt;div [dragula]=&#039;&quot;seventh-bag&quot;&#039;&gt;&lt;/div&gt;

class WowExample {
  public clicked: any = {
    'one': false,
    'two': false,
    'three': false,
    'four': false,
    'five': false,
    'six': false,
    'seven': false
  };

  public onclick(key): void {
    this.clicked[key] = true;
    setTimeout(() => {
      this.clicked[key] = false;
    }, 2000);
  }
}
      </code>
    </pre>
  </div>
  `
})
export class WowExample {
  public clicked: any = {
    'one': false,
    'two': false,
    'three': false,
    'four': false,
    'five': false,
    'six': false,
    'seven': false
  };

  public onclick(key): void {
    this.clicked[key] = true;
    setTimeout(() => {
      this.clicked[key] = false;
    }, 2000);
  }
}

@Component({
  selector: 'repeat-example',
  directives: [Dragula],
  viewProviders: [DragulaService],
  template:`
  <div class='parent'>
    <label for='hy'><strong>Angular-specific example.</strong> Fancy some <code>ngFor</code>?</label>
    <div class='wrapper'>
      <div class='container' [dragula]='"another-bag"' [dragulaModel]='many'>
        <div *ngFor='#text of many' [innerHtml]='text'></div>
      </div>
      <div class='container' [dragula]='"another-bag"' [dragulaModel]='many2'>
        <div *ngFor='#text of many2' [innerHtml]='text'></div>
      </div>
    </div>
    <div class='wrapper'>
      <div class='container'><pre>{{many | json}}</pre></div>
      <div class='container'><pre>{{many2 | json}}</pre></div>
    </div>
    <pre>
      <code>
&lt;div class='wrapper'&gt;
  &lt;div class='container' [dragula]='&quot;another-bag&quot;' [dragulaModel]='many'&gt;
    &lt;div *ngFor='#text of many' [innerHtml]='text'&gt;&lt;/div&gt;
  &lt;/div&gt;
  &lt;div class='container' [dragula]='&quot;another-bag&quot;' [dragulaModel]='many2'&gt;
    &lt;div *ngFor='#text of many2' [innerHtml]='text'&gt;&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;

class RepeatExample {
  public many: Array&lt;string&gt; = ['The', 'possibilities', 'are', 'endless!'];
  public many2: Array&lt;string&gt; = ['Explore', 'them'];
}

constructor(private dragulaService: DragulaService) {
  dragulaService.dropModel.subscribe((value) => {
    this.onDropModel(value.slice(1));
  });
  dragulaService.removeModel.subscribe((value) => {
    this.onRemoveModel(value.slice(1));
  });
}

private onDropModel(args) {
  let [el, target, source] = args;
  // do something else
}

private onRemoveModel(args) {
  let [el, source] = args;
  // do something else
}
      </code>
    </pre>
  </div>
  `
})
export class RepeatExample {
  public many: Array<string> = ['The', 'possibilities', 'are', 'endless!'];
  public many2: Array<string> = ['Explore', 'them'];

  constructor(private dragulaService: DragulaService) {
    dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value.slice(1));
    });
    dragulaService.removeModel.subscribe((value) => {
      this.onRemoveModel(value.slice(1));
    });
  }

  private onDropModel(args) {
    let [el, target, source] = args;
    console.log('onDropModel:');
    console.log(el);
    console.log(target);
    console.log(source);
  }

  private onRemoveModel(args) {
    let [el, source] = args;
    console.log('onRemoveModel:');
    console.log(el);
    console.log(source);
  }
}

@Component({
  selector: 'nested-repeat-example',
  directives: [Dragula],
  viewProviders: [DragulaService],
  template:`
  <div class='parent'>
    <label for='hy'><strong>Angular-specific example.</strong> Fancy some nested <code>ngFor</code>?</label>
    <div class='wrapper'>
      <div class='container' *ngFor='#group of groups' [dragula]="'nested-bag'">
        <span>{{group.name}}</span>
        <div *ngFor='#item of group.items' [innerHtml]='item.name'></div>
      </div>
    </div>
    <pre>
      <code>
&lt;div class='wrapper'&gt;
  &lt;div class='container' *ngFor='#group of groups' [dragula]='&quot;nested-bag&quot;'&gt;
    &lt;div *ngFor='#item of group.items' [innerHtml]='item.name'&gt;&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;

class NestedRepeatExample {
  public groups: Array&lt;any&gt; = [
    {
      name: 'Group A',
      items: [{name: 'Item A'},{name: 'Item B'},{name: 'Item C'},{name: 'Item D'}]
    },
    {
      name: 'Group B',
      items: [{name: 'Item 1'},{name: 'Item 2'},{name: 'Item 3'},{name: 'Item 4'}]
    }
  ];
}
      </code>
    </pre>
  </div>
  `
})
export class NestedRepeatExample {
  public groups: Array<any> = [
    {
      name: 'Group A',
      items: [{name: 'Item A'},{name: 'Item B'},{name: 'Item C'},{name: 'Item D'}]
    },
    {
      name: 'Group B',
      items: [{name: 'Item 1'},{name: 'Item 2'},{name: 'Item 3'},{name: 'Item 4'}]
    }
  ];
}

export const EXAMPLES: any[] = [ExampleA, ExampleB, AnotherExample, SuchExample, VeryExample, MuchExample, WowExample, RepeatExample, NestedRepeatExample];
