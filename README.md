## HTML
~~~
<script src="https://cdn.jsdelivr.net/npm/@calj.net/jdates"></script>


<script>
  const {
    GDate, 
    HDate,
    HDateMonth,
    Parasha,
    ParashaScheme
  } = CalJ;

  console.log("This week's Parasha:",
    Parasha.make(GDate.today(), ParashaScheme.ISRAEL)
      .getHebrewName()
  );

  const h = HDate.make(GDate.make(9, 2, 2023));
  console.log("9 Feb 2023 is: ",
    `${h.getDay()} ${h.getMonthName()} ${h.getYear()}`);

  const hYomKippur = HDate.make(10, HDateMonth.TISHRI, 5780));
  const gYomKippur = GDate.make(hYomKippur);
  console.log("Yom Kippur 5780 is: ", `${gYomKippur}`);
</script>
~~~
