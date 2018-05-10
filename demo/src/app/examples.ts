/* tslint:disable */
import { Component } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'example-a',
  templateUrl: './templates/example-a.html'
})
export class ExampleAComponent {
}

@Component({
  selector: 'example-b',
  templateUrl: './templates/example-b.html'
})
export class ExampleBComponent {
  public constructor(private dragulaService:DragulaService) {
    dragulaService.drag.subscribe((value:any) => {
      // console.log(`drag: ${value[0]}`); // value[0] will always be bag name
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value:any) => {
      // console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value:any) => {
      // console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value:any) => {
      // console.log(`out: ${value[0]}`);
      this.onOut(value.slice(1));
    });
  }

  private hasClass(el:any, name:string):any {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  private addClass(el:any, name:string):void {
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  private removeClass(el:any, name:string):void {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }

  private onDrag(args:any):void {
    let [e] = args;
    this.removeClass(e, 'ex-moved');
  }

  private onDrop(args:any):void {
    let [e] = args;
    this.addClass(e, 'ex-moved');
  }

  private onOver(args:any):void {
    let [el] = args;
    this.addClass(el, 'ex-over');
  }

  private onOut(args:any):void {
    let [el] = args;
    this.removeClass(el, 'ex-over');
  }
}

@Component({
  selector: 'another-example',
  templateUrl: './templates/another-example.html'
})
export class AnotherExampleComponent {
  public constructor(private dragulaService:DragulaService) {
    dragulaService.setOptions('third-bag', {
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
    dragulaService.setOptions('fourth-bag', {
      revertOnSpill: true
    });
  }
}

@Component({
  selector: 'very-example',
  templateUrl: './templates/very-example.html'
})
export class VeryExampleComponent {
  public constructor(private dragulaService:DragulaService) {
    dragulaService.setOptions('fifth-bag', {
      copy: true
    });
  }
}

@Component({
  selector: 'much-example',
  templateUrl: './templates/much-example.html'
})
export class MuchExampleComponent {
  public constructor(private dragulaService:DragulaService) {
    dragulaService.setOptions('sixth-bag', {
      moves: function (el:any, container:any, handle:any):any {
        console.log(el, container);
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

@Component({
  selector: 'repeat-example',
  templateUrl: './templates/repeat-example.html'
})
export class RepeatExampleComponent {
  public many:Array<string> = ['The', 'possibilities', 'are', 'endless!'];
  public many2:Array<string> = ['Explore', 'them'];

  public constructor(private dragulaService:DragulaService) {
    dragulaService.dropModel.subscribe((value:any) => {
      this.onDropModel(value.slice(1));
    });
    dragulaService.removeModel.subscribe((value:any) => {
      this.onRemoveModel(value.slice(1));
    });
  }

  private onDropModel(args:any):void {
    let [el, target, source] = args;
    console.log('onDropModel:');
    console.log(el);
    console.log(target);
    console.log(source);
  }

  private onRemoveModel(args:any):void {
    let [el, source] = args;
    console.log('onRemoveModel:');
    console.log(el);
    console.log(source);
  }
}

export class Property {
  constructor(public name: string, public value: string){}
  clone(): Property{
    return new Property(this.name + "-copy", this.value);
  }
}

@Component({
  selector: 'clone-example',
  templateUrl: './templates/clone-example.html'
})
export class CloneExampleComponent {
  public source:Array<Property> = new Array(new Property("a", "value A"), new Property("b", "value B"));
  public target:Array<Property> = new Array();

  public constructor(private dragulaService:DragulaService) {
    dragulaService.setOptions('clone-bag', {
      copy: true
    });
  }
}

@Component({
  selector: 'nested-repeat-example',
  templateUrl: './templates/nested-repeat-example.html'
})
export class NestedRepeatExampleComponent {
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
  VeryExampleComponent,
  MuchExampleComponent,
  WowExampleComponent,
  RepeatExampleComponent,
  CloneExampleComponent,
  NestedRepeatExampleComponent
];
