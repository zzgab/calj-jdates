import { HDate, HDateMonth } from "./HDate";
import { DayOfWeek, JDate } from "./JDate";
import { ParashaScheme } from "./ParashaScheme";
import { GDate } from "./GDate";

type ExecutorArgs = [number, ParashaScheme];

enum FestivalType {
  ROSH_HASHANA = 0,
  GDALIA = 1,
  YOM_KIPPUR = 2,
  SUCCOT = 3,
  HOSHAANA_RABBA = 4,
  SHMINI_ATSERET = 5,
  SIMCHAT_TORAH = 6,
  CHANUKA = 7,
  TEVET_10 = 8,
  SHVAT_15 = 9,
  PURIM_QATAN = 10,
  PURIM_FAST = 11,
  PURIM = 12,
  PURIM_SHUSHAN = 13,
  PESACH = 14,
  YOM_HASHOA = 15,
  YOM_HAZICARON = 16,
  YOM_HAATSMAUT = 17,
  PESACH_SHENI = 18,
  OMER_33 = 19,
  YOM_YERUSHALAYM = 20,
  SHAVUOT = 21,
  TAMUZ_17 = 22,
  AV_9 = 23,
  AV_15 = 24,
}

const cache = new Map<number, Festival>();

const cacheKey = (type: FestivalType, hyear: number, israel: boolean) =>
  (type << 14) + (hyear << 1) + (israel ? 1 : 0);

const checkCache = (
  type: FestivalType,
  hyear: number,
  israel: ParashaScheme,
  calculator: () => Festival
): Festival => {
  const key = cacheKey(type, hyear, !!israel);
  let festival = cache.get(key);
  if (!festival) {
    festival = calculator();
    cache.set(key, festival);
  }
  return festival;
};

export class Festival {
  public static roshHashana(hyear: number): Festival {
    return checkCache(
      FestivalType.ROSH_HASHANA,
      hyear,
      ParashaScheme.WORLD,
      () =>
        new Festival(
          ParashaScheme.WORLD,
          FestivalType.ROSH_HASHANA,
          HDate.make(1, HDateMonth.TISHRI, hyear),
          HDate.make(2, HDateMonth.TISHRI, hyear),
          [true, true],
          true
        )
    );
  }

  public static gdalia(hyear: number): Festival {
    return checkCache(FestivalType.GDALIA, hyear, ParashaScheme.WORLD, () => {
      const h3 = HDate.make(3, HDateMonth.TISHRI, hyear);
      const h = h3.getDayOfWeek() === DayOfWeek.SHABBAT ? h3.plus(1) : h3;

      return new Festival(
        ParashaScheme.WORLD,
        FestivalType.GDALIA,
        h,
        h,
        [],
        false
      );
    });
  }

  public static yomKippur(hyear: number): Festival {
    return checkCache(FestivalType.PESACH, hyear, ParashaScheme.ISRAEL, () => {
      const hStart = HDate.make(10, HDateMonth.TISHRI, hyear);
      return new Festival(
        ParashaScheme.ISRAEL,
        FestivalType.YOM_KIPPUR,
        hStart,
        hStart,
        [true],
        true
      );
    });
  }

  public static succot(hyear: number, israel: ParashaScheme): Festival {
    return checkCache(
      FestivalType.SUCCOT,
      hyear,
      israel,
      () =>
        new Festival(
          israel,
          FestivalType.SUCCOT,
          HDate.make(15, HDateMonth.TISHRI, hyear),
          HDate.make(22 + (israel ? 0 : 1), HDateMonth.TISHRI, hyear),
          [true, !israel, false, false, false, false, false, true, !israel],
          true
        )
    );
  }

  public static hoshaanaRabba(hyear: number): Festival {
    return checkCache(
      FestivalType.HOSHAANA_RABBA,
      hyear,
      ParashaScheme.WORLD,
      () =>
        new Festival(
          ParashaScheme.WORLD,
          FestivalType.HOSHAANA_RABBA,
          HDate.make(21, HDateMonth.TISHRI, hyear),
          null,
          null,
          true
        )
    );
  }

