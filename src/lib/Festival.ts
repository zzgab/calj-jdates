import { HDate, HDateMonth } from "./HDate";

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

const cache = new Map<number, Festival>();

const cacheKey = (type: FestivalType, hyear: number, israel: boolean) =>
  (type << 14) + (hyear << 1) + (israel ? 1 : 0);

const checkCache = (
  type: FestivalType,
  hyear: number,
  israel: boolean,
  calculator: () => Festival
): Festival => {
  const key = cacheKey(type, hyear, israel);
  let festival = cache.get(key);
  if (!festival) {
    festival = calculator();
    cache.set(key, festival);
  }
  return festival;
};

export class Festival {
  constructor(
    private israel: boolean,
    private festivalType: FestivalType,
    private startDate: HDate,
    private endDate: HDate,
    private yamimTovim: boolean[],
    _zmaner: null,
    private _startsEve: boolean
  ) {}

  static makePesach(hyear: number, israel: boolean): Festival {
    return checkCache(FestivalType.PESACH, hyear, israel, () => {
      const hStart = new HDate(15, HDateMonth.NISSAN, hyear);
      const hEnd = new HDate(21 + (israel ? 0 : 1), HDateMonth.NISSAN, hyear);
      return new Festival(
        israel,
        FestivalType.PESACH,
        hStart,
        hEnd,
        [true, !israel, false, false, false, false, true, !israel],
        null,
        true
      );
    });
  }

  getStartDate(): HDate {
    return this.startDate;
  }
}
