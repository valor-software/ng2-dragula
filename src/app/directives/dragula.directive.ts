import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  OnChanges,
  SimpleChange
} from '@angular/core';
import {DragulaService} from '../providers/dragula.provider';
import * as dragula from 'dragula';

@Directive({
  selector: '[dragula]'
})
export class DragulaDirective implements OnInit, OnChanges {
  @Input('dragula') public bag:string;
  @Input() public dragulaModel:any;
  private container:any;
  private drake:any;

  public constructor(private el:ElementRef, private dragulaService:DragulaService) {
    this.container = el.nativeElement;
  }

  public ngOnInit():void {
    // console.log(this.bag);
    let bag = this.dragulaService.find(this.bag);
    let checkModel = () => {
      if (this.dragulaModel) {
        if (this.drake.models) {
          this.drake.models.push(this.dragulaModel);
        } else {
          this.drake.models = [this.dragulaModel];
        }
      }
    };
    if (bag) {
      this.drake = bag.drake;
      checkModel();
      this.drake.containers.push(this.container);
    } else {
      this.drake = dragula({
        containers: [this.container]
      });
      checkModel();
      this.dragulaService.add(this.bag, this.drake);
    }
  }

  public ngOnChanges(changes:{[propName:string]:SimpleChange}):void {
    // console.log('dragula.directive: ngOnChanges');
    // console.log(changes);
    if (changes && changes['dragulaModel']) {
      if (this.drake) {
        if (this.drake.models) {
          let modelIndex = this.drake.models.indexOf(changes['dragulaModel'].previousValue);
          this.drake.models.splice(modelIndex, 1, changes['dragulaModel'].currentValue);
        } else {
          this.drake.models = [changes['dragulaModel'].currentValue];
        }
      }
    }
  }
}
