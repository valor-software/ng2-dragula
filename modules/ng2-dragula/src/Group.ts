import { DrakeWithModels } from "./DrakeWithModels";

export class Group {
  public initEvents: boolean = false;
  constructor(
    public name: string,
    public drake: DrakeWithModels,
  ) {}
}
