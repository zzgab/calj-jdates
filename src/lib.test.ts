import { GDate, HDate, Parasha } from "./lib";

describe("HDate", () => {
  it("should convert from GDate", () => {
    expect(`${HDate.convert(new GDate(9, 10, 1974))}`).toBe("5735-07-23");
  });
});

describe("Parasha", () => {
  it("should calculate", () => {
    const g = new GDate(16, 2, 2023);
    const parasha = new Parasha(g, true);
    expect(parasha.getHebrewName()).toEqual("משפטים");
  });

  it("should have special parasha", () => {
    expect(new Parasha(new GDate(2, 3, 2023), true).getSpecialName()).toEqual(
      "זכור"
    );
  });
});
