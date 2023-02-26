import { Anniversary } from "../src";

describe("Anniversary class", () => {
  it("should calculate any birthday", () => {
    expect(
      new Anniversary(new Date("2000-01-01")).calcBirthday(5783).toString()
    ).toEqual("5783-10-23");
  });

  it("should calculate birthday 30 Cheshvan of short year", () => {
    expect(
      new Anniversary(new Date("2022-11-24")).calcBirthday(5784).toString()
    ).toEqual("5784-09-01");
  });

  it("should calculate birthday 30 Cheshvan of long year", () => {
    expect(
      new Anniversary(new Date("2022-11-24")).calcBirthday(5785).toString()
    ).toEqual("5785-08-30");
  });

  it("should calculate birthday 30 Kislev of short year", () => {
    expect(
      new Anniversary(new Date("2022-12-24")).calcBirthday(5784).toString()
    ).toEqual("5784-10-01");
  });

  it("should calculate birthday 30 Kislev of long year", () => {
    expect(
      new Anniversary(new Date("2022-12-24")).calcBirthday(5785).toString()
    ).toEqual("5785-09-30");
  });

  it("should calculate birthday Adar in leap year target", () => {
    expect(
      new Anniversary(new Date("2021-02-24")).calcBirthday(5782).toString()
    ).toEqual("5782-13-12");
  });

  it("should calculate birthday Adar(1 or 2) into simple year target", () => {
    expect(
      new Anniversary(new Date("2022-03-15")).calcBirthday(5783).toString()
    ).toEqual("5783-12-12");
    expect(
      new Anniversary(new Date("2022-02-13")).calcBirthday(5783).toString()
    ).toEqual("5783-12-12");
  });
});
