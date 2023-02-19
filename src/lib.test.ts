import { GDate, HDate, Parasha, ParashaScheme } from "./lib";
import { HDateMonth } from "./lib/HDate";
import { Festival } from "./lib/Festival";
import { ParashaSpecial } from "./lib/Parasha";

describe("HDate", () => {
  it("should convert from GDate", () => {
    expect(`${HDate.make(GDate.make(9, 10, 1974))}`).toBe("5735-07-23");
  });

  it("should have month name", () => {
    expect( HDate.make(23, HDateMonth.TISHRI, 5780).getMonthName()).toBe("תשרי");
    expect( HDate.make(23, HDateMonth.ADAR, 5780).getMonthName()).toBe("אדר");
    expect( HDate.make(23, HDateMonth.ADAR2, 5780).getMonthName()).toBe("אדר");
    expect( HDate.make(23, HDateMonth.ADAR, 5782).getMonthName()).toBe("אדר א");
    expect(HDate.make(23, HDateMonth.ADAR2, 5782).getMonthName()).toBe("אדר ב");
  });
});

describe("Parasha", () => {
  it("should calculate", () => {
    const g = GDate.make(16, 2, 2023);
    const parasha = Parasha.make(g, ParashaScheme.ISRAEL);
    expect(parasha.getHebrewName()).toEqual("משפטים");
  });

  it("should have special parasha", () => {
    const parasha = Parasha.make(GDate.make(2, 3, 2023), ParashaScheme.WORLD);
    expect(parasha.getSpecialName()).toEqual("זכור");
    expect(parasha.getSpecial()).toBe(ParashaSpecial.ZACHOR);
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
});

describe("Festival", () => {
  it("should calculate Pesach", () => {
    expect(
      GDate.convert(
        Festival.pesach(
          HDate.make(GDate.make(17, 2, 2023)).getYear(),
          ParashaScheme.ISRAEL
        ).getStartDate()
      ).toString()
    ).toBe("2023-04-06");
  });
});