  public static shminiAtseret(hyear: number, israel: ParashaScheme): Festival {
    return checkCache(
      FestivalType.SHMINI_ATSERET,
      hyear,
      israel,
      () =>
        new Festival(
          israel,
          FestivalType.SHMINI_ATSERET,
          HDate.make(22, HDateMonth.TISHRI, hyear),
          israel ? null : HDate.make(23, HDateMonth.TISHRI, hyear),
          [true, !israel],
          true
        )
    );
  }

  public static simchatTorah(hyear: number, israel: ParashaScheme): Festival {
    return checkCache(
      FestivalType.SIMCHAT_TORAH,
      hyear,
      israel,
      () =>
        new Festival(
          israel,
          FestivalType.SIMCHAT_TORAH,
          HDate.make(22 + (israel ? 0 : 1), HDateMonth.TISHRI, hyear),
          null,
          [true],
          true
        )
    );
  }

  public static chanuka(hyear: number): Festival {
    return checkCache(
      FestivalType.CHANUKA,
      hyear,
      ParashaScheme.WORLD,
      () =>
        new Festival(
          ParashaScheme.WORLD,
          FestivalType.CHANUKA,
          HDate.make(25, HDateMonth.KISLEV, hyear),
          HDate.make(25, HDateMonth.KISLEV, hyear).plus(7),
          null,
          true
        )
    );
  }

  public static tevet10(hyear: number): Festival {
    return checkCache(FestivalType.TEVET_10, hyear, ParashaScheme.WORLD, () => {
      const h10 = HDate.make(10, HDateMonth.TEVET, hyear);
      const h = h10.getDayOfWeek() === DayOfWeek.SHABBAT ? h10.plus(1) : h10;
      return new Festival(
        ParashaScheme.WORLD,
        FestivalType.TEVET_10,
        h,
        null,
        null,
        false
      );
    });
  }

  public static shvat15(hyear: number): Festival {
    return checkCache(
      FestivalType.SHVAT_15,
      hyear,
      ParashaScheme.WORLD,
      () =>
        new Festival(
          ParashaScheme.WORLD,
          FestivalType.SHVAT_15,
          HDate.make(15, HDateMonth.SHVAT, hyear),
          null,
          null,
          true
        )
    );
  }

  public static purimQatan(hyear: number): Festival | null {
    if (!HDate.embolismicYear(hyear)) {
      return null;
    }
    return checkCache(
      FestivalType.PURIM_QATAN,
      hyear,
      ParashaScheme.WORLD,
      () => {
        return new Festival(
          ParashaScheme.WORLD,
          FestivalType.PURIM_QATAN,
          HDate.make(14, HDateMonth.ADAR, hyear),
          null,
          null,
          false
        );
      }
    );
  }

  public static purimFast(hyear: number): Festival {
    return checkCache(
      FestivalType.PURIM_FAST,
      hyear,
      ParashaScheme.WORLD,
      () => {
        const h = HDate.make(13, HDateMonth.ADAR2, hyear);
        const hPurimFast =
          h.getDayOfWeek() === DayOfWeek.SHABBAT
            ? h.plus(-2)
            : h.getDayOfWeek() === DayOfWeek.SHISHI
            ? h.plus(-1)
            : h;
        return new Festival(
          ParashaScheme.WORLD,
          FestivalType.PURIM_FAST,
          hPurimFast,
          null,
          null,
          false
        );
      }
    );
  }

  public static purim(hyear: number): Festival {
    return checkCache(
      FestivalType.PURIM,
      hyear,
      ParashaScheme.WORLD,
      () =>
        new Festival(
          ParashaScheme.WORLD,
          FestivalType.PURIM,
          HDate.make(14, HDateMonth.ADAR2, hyear),
          null,
          null,
          false
        )
    );
  }

  public static purimShushan(hyear: number): Festival {
    return checkCache(
      FestivalType.PURIM_SHUSHAN,
      hyear,
      ParashaScheme.WORLD,
      () => {
        const h = HDate.make(15, HDateMonth.ADAR2, hyear);
        const hPurimShushan =
          h.getDayOfWeek() === DayOfWeek.SHABBAT ? h.plus(1) : h;
        return new Festival(
          ParashaScheme.WORLD,
          FestivalType.PURIM_SHUSHAN,
          hPurimShushan,
          null,
          null,
          false
        );
      }
    );
  }

