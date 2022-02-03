import { Component } from "@angular/core";
import { DragulaService } from "ng2-dragula";
import { Subscription } from 'rxjs';

const code = `
<div dragula="DRAGULA_EVENTS"> ... </div>
<div dragula="DRAGULA_EVENTS"> ... </div>

export class EventsComponent {
  BAG = "DRAGULA_EVENTS";
  subs = new Subscription();
  public constructor(private dragulaService: DragulaService) {
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
  selector: 'ex-02-events',
  templateUrl: './02-events.component.html'
})
export class EventsComponent {
  code = code;
  BAG = "DRAGULA_EVENTS";
  subs = new Subscription();
  public constructor(private dragulaService: DragulaService) {
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

