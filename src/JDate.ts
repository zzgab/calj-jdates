export enum DayOfWeek {
  SHABBAT = 6,
}

export abstract class JDate {
  private hdn: number;

  protected constructor(jdate: JDate);
  protected constructor(hdn: number);
  protected constructor(param: number | JDate) {
    if (typeof param === "number") {
      this.hdn = param;
    } else {
      this.hdn = param.hdn;
    }
  }

  protected setHdn(hdn: number) {
    this.hdn = hdn;
  }

  public lte(other: JDate): boolean {
    return this.hdn <= other.hdn;
  }

  public gt(other: JDate): boolean {
    return this.hdn > other.hdn;
  }

  public gte(other: JDate): boolean {
    return this.hdn >= other.hdn;
  }

  public minus(other: JDate): number {
    return this.hdn - other.hdn;
  }

  protected getHdn(): number {
    return this.hdn;
  }

  public getDayOfWeek(): DayOfWeek {
    return this.hdn % 7;
  }

  public abstract getYear(): number;
  public abstract getMonth(): number;
  public abstract getDay(): number;

  public toString(): string {
    return `${this.getYear()}-${`${this.getMonth()}`.padStart(
      2,
      "0"
    )}-${`${this.getDay()}`.padStart(2, "0")}`;
  }
}
