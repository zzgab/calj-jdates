import { GDate, HDate, Parasha, ParashaScheme } from "./lib";
import { HDateMonth } from "./lib/HDate";
import { Festival } from "./lib/Festival";

describe("HDate", () => {
  it("should convert from GDate", () => {
    expect(`${HDate.convert(new GDate(9, 10, 1974))}`).toBe("5735-07-23");
  });

  it("should have month name", () => {
    expect(new HDate(23, HDateMonth.TISHRI, 5780).getMonthName()).toBe("תשרי");
    expect(new HDate(23, HDateMonth.ADAR, 5780).getMonthName()).toBe("אדר");
    expect(new HDate(23, HDateMonth.ADAR2, 5780).getMonthName()).toBe("אדר");
    expect(new HDate(23, HDateMonth.ADAR, 5782).getMonthName()).toBe("אדר א");
    expect(new HDate(23, HDateMonth.ADAR2, 5782).getMonthName()).toBe("אדר ב");
  });
});

describe("Parasha", () => {
  it("should calculate", () => {
    const g = new GDate(16, 2, 2023);
    const parasha = new Parasha(g, ParashaScheme.ISRAEL);
    expect(parasha.getHebrewName()).toEqual("משפטים");
  });

  it("should have special parasha", () => {
    expect(
      new Parasha(new GDate(2, 3, 2023), ParashaScheme.WORLD).getSpecialName()
    ).toEqual("זכור");
  });
});

describe("Festival", () => {
  it("should calculate Pesach", () => {
    expect(
      GDate.convert(
        Festival.pesach(
          HDate.convert(new GDate(17, 2, 2023)).getYear(),
          ParashaScheme.ISRAEL
        ).getStartDate()
      ).toString()
    ).toBe("2023-04-06");
  });
});
