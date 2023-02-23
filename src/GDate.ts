import { isDate, JDate } from "./JDate";

type Ymd = { year: number; month: number; day: number };

export class GDate extends JDate {
  static make(jdate: JDate): GDate;
  static make(date: Date): GDate;
  static make(day: number, month: number, year: number): GDate;
  static make(
    dayOrHdnOrJdate: number | JDate | Date,
    month?: number,
    year?: number
  ) {
    return new GDate(dayOrHdnOrJdate, month, year);
  }

  private constructor(
    dayOrHdnOrJdate: number | JDate | Date,
    month?: number,
    year?: number
  ) {
    let params: Ymd = {} as Ymd;
    if (isDate(dayOrHdnOrJdate)) {
      Object.assign(params, {
        year: dayOrHdnOrJdate.getFullYear(),
        month: dayOrHdnOrJdate.getMonth() + 1,
        day: dayOrHdnOrJdate.getDate(),
      });
      super(GDate.hdnForYmd(params.year, params.month, params.day));
    } else if (typeof dayOrHdnOrJdate !== "number" || month === undefined) {
      super(dayOrHdnOrJdate as number);
      Object.assign(params, GDate.calcFromHdn(this.getHdn()));
    } else {
      Object.assign(params, {
        year,
        month,
        day: dayOrHdnOrJdate,
      });
      super(GDate.hdnForYmd(params.year, params.month, params.day));
    }

    this.day = params.day;
    this.month = params.month;
    this.year = params.year;
  }

  static isLeapYear(year: number): boolean {
    return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
  }

  static monthLength(year: number, month: number): number {
    return month === 2 && GDate.isLeapYear(year)
      ? 29
      : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  }

  private static hdnForYmd(year: number, month: number, day: number): number {
    if (month <= 0) {
      month = 12;
      --year;
    } else if (month > 12) {
      month = 1;
      ++year;
    }

    const ml = GDate.monthLength(year, month);
    if (day > ml) {
      day = ml;
    }

    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;

    return (
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      380042
    );
  }

  static today(): GDate {
    const date = new Date(Date.now());
    return new GDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
  }

  getDay(): number {
    return this.day;
  }

  getMonth(): number {
    return this.month;
  }

  getYear(): number {
    return this.year;
  }

  private static calcFromHdn(hdn: number): Ymd {
    const a = hdn + 380041;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);

    return {
      day: e - Math.floor((153 * m + 2) / 5) + 1,
      month: m + 3 - 12 * Math.floor(m / 10),
      year: 100 * b + d - 4800 + Math.floor(m / 10),
    };
  }

  private day: number;
  private month: number;
  private year: number;
}
