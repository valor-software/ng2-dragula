import { Directive, Input, Output, ElementRef, OnInit, OnChanges, EventEmitter, SimpleChange } from '@angular/core';
import { DragulaService } from './dragula.provider';
import { dragula } from './dragula.class';

@Directive({ selector: '[dragula]' })
export class DragulaDirective implements OnInit, OnChanges {
  @Input() public dragula: string;
  @Input() public dragulaModel: any;
  @Input() public dragulaOptions: any;

  @Output() public dragulaOnDrop: EventEmitter<any> = new EventEmitter<any>();
  @Output() public dragulaOnDrag: EventEmitter<any> = new EventEmitter<any>();
  @Output() public dragulaOnDragend: EventEmitter<any> = new EventEmitter<any>();
  @Output() public dragulaOnCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() public dragulaOnRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() public dragulaOnShadow: EventEmitter<any> = new EventEmitter<any>();
  @Output() public dragulaOnOver: EventEmitter<any> = new EventEmitter<any>();
  @Output() public dragulaOnOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() public dragulaOnCloned: EventEmitter<any> = new EventEmitter<any>();

  private container: any;
  private drake: any;

  private el: ElementRef;
  private dragulaService: DragulaService;

  public constructor(el: ElementRef, dragulaService: DragulaService) {
    this.el = el;
    this.dragulaService = dragulaService;
    this.container = el.nativeElement;
  }

  public ngOnInit(): void {
    // console.log(this.bag);
    let bag = this.dragulaService.find(this.dragula);
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
      this.drake = dragula([this.container], Object.assign({}, this.dragulaOptions));

      this.drake.on('drop', (...args: any[]): void => {
        this.dragulaOnDrop.emit(args);
      });

      this.drake.on('drag', (...args: any[]): void => {
        this.dragulaOnDrag.emit(args);
      });
      this.drake.on('dragend', (...args: any[]): void => {
        this.dragulaOnDragend.emit(args);
      });
      this.drake.on('cancel', (...args: any[]): void => {
        this.dragulaOnCancel.emit(args);
      });
      this.drake.on('remove', (...args: any[]): void => {
        this.dragulaOnRemove.emit(args);
      });
      this.drake.on('shadow', (...args: any[]): void => {
        this.dragulaOnShadow.emit(args);
      });
      this.drake.on('over', (...args: any[]): void => {
        this.dragulaOnOver.emit(args);
      });
      this.drake.on('out', (...args: any[]): void => {
        this.dragulaOnOut.emit(args);
      });
      this.drake.on('cloned', (...args: any[]): void => {
        this.dragulaOnCloned.emit(args);
      });

      checkModel();
      this.dragulaService.add(this.dragula, this.drake);
    }
  }

  public ngOnChanges(changes: { dragulaModel?: SimpleChange }): void {
    // console.log('dragula.directive: ngOnChanges');
    // console.log(changes);
    if (changes && changes.dragulaModel) {
      if (this.drake) {
        if (this.drake.models) {
          let modelIndex = this.drake.models.indexOf(changes.dragulaModel.previousValue);
          this.drake.models.splice(modelIndex, 1, changes.dragulaModel.currentValue);
        } else {
          this.drake.models = [changes.dragulaModel.currentValue];
        }
      }
    }
  }
}
