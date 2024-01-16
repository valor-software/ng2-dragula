import { Component, OnDestroy } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

const repeatCode = `
<div class='container' [dragula]="MANY_ITEMS" [(dragulaModel)]='many'>
    <div *ngFor='let text of many' [innerHtml]='text'></div>
</div>
<div class='container' [dragula]="MANY_ITEMS" [(dragulaModel)]='many2'>
    <div *ngFor='let text of many2' [innerHtml]='text'></div>
</div>

export class NgForComponent {
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
  selector: 'ex-09-ngfor',
  templateUrl: './09-ngfor.component.html',
  styles: [
    `
      .container {
        min-width: 200px;
      }
    `,
  ],
})
export class NgForComponent implements OnDestroy {
  code = repeatCode;
  MANY_ITEMS = 'MANY_ITEMS';
  public many = ['The', 'possibilities', 'are', 'endless!'];
  public many2 = ['Explore', 'them'];

  subs = new Subscription();

  public constructor(private dragulaService: DragulaService) {
    this.subs.add(
      dragulaService
        .dropModel(this.MANY_ITEMS)
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
    this.subs.add(
      dragulaService
        .removeModel(this.MANY_ITEMS)
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
