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
    const festival = Festival.succot(5789, ParashaScheme.ISRAEL);
    expect(GDate.make(festival.getStartDate()).toString()).toBe("2028-10-05");

    expect(festival.getYamimTovim()).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
    ]);

    expect(Festival.succot(5789, ParashaScheme.WORLD).getYamimTovim()).toEqual([
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
    ]);
  });

  it("should calculate Shmini Atseret", () => {
    expect(
      GDate.make(
        Festival.succot(5789, ParashaScheme.ISRAEL).getEndDate()
      ).toString()
    ).toBe("2028-10-12");
    expect(
      GDate.make(
        Festival.succot(5789, ParashaScheme.WORLD).getEndDate()
      ).toString()
    ).toBe("2028-10-13");
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

  describe("Yom HaAtsmaut", () => {
    it("should not exist before Hakamat Medina", () => {
      expect(Festival.yomHaAtsmaut(5700)).toBe(null);
      expect(Festival.yomHaZicaron(5700)).toBe(null);
    });
    it("should have be advanced if Shabbat", () => {
      expect(Festival.yomHaAtsmaut(5754).getStartDate().toString()).toBe(
        "5754-02-03"
      );
    });
    it("should have be advanced if Friday", () => {
      expect(Festival.yomHaAtsmaut(5755).getStartDate().toString()).toBe(
        "5755-02-04"
      );
    });
    it("should have be postponed if Monday", () => {
      expect(Festival.yomHaAtsmaut(5757).getStartDate().toString()).toBe(
        "5757-02-06"
      );
    });
  });
});
