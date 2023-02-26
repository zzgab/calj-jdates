import { GDate, HDate, HDateMonth } from "../src";

describe("HDate", () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.clearAllMocks());

  it("should convert from GDate", () => {
    expect(`${HDate.make(GDate.make(9, 10, 1974))}`).toBe("5735-07-23");
  });

  it("should have month name", () => {
    expect(HDate.make(23, HDateMonth.TISHRI, 5780).getMonthName()).toBe("תשרי");
    expect(HDate.make(23, HDateMonth.ADAR, 5780).getMonthName()).toBe("אדר");
    expect(HDate.make(23, HDateMonth.ADAR2, 5780).getMonthName()).toBe("אדר");
    expect(HDate.make(23, HDateMonth.ADAR, 5782).getMonthName()).toBe("אדר א");
    expect(HDate.make(23, HDateMonth.ADAR2, 5782).getMonthName()).toBe("אדר ב");
  });

  it("should instantiate from Date", () => {
    expect(HDate.make(new Date(Date.UTC(2023, 1, 22))).toString()).toBe(
      "5783-12-01"
    );
  });

  it("should instantiate from today", () => {
    jest.spyOn(Date, "now").mockReturnValue(Date.UTC(2023, 1, 22));
    expect(HDate.today().toString()).toEqual("5783-12-01");
  });

  it("should cap to month length", () => {
    expect(HDate.make(40, HDateMonth.TAMUZ, 5700)).toEqual(
      HDate.make(29, HDateMonth.TAMUZ, 5700)
    );
  });

  it("should compute year length", () => {
    expect(HDate.make(1, HDateMonth.IYAR, 5726).getYearLength()).toBe(353);
    expect(HDate.make(1, HDateMonth.IYAR, 5701).getYearLength()).toBe(354);
    expect(HDate.make(1, HDateMonth.IYAR, 5712).getYearLength()).toBe(355);
    expect(HDate.make(1, HDateMonth.IYAR, 5714).getYearLength()).toBe(383);
    expect(HDate.make(1, HDateMonth.IYAR, 5711).getYearLength()).toBe(384);
    expect(HDate.make(1, HDateMonth.IYAR, 5717).getYearLength()).toBe(385);
  });

  it("should compute year without Molad Zaken", () => {
    expect(HDate.make(new Date("1901-04-29")).toString()).toBe("5661-02-10");
  });

  it("should compute year with Molad Zaken with Adu", () => {
    expect(HDate.make(new Date("1923-04-26")).toString()).toBe("5683-02-10");
  });

  it("should compute year with Molad Zaken without Adu", () => {
    expect(HDate.make(new Date("1975-04-21")).toString()).toBe("5735-02-10");
  });

  it("should compute year without Molad Zaken with Adu", () => {
    expect(HDate.make(new Date("1902-05-17")).toString()).toBe("5662-02-10");
  });

  it("should compute year without Molad Zaken with Gatarad", () => {
    expect(HDate.make(new Date("1907-04-24")).toString()).toBe("5667-02-10");
  });

  it("should compute year without Molad Zaken with Betutkafot", () => {
    expect(HDate.make(new Date("1928-04-30")).toString()).toBe("5688-02-10");
  });
});
