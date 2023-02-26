import { Anniversary } from "../src";
import { AnniversaryType, Rite } from "../src/Anniversary";

describe("Anniversary class: Birthday", () => {
  it("should calculate any birthday", () => {
    expect(
      new Anniversary(new Date("2000-01-01"), AnniversaryType.BIRTHDAY)
        .calc(5783)
        .toString()
    ).toEqual("5783-10-23");
  });

  it("should not travel back", () => {
    expect(
      new Anniversary(new Date("2000-01-01"), AnniversaryType.BIRTHDAY).calc(
        5720
      )
    ).toBe(null);
  });

  it("should calculate 30 Cheshvan of short year", () => {
    expect(
      new Anniversary(new Date("2022-11-24"), AnniversaryType.BIRTHDAY)
        .calc(5784)
        .toString()
    ).toEqual("5784-09-01");
  });

  it("should calculate 30 Cheshvan of long year", () => {
    expect(
      new Anniversary(new Date("2022-11-24"), AnniversaryType.BIRTHDAY)
        .calc(5785)
        .toString()
    ).toEqual("5785-08-30");
  });

  it("should calculate 30 Kislev of short year", () => {
    expect(
      new Anniversary(new Date("2022-12-24"), AnniversaryType.BIRTHDAY)
        .calc(5784)
        .toString()
    ).toEqual("5784-10-01");
  });

  it("should calculate 30 Kislev of long year", () => {
    expect(
      new Anniversary(new Date("2022-12-24"), AnniversaryType.BIRTHDAY)
        .calc(5785)
        .toString()
    ).toEqual("5785-09-30");
  });

  it("should calculate Adar in leap year target -> Adar2", () => {
    expect(
      new Anniversary(new Date("2021-02-24"), AnniversaryType.BIRTHDAY)
        .calc(5782)
        .toString()
    ).toEqual("5782-13-12");
  });

  it("should calculate birthday Adar(1 or 2) into simple year target", () => {
    expect(
      new Anniversary(new Date("2022-03-15"), AnniversaryType.BIRTHDAY)
        .calc(5783)
        .toString()
    ).toEqual("5783-12-12");
    expect(
      new Anniversary(new Date("2022-02-13"), AnniversaryType.BIRTHDAY)
        .calc(5783)
        .toString()
    ).toEqual("5783-12-12");
  });
});

describe("Anniversary class: Azcara", () => {
  it("should calculate 1 Kislev if ptira 30 Chesvhan followed by 30 Cheshvan", () => {
    expect(
      new Anniversary(new Date("1982-11-16"), AnniversaryType.AZCARA)
        .calc(5745)
        .toString()
    ).toBe("5745-09-01");
  });
  it("should calculate 29 Chesvhan if ptira 30 Chesvhan followed by 29 Cheshvan", () => {
    expect(
      new Anniversary(new Date("1983-11-06"), AnniversaryType.AZCARA)
        .calc(5746)
        .toString()
    ).toBe("5746-08-29");
  });
  it("should calculate 1 Tevet if ptira 30 Kislev followed by 30 Kislev", () => {
    expect(
      new Anniversary(new Date("1983-12-06"), AnniversaryType.AZCARA)
        .calc(5746)
        .toString()
    ).toBe("5746-10-01");
  });
  it("should calculate 29 Kislev if ptira 30 Kislev followed by 29 Kislev", () => {
    expect(
      new Anniversary(new Date("1984-12-24"), AnniversaryType.AZCARA)
        .calc(5749)
        .toString()
    ).toBe("5749-09-29");
  });
  it("should calculate 30 Kislev if target year has 30 Kislev", () => {
    expect(
      new Anniversary(new Date("1984-12-24"), AnniversaryType.AZCARA)
        .calc(5748)
        .toString()
    ).toBe("5748-09-30");
  });

  it("should calculate Adar in leap year target -> Adar2 for Sefarad", () => {
    expect(
      new Anniversary(new Date("2021-02-24"), AnniversaryType.AZCARA)
        .calc(5782)
        .toString()
    ).toEqual("5782-13-12");
  });
  it("should calculate Adar in leap year target -> Adar1 for Ashkenaz", () => {
    expect(
      new Anniversary(
        new Date("2021-02-24"),
        AnniversaryType.AZCARA,
        Rite.ASHKENAZI
      )
        .calc(5782)
        .toString()
    ).toEqual("5782-12-12");
  });
});
