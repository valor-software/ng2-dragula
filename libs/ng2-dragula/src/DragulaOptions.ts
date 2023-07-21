import { DragulaOptions as OriginalOptions } from 'dragula';

/* Use this instead of the DragulaOptions from '@types/dragula'. */
export interface DragulaOptions<T = any> extends Omit<OriginalOptions, 'copySortSource'> {

  copySortSource?: boolean | ((el: Element, source: Element) => boolean);

  /** You must provide this if you are using `copy` with `[dragulaModel]`. It
   *  is responsible for cloning a model item. Your implementation should
   *  ensure `x !== copyItem(x)` -- so you must create a *new* object.
   **/
  copyItem?: (item: T) => T;

}
