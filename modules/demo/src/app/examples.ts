/* tslint:disable */
import { Component } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

@Component({
  selector: 'example-a',
  templateUrl: './templates/example-a.html'
})
export class ExampleAComponent {
  code = `
  <div dragula="DRAGULA_FACTS">
    <div>...</div>
    <div>...</div>
  </div>
  <div dragula="DRAGULA_FACTS">
    <div>...</div>
    <div>...</div>
  </div>
  `;
}

let eventsCode = `
<div dragula="DRAGULA_EVENTS"> ... </div>
<div dragula="DRAGULA_EVENTS"> ... </div>

export class ExampleBComponent {
  BAG = "DRAGULA_EVENTS";
  subs = new Subscription();
  public constructor(private dragulaService:DragulaService) {
    this.subs.add(dragulaService.drag(this.BAG)
      .subscribe(({ el }) => {
        this.removeClass(el, 'ex-moved');
      })
    );
    this.subs.add(dragulaService.drop(this.BAG)
      .subscribe(({ el }) => {
        this.addClass(el, 'ex-moved');
      })
    );
    this.subs.add(dragulaService.over(this.BAG)
      .subscribe(({ el, container }) => {
        console.log('over', container);
        this.addClass(container, 'ex-over');
      })
    );
    this.subs.add(dragulaService.out(this.BAG)
      .subscribe(({ el, container }) => {
        console.log('out', container);
        this.removeClass(container, 'ex-over');
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  addClass() { ... }
  removeClass() { ... }
}
`;