  public static pesach(hyear: number, israel: ParashaScheme): Festival {
    return checkCache(FestivalType.PESACH, hyear, israel, () => {
      const hStart = HDate.make(15, HDateMonth.NISSAN, hyear);
      const hEnd = HDate.make(21 + (israel ? 0 : 1), HDateMonth.NISSAN, hyear);
      return new Festival(
        israel,
        FestivalType.PESACH,
        hStart,
        hEnd,
        [true, !israel, false, false, false, false, true, !israel],
        true
      );
    });
  }

  public static yomHaShoa(hyear: number): Festival {
    //TODO: pas de yom hashoa avant la shoa. Verifier l'annee de la premier occurrence.
    return checkCache(
      FestivalType.YOM_HASHOA,
      hyear,
      ParashaScheme.WORLD,
      () => {
        const h = HDate.make(27, HDateMonth.NISSAN, hyear);
        // It can never be Shabbat, as per Dechiot (would mean subsequent Rosh Hashana on Wed, wich is excluded).
        // Fri: advanced to Thu, because following Sunday is Rosh Chodesh.
        const hShoa =
          h.getDayOfWeek() === DayOfWeek.SHISHI
            ? h.plus(-1)
            : h.getDayOfWeek() === DayOfWeek.RISHON
            ? h.plus(1)
            : h;
        return new Festival(
          ParashaScheme.WORLD,
          FestivalType.YOM_HASHOA,
          hShoa,
          null,
          null,
          true
        );
      }
    );
  }

  public static yomHaAtsmaut(hyear: number): Festival | null {
    if (hyear < 5708) {
      return null;
    }

    return checkCache(
      FestivalType.YOM_HAATSMAUT,
      hyear,
      ParashaScheme.WORLD,
      () => {
        let h;

        if (hyear == 5708 || hyear == 5710 || hyear == 5711) {
          h = HDate.make(5, HDateMonth.IYAR, hyear);
        } else {
          h = HDate.make(5, HDateMonth.IYAR, hyear);
          if (h.getDayOfWeek() == DayOfWeek.SHABBAT) {
            h = h.plus(-2);
          } else if (h.getDayOfWeek() == DayOfWeek.SHISHI) {
            h = h.plus(-1);
          } else if (h.getDayOfWeek() == DayOfWeek.MONDAY) {
            //Si ça tombe un lundi, on reporte au mardi, car ferait un Zikaron le dimanche,
            //or pour éviter les préparatifs shabbat on repousse d'un jour les deux.
            h = h.plus(1);
          }
        }
        return new Festival(
          ParashaScheme.WORLD,
          FestivalType.YOM_HAATSMAUT,
          h,
          null,
          null,
          true
        );
      }
    );
  }

  public static yomHaZicaron(hyear: number): Festival | null {
    const yomHaAtsmaut = Festival.yomHaAtsmaut(hyear);
    // On a year when there is no Yom haAtsma'ut, there isn't a Yom haZicaron too.
    if (null === yomHaAtsmaut) {
      return null;
    }
    return checkCache(
      FestivalType.YOM_HAZICARON,
      hyear,
      ParashaScheme.WORLD,
      () => {
        return new Festival(
          ParashaScheme.WORLD,
          FestivalType.YOM_HAZICARON,
          yomHaAtsmaut.getStartDate().plus(-1),
          null,
          null,
          true
        );
      }
    );
  }

  public static pesachSheni(hyear: number): Festival {
    return checkCache(
      FestivalType.PESACH_SHENI,
      hyear,
      ParashaScheme.WORLD,
      () =>
        new Festival(
          ParashaScheme.WORLD,
          FestivalType.PESACH_SHENI,
          HDate.make(14, HDateMonth.IYAR, hyear),
          null,
          null,
          true
        )
    );
  }

  public static omer33(hyear: number): Festival {
    return checkCache(
      FestivalType.OMER_33,
      hyear,
      ParashaScheme.WORLD,
      () =>
        new Festival(
          ParashaScheme.WORLD,
          FestivalType.OMER_33,
          HDate.make(18, HDateMonth.IYAR, hyear),
          null,
          null,
          true
        )
    );
  }

