import { DrakeWithModels } from "./DrakeWithModels";
import { DragulaOptions } from "./DragulaOptions";

export class Group {
  public initEvents: boolean = false;
  constructor(
    public name: string,
    public drake: DrakeWithModels,
    public options: DragulaOptions
  ) {}
}
