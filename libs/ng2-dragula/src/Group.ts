import { DrakeWithModels } from "./DrakeWithModels";
import { DragulaOptions } from "./DragulaOptions";

export class Group {
  public initEvents = false;
  constructor(
    public name: string,
    public drake: DrakeWithModels,
    public options: DragulaOptions
  ) {}
}
