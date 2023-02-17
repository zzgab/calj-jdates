import { JDate } from "./JDate";

export class GDate extends JDate {
  private day: number;
  private month: number;
  private year: number;

  constructor(jdate: JDate);
  constructor(hdn: number);
  constructor(day: number, month: number, year: number);
  constructor(dayOrHdnOrJdate: number | JDate, month?: number, year?: number) {
    if (typeof dayOrHdnOrJdate === "number") {
      if (month === undefined) {
        super(dayOrHdnOrJdate);
        this.calcFromHdn();
      } else {
        super(GDate.hdnForYmd(year, month, dayOrHdnOrJdate));
        this.year = year;
        this.month = month;
        this.day = dayOrHdnOrJdate;
      }
    } else {
      super(dayOrHdnOrJdate);
      this.calcFromHdn();
    }
  }

  public static isLeapYear(year: number): boolean {
    return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
  }

  public static monthLength(year: number, month: number): number {
    switch (month) {
      case 1:
        return 31;
      case 2:
        return GDate.isLeapYear(year) ? 29 : 28;
      case 3:
        return 31;
      case 4:
        return 30;
      case 5:
        return 31;
      case 6:
        return 30;
      case 7:
        return 31;
      case 8:
        return 31;
      case 9:
        return 30;
      case 10:
        return 31;
      case 11:
        return 30;
      case 12:
        return 31;
      default:
        return 0; //Impossible
    }
  }

  public static hdnForYmd(year: number, month: number, day: number): number {
    if (month == 0) {
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

  public static today(): GDate {
    const date = new Date(Date.now());
    return new GDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
  }

  private calcFromHdn() {
    const a = this.getHdn() + 380041;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);

    this.day = e - Math.floor((153 * m + 2) / 5) + 1;
    this.month = m + 3 - 12 * Math.floor(m / 10);
    this.year = 100 * b + d - 4800 + Math.floor(m / 10);
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
}