@Component({
  selector: 'example-b',
  templateUrl: './templates/example-b.html'
})
export class ExampleBComponent {
  template = eventsCode;
  BAG = "DRAGULA_EVENTS";
  subs = new Subscription();
  public constructor(private dragulaService:DragulaService) {
    this.subs.add(dragulaService.drag(this.BAG)
      .subscribe(({ el }) => {
        this.removeClass(el, 'ex-moved');
      })
    );
    this.subs.add(dragulaService.drop(this.BAG)
      .subscribe(({ el }) => {
        this.addClass(el, 'ex-moved');
      })
    );
    this.subs.add(dragulaService.over(this.BAG)
      .subscribe(({ el, container }) => {
        this.addClass(container, 'ex-over');
      })
    );
    this.subs.add(dragulaService.out(this.BAG)
      .subscribe(({ el, container }) => {
        this.removeClass(container, 'ex-over');
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private hasClass(el: Element, name: string):any {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  private addClass(el: Element, name: string):void {
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  private removeClass(el: Element, name: string):void {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }

}

@Component({
  selector: 'another-example',
  templateUrl: './templates/another-example.html'
})
export class AnotherExampleComponent {
  public constructor(private dragulaService:DragulaService) {
    dragulaService.setOptions('REMOVABLE', {
      removeOnSpill: true
    });
  }
}

@Component({
  selector: 'such-example',
  templateUrl: './templates/such-example.html'
})
export class SuchExampleComponent {
  public constructor(private dragulaService:DragulaService) {
    dragulaService.setOptions('REVERT', {
      revertOnSpill: true
    });
  }
}

let copyCode = `
<div class='container' dragula="COPYABLE" id="left">
  <div>...</div>
</div>
<div class='container' dragula="COPYABLE" id="right">
  <div>...</div>
</div>

export class CopyComponent {
  public constructor(private dragulaService:DragulaService) {
    dragulaService.setOptions('COPYABLE', {
      copy: (el, source) => {
        return source.id === 'left';
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target.id !== 'left';
      }
    });
  }
}
`;

@Component({
  selector: 'copy-example',
  templateUrl: './templates/very-example.html'
})
export class CopyComponent {
  code = copyCode;
  public constructor(private dragulaService:DragulaService) {
    dragulaService.setOptions('COPYABLE', {
      copy: (el, source) => {
        return source.id === 'left';
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target.id !== 'left';
      }
    });
  }
}

@Component({
  selector: 'much-example',
  templateUrl: './templates/much-example.html',
  styles: [`
  .container div {
    cursor: initial !important;
  }
  `]
})
export class MuchExampleComponent {
  public constructor(private dragulaService:DragulaService) {
    dragulaService.setOptions('HANDLES', {
      moves: (el, container, handle) => {
        return handle.className === 'handle';
      }
    });
  }
}

@Component({
  selector: 'wow-example',
  templateUrl: './templates/wow-example.html'
})
export class WowExampleComponent {
  public clicked:any = {
    'one': false,
    'two': false,
    'three': false,
    'four': false,
    'five': false,
    'six': false,
    'seven': false
  };

  public onclick(key:any):void {
    this.clicked[key] = true;
    setTimeout(() => {
      this.clicked[key] = false;
    }, 2000);
  }
}

const repeatCode = `
<div class='container' [dragula]="MANY_ITEMS" [(dragulaModel)]='many'>
    <div *ngFor='let text of many' [innerHtml]='text'></div>
</div>
<div class='container' [dragula]="MANY_ITEMS" [(dragulaModel)]='many2'>
    <div *ngFor='let text of many2' [innerHtml]='text'></div>
</div>

export class RepeatExampleComponent {
  MANY_ITEMS = 'MANY_ITEMS';
  public many = ['The', 'possibilities', 'are', 'endless!'];
  public many2 = ['Explore', 'them'];

  subs = new Subscription();

  public constructor(private dragulaService:DragulaService) {
    this.subs.add(dragulaService.dropModel(this.MANY_ITEMS)
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        console.log('dropModel:');
        console.log(el);
        console.log(source);
        console.log(target);
        console.log(sourceModel);
        console.log(targetModel);
        console.log(item);
      })
    );
    this.subs.add(dragulaService.removeModel(this.MANY_ITEMS)
      .subscribe(({ el, source, item, sourceModel }) => {
        console.log('removeModel:');
        console.log(el);
        console.log(source);
        console.log(sourceModel);
        console.log(item);
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
`;

@Component({
  selector: 'repeat-example',
  templateUrl: './templates/repeat-example.html',
  styles: [`
  .container { min-width: 200px; }
  `]
})
export class RepeatExampleComponent {
  template = repeatCode;
  MANY_ITEMS = 'MANY_ITEMS';
  public many = ['The', 'possibilities', 'are', 'endless!'];
  public many2 = ['Explore', 'them'];

  subs = new Subscription();

  public constructor(private dragulaService:DragulaService) {
    this.subs.add(dragulaService.dropModel(this.MANY_ITEMS)
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        console.log('dropModel:');
        console.log(el);
        console.log(source);
        console.log(target);
        console.log(sourceModel);
        console.log(targetModel);
        console.log(item);
      })
    );
    this.subs.add(dragulaService.removeModel(this.MANY_ITEMS)
      .subscribe(({ el, source, item, sourceModel }) => {
        console.log('removeModel:');
        console.log(el);
        console.log(source);
        console.log(sourceModel);
        console.log(item);
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}

const nestedExampleCode = `
<div class="wrapper" dragula="COLUMNS" [(dragulaModel)]="groups">
    <div class="container" *ngFor="let group of groups">
      <span class="group-handle">{{group.name}}</span>
      <div class="container" dragula="ITEMS" [(dragulaModel)]="group.items">
        <div *ngFor="let item of group.items" [innerHtml]="item.name"></div>
      </div>
    </div>
</div>

export class NestedRepeatExample {

  constructor(private dragulaService: DragulaService) {
    this.dragulaService.setOptions("COLUMNS", {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === "group-handle"
    });
  }

  public groups:Array<any> = [
    {
      name: 'Group A',
      items: [{name: 'Item A'}, {name: 'Item B'}, {name: 'Item C'}, {name: 'Item D'}]
    },
    {
      name: 'Group B',
      items: [{name: 'Item 1'}, {name: 'Item 2'}, {name: 'Item 3'}, {name: 'Item 4'}]
    }
  ];
}
`;

@Component({
  selector: 'nested-repeat-example',
  templateUrl: './templates/nested-repeat-example.html',
  styles: [`
  .container span {
    display: block;
    padding: 8px;
  }
  `]
})
export class NestedRepeatExampleComponent {
  example = nestedExampleCode;

  constructor(private dragulaService: DragulaService) {
    this.dragulaService.setOptions("COLUMNS", {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === "group-handle"
    });
  }

  public groups:Array<any> = [
    {
      name: 'Group A',
      items: [{name: 'Item A'}, {name: 'Item B'}, {name: 'Item C'}, {name: 'Item D'}]
    },
    {
      name: 'Group B',
      items: [{name: 'Item 1'}, {name: 'Item 2'}, {name: 'Item 3'}, {name: 'Item 4'}]
    }
  ];
}

export const EXAMPLES:any[] = [
  ExampleAComponent,
  ExampleBComponent,
  AnotherExampleComponent,
  SuchExampleComponent,
  CopyComponent,
  MuchExampleComponent,
  WowExampleComponent,
  RepeatExampleComponent,
  NestedRepeatExampleComponent
];
