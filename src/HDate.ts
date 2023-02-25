import { isDate, JDate } from "./JDate";
import { GDate } from "./GDate";

const uday = 25920; // 24 * 1080
const Tsyn = 765433; //29 * uday + 12 * 1080 + 793
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
  static make(jdate: JDate): HDate;
  static make(date: Date): HDate;
  static make(day: number, month: number, year: number): HDate;
  static make(
    dayOrHdnOrJdate: number | JDate | Date,
    month?: number,
    year?: number
  ): HDate {
    return new HDate(dayOrHdnOrJdate, month, year);
  }

  private constructor(
    dayOrHdnOrJdate: number | JDate | Date,
    month?: number,
    year?: number
  ) {
    if (typeof dayOrHdnOrJdate === "number") {
      super(HDate.hdnForYmd(year!, month!, dayOrHdnOrJdate));
    } else if (isDate(dayOrHdnOrJdate)) {
      super(GDate.make(dayOrHdnOrJdate));
    } else {
      super(dayOrHdnOrJdate);
    }
    const { year: y, month: m, day: d, yearType } = this.calcFromHdn();
    this.year = y;
    this.month = m;
    this.day = d;
    this.yearType = yearType;
  }

  static today(): HDate {
    return new HDate(GDate.today());
  }

  getYear(): number {
    return this.year;
  }

  getMonth(): HDateMonth {
    return this.month;
  }

  getDay(): number {
    return this.day;
  }

  getMonthLength(): number {
    return HDate.monthLength(this.year, this.month, this.yearType);
  }

  getNumberOfMonths(): number {
    return HDate.monthsInYear(this.year);
  }

  static monthsInYear(hyear: number): number {
    return HDate.embolismicYear(hyear) ? 13 : 12;
  }

  private static monthLength(
    hyear: number,
    hmonth: HDateMonth,
    yearType: number
  ): number {
    const months = {
      [HDateMonth.TISHRI]: 30,
      [HDateMonth.CHESHVAN]: yearType === HDateYearType.SHLEMA ? 30 : 29,
      [HDateMonth.KISLEV]: yearType === HDateYearType.CHASERA ? 29 : 30,
      [HDateMonth.TEVET]: 29,
      [HDateMonth.SHVAT]: 30,
      [HDateMonth.ADAR]: HDate.embolismicYear(hyear) ? 30 : 29,
      [HDateMonth.ADAR2]: 29,
      [HDateMonth.NISSAN]: 30,
      [HDateMonth.IYAR]: 29,
      [HDateMonth.SIVAN]: 30,
      [HDateMonth.TAMUZ]: 29,
      [HDateMonth.AV]: 30,
      [HDateMonth.ELUL]: 29,
    };
    return months[hmonth];
  }

  static embolismicYear(hyear: number): boolean {
    return (12 * hyear + 17) % 19 >= 12;
  }

  plus(days: number): HDate {
    const hdate = HDate.make(this);
    hdate.calcFromHdn(days);
    return hdate;
  }

  isEmbolismic(): boolean {
    return HDate.embolismicYear(this.year);
  }

  getYearLength(): number {
    const yearTypeMap: Record<HDateYearType, (leap: boolean) => number> = {
      [HDateYearType.CHASERA]: (leap) => (leap ? 383 : 353),
      [HDateYearType.SDURA]: (leap) => (leap ? 384 : 354),
      [HDateYearType.SHLEMA]: (leap) => (leap ? 385 : 355),
    };
    return yearTypeMap[this.yearType](this.isEmbolismic());
  }

  getMonthName(): string {
    return HDate.monthNames[
      this.month !== 12
        ? this.month - 1
        : this.getNumberOfMonths() === 12
        ? 11
        : 13
    ];
  }

  static monthNames = [
    "ניסן",
    "אייר",
    "סיון",
    "תמוז",
    "אב",
    "אלול",
    "תשרי",
    "חשון",
    "כסלו",
    "טבת",
    "שבט",
    "אדר",
    "אדר ב",
    "אדר א",
  ] as const;

  private static hdnForYmd(year: number, month: number, day: number): number {
    let _hdn = HDate.roshHashanaDay(year);
    const nextRH = HDate.roshHashanaDay(year + 1);
    const yearType = ((nextRH - _hdn) % 10) - 2;
    let hmonth = HDateMonth.TISHRI;
    const hyear = year;

    const nbMonths = HDate.embolismicYear(hyear) ? 13 : 12;

    if (month > nbMonths) month = nbMonths;

    while (hmonth != month) {
      _hdn += HDate.monthLength(hyear, hmonth, yearType);
      hmonth = hmonth + 1 > nbMonths ? 1 : hmonth + 1;
    }
    const getMonthLength = HDate.monthLength(hyear, hmonth, yearType);
    if (day > getMonthLength) {
      day = getMonthLength;
    }
    _hdn += day - 1;
    return _hdn;
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

  private calcFromHdn(offsetBy?: number): {
    year: number;
    month: number;
    day: number;
    yearType: HDateYearType;
  } {
    if (offsetBy) {
      this.setHdn(this.getHdn() + offsetBy);
    }
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

    if (rhnext === 0) {
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

    return {
      year: this.year,
      month: this.month,
      day: this.day,
      yearType: this.yearType,
    };
  }

  private year: number;
  private month: number;
  private day: number;
  private yearType: HDateYearType;
}
