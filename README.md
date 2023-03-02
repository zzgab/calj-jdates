# @calj.net/jdates
[![npm version](https://img.shields.io/badge/dynamic/json?logo=npm&url=https://registry.npmjs.org/-/package/@calj.net/jdates/dist-tags&label=npm&color=success&query=$.latest)](https://www.npmjs.com/package/@calj.net/jdates)

The Jewish dates toolbox used on [https://calj.net](https://calj.net).
- Manipulate Jewish and Gregorian dates
- Transform dates between the two calendar systems
- Compute the weekly Parasha
- Compute the dates of the Holidays

![CalJ.net](https://calj.net/img/title.jpg)

## Modes
The library can be used in [Node](https://www.npmjs.com/package/@calj.net/jdates) (both **ESM** and **CommonJS**) and in the [browser](https://cdn.jsdelivr.net/npm/@calj.net/jdates):

### Node ESM

~~~js
import { GDate, HDate, Festival, Parasha } from "@calj.net/jdates";
~~~

### Node CommonJS

~~~js
const { GDate, HDate, Festival, Parasha } = require("@calj.net/jdates");
~~~

### Browser

~~~html
<script
src="https://cdn.jsdelivr.net/npm/@calj.net/jdates">
</script>

<script>
const {
  Festival,
  GDate,
  HDate,
  Parasha,
} = CalJ;
</script>
~~~

## Examples

~~~js
console.log("This week's Parasha in Israel:",
  new HebrewParashaLocalizer().sidra(Parasha.make(
    GDate.today(), ParashaScheme.ISRAEL
  ))
);

const h = HDate.make(GDate.make(9, 2, 2023));
console.log("9 Feb 2023 is: ",
  `${h.getDay()} ${h.getMonthName()} ${h.getYear()}`);

const yomKippur = Festival.yomKippur(5780);
const gYomKippur = GDate.make(yomKippur.getStartDate());
console.log("Yom Kippur 5780 is: ", `${gYomKippur}`);
~~~

## API

You can instantiate [GDate](#GDate) and [HDate](#HDate) immutable objects, both extending the `JDate` abstract.

### GDate

* `static GDate.`**make**`(date: Date): GDate`

  \
  Obtain a Gregorian date from a JavaScript Date instance.


* `static GDate.`**make**`(jdate: JDate): GDate`

  \
  Obtain a Gregorian date from another instance, which may be of class [GDate](#GDate) (copy), or [HDate](#HDate) (conversion).


* `static GDate.`**make**`(day: number, month: number, year: number): GDate`

  \
  Obtain a [GDate](#GDate) instance positionned on the specified Gregorian date elements.

### HDate

* `static HDate.`**make**`(date: Date): HDate`

  \
  Obtain a Jewish date from a JavaScript Date instance.


* `static HDate.`**make**`(jdate: JDate): HDate`

  \
  Obtain a Jewish date from another instance, which may be of class [HDate](#HDate) (copy), or [GDate](#GDate) (conversion).


* `static HDate.`**make**`(day: number, month: `[HDateMonth](#HDateMonth)`, year: number): HDate`

  \
  Obtain an [HDate](#HDate) instance positionned on the specified Jewish date elements.

### HDateMonth

An `enum` of the Jewish months:

~~~
{
    TISHRI,
    CHESHVAN,
    KISLEV,
    TEVET,
    SHVAT,
    ADAR,
    ADAR2,
    NISSAN,
    IYAR,
    SIVAN,
    TAMUZ,
    AV,
    ELUL,
}
~~~

### JDate

 - `.eq`, `.lt`, `.lte`, `.gt`, `.gte (other: JDate): boolean`
 
    \
    Boolean functions accepting an instance of `JDate`, to check respectively
    if the argument is `==`, `<`, `<=`, `>`, `>=` to `this` instance.
    The comparison is done on the date itself, as a point in time, rather than
    equality of the objects or any other date components that represent the date
    in one system or the other.