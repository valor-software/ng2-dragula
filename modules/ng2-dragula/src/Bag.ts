import { DrakeWithModels } from "./DrakeWithModels";

export interface Bag {
  name: string;
  drake: DrakeWithModels;
  initEvents?: boolean;
}
