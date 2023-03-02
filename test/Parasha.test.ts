import { GDate, HDate, HDateMonth, Parasha, ParashaScheme } from "../src";
import { ParashaSpecial } from "../src/Parasha";
import { HebrewParashaLocalizer } from "../src/HebrewParashaLocalizer";

const getName = (parasha: Parasha) =>
  new HebrewParashaLocalizer().sidra(parasha.getSidra());

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
        getName(Parasha.make(HDate.make(day, month, year), scheme))
      ).toEqual(parasha)
    );
  });

  it("should have special parasha", () => {
    const parasha = Parasha.make(GDate.make(2, 3, 2023), ParashaScheme.WORLD);
    expect(new HebrewParashaLocalizer().special(parasha.getSpecial())).toEqual(
      "זכור"
    );
    expect(parasha.getSpecial()).toBe(ParashaSpecial.ZACHOR);

    const loc = new HebrewParashaLocalizer();
    expect(
      loc.special(
        Parasha.make(GDate.make(9, 3, 2023), ParashaScheme.ISRAEL).getSpecial()
      )
    ).toBe("פרה");

    expect(
      loc.special(
        Parasha.make(GDate.make(16, 3, 2023), ParashaScheme.ISRAEL).getSpecial()
      )
    ).toBe("החודש");

    expect(
      loc.special(
        Parasha.make(GDate.make(30, 3, 2023), ParashaScheme.ISRAEL).getSpecial()
      )
    ).toBe("הגדול");

    expect(
      loc.special(
        Parasha.make(GDate.make(15, 2, 2023), ParashaScheme.ISRAEL).getSpecial()
      )
    ).toBe("שקלים");
  });

  it("should have holiday name Pesach", () => {
    const parasha = Parasha.make(HDate.make(16, HDateMonth.NISSAN, 5760));
    expect(getName(parasha)).toEqual("");
    expect(parasha.getFestivalName()).toBe("פסח");
  });

  it("should have holiday name Shavuot in Chul", () => {
    const parasha = Parasha.make(HDate.make(7, HDateMonth.SIVAN, 5783));
    expect(getName(parasha)).toEqual("");
    expect(parasha.getFestivalName()).toBe("שבועות");
  });

  it("should not be holiday on Sivan 7 in Israel", () => {
    const parasha = Parasha.make(
      HDate.make(7, HDateMonth.SIVAN, 5783),
      ParashaScheme.ISRAEL
    );
    expect(getName(parasha)).toBe("נשא");
    expect(parasha.getFestivalName()).toBe(undefined);
  });

  it("should calculate a parasha in Tishri before Bereshit", () => {
    expect(getName(Parasha.make(HDate.make(1, HDateMonth.TISHRI, 5779)))).toBe(
      "וילך"
    );
  });

  it("should handle special parashiot if 1st Adar is shabbat", () => {
    const specialName = (special: ParashaSpecial) =>
      new HebrewParashaLocalizer().special(special);
    expect(
      specialName(Parasha.make(GDate.make(27, 2, 2025)).getSpecial())
    ).toBe("שקלים");
  });

  describe("Haftarot", () => {
    it("should have shabbat rosh hodesh", () => {
      expect(Parasha.make(GDate.make(20, 4, 2023)).getHaftara()).toBe(
        "ראש חדש"
      );
    });
    it("should have ma'char hodesh", () => {
      expect(Parasha.make(GDate.make(20, 5, 2023)).getHaftara()).toBe(
        "מחר חדש"
      );
    });
    it("should have zachor", () => {
      expect(Parasha.make(GDate.make(27, 2, 2023)).getHaftara()).toBe(
        ParashaSpecial.ZACHOR
      );
    });
    it("should have hachodesh", () => {
      expect(Parasha.make(GDate.make(13, 3, 2023)).getHaftara()).toBe(
        ParashaSpecial.HACHODESH
      );
    });
    it("should have hagadol", () => {
      expect(Parasha.make(GDate.make(30, 3, 2023)).getHaftara()).toBe(
        ParashaSpecial.HAGADOL
      );
    });
    it("should have second haftara if mechubarin", () => {
      expect(Parasha.make(GDate.make(25, 4, 2023)).getHaftara()).toBe("קדושים");
    });
    it("should have shabbat Hanouca", () => {
      expect(Parasha.make(GDate.make(11, 12, 2020)).getHaftara()).toBe("חנוכה");
    });
    it("should have first and second shabbat Hanouca", () => {
      expect(
        Parasha.make(HDate.make(25, HDateMonth.KISLEV, 5713)).getHaftara()
      ).toBe("חנוכה שבת ראשון");
      expect(
        Parasha.make(HDate.make(2, HDateMonth.TEVET, 5713)).getHaftara()
      ).toBe("חנוכה שבת שני");
    });
    it("should have name of festival", () => {
      expect(Parasha.make(GDate.make(6, 4, 2023)).getHaftara()).toBe("פסח");
    });
  });
});
