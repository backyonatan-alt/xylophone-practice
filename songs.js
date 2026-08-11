/* Song data — one object per song. Adding a song = adding one object here.
   bar: 1–8 (low C → high C per the physical instrument).
   duration: 1 normal, 2 long (wider block + double hold in auto mode).
   Bilingual songs: syllable = { he, en } with lyricsLang: "both". */
(function () {
  const N = (bar, syllable, duration) => ({ bar, syllable, duration: duration || 1 });

  window.SONGS = [
    { id: 'yonatan', slug: 'yonatan-hakatan', title: 'יונתן הקטן', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { lyricLine: "יונתן הקטן", notes: [N(5,'יוֹ'),N(3,'נָ'),N(3,'תָן'),N(4,'הַ'),N(2,'קָ'),N(2,'טָן')] },
      { lyricLine: "רץ בבוקר אל הגן", notes: [N(1,'רָץ'),N(2,'בַּ'),N(3,'בֹּ'),N(4,'קֶר'),N(5,'אֶל'),N(5,'הַ'),N(5,'גָּן',2)] },
      { lyricLine: "הוא טיפס על העץ", notes: [N(5,'הוּא'),N(3,'טִי'),N(3,'פֵּס'),N(4,'עַל'),N(2,'הָ'),N(2,'עֵץ')] },
      { lyricLine: "אפרוחים חיפש", notes: [N(1,'אֶפ'),N(3,'רוֹ'),N(5,'חִים'),N(5,'חִי'),N(1,'פֵּשׂ',2)] },
      { lyricLine: "אוי ואבוי לו לשובב", notes: [N(2,'אוֹי'),N(2,'וַא'),N(2,'בוֹי'),N(2,'לוֹ'),N(3,'לַ'),N(4,'שּׁוֹ'),N(4,'בָב',2)] },
      { lyricLine: "חור גדול במכנסיו", notes: [N(3,'חוֹר'),N(3,'גָּ'),N(3,'דוֹל'),N(3,'בְּ'),N(4,'מִכ'),N(5,'נָ'),N(5,'סָיו',2)] },
      { lyricLine: "מן העץ התגלגל", notes: [N(5,'מִן'),N(3,'הָ'),N(3,'עֵץ'),N(4,'הִת'),N(2,'גַּל'),N(2,'גֵּל')] },
      { lyricLine: "ועונשו קיבל", notes: [N(1,'וְ'),N(3,'עָנ'),N(5,'שׁוֹ'),N(5,'קִ'),N(1,'בֵּל',2)] }
    ]},
    { id: 'twinkle', slug: 'twinkle-twinkle', title: 'Twinkle Twinkle Little Star', difficulty: 'easy', lyricsLang: 'both', phrases: [
      { lyricLine: { he: "נצנוץ נצנוץ כוכב קט", en: "Twinkle twinkle little star" }, notes: [N(1,{he:'נִצ',en:'Twin'}),N(1,{he:'נוֹץ',en:'kle'}),N(5,{he:'נִצ',en:'twin'}),N(5,{he:'נוֹץ',en:'kle'}),N(6,{he:'כּוֹ',en:'lit'}),N(6,{he:'כָב',en:'tle'}),N(5,{he:'קָט',en:'star'},2)] },
      { lyricLine: { he: "הו איך נפלא מה אתה", en: "How I wonder what you are" }, notes: [N(4,{he:'הוֹ',en:'how'}),N(4,{he:'אֵיךְ',en:'I'}),N(3,{he:'נִפ',en:'won'}),N(3,{he:'לָא',en:'der'}),N(2,{he:'מָה',en:'what'}),N(2,{he:'אַ',en:'you'}),N(1,{he:'תָּה',en:'are'},2)] },
      { lyricLine: { he: "מעל העולם גבוה", en: "Up above the world so high" }, notes: [N(5,{he:'מֵ',en:'up'}),N(5,{he:'עַל',en:'a'}),N(4,{he:'הָ',en:'bove'}),N(4,{he:'עוֹ',en:'the'}),N(3,{he:'לָם',en:'world'}),N(3,{he:'גָּ',en:'so'}),N(2,{he:'בוֹהַּ',en:'high'},2)] },
      { lyricLine: { he: "כמו יהלום בשמיים", en: "Like a diamond in the sky" }, notes: [N(5,{he:'כְּמוֹ',en:'like'}),N(5,{he:'יַ',en:'a'}),N(4,{he:'הֲ',en:'dia'}),N(4,{he:'לוֹם',en:'mond'}),N(3,{he:'בַּ',en:'in'}),N(3,{he:'שָּׁ',en:'the'}),N(2,{he:'מַיִם',en:'sky'},2)] },
      { lyricLine: { he: "נצנוץ נצנוץ כוכב קט", en: "Twinkle twinkle little star" }, notes: [N(1,{he:'נִצ',en:'Twin'}),N(1,{he:'נוֹץ',en:'kle'}),N(5,{he:'נִצ',en:'twin'}),N(5,{he:'נוֹץ',en:'kle'}),N(6,{he:'כּוֹ',en:'lit'}),N(6,{he:'כָב',en:'tle'}),N(5,{he:'קָט',en:'star'},2)] },
      { lyricLine: { he: "הו איך נפלא מה אתה", en: "How I wonder what you are" }, notes: [N(4,{he:'הוֹ',en:'how'}),N(4,{he:'אֵיךְ',en:'I'}),N(3,{he:'נִפ',en:'won'}),N(3,{he:'לָא',en:'der'}),N(2,{he:'מָה',en:'what'}),N(2,{he:'אַ',en:'you'}),N(1,{he:'תָּה',en:'are'},2)] }
    ]},
    { id: 'mary', slug: 'mary-had-a-little-lamb', title: 'Mary Had a Little Lamb', difficulty: 'easy', lyricsLang: 'en', phrases: [
      { lyricLine: "Mary had a little lamb", notes: [N(3,'Ma'),N(2,'ry'),N(1,'had'),N(2,'a'),N(3,'lit'),N(3,'tle'),N(3,'lamb',2)] },
      { lyricLine: "Little lamb, little lamb", notes: [N(2,'lit'),N(2,'tle'),N(2,'lamb',2),N(3,'lit'),N(5,'tle'),N(5,'lamb',2)] },
      { lyricLine: "Mary had a little lamb, its", notes: [N(3,'Ma'),N(2,'ry'),N(1,'had'),N(2,'a'),N(3,'lit'),N(3,'tle'),N(3,'lamb'),N(3,'its')] },
      { lyricLine: "Fleece was white as snow", notes: [N(2,'fleece'),N(2,'was'),N(3,'white'),N(2,'as'),N(1,'snow',2)] }
    ]},
    // Note: the עוגה עוגה and הנה מה טוב melodies are plausible arrangements —
    // verify against how the family sings them before ship.
    { id: 'uga', slug: 'uga-uga', title: 'עוגה עוגה', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { lyricLine: "עוגה עוגה עוגה", notes: [N(5,'עוּ'),N(3,'גָה'),N(5,'עוּ'),N(3,'גָה'),N(5,'עוּ'),N(3,'גָה')] },
      { lyricLine: "במעגל נחוגה", notes: [N(4,'בַּ'),N(2,'מַע'),N(4,'גָל'),N(2,'נָ'),N(4,'חוּ'),N(2,'גָה')] },
      { lyricLine: "נסתובבה כל היום", notes: [N(1,'נִס'),N(2,'תּוֹ'),N(3,'בְ'),N(4,'בָה'),N(5,'כָּל'),N(5,'הַ'),N(5,'יּוֹם',2)] },
      { lyricLine: "עד אשר נמצא מקום", notes: [N(1,'עַד'),N(2,'אֲ'),N(3,'שֶׁר'),N(4,'נִמ'),N(5,'צָא'),N(5,'מָ'),N(5,'קוֹם',2)] },
      { lyricLine: "לשבת, לקום", notes: [N(5,'לָ'),N(4,'שֶׁ'),N(3,'בֶת',2),N(2,'לָ'),N(1,'קוּם',2)] }
    ]},
    { id: 'hine', slug: 'hine-ma-tov', title: 'הנה מה טוב', difficulty: 'medium', lyricsLang: 'he', phrases: [
      { lyricLine: "הנה מה טוב", notes: [N(1,'הִ'),N(3,'נֵּה'),N(5,'מַה'),N(5,'טּוֹב',2)] },
      { lyricLine: "ומה נעים", notes: [N(6,'וּ'),N(5,'מַה'),N(4,'נָּ'),N(3,'עִים',2)] },
      { lyricLine: "שבת אחים", notes: [N(2,'שֶׁ'),N(3,'בֶת'),N(4,'אַ'),N(2,'חִים',2)] },
      { lyricLine: "גם יחד", notes: [N(3,'גַּם'),N(2,'יָ'),N(1,'חַד',2)] }
    ]},
    // Note: the נד נד melody is a plausible arrangement — verify against how
    // the family sings it before ship.
    { id: 'nadned', slug: 'nad-ned', title: 'נד נד', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { lyricLine: "נד נד, נד נד", notes: [N(5,'נַד'),N(3,'נֵד'),N(5,'נַד'),N(3,'נֵד')] },
      { lyricLine: "רד עלה, עלה ורד", notes: [N(5,'רֵד'),N(6,'עֲ'),N(5,'לֵה'),N(6,'עֲ'),N(5,'לֵה'),N(4,'וָ'),N(3,'רֵד',2)] },
      { lyricLine: "מה למעלה? מה למטה?", notes: [N(5,'מַה'),N(5,'לְּ'),N(6,'מַעְ'),N(6,'לָה'),N(3,'מַה'),N(3,'לְּ'),N(4,'מַ'),N(4,'טָּה')] },
      { lyricLine: "רק אני, אני ואתה", notes: [N(5,'רַק'),N(4,'אֲ'),N(3,'נִי'),N(2,'אֲ'),N(3,'נִי'),N(2,'וָ'),N(2,'אַ'),N(1,'תָּה',2)] }
    ]},
    // Happy Birthday arranged for an 8-note C-major toy (the melody's usual key
    // needs a Bb — the last line uses the common toy substitution of דו׳ instead).
    { id: 'birthday', slug: 'yom-huledet-sameach', title: 'יום הולדת שמח', difficulty: 'medium', lyricsLang: 'he', phrases: [
      { lyricLine: "יום הולדת שמח", notes: [N(1,'יוֹם'),N(1,'הֻ'),N(2,'לֶּ'),N(1,'דֶת'),N(4,'שָׂ'),N(3,'מֵחַ',2)] },
      { lyricLine: "יום הולדת שמח", notes: [N(1,'יוֹם'),N(1,'הֻ'),N(2,'לֶּ'),N(1,'דֶת'),N(5,'שָׂ'),N(4,'מֵחַ',2)] },
      { lyricLine: "יום הולדת שמח", notes: [N(1,'יוֹם'),N(1,'הֻ'),N(8,'לֶּ'),N(6,'דֶת'),N(4,'שָׂ'),N(3,'מֵ'),N(2,'חַ')] },
      { lyricLine: "יום הולדת שמח", notes: [N(8,'יוֹם'),N(8,'הֻ'),N(6,'לֶּ'),N(4,'דֶת'),N(5,'שָׂ'),N(4,'מֵחַ',2)] }
    ]},
    { id: 'rowboat', slug: 'row-row-row-your-boat', title: 'Row Row Row Your Boat', difficulty: 'easy', lyricsLang: 'en', phrases: [
      { lyricLine: "Row row row your boat", notes: [N(1,'Row'),N(1,'row'),N(1,'row'),N(2,'your'),N(3,'boat',2)] },
      { lyricLine: "Gently down the stream", notes: [N(3,'gent'),N(2,'ly'),N(3,'down'),N(4,'the'),N(5,'stream',2)] },
      { lyricLine: "Merrily merrily merrily merrily", notes: [N(8,'mer'),N(8,'ri'),N(8,'ly'),N(5,'mer'),N(5,'ri'),N(5,'ly'),N(3,'mer'),N(3,'ri'),N(3,'ly'),N(1,'mer'),N(1,'ri'),N(1,'ly')] },
      { lyricLine: "Life is but a dream", notes: [N(5,'life'),N(4,'is'),N(3,'but'),N(2,'a'),N(1,'dream',2)] }
    ]},
    { id: 'london', slug: 'london-bridge', title: 'London Bridge', difficulty: 'easy', lyricsLang: 'en', phrases: [
      { lyricLine: "London Bridge is falling down", notes: [N(5,'Lon'),N(6,'don'),N(5,'Bridge'),N(4,'is'),N(3,'fall'),N(4,'ing'),N(5,'down',2)] },
      { lyricLine: "Falling down, falling down", notes: [N(2,'fall'),N(3,'ing'),N(4,'down',2),N(3,'fall'),N(4,'ing'),N(5,'down',2)] },
      { lyricLine: "London Bridge is falling down", notes: [N(5,'Lon'),N(6,'don'),N(5,'Bridge'),N(4,'is'),N(3,'fall'),N(4,'ing'),N(5,'down',2)] },
      { lyricLine: "My fair lady", notes: [N(2,'my'),N(5,'fair'),N(3,'la'),N(1,'dy',2)] }
    ]},
    // Ode to Joy — no standard Hebrew children's lyric, so it's sung on לה.
    { id: 'odetojoy', slug: 'ode-to-joy', title: 'שיר השמחה (בטהובן)', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { lyricLine: "שורה 1", notes: [N(3,'לָה'),N(3,'לָה'),N(4,'לָה'),N(5,'לָה'),N(5,'לָה'),N(4,'לָה'),N(3,'לָה'),N(2,'לָה')] },
      { lyricLine: "שורה 2", notes: [N(1,'לָה'),N(1,'לָה'),N(2,'לָה'),N(3,'לָה'),N(3,'לָה',2),N(2,'לָה'),N(2,'לָה',2)] },
      { lyricLine: "שורה 3 (כמו שורה 1)", notes: [N(3,'לָה'),N(3,'לָה'),N(4,'לָה'),N(5,'לָה'),N(5,'לָה'),N(4,'לָה'),N(3,'לָה'),N(2,'לָה')] },
      { lyricLine: "שורה 4", notes: [N(1,'לָה'),N(1,'לָה'),N(2,'לָה'),N(3,'לָה'),N(2,'לָה',2),N(1,'לָה'),N(1,'לָה',2)] }
    ]},
    // בא אלי פרפר נחמד — Hänschen klein / Lightly Row tune, confident fit.
    { id: 'parpar', slug: 'parpar-nechmad', title: 'בא אלי פרפר נחמד', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { lyricLine: "בא אליי פרפר נחמד", notes: [N(5,'בָּא'),N(3,'אֵ'),N(3,'לַי'),N(4,'פַּר'),N(2,'פַּר'),N(2,'נֶחְ'),N(2,'מָד',2)] },
      { lyricLine: "ישב על כף היד", notes: [N(1,'יָ'),N(2,'שַׁב'),N(3,'עַל'),N(4,'כַּף'),N(5,'הַ'),N(5,'יָּד',2)] },
      { lyricLine: "קום פרפר, עוף פרח", notes: [N(5,'קוּם'),N(3,'פַּרְ'),N(3,'פַּר'),N(4,'עוּף'),N(2,'פְּ'),N(2,'רַח',2)] },
      { lyricLine: "שוב אלינו בוא", notes: [N(5,'שׁוּב'),N(4,'אֵ'),N(3,'לֵי'),N(2,'נוּ'),N(1,'בּוֹא',2)] }
    ]},
    // Note: plausible arrangement — verify against how the family sings it.
    { id: 'oto', slug: 'haoto-shelanu', title: 'האוטו שלנו גדול וירוק', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { lyricLine: "האוטו שלנו גדול וירוק", notes: [N(1,'הָ'),N(3,'אוֹ'),N(3,'טוֹ'),N(5,'שֶׁ'),N(5,'לָּ'),N(5,'נוּ'),N(6,'גָּ'),N(5,'דוֹל'),N(4,'וְיָ'),N(3,'רֹק',2)] },
      { lyricLine: "האוטו שלנו נוסע רחוק", notes: [N(2,'הָ'),N(4,'אוֹ'),N(4,'טוֹ'),N(5,'שֶׁ'),N(4,'לָּ'),N(3,'נוּ'),N(2,'נוֹ'),N(3,'סֵ'),N(2,'עַ'),N(2,'רָ'),N(1,'חוֹק',2)] },
      { lyricLine: "בבוקר נוסע, בערב הוא שב", notes: [N(3,'בַּ'),N(3,'בֹּ'),N(4,'קֶר'),N(5,'נוֹ'),N(5,'סֵ'),N(3,'עַ'),N(4,'בָּ'),N(4,'עֶ'),N(5,'רֶב'),N(6,'הוּא'),N(5,'שָׁב',2)] },
      { lyricLine: "מוביל הוא לתנובה ביצים וחלב", notes: [N(5,'מוֹ'),N(4,'בִיל'),N(3,'הוּא'),N(4,'לִתְ'),N(3,'נוּ'),N(2,'בָה'),N(3,'בֵּי'),N(2,'צִים'),N(2,'וְ'),N(2,'חָ'),N(1,'לָב',2)] }
    ]},
    // Note: plausible arrangement — this movement song varies between kindergartens.
    { id: 'yadaim', slug: 'yadaim-lemala', title: 'ידיים למעלה על הראש', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { lyricLine: "ידיים למעלה", notes: [N(5,'יָ'),N(3,'דַ'),N(3,'יִם'),N(5,'לְ'),N(3,'מַעְ'),N(3,'לָה')] },
      { lyricLine: "על הראש", notes: [N(5,'עַל'),N(4,'הָ'),N(3,'רֹאשׁ',2)] },
      { lyricLine: "על הכתפיים", notes: [N(5,'עַל'),N(5,'הַ'),N(6,'כְּתֵ'),N(4,'פַ'),N(4,'יִם',2)] },
      { lyricLine: "על המותניים", notes: [N(3,'עַל'),N(3,'הַ'),N(2,'מָּתְ'),N(2,'נַ'),N(1,'יִם',2)] }
    ]},
    // Itsy Bitsy Spider in Hebrew — confident melody fit.
    { id: 'akavish', slug: 'akavish-katanchik', title: 'עכביש קטנצ\'יק', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { lyricLine: "עכביש קטנצ'יק", notes: [N(1,'עַ'),N(1,'כָּ'),N(1,'בִישׁ'),N(2,'קְטַנְ'),N(3,'צִ\'יק',2)] },
      { lyricLine: "טיפס על המרזב", notes: [N(3,'טִ'),N(2,'פֵּס'),N(1,'עַל'),N(2,'הַ'),N(3,'מַּרְ'),N(1,'זֵב',2)] },
      { lyricLine: "ירד לו גשם", notes: [N(3,'יָ'),N(3,'רַד'),N(4,'לוֹ'),N(5,'גֶּ'),N(5,'שֶׁם',2)] },
      { lyricLine: "ושטף אותו מיד", notes: [N(5,'וְ'),N(4,'שָׁ'),N(3,'טַף'),N(2,'אוֹ'),N(3,'תוֹ'),N(2,'מִ'),N(1,'יָּד',2)] },
      { lyricLine: "יצאה השמש", notes: [N(3,'יָצְ'),N(3,'אָה'),N(4,'הַ'),N(5,'שֶּׁ'),N(5,'מֶשׁ',2)] },
      { lyricLine: "ייבשה את הגשם כבר", notes: [N(5,'יִבְּ'),N(4,'שָׁה'),N(3,'אֶת'),N(2,'הַ'),N(3,'גֶּ'),N(2,'שֶׁם'),N(1,'כְּבָר',2)] },
      { lyricLine: "עכביש קטנצ'יק", notes: [N(1,'עַ'),N(1,'כָּ'),N(1,'בִישׁ'),N(2,'קְטַנְ'),N(3,'צִ\'יק',2)] },
      { lyricLine: "טיפס שוב על המרזב", notes: [N(3,'טִ'),N(2,'פֵּס'),N(1,'שׁוּב'),N(2,'עַל'),N(3,'הַ'),N(2,'מַּרְ'),N(1,'זֵב',2)] }
    ]},
    // Note: plausible arrangement — verify against how the family sings it.
    { id: 'aviron', slug: 'aviron', title: 'רד אלינו אווירון', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { lyricLine: "רד אלינו אווירון", notes: [N(5,'רֵד'),N(5,'אֵ'),N(6,'לֵי'),N(6,'נוּ'),N(5,'אֲ'),N(4,'וִי'),N(3,'רוֹן',2)] },
      { lyricLine: "קח אותנו למרום", notes: [N(4,'קַח'),N(4,'אוֹ'),N(5,'תָ'),N(5,'נוּ'),N(4,'לַ'),N(3,'מָּ'),N(2,'רוֹם',2)] },
      { lyricLine: "ונטוס מעל ההרים", notes: [N(3,'וְ'),N(3,'נָ'),N(4,'טוּס'),N(5,'מֵ'),N(5,'עַל'),N(6,'הֶ'),N(6,'הָ'),N(5,'רִים',2)] },
      { lyricLine: "מעל ימים וגם ערים", notes: [N(4,'מֵ'),N(4,'עַל'),N(3,'יַ'),N(3,'מִּים'),N(2,'וְ'),N(2,'גַם'),N(2,'עָ'),N(1,'רִים',2)] }
    ]},
    // Note: approximation — פזמון ליקינתון is a wistful waltz and this arrangement
    // especially needs family verification (and may need rework to fit 8 bars).
    { id: 'yakinton', slug: 'yakinton', title: 'פזמון ליקינתון', difficulty: 'medium', lyricsLang: 'he', phrases: [
      { lyricLine: "לילה לילה מסתכלת הלבנה", notes: [N(6,'לַיְ'),N(6,'לָה'),N(5,'לַיְ'),N(5,'לָה'),N(6,'מִסְ'),N(7,'תַּ'),N(8,'כֶּ'),N(7,'לֶת'),N(6,'הַלְּ'),N(5,'בָ'),N(6,'נָה',2)] },
      { lyricLine: "בפרחים אשר הנצו בגינה", notes: [N(5,'בַּפְּ'),N(5,'רָ'),N(4,'חִים'),N(4,'אֲ'),N(5,'שֶׁר'),N(6,'הֵ'),N(7,'נֵ'),N(6,'צוּ'),N(5,'בַּ'),N(4,'גִּ'),N(5,'נָּה',2)] },
      { lyricLine: "ונדמה לה כי ראתה בין הפרחים", notes: [N(4,'וְ'),N(4,'נִדְ'),N(5,'מֶה'),N(6,'לָהּ'),N(6,'כִּי'),N(5,'רָ'),N(4,'אֲ'),N(3,'תָה'),N(4,'בֵּין'),N(5,'הַפְּ'),N(4,'רָ'),N(3,'חִים',2)] },
      { lyricLine: "יקינתון אחד שונה מן האחים", notes: [N(6,'יַ'),N(6,'קִּינְ'),N(7,'טוֹן'),N(8,'אֶ'),N(7,'חָד'),N(6,'שׁוֹ'),N(5,'נֶה'),N(4,'מִן'),N(5,'הָ'),N(4,'אַ'),N(6,'חִים',2)] }
    ]},
    // Note: plausible arrangement — verify against how the family sings it.
    { id: 'eretz', slug: 'eretz-yisrael-sheli', title: 'ארץ ישראל שלי', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { lyricLine: "ארץ ישראל שלי", notes: [N(5,'אֶ'),N(5,'רֶץ'),N(5,'יִשְׂ'),N(4,'רָ'),N(3,'אֵל'),N(4,'שֶׁ'),N(5,'לִּי',2)] },
      { lyricLine: "יפה וגם פורחת", notes: [N(4,'יָ'),N(4,'פָה'),N(4,'וְ'),N(3,'גַם'),N(2,'פּוֹ'),N(3,'רַ'),N(4,'חַת',2)] },
      { lyricLine: "מי בנה ומי נטע?", notes: [N(5,'מִי'),N(5,'בָּ'),N(3,'נָה'),N(5,'וּ'),N(5,'מִי'),N(3,'נָ'),N(3,'טַע',2)] },
      { lyricLine: "כולנו ביחד!", notes: [N(4,'כֻּ'),N(4,'לָּ'),N(3,'נוּ'),N(2,'בְּ'),N(2,'יַ'),N(1,'חַד',2)] }
    ]},
    // Note: minor-key lullaby squeezed onto the white keys — plausible arrangement,
    // verify against how the family sings it.
    { id: 'dugit', slug: 'dugit-nosaat', title: 'דוגית נוסעת', difficulty: 'medium', lyricsLang: 'he', phrases: [
      { lyricLine: "דוגית נוסעת", notes: [N(3,'דּוּ'),N(6,'גִית'),N(6,'נוֹ'),N(7,'סַ'),N(6,'עַת',2)] },
      { lyricLine: "מפרשיה שניים", notes: [N(5,'מִפְ'),N(5,'רָ'),N(6,'שֶׂי'),N(5,'הָ'),N(4,'שְׁנַ'),N(3,'יִם',2)] },
      { lyricLine: "ומלחיה נרדמו", notes: [N(3,'וּ'),N(4,'מַ'),N(5,'לָּ'),N(6,'חֶי'),N(5,'הָ'),N(4,'נִרְ'),N(3,'דְּ'),N(2,'מוּ')] },
      { lyricLine: "כולם", notes: [N(3,'כֻּ'),N(6,'לָּם',2)] }
    ]},
    // Note: minor-key song squeezed onto the white keys — plausible arrangement,
    // verify against how the family sings it.
    { id: 'rakefet', slug: 'rakefet', title: 'רקפת', difficulty: 'medium', lyricsLang: 'he', phrases: [
      { lyricLine: "מתחת לסלע", notes: [N(6,'מִ'),N(6,'תַּ'),N(7,'חַת'),N(8,'לַ'),N(7,'סֶּ'),N(6,'לַע',2)] },
      { lyricLine: "צומחת לפלא", notes: [N(5,'צוֹ'),N(5,'מַ'),N(6,'חַת'),N(7,'לְ'),N(6,'פֶ'),N(5,'לֶא',2)] },
      { lyricLine: "רקפת נחמדת מאוד", notes: [N(4,'רַ'),N(4,'קֶּ'),N(5,'פֶת'),N(6,'נֶחְ'),N(5,'מֶ'),N(4,'דֶת'),N(3,'מְ'),N(6,'אֹד',2)] }
    ]},
    // Note: minor-key song squeezed onto the white keys — plausible arrangement,
    // verify against how the family sings it.
    { id: 'shkedia', slug: 'hashkedia-porachat', title: 'השקדיה פורחת', difficulty: 'medium', lyricsLang: 'he', phrases: [
      { lyricLine: "השקדיה פורחת", notes: [N(3,'הַשְּׁ'),N(6,'קֵ'),N(6,'דִ'),N(7,'יָּה'),N(6,'פּוֹ'),N(5,'רַ'),N(6,'חַת',2)] },
      { lyricLine: "ושמש פז זורחת", notes: [N(3,'וְ'),N(6,'שֶׁ'),N(6,'מֶשׁ'),N(7,'פָּז'),N(6,'זוֹ'),N(5,'רַ'),N(6,'חַת',2)] },
      { lyricLine: "ציפורים מראש כל גג", notes: [N(6,'צִ'),N(7,'פֳּ'),N(8,'רִים'),N(7,'מֵ'),N(6,'רֹאשׁ'),N(5,'כָּל'),N(4,'גָּג',2)] },
      { lyricLine: "מבשרות את בוא החג", notes: [N(4,'מְ'),N(5,'בַ'),N(6,'שְּׂ'),N(5,'רוֹת'),N(4,'אֶת'),N(3,'בּוֹא'),N(2,'הֶ'),N(3,'חָג',2)] },
      { lyricLine: "ט\"ו בשבט הגיע", notes: [N(3,'טוּ'),N(4,'בִּשְׁ'),N(5,'בָט'),N(4,'הִ'),N(3,'גִּי'),N(2,'עַ')] },
      { lyricLine: "חג האילנות", notes: [N(6,'חַג'),N(5,'הָ'),N(4,'אִי'),N(3,'לָ'),N(6,'נוֹת',2)] }
    ]},
    // Note: plausible arrangement — verify against how the family sings it.
    { id: 'anipurim', slug: 'ani-purim', title: 'אני פורים', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { lyricLine: "אני פורים, אני פורים", notes: [N(1,'אֲ'),N(3,'נִי'),N(5,'פוּ'),N(5,'רִים',2),N(1,'אֲ'),N(3,'נִי'),N(5,'פוּ'),N(5,'רִים',2)] },
      { lyricLine: "שמח ומבדח", notes: [N(6,'שָׂ'),N(6,'מֵ'),N(5,'חַ'),N(4,'וּמְ'),N(4,'בַ'),N(3,'דֵּ'),N(3,'חַ',2)] },
      { lyricLine: "הלא רק פעם בשנה", notes: [N(5,'הֲ'),N(5,'לֹא'),N(4,'רַק'),N(4,'פַּ'),N(3,'עַם'),N(3,'בַּ'),N(2,'שָּׁ'),N(2,'נָה',2)] },
      { lyricLine: "אבוא להתארח", notes: [N(1,'אָ'),N(2,'בוֹא'),N(3,'לְ'),N(4,'הִתְ'),N(2,'אָ'),N(2,'רֵ'),N(1,'חַ',2)] }
    ]},
    // Jingle Bells chorus — confident melody fit.
    { id: 'jingle', slug: 'jingle-bells', title: 'Jingle Bells', difficulty: 'easy', lyricsLang: 'en', phrases: [
      { lyricLine: "Jingle bells, jingle bells", notes: [N(3,'Jin'),N(3,'gle'),N(3,'bells',2),N(3,'jin'),N(3,'gle'),N(3,'bells',2)] },
      { lyricLine: "Jingle all the way", notes: [N(3,'jin'),N(5,'gle'),N(1,'all'),N(2,'the'),N(3,'way',2)] },
      { lyricLine: "Oh what fun it is to ride in a", notes: [N(4,'Oh'),N(4,'what'),N(4,'fun'),N(4,'it'),N(4,'is'),N(3,'to'),N(3,'ride'),N(3,'in'),N(3,'a')] },
      { lyricLine: "One-horse open sleigh", notes: [N(2,'one'),N(2,'horse'),N(3,'o'),N(2,'pen'),N(5,'sleigh',2)] },
      { lyricLine: "Jingle bells, jingle bells", notes: [N(3,'Jin'),N(3,'gle'),N(3,'bells',2),N(3,'jin'),N(3,'gle'),N(3,'bells',2)] },
      { lyricLine: "Jingle all the way", notes: [N(3,'jin'),N(5,'gle'),N(1,'all'),N(2,'the'),N(3,'way',2)] },
      { lyricLine: "Oh what fun it is to ride in a", notes: [N(4,'Oh'),N(4,'what'),N(4,'fun'),N(4,'it'),N(4,'is'),N(3,'to'),N(3,'ride'),N(3,'in'),N(3,'a')] },
      { lyricLine: "One-horse open sleigh", notes: [N(5,'one'),N(5,'horse'),N(4,'o'),N(2,'pen'),N(1,'sleigh',2)] }
    ]},
    // Old MacDonald adapted for the toy: the melody's low sol/la are played as the
    // higher סול/לה bars (the common toy-xylophone adaptation).
    { id: 'macdonald', slug: 'old-macdonald', title: 'Old MacDonald', difficulty: 'easy', lyricsLang: 'en', phrases: [
      { lyricLine: "Old MacDonald had a farm", notes: [N(1,'Old'),N(1,'Mac'),N(1,'Don'),N(5,'ald'),N(6,'had'),N(6,'a'),N(5,'farm',2)] },
      { lyricLine: "E-I-E-I-O", notes: [N(3,'E'),N(3,'I'),N(2,'E'),N(2,'I'),N(1,'O',2)] },
      { lyricLine: "And on his farm he had a cow", notes: [N(1,'And'),N(1,'on'),N(1,'his'),N(5,'farm'),N(6,'he'),N(6,'had'),N(5,'a'),N(5,'cow',2)] },
      { lyricLine: "E-I-E-I-O", notes: [N(3,'E'),N(3,'I'),N(2,'E'),N(2,'I'),N(1,'O',2)] },
      { lyricLine: "With a moo moo here and a moo moo there", notes: [N(5,'With'),N(5,'a'),N(1,'moo'),N(1,'moo'),N(1,'here'),N(5,'and'),N(5,'a'),N(1,'moo'),N(1,'moo'),N(1,'there')] },
      { lyricLine: "Here a moo, there a moo, everywhere a moo moo", notes: [N(1,'Here'),N(1,'a'),N(1,'moo'),N(1,'there'),N(1,'a'),N(1,'moo'),N(1,'ev'),N(1,'ery'),N(1,'where'),N(1,'a'),N(1,'moo'),N(1,'moo')] },
      { lyricLine: "Old MacDonald had a farm", notes: [N(1,'Old'),N(1,'Mac'),N(1,'Don'),N(5,'ald'),N(6,'had'),N(6,'a'),N(5,'farm',2)] },
      { lyricLine: "E-I-E-I-O", notes: [N(3,'E'),N(3,'I'),N(2,'E'),N(2,'I'),N(1,'O',2)] }
    ]}
  ];
})();
