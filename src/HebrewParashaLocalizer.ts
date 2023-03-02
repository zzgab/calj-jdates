import { ParashaLocalizer } from "./ParashaLocalizer";
import { ParashaSpecial } from "./Parasha";
import { Sidra } from "./Sidra";

const specialParashaNames: Record<ParashaSpecial, string> = {
  [ParashaSpecial.SHEQALIM]: "שקלים",
  [ParashaSpecial.ZACHOR]: "זכור",
  [ParashaSpecial.PARAH]: "פרה",
  [ParashaSpecial.HACHODESH]: "החודש",
  [ParashaSpecial.HAGADOL]: "הגדול",
};

export class HebrewParashaLocalizer implements ParashaLocalizer {
  special(specialParasha: ParashaSpecial | undefined): string {
    return specialParasha ? specialParashaNames[specialParasha] : "";
  }

  sidra(parshiot: Sidra[] | undefined): string {
    return parshiot
      ? parshiot.length === 1
        ? parshiot[0]
        : `${parshiot[0]} - ${parshiot[1]}`
      : "";
  }
}
