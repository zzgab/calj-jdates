import {
  Festival,
  GDate,
  HDate,
  HDateMonth,
  Parasha,
  ParashaScheme,
} from "../src";
import { ParashaSpecial } from "../src/Parasha";

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
    expect(HDate.make(1, HDateMonth.IYAR, 5701).getYearLength()).toBe(354);
    expect(HDate.make(1, HDateMonth.IYAR, 5711).getYearLength()).toBe(384);
  });
});

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
      [15, 2, 5726, ParashaScheme.WORLD, "אמור"], // 35310
      [15, 2, 5710, ParashaScheme.ISRAEL, "אמור"], // 35361
      [16, 2, 5702, ParashaScheme.WORLD, "בהר - בחקתי"], // 35510
      [4, 8, 5702, ParashaScheme.ISRAEL, "נח"], // 35511
      [5, 12, 5701, ParashaScheme.WORLD, "תצוה"], // 35440
      [15, 2, 5736, ParashaScheme.ISRAEL, "בהר"], // 38561
      [15, 2, 5714, ParashaScheme.WORLD, "בחקתי"], // 38340
      [15, 2, 5703, ParashaScheme.ISRAEL, "בהר"], // 38361
      [15, 2, 5708, ParashaScheme.ISRAEL, "בחקתי"], // 38511
      [15, 2, 5708, ParashaScheme.WORLD, "בהר"], // 38510
      [15, 2, 5700, ParashaScheme.WORLD, "בחקתי"], // 38540
      [15, 2, 5736, ParashaScheme.WORLD, "בהר"], // 38560

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

describe("Festival", () => {
  it("should calculate Rosh Hashana", () => {
    expect(GDate.make(Festival.roshHashana(5787).getEndDate()).toString()).toBe(
      "2026-09-13"
    );
  });

  it("should calculate Gdalia", () => {
    expect(GDate.make(Festival.gdalia(5788).getStartDate()).toString()).toBe(
      "2027-10-04"
    );
    expect(GDate.make(Festival.gdalia(5789).getStartDate()).toString()).toBe(
      "2028-09-24"
    );
  });

  it("should calculate Pesach", () => {
    expect(
      GDate.make(
        Festival.pesach(
          HDate.make(GDate.make(17, 2, 2023)).getYear(),
          ParashaScheme.ISRAEL
        ).getStartDate()
      ).toString()
    ).toBe("2023-04-06");
  });

  it("should calculate Kippur", () => {
    expect(Festival.yomKippur(5780).getStartDate().toString()).toEqual(
      "5780-07-10"
    );
  });
  it("should return onDate nothing", () => {
    expect(
      Festival.onDate(
        HDate.make(12, HDateMonth.CHESHVAN, 5755),
        ParashaScheme.WORLD
      )
    ).toBe(undefined);
  });

  it("should compute end date", () => {
    expect(
      Festival.pesach(5783, ParashaScheme.WORLD)
        .getEndDate()
        .eq(GDate.make(13, 4, 2023))
    ).toBe(true);

    expect(
      Festival.shavuot(5783, ParashaScheme.ISRAEL)
        .getEndDate()
        .eq(HDate.make(6, HDateMonth.SIVAN, 5783))
    ).toBe(true);
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