  /**
   * Yom Yerushalaym is 28 Iyar, unless it falls on Friday, where it's advanced to Thu.
   */
  public static yomYerushalaym(hyear: number): Festival {
    return checkCache(
      FestivalType.YOM_YERUSHALAYM,
      hyear,
      ParashaScheme.WORLD,
      () => {
        let hdate = HDate.make(28, HDateMonth.IYAR, hyear);
        if (hdate.getDayOfWeek() === DayOfWeek.SHISHI && hyear != 5780) {
          // In 2020 despite what I thought, the Friday Yom Yerushalaim was not advanced to Thu.
          hdate = hdate.plus(-1);
        }
        return new Festival(
          ParashaScheme.WORLD,
          FestivalType.YOM_YERUSHALAYM,
          hdate,
          null,
          null,
          false
        );
      }
    );
  }

  public static shavuot(hyear: number, israel: ParashaScheme): Festival {
    return checkCache(FestivalType.SHAVUOT, hyear, israel, () => {
      const hStart = HDate.make(6, HDateMonth.SIVAN, hyear);
      const hEnd = HDate.make(6 + (israel ? 0 : 1), HDateMonth.SIVAN, hyear);
      return new Festival(
        israel,
        FestivalType.SHAVUOT,
        hStart,
        hEnd,
        [true, !israel],
        true
      );
    });
  }

  public static tamuz17(hyear: number): Festival {
    return checkCache(FestivalType.TAMUZ_17, hyear, ParashaScheme.WORLD, () => {
      let h = HDate.make(17, HDateMonth.TAMUZ, hyear);
      if (h.getDayOfWeek() === DayOfWeek.SHABBAT) {
        h = h.plus(1);
      }
      return new Festival(
        ParashaScheme.WORLD,
        FestivalType.TAMUZ_17,
        h,
        null,
        null,
        false
      );
    });
  }

  public static av9(hyear: number): Festival {
    return checkCache(FestivalType.AV_9, hyear, ParashaScheme.WORLD, () => {
      let h = HDate.make(9, HDateMonth.AV, hyear);
      if (h.getDayOfWeek() == DayOfWeek.SHABBAT) {
        h = h.plus(1);
      }
      return new Festival(
        ParashaScheme.WORLD,
        FestivalType.AV_9,
        h,
        null,
        null,
        true
      );
    });
  }

  public static av15(hyear: number): Festival {
    return checkCache(FestivalType.AV_15, hyear, ParashaScheme.WORLD, () => {
      return new Festival(
        ParashaScheme.WORLD,
        FestivalType.AV_15,
        HDate.make(15, HDateMonth.AV, hyear),
        null,
        null,
        true
      );
    });
  }

  public static onDate(hdate: HDate, israel: ParashaScheme): Festival[] {
    const festivals = [];
    const hyear = hdate.getYear();
    let started = false;
    for (
      let type = FestivalType.ROSH_HASHANA;
      type <= FestivalType.AV_15;
      type++
    ) {
      const festival = Festival.make(type, hyear, israel);
      if (!festival) {
        continue;
      }
      if (festival.contains(hdate)) {
        festivals.push(festival);
        started = true;
      } else {
        if (started) {
          break;
        }
      }
    }
    return festivals;
  }

  public contains(jdate: JDate): boolean {
    return jdate.gte(this.startDate) && jdate.lte(this.endDate);
  }

  public getEndDate(): HDate {
    return this.endDate;
  }
  public getStartDate(): HDate {
    return this.startDate;
  }

  private constructor(
    private _israel: ParashaScheme,
    private type: FestivalType,
    private startDate: HDate,
    endDate: HDate | null,
    _yamimTovim: boolean[] | null,
    private _startsEve: boolean
  ) {
    this.yamimTovim = _yamimTovim ?? [];
    this.endDate = endDate ?? startDate;
  }

  public getName(): string {
    return Festival.executorMap[this.type].name;
  }

  public getYamimTovim(): boolean[] {
    return this.yamimTovim;
  }

