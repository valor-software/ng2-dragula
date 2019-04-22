/// <reference types="dragula" />
import { DragulaOptions as OriginalOptions } from 'dragula';
export interface DragulaOptions<T = any> extends OriginalOptions {
    copySortSource?: boolean | ((el: Element, source: Element) => boolean);
    /** You must provide this if you are using `copy` with `[dragulaModel]`. It
     *  is responsible for cloning a model item. Your implementation should
     *  ensure `x !== copyItem(x)` -- so you must create a *new* object.
     **/
    copyItem?: (item: T) => T;
}
