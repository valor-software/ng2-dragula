import { Subject, BehaviorSubject, Observable, empty } from 'rxjs';
import { DragulaOptions } from '../DragulaOptions';
import { DragulaService } from '../components/dragula.service';
import { Group } from '../Group';
import { MockDrake } from '../MockDrake';

type Interface<T> = {
    [P in keyof T]: T[P]
}
export class StaticService implements Interface<DragulaService> {
  public drag: (groupName?: string) => Observable<{ name: string; el: Element; source: Element; }>
    = () => empty();
  public dragend: (groupName?: string) => Observable<{ name: string; el: Element; }>
    = () => empty();
  public drop: (groupName?: string) => Observable<{ name: string; el: Element; target: Element; source: Element; sibling: Element; }>
    = () => empty();
  public cancel: (groupName?: string) => Observable<{ name: string; el: Element; container: Element; source: Element; }>
    = () => empty();
  public remove: (groupName?: string) => Observable<{ name: string; el: Element; container: Element; source: Element; }>
    = () => empty();
  public shadow: (groupName?: string) => Observable<{ name: string; el: Element; container: Element; source: Element; }>
    = () => empty();
  public over: (groupName?: string) => Observable<{ name: string; el: Element; container: Element; source: Element; }>
    = () => empty();
  public out: (groupName?: string) => Observable<{ name: string; el: Element; container: Element; source: Element; }>
    = () => empty();
  public cloned: (groupName?: string) => Observable<{ name: string; clone: Element; original: Element; cloneType: "mirror" | "copy"; }>
    = () => empty();
  public dropModel: <T = any>(groupName?: string) => Observable<{ name: string; el: Element; target: Element; source: Element; sibling: Element; item: T; sourceModel: T[]; targetModel: T[]; sourceIndex: number; targetIndex: number; }>
    = () => empty();
  public removeModel: <T = any>(groupName?: string) => Observable<{ name: string; el: Element; container: Element; source: Element; item: T; sourceModel: T[]; sourceIndex: number; }>
    = () => empty();

  groups: { [k: string]: Group } = {};

  add(group: Group): Group {
    this.groups[group.name] = group;
    return group;
  }
  createGroup<T = any>(name: string, options: DragulaOptions<T>): Group {
    let group = new Group(name, new MockDrake([], options), options);
    return this.add(group);
  }
  find(name: string): Group {
    return this.groups[name];
  }
  destroy(name: string): void {
    let g = this.groups[name];
    g.drake.destroy();
    delete this.groups[name];
  }
  clear() {
    Object.keys(this.groups).forEach(k => this.destroy(k));
  }
}
