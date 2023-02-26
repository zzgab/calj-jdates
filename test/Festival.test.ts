import { Festival, GDate, HDate, HDateMonth, ParashaScheme } from "../src";

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

  it("should calculate Succot", () => {
    expect(
      GDate.make(
        Festival.succot(5789, ParashaScheme.ISRAEL).getStartDate()
      ).toString()
    ).toBe("2028-10-05");
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
    ).toStrictEqual([]);
  });

  it("should return Succot and HoshaanaRabba onDate", () => {
    expect(
      Festival.onDate(
        HDate.make(21, HDateMonth.TISHRI, 5755),
        ParashaScheme.WORLD
      )
    ).toStrictEqual([
      Festival.succot(5755, ParashaScheme.WORLD),
      Festival.hoshaanaRabba(5755),
    ]);
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

  it("should compute Barekh Aleinu", () => {
    expect(Festival.winterEve(2022, ParashaScheme.WORLD).toString()).toEqual(
      "2022-12-04"
    );
    expect(Festival.winterEve(2023, ParashaScheme.WORLD).toString()).toEqual(
      "2023-12-05"
    );
    expect(Festival.winterEve(2026, ParashaScheme.WORLD).toString()).toEqual(
      "2026-12-05"
    );
    expect(Festival.winterEve(2023, ParashaScheme.ISRAEL).toString()).toEqual(
      "2023-10-21"
    );
  });

  it("should not have Yom HaAtsmaut before Hakamat Medina", () => {
    expect(Festival.yomHaAtsmaut(5700)).toBe(null);
  });
});
