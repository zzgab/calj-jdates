import { HDate, HDateMonth } from "./HDate";
import { JDate } from "./JDate";
import { ParashaScheme } from "./ParashaScheme";

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

  WINTER = 100,
}

const festivalNames: { [k: number]: string } = {
  [FestivalType.PESACH]: "פסח",
  [FestivalType.SHAVUOT]: "שבועות",
};

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
  public static yomKippur(hyear: number): Festival {
    return checkCache(FestivalType.PESACH, hyear, ParashaScheme.ISRAEL, () => {
      const hStart = HDate.make(10, HDateMonth.TISHRI, hyear);
      return new Festival(
        !!ParashaScheme.ISRAEL,
        FestivalType.YOM_KIPPUR,
        hStart,
        hStart,
        [true],
        null,
        true
      );
    });
  }

  public static pesach(hyear: number, israel: ParashaScheme): Festival {
    return checkCache(FestivalType.PESACH, hyear, israel, () => {
      const hStart = HDate.make(15, HDateMonth.NISSAN, hyear);
      const hEnd = HDate.make(21 + (israel ? 0 : 1), HDateMonth.NISSAN, hyear);
      return new Festival(
        !!israel,
        FestivalType.PESACH,
        hStart,
        hEnd,
        [true, !israel, false, false, false, false, true, !israel],
        null,
        true
      );
    });
  }

  public static shavuot(hyear: number, israel: ParashaScheme): Festival {
    return checkCache(FestivalType.SHAVUOT, hyear, israel, () => {
      const hStart = HDate.make(6, HDateMonth.SIVAN, hyear);
      const hEnd = HDate.make(6 + (israel ? 0 : 1), HDateMonth.SIVAN, hyear);
      return new Festival(
        !!israel,
        FestivalType.SHAVUOT,
        hStart,
        hEnd,
        [true, !israel],
        null,
        true
      );
    });
  }

  public static onDate(
    hdate: HDate,
    israel: ParashaScheme
  ): Festival | undefined {
    if (hdate.getMonth() === HDateMonth.NISSAN) {
      const festival = Festival.pesach(hdate.getYear(), israel);
      if (festival.contains(hdate)) {
        return festival;
      }
    } else if (hdate.getMonth() === HDateMonth.SIVAN) {
      const festival = Festival.shavuot(hdate.getYear(), israel);
      if (festival.contains(hdate)) {
        return festival;
      }
    }
    return undefined;
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
    private _israel: boolean,
    private type: FestivalType,
    private startDate: HDate,
    private endDate: HDate,
    private _yamimTovim: boolean[],
    private _zmaner: null,
    private _startsEve: boolean
  ) {}

  public getName(): string {
    return festivalNames[this.type];
  }
}
