import { GDate, HDate, HDateMonth } from "../src";

describe("GDate", () => {
  it("should instantiate from Date", () => {
    expect(GDate.make(new Date(Date.UTC(2012, 5, 12))).toString()).toBe(
      "2012-06-12"
    );
  });

  it("should understand leap years", () => {
    expect(GDate.isLeapYear(1999)).toBe(false);
    expect(GDate.isLeapYear(2000)).toBe(true);
    expect(GDate.isLeapYear(2004)).toBe(true);
    expect(GDate.isLeapYear(1900)).toBe(false);
    expect(GDate.monthLength(1999, 2)).toBe(28);
    expect(GDate.monthLength(2008, 2)).toBe(29);
  });

  it("should cope with out-of-bound months and days", () => {
    expect(GDate.make(4, 13, 1999).eq(GDate.make(4, 1, 2000))).toBe(true);
    expect(GDate.make(12, 0, 1999).eq(GDate.make(12, 12, 1998))).toBe(true);
    expect(GDate.make(43, 4, 2001).eq(GDate.make(30, 4, 2001))).toBe(true);
  });
});

describe("JDate", () => {
  it("should compare dates", () => {
    expect(GDate.make(31, 12, 2000).lt(GDate.make(1, 1, 2001))).toBe(true);
    expect(
      GDate.make(22, 2, 2023).eq(HDate.make(1, HDateMonth.ADAR, 5783))
    ).toBe(true);
  });
});
