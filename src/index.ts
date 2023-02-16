import {GDate, HDate, Parasha} from "./lib";

console.log(HDate.convert((new GDate(1974, 10, 9))));
console.log(`${HDate.today()}`);
console.log(`${GDate.today()}`);

const g = GDate.today();
const parasha = new Parasha(g, true);
console.log(parasha.getHebrewName());