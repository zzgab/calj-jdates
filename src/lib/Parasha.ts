import { DayOfWeek, JDate } from "./JDate";
import { HDate, HDateMonth } from "./HDate";
import { Festival } from "./Festival";

export enum ParashaSpecial {
  SHEQALIM = "SHEQALIM",
  ZACHOR = "ZACHOR",
  PARAH = "PARAH",
  HACHODESH = "HACHODESH",
  HAGADOL = "HAGADOL",
}

const specialParashaNames: Record<ParashaSpecial, string> = {
  [ParashaSpecial.SHEQALIM]: "שקלים",
  [ParashaSpecial.ZACHOR]: "זכור",
  [ParashaSpecial.PARAH]: "פרה",
  [ParashaSpecial.HACHODESH]: "החודש",
  [ParashaSpecial.HAGADOL]: "הגדול",
};

export enum ParashaScheme {
  ISRAEL = 1,
  WORLD = 0,
}

export class Parasha {
  public static make(jdate: JDate, israel?: ParashaScheme) {
    return new Parasha(jdate, israel);
  }

  private parshiot: number[];
  private festival: Festival;
  private special: ParashaSpecial;
  private constructor(jdate: JDate, israel: ParashaScheme) {
    this.compute(HDate.make(jdate), israel);
  }

  private compute(hdate: HDate, israel: ParashaScheme): void {
    if (hdate.getDayOfWeek() != DayOfWeek.SHABBAT) {
      hdate = hdate.plus(DayOfWeek.SHABBAT - hdate.getDayOfWeek());
    }

    const HY = hdate.getYear();
    //Get the date of Simchat Torah of the current Jewish year.
    //Note: it is safe to use 23 Tishri for Simchat Torah, even in Israel,
    //because anyway 23 Tishri can never be Shabbat, so we don't risk to skip one Shabbat.
    const hSTcandidate = HDate.make(23, HDateMonth.TISHRI, HY);
    //If we're querying the Parasha for a date between Rosh Hashana and Simchat Torah,
    //we need to rebase from previous Simchat Torah.
    const hST = hdate.lte(hSTcandidate)
      ? HDate.make(23, HDateMonth.TISHRI, HY - 1)
      : hSTcandidate;

    //We're going to compute the date of Bereshit:
    //The shabbat immediately following Simchat Torah.
    //Let's rename the variable for clarity.
    const hBereshit = HDate.make(hST);

    // n: number of full weeks between last time Bereshit was read, and this->hdate.
    // 0 means: this week's parasha is Bereshit!
    const n = Math.floor(
      (hdate.minus(hBereshit) -
        (DayOfWeek.SHABBAT - hBereshit.getDayOfWeek())) /
        7
    );

    //Compute Kevvia key: [YearLength][DayOfWeek of Rosh Hashana][Israel=1/Galut=0]
    const yl = hBereshit.getYearLength();
    //Day of week of Rosh Hashana, is same day as 22 Tishri, ie. eve of hBereshit
    const dow = (hBereshit.getDayOfWeek() + 6) % 7;
    const kevvia = yl * 100 + dow * 10 + (israel ? 1 : 0);

    this.parshiot = Parasha.getArrayParshiot(kevvia, n);

    if ((this.parshiot?.length ?? 0) === 0) {
      this.festival = Festival.onDate(hdate, israel);
    }

    //Detect now if it is one of the 4 special parshiot:
    this.computeSpecialParasha(hdate);
  }

  /**
   * Returns the weekly parshiot of week #$n starting from the week of
   * Bereshit, given a kevvia formed with:
   * [YearLength][DayOfWeekRoshHashana][Israel/Galout(1/0)] The returned value
   * is null if no regular sidra (holiday sidra), or an array of one integer,
   * if one sidra read (its index in the parasha table), or an array of two
   * integers if mehhubarin.
   *
   *
   * @param kevvia The Hebrew Year Type
   * @param n The number of full weeks since Bereshit
   * @return array
   */
  private static getArrayParshiot(kevvia: number, n: number): number[] {
    const strLayout = Parasha.getKevviaString(kevvia);
    const c = strLayout.charAt(n);

    if (c == "/") {
      return null;
    }
    const result = [];

    if (c == ".") {
      result.push(n - 1);
    } else if (c == ":") {
      result.push(n - 2);
    } else if (c >= "0" && c <= "9") {
      result.push(n + c.charCodeAt(0) - "0".charCodeAt(0));
    } else if (c >= "a" && c <= "e") {
      result.push(n + c.charCodeAt(0) - "a".charCodeAt(0));
      result.push(n + c.charCodeAt(0) - "a".charCodeAt(0) + 1);
    } else if (c >= "B") {
      result.push(n - 1 - (c.charCodeAt(0) - "B".charCodeAt(0)));
      result.push(n - (c.charCodeAt(0) - "B".charCodeAt(0)));
    }

    return result;
  }

  /**
   * Returns a string where each character represents a week, and whose
   * meaning is as follows:
   *
   * 0 = parasha's number is same as position in string (0-based both) 1..5 =
   * parasha's number is x + position / = no parasha this week a = two
   * parshiot : current position and next parasha b = two parshiot :
   * 1+position and next c..e = two parshiot, same as above but with 2+ and 3+
   * . = parasha's number is position-1 : = parasha's number is position-2 B =
   * two parshiot : position-1 and position C = two parshiot : position-2 and
   * position-1
   */
  private static getKevviaString(kevvia: number): string {
    switch (kevvia) {
      case 35310:
      case 35311:
      case 35560:
      case 35561:
        return "000000000000000000000a11/0ab2c33333333d4444444e5//";
      case 35360:
      case 35361:
        return "000000000000000000000a11/0ab2c33333333d4444444444/";
      case 35420:
      case 35510:
        return "000000000000000000000a11/0ab2c3/2222c3d4444444e/4//";
      case 35421:
      case 35511:
        return "000000000000000000000a11/0ab2c33333333d4444444e/4//";
      case 35440:
        return "000000000000000000000a11//.Ba1b22222222c3333333333/";
      case 35441:
        return "000000000000000000000a11/0ab22222222222c3333333333/";
      case 35540:
      case 35541:
        return "0000000000000000000000000/.Ba1b22222222c3333333333/";
      case 38311:
      case 38561:
        return "0000000000000000000000000000/.............B0000000a/0//";
      case 38340:
      case 38341:
        return "00000000000000000000000000000/......................../";
      case 38360:
      case 38361:
        return "0000000000000000000000000000/.............B0000000a1//";
      case 38421:
      case 38511:
        return "0000000000000000000000000000/........................./";
      case 38420:
      case 38510:
        return "0000000000000000000000000000//:::::::::::::C........../";
      case 38540:
      case 38541:
        return "00000000000000000000000000000/.....................B0//";
      case 38310:
      case 38560:
        return "0000000000000000000000000000/....../::::C.B0000000a/0//";
      default:
        throw new Error("Invalid Kevyya: " + kevvia);
    }
  }

