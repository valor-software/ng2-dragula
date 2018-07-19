// import { DragulaOptions as OriginalOptions } from 'dragula';

// the copy prop in @types/dragula are just booleans, which is severely limiting.
// and it doesn't have copySortSource.
// TODO: PR this against @types/dragula
export interface DragulaOptions<T = any> {

  // note: it's possible you could wrap DragulaOptions such that
  // the important functions would get model data included.
  // that wouldn't be a breaking change if you appended the args to the callbacks.

  /* from @types/dragula */
  containers?: Element[];
  isContainer?: (el?: Element) => boolean;
  moves?: (el?: Element, container?: Element, handle?: Element) => boolean;
  accepts?: (el?: Element, target?: Element, source?: Element, sibling?: Element) => boolean;
  invalid?: (el?: Element, target?: Element) => boolean;
  direction?: string;
  revertOnSpill?: boolean;
  removeOnSpill?: boolean;
  delay?: boolean | number;
  mirrorContainer?: Element;

  /* modifications */
  copy?: boolean | ((el: Element, source: Element) => boolean);
  copySortSource?: boolean | ((el: Element, source: Element) => boolean);

  copyItem?: (item: T) => T;
}