  /**
   * Returns the Gregorian day _whose evening_ (Arvit) is first time
   * we recite Barekh Aleinu (winter prayer in Amida)
   * In Israel: 7th Cheshvan
   * In Hu"L : Dec. 4th (or 5th, if the following Greg year is a leap year).
   *           If Friday night -> postponed to Sat. night.
   */
  public static winterEve(gyear: number, israel: ParashaScheme): GDate {
    if (israel) {
      return GDate.make(
        HDate.make(
          6,
          HDateMonth.CHESHVAN,
          HDate.make(GDate.make(1, 12, gyear)).getYear()
        )
      );
    }
    let g = GDate.make(GDate.isLeapYear(gyear + 1) ? 5 : 4, 12, gyear);
    if (g.getDayOfWeek() == DayOfWeek.SHISHI) {
      return g.plus(1);
    }
    return g;
  }

  private readonly endDate: HDate;
  private readonly yamimTovim: boolean[];

  private static readonly executorMap: Record<
    FestivalType,
    { executor: (...args: ExecutorArgs) => Festival | null; name: string }
  > = {
    [FestivalType.ROSH_HASHANA]: {
      name: "ראש השנה",
      executor: Festival.roshHashana,
    },
    [FestivalType.GDALIA]: { name: "גדליה", executor: Festival.gdalia },
    [FestivalType.YOM_KIPPUR]: {
      name: "יום כיפור",
      executor: Festival.yomKippur,
    },
    [FestivalType.SUCCOT]: { name: "סוכות", executor: Festival.succot },
    [FestivalType.HOSHAANA_RABBA]: {
      name: "הושענה רבה",
      executor: Festival.hoshaanaRabba,
    },
    [FestivalType.SHMINI_ATSERET]: {
      name: "שמיני עצרת",
      executor: Festival.shminiAtseret,
    },
    [FestivalType.SIMCHAT_TORAH]: {
      name: "שמחת תורה",
      executor: Festival.simchatTorah,
    },
    [FestivalType.CHANUKA]: { name: "חנוכה", executor: Festival.chanuka },
    [FestivalType.TEVET_10]: {
      name: "תענית טבת",
      executor: Festival.tevet10,
    },
    [FestivalType.SHVAT_15]: { name: "טו בשבט", executor: Festival.shvat15 },
    [FestivalType.PURIM_QATAN]: {
      name: "פורים קטן",
      executor: Festival.purimQatan,
    },
    [FestivalType.PURIM_FAST]: {
      name: "תענית אסתר",
      executor: Festival.purimFast,
    },
    [FestivalType.PURIM]: { name: "פורים", executor: Festival.purim },
    [FestivalType.PURIM_SHUSHAN]: {
      name: "פורים שושן",
      executor: Festival.purimShushan,
    },
    [FestivalType.PESACH]: { name: "פסח", executor: Festival.pesach },
    [FestivalType.YOM_HASHOA]: {
      name: "יום השואה",
      executor: Festival.yomHaShoa,
    },
    [FestivalType.YOM_HAZICARON]: {
      name: "יום הזכרון",
      executor: Festival.yomHaZicaron,
    },
    [FestivalType.YOM_HAATSMAUT]: {
      name: "יום העצמאות",
      executor: Festival.yomHaAtsmaut,
    },
    [FestivalType.PESACH_SHENI]: {
      name: "פסח שני",
      executor: Festival.pesachSheni,
    },
    [FestivalType.OMER_33]: { name: "לג בעומר", executor: Festival.omer33 },
    [FestivalType.YOM_YERUSHALAYM]: {
      name: "יום ירושלים",
      executor: Festival.yomYerushalaym,
    },
    [FestivalType.SHAVUOT]: { name: "שבועות", executor: Festival.shavuot },
    [FestivalType.TAMUZ_17]: { name: "יז תמוז", executor: Festival.tamuz17 },
    [FestivalType.AV_9]: { name: "תשעה באב", executor: Festival.av9 },
    [FestivalType.AV_15]: { name: "טו באב", executor: Festival.av15 },
  };

  private static make(
    type: FestivalType,
    hyear: number,
    israel: ParashaScheme
  ): Festival | null {
    return Festival.executorMap[type].executor(hyear, israel);
  }
}