  private computeSpecialParasha(hdate: HDate): void {
    this.special = undefined;

    //Don't need to bother computing, if we are in a month that is not
    //likely to bear one of the special parshiot.

    const hdateMonth = hdate.getMonth();

    if (
      hdateMonth != HDateMonth.SHVAT &&
      hdateMonth != HDateMonth.ADAR &&
      hdateMonth != HDateMonth.ADAR2 &&
      hdateMonth != HDateMonth.NISSAN
    ) {
      return;
    }

    const purim = HDate.make(14, hdate.getNumberOfMonths(), hdate.getYear());

    const hShabbatZachor = HDate.make(purim).plus(-(purim.getDayOfWeek() + 1));
    const hShabbatZachorMinus7 = HDate.make(hShabbatZachor).plus(-7);

    if (hdate.lte(hShabbatZachor) && hdate.gt(hShabbatZachorMinus7)) {
      this.special = ParashaSpecial.ZACHOR;
      return;
    }

    const hFirstAdar = HDate.make(1, hdate.getNumberOfMonths(), hdate.getYear());
    const hShabbatSheqalim = hFirstAdar.plus(
      hFirstAdar.getDayOfWeek() == DayOfWeek.SHABBAT
        ? 0
        : -(hFirstAdar.getDayOfWeek() + 1)
    );

    const hShabbatSheqalimMinus7 = HDate.make(hShabbatSheqalim).plus(-7);

    if (hdate.lte(hShabbatSheqalim) && hdate.gt(hShabbatSheqalimMinus7)) {
      this.special = ParashaSpecial.SHEQALIM;
      return;
    }

    const hShabbatHaChodesh = HDate.make(1, HDateMonth.NISSAN, hdate.getYear());
    if (hShabbatHaChodesh.getDayOfWeek() != DayOfWeek.SHABBAT) {
      hShabbatHaChodesh.plus(-(hShabbatHaChodesh.getDayOfWeek() + 1));
    }
    const hShabbatParah = hShabbatHaChodesh.plus(-7);
    if (hdate.lte(hShabbatHaChodesh) && hdate.gt(hShabbatParah)) {
      this.special = ParashaSpecial.HACHODESH;
      return;
    }

    const hShabbatParahMinus7 = hShabbatParah.plus(-7);
    if (hdate.lte(hShabbatParah) && hdate.gt(hShabbatParahMinus7)) {
      this.special = ParashaSpecial.PARAH;
      return;
    }

    const hPesach = Festival.pesach(
      hdate.getYear(),
      ParashaScheme.ISRAEL
    ).getStartDate();
    const hShabbatHaGadol = hPesach.plus(-(hPesach.getDayOfWeek() + 1));
    if (hdate.lte(hShabbatHaGadol) && hdate.gt(hShabbatHaGadol.plus(-7))) {
      this.special = ParashaSpecial.HAGADOL;
    }
  }

  private static hebrewSidraNames = [
    "בראשית",
    "נח",
    "לך לך",
    "וירא",
    "חיי-שרה",
    "תולדות",
    "ויצא",
    "וישלח",
    "וישב",
    "מקץ",
    "ויגש",
    "ויחי",
    "שמות",
    "וארא",
    "בא",
    "בשלח",
    "יתרו",
    "משפטים",
    "תרומה",
    "תצוה",
    "כי-תשא",
    "ויקהל",
    "פקודי",
    "ויקרא",
    "צו",
    "שמיני",
    "תזריע",
    "מצורע",
    "אחרי מות",
    "קדושים",
    "אמור",
    "בהר",
    "בחקתי",
    "במדבר",
    "נשא",
    "בהעלתך",
    "שלח",
    "קרח",
    "חקת",
    "בלק",
    "פינחס",
    "מטות",
    "מסעי",
    "דברים",
    "ואתחנן",
    "עקב",
    "ראה",
    "שפטים",
    "כי-תצא",
    "כי-תבוא",
    "נצבים",
    "וילך",
    "האזינו",
    "וזאת-הברכה",
  ] as const;

  public static getSidraHebrewName(n: number): string | null {
    if (0 <= n && n <= 53) return Parasha.hebrewSidraNames[n];
    return null;
  }

  public getHebrewName(): string {
    if ((this.parshiot?.length ?? 0) == 0) {
      return undefined; // Holiday...
    }

    if (this.parshiot.length == 1) {
      return Parasha.getSidraHebrewName(this.parshiot[0]);
    } else {
      return `${Parasha.getSidraHebrewName(
        this.parshiot[0]
      )} - ${Parasha.getSidraHebrewName(this.parshiot[1])}`;
    }
  }

  public getSpecial(): ParashaSpecial {
    return this.special;
  }

  public getSpecialName(): string {
    return this.special && specialParashaNames[this.special];
  }

  public getFestivalName(): string {
    if (this.festival) {
      return this.festival.getName();
    }
  }
}
