import {GDate, HDate} from "./lib";

console.log(HDate.convert((new GDate(1974, 10, 9))));
console.log(`${HDate.today()}`);
console.log(`${GDate.today()}`);
