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

  protected getHdn(): number {
    return this.hdn;
  }

  public abstract getYear(): number;
  public abstract getMonth(): number;
  public abstract getDay(): number;

  public toString(): string {
    return `${this.getYear()}-${`${this.getMonth()}`.padStart(2, '0')}-${`${this.getDay()}`.padStart(2, '0')}`;
  }
}
