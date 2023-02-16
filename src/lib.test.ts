import { GDate, HDate, Parasha } from "./lib";

describe("HDate", () => {
  it("should convert from GDate", () => {
    expect(`${HDate.convert(new GDate(1974, 10, 9))}`).toBe("5735-07-23");
  });
});

describe("Parasha", () => {
  it("should calculate", () => {
    const g = new GDate(2023, 2, 16);
    const parasha = new Parasha(g, true);
    expect(parasha.getHebrewName()).toEqual("משפטים");
  });
});
