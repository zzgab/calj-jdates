import { GDate } from "./GDate";
import { HDate, HDateMonth } from "./HDate";

export enum Rite {
  SEFARADI,
  ASHKENAZI,
}

export enum AnniversaryType {
  BIRTHDAY,
  AZCARA,
}

export class Anniversary {
  constructor(
    date: Date | HDate | GDate,
    private type: AnniversaryType,
    private rite: Rite = Rite.SEFARADI
  ) {
    this.hdate = HDate.make(date as Date);
  }

  calc(hyear: number): HDate | null {
    // Can't travel back in time
    if (hyear <= this.hdate.getYear()) {
      return null;
    }

    // Source date on 30 Cheshvan, target year Cheshvan has only 29 days
    if (
      this.hdate.getMonth() === HDateMonth.CHESHVAN &&
      this.hdate.getDay() === 30 &&
      HDate.monthLength(hyear, HDateMonth.CHESHVAN) === 29
    ) {
      if (this.type === AnniversaryType.BIRTHDAY) {
        return HDate.make(1, HDateMonth.KISLEV, hyear);
      }
      // If on the year that followed the Petira, Cheshvan had 30 days -> 1Kislev:
      if (
        HDate.monthLength(this.hdate.getYear() + 1, HDateMonth.CHESHVAN) == 30
      ) {
        return HDate.make(1, HDateMonth.KISLEV, hyear);
      } else {
        return HDate.make(29, HDateMonth.CHESHVAN, hyear);
      }
    }

    // Source date on 30 Kislev, target year Kislev has only 29 days
    if (
      this.hdate.getMonth() === HDateMonth.KISLEV &&
      this.hdate.getDay() === 30 &&
      HDate.monthLength(hyear, HDateMonth.KISLEV) === 29
    ) {
      if (this.type === AnniversaryType.BIRTHDAY) {
        return HDate.make(1, HDateMonth.TEVET, hyear);
      }
      // If on the year that followed the Petira, Kislev had 30 days -> 1Tevet:
      if (
        HDate.monthLength(this.hdate.getYear() + 1, HDateMonth.KISLEV) == 30
      ) {
        return HDate.make(1, HDateMonth.TEVET, hyear);
      } else {
        return HDate.make(29, HDateMonth.KISLEV, hyear);
      }
    }

    //Source date Adar simple year, target leap year -> Adar2
    if (
      this.hdate.getMonth() === HDateMonth.ADAR &&
      !this.hdate.isEmbolismic() &&
      HDate.embolismicYear(hyear)
    ) {
      return this.type === AnniversaryType.AZCARA &&
        this.rite === Rite.ASHKENAZI
        ? HDate.make(this.hdate.getDay(), HDateMonth.ADAR, hyear)
        : HDate.make(this.hdate.getDay(), HDateMonth.ADAR2, hyear);
    }

    return HDate.make(this.hdate.getDay(), this.hdate.getMonth(), hyear);
  }

  private readonly hdate: HDate;
}
