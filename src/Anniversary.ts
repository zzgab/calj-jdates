import { GDate } from "./GDate";
import { HDate, HDateMonth } from "./HDate";

export class Anniversary {
  constructor(date: Date | HDate | GDate) {
    this.hdate = HDate.make(date as Date);
  }

  calcBirthday(hyear: number): HDate | null {
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
      return HDate.make(1, HDateMonth.KISLEV, hyear);
    }

    // Source date on 30 Kislev, target year Kislev has only 29 days
    if (
      this.hdate.getMonth() === HDateMonth.KISLEV &&
      this.hdate.getDay() === 30 &&
      HDate.monthLength(hyear, HDateMonth.KISLEV) === 29
    ) {
      return HDate.make(1, HDateMonth.TEVET, hyear);
    }

    //Source date Adar simple year, target leap year -> Adar2
    if (
      this.hdate.getMonth() === HDateMonth.ADAR &&
      !this.hdate.isEmbolismic() &&
      HDate.embolismicYear(hyear)
    ) {
      return HDate.make(this.hdate.getDay(), HDateMonth.ADAR2, hyear);
    }

    return HDate.make(this.hdate.getDay(), this.hdate.getMonth(), hyear);
  }

  private readonly hdate: HDate;
}
