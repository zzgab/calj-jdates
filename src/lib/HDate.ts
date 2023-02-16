import { JDate } from "./JDate";
import { GDate } from "./GDate";

const uday = 25920; // 24 * 1080
const Tsyn = 765433; //29 * $uday + 12 * 1080 + 793
const Ttohu = 5604; //5 * 1080 + 204;
const Tgatarad = 9924; //9 * 1080 + 204;
const Tzaken = 19440; //18 * 1080;
const Tbetutkafot = 16789; //15 * 1080 + 589;

export enum HDateMonth {
  TISHRI = 7,
  CHESHVAN = 8,
  KISLEV = 9,
  TEVET = 10,
  SHVAT = 11,
  ADAR1 = 12,
  ADAR = 12,
  ADAR2 = 13,
  NISSAN = 1,
  IYAR = 2,
  SIVAN = 3,
  TAMUZ = 4,
  AV = 5,
  ELUL = 6,
}

export enum HDateYearType {
  CHASERA = 1,
  SDURA = 2,
  SHLEMA = 3,
}

const cacheRH = new Map<number, number>();

export class HDate extends JDate {
  private year: number;
  private month: number;
  private day: number;
  private yearType: number;

  public constructor(jdate: JDate) {
    super(jdate);
    this.calcFromHdn();
  }
  public static today(): HDate {
    return new HDate(GDate.today());
  }

  public getYear(): number {
    return this.year;
  }

  public getMonth(): number {
    return this.month;
  }

  public getDay(): number {
    return this.day;
  }

  private static roshHashanaDay(hyear: number): number {
    const result = cacheRH.get(hyear);
    if (result) {
      return result;
    }

    const Nmonths = Math.floor((235 * hyear - 234) / 19);
    const Tmolad = Nmonths * Tsyn + Ttohu;

    const days = Math.floor(Tmolad / uday);
    const parts = Tmolad - days * uday;
    const weekday = (1 + days) % 7;

    let adu = weekday == 0 || weekday == 3 || weekday == 5;
    const gatarad =
      !HDate.embolismicYear(hyear) && weekday == 2 && parts >= Tgatarad;
    const betutkafot =
      hyear != 1 &&
      HDate.embolismicYear(hyear - 1) &&
      weekday == 1 &&
      parts >= Tbetutkafot;

    let zaken = false;
    if (!adu && !gatarad && !betutkafot) {
      zaken = parts >= Tzaken;
      if (zaken) adu = weekday == 2 || weekday == 4 || weekday == 6;
    }

    const lResult =
      1 +
      days +
      (adu ? 1 : 0) +
      (gatarad ? 2 : 0) +
      (betutkafot ? 1 : 0) +
      (zaken ? 1 : 0);

    cacheRH.set(hyear, lResult);

    return lResult;
  }

  private calcFromHdn() {
    const hdn = this.getHdn();

    //Guess the approximate (greater) year of the specified Hebrew Day Number:
    let hyear = 1 + Math.floor((234 + (19 * (hdn + 1) * uday) / Tsyn) / 235);

    let rhnext = 0;
    let rh = HDate.roshHashanaDay(hyear);
    while (rh > hdn) {
      rhnext = rh;
      hyear--;
      rh = HDate.roshHashanaDay(hyear);
    }

    if (rhnext == 0) {
      rhnext = HDate.roshHashanaDay(hyear + 1);
    }

    this.yearType = ((rhnext - rh) % 10) - 2;
    this.month = HDateMonth.TISHRI;
    this.year = hyear;
    this.day = 1;

    let days = hdn - rh;
    let ml = this.getMonthLength();
    while (days >= ml) {
      this.month =
        this.month + 1 > this.getNumberOfMonths() ? 1 : this.month + 1;
      days -= ml;
      ml = this.getMonthLength();
    }
    this.day += days;
  }

  public getMonthLength(): number {
    return HDate.monthLength(this.year, this.month, this.yearType);
  }

  public getNumberOfMonths(): number {
    return HDate.monthsInYear(this.year);
  }
  public static monthsInYear(hyear: number): number {
    return HDate.embolismicYear(hyear) ? 13 : 12;
  }

  public static monthLength(
    hyear: number,
    hmonth: number,
    yearType: number
  ): number {
    switch (hmonth) {
      case HDateMonth.TISHRI:
      case HDateMonth.AV:
      case HDateMonth.NISSAN:
      case HDateMonth.SIVAN:
      case HDateMonth.SHVAT:
        return 30;
      case HDateMonth.CHESHVAN:
        if (yearType == HDateYearType.SHLEMA) {
          return 30;
        }
        return 29;
      case HDateMonth.KISLEV:
        if (yearType == HDateYearType.CHASERA) {
          return 29;
        }
        return 30;
      case HDateMonth.TEVET:
      case HDateMonth.ADAR2:
      case HDateMonth.IYAR:
      case HDateMonth.TAMUZ:
      case HDateMonth.ELUL:
        return 29;
      case HDateMonth.ADAR:
        return HDate.embolismicYear(hyear) ? 30 : 29;
      default:
        return 0; //Impossible.
    }
  }

  public static embolismicYear(hyear: number): boolean {
    return (12 * hyear + 17) % 19 >= 12;
  }

  static convert(gDate: GDate) {
    return new HDate(gDate);
  }
}
