# @calj.net/jdates

The Jewish dates toolbox used on [https://calj.net](https://calj.net).
- Manipulate Jewish and Gregorian dates
- Transform dates between the two calendar systems
- Compute the weekly Parasha
- Compute the dates of the Holidays

## Modes
The library can be used in Node (both *ESM* and *CommonJS*) and in the browser:
~~~
<html>
  <script
    src="https://cdn.jsdelivr.net/npm/@calj.net/jdates">
  </script>

  <script>
    const {
      Festival,
      GDate,
      HDate,
      Parasha,
      ParashaScheme
    } = CalJ;
    
    console.log("This week's Parasha in Israel:",
      Parasha.make(
        GDate.today(), ParashaScheme.ISRAEL
      ).getHebrewName()
    );

    const h = HDate.make(GDate.make(9, 2, 2023));
    console.log("9 Feb 2023 is: ",
      `${h.getDay()} ${h.getMonthName()} ${h.getYear()}`);

    const yomKippur = Festival.makeYomKippur(5780);
    const gYomKippur = GDate.make(yomKippur.getStartDate());
    console.log("Yom Kippur 5780 is: ", `${gYomKippur}`);
  </script>
</html>
~~~

## API

You can instantiate [GDate](#GDate) and [HDate](#HDate) immutable objects, both extending the `JDate` abstract.

### GDate

* `static GDate.`**make**`(jdate: JDate): GDate`

  \
  Obtain a Gregorian date from another instance, which may be of class [GDate](#GDate) (copy), or [HDate](#HDate) (conversion).


* `static GDate.`**make**`(day: number, month: number, year: number): GDate`

  \
  Obtain a [GDate](#GDate) instance positionned on the specified Gregorian date elements.

### HDate

* `static HDate.`**make**`(jdate: JDate): HDate`

  \
  Obtain a Jewish date from another instance, which may be of class [HDate](#HDate) (copy), or [GDate](#GDate) (conversion).


* `static HDate.`**make**`(day: number, month: `[HDateMonth](#HDateMonth)`, year: number): HDate`

  \
  Obtain an [HDate](#HDate) instance positionned on the specified Jewish date elements.

### HDateMonth
