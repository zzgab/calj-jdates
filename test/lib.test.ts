import { GDate, HDate, HDateMonth, Parasha, ParashaScheme } from "../src";
import { ParashaSpecial } from "../src/Parasha";

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

describe("Parasha", () => {
  it("should calculate the kevviot", () => {
    const data: [number, number, number, ParashaScheme, string][] = [
      [15, 2, 5726, ParashaScheme.WORLD, "אמור"], // 5310
      [15, 2, 5710, ParashaScheme.ISRAEL, "אמור"], // 5361
      [16, 2, 5702, ParashaScheme.WORLD, "בהר - בחקתי"], // 5510
      [4, 8, 5702, ParashaScheme.ISRAEL, "נח"], // 5511
      [5, 12, 5701, ParashaScheme.WORLD, "תצוה"], // 5440
      [15, 2, 5736, ParashaScheme.ISRAEL, "בהר"], // 8561
      [15, 2, 5714, ParashaScheme.WORLD, "בחקתי"], // 8340
      [15, 2, 5703, ParashaScheme.ISRAEL, "בהר"], // 8361
      [15, 2, 5708, ParashaScheme.ISRAEL, "בחקתי"], // 8511
      [15, 2, 5708, ParashaScheme.WORLD, "בהר"], // 8510
      [15, 2, 5700, ParashaScheme.WORLD, "בחקתי"], // 8540
      [15, 2, 5736, ParashaScheme.WORLD, "בהר"], // 8560

      [5, 2, 5734, ParashaScheme.WORLD, "תזריע - מצורע"], // 35540, offset char B
    ];

    data.forEach(([day, month, year, scheme, parasha]) =>
      expect(
        Parasha.make(HDate.make(day, month, year), scheme).getHebrewName()
      ).toEqual(parasha)
    );
  });

  it("should have special parasha", () => {
    const parasha = Parasha.make(GDate.make(2, 3, 2023), ParashaScheme.WORLD);
    expect(parasha.getSpecialName()).toEqual("זכור");
    expect(parasha.getSpecial()).toBe(ParashaSpecial.ZACHOR);

    expect(
      Parasha.make(
        GDate.make(9, 3, 2023),
        ParashaScheme.ISRAEL
      ).getSpecialName()
    ).toBe("פרה");

    expect(
      Parasha.make(
        GDate.make(16, 3, 2023),
        ParashaScheme.ISRAEL
      ).getSpecialName()
    ).toBe("החודש");

    expect(
      Parasha.make(
        GDate.make(30, 3, 2023),
        ParashaScheme.ISRAEL
      ).getSpecialName()
    ).toBe("הגדול");

    expect(
      Parasha.make(
        GDate.make(15, 2, 2023),
        ParashaScheme.ISRAEL
      ).getSpecialName()
    ).toBe("שקלים");
  });

  it("should have holiday name Pesach", () => {
    const parasha = Parasha.make(HDate.make(16, HDateMonth.NISSAN, 5760));
    expect(parasha.getHebrewName()).toBe(undefined);
    expect(parasha.getFestivalName()).toBe("פסח");
  });

  it("should have holiday name Shavuot in Chul", () => {
    const parasha = Parasha.make(HDate.make(7, HDateMonth.SIVAN, 5783));
    expect(parasha.getHebrewName()).toBe(undefined);
    expect(parasha.getFestivalName()).toBe("שבועות");
  });

  it("should not be holiday on Sivan 7 in Israel", () => {
    const parasha = Parasha.make(
      HDate.make(7, HDateMonth.SIVAN, 5783),
      ParashaScheme.ISRAEL
    );
    expect(parasha.getHebrewName()).toBe("נשא");
    expect(parasha.getFestivalName()).toBe(undefined);
  });

  it("should calculate a parasha in Tishri before Bereshit", () => {
    expect(
      Parasha.make(HDate.make(1, HDateMonth.TISHRI, 5779)).getHebrewName()
    ).toBe("וילך");
  });

  it("should handle special parashiot if 1st Adar is shabbat", () => {
    expect(Parasha.make(GDate.make(27, 2, 2025)).getSpecialName()).toBe(
      "שקלים"
    );
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
