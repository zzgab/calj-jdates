import { ParashaSpecial } from "./Parasha";
import { Sidra } from "./Sidra";

export interface ParashaLocalizer {
  special(specialParasha: ParashaSpecial | undefined): string;
  sidra(parshiot: Sidra[] | undefined): string;
}
