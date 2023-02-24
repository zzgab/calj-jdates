const { GDate, HDate, HDateMonth } = require("@calj.net/jdates");

console.log(GDate.make(HDate.make(2, HDateMonth.ADAR, 5783)).toString());
