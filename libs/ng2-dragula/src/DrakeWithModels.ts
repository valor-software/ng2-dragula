import { Drake } from 'dragula';

export interface DrakeWithModels extends Drake {
  models?: any[][];

  on(event: 'drag', listener: (el: Element, source: Element) => void): Drake;
  on(event: 'dragend', listener: (el: Element) => void): Drake;
  on(
    event: 'drop',
    listener: (
      el: Element,
      target: Element,
      source: Element,
      sibling: Element
    ) => void
  ): Drake;
  on(
    event: 'cancel' | 'remove' | 'shadow' | 'over' | 'out',
    listener: (el: Element, container: Element, source: Element) => void
  ): Drake;
  on(
    event: 'cloned',
    listener: (
      clone: Element,
      original: Element,
      type: 'mirror' | 'copy'
    ) => void
  ): Drake;

  on(
    event: 'dropModel',
    listener: ([
      el,
      target,
      source,
      sibling,
      item,
      sourceModel,
      targetModel,
      sourceIndex,
      targetIndex,
    ]: [
      Element,
      Element,
      Element,
      Element,
      any,
      any[],
      any[],
      number,
      number
    ]) => void
  ): Drake;

  on(
    event: 'removeModel',
    listener: ([el, container, source, item, sourceModel, sourceIndex]: [
      Element,
      Element,
      Element,
      any,
      any[],
      number
    ]) => void
  ): Drake;
}
