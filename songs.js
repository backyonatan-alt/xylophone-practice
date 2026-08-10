/* Song data — one object per song. Adding a song = adding one object here.
   bar: 1–8 (low C → high C per the physical instrument).
   duration: 1 normal, 2 long (wider block + double hold in auto mode).
   Bilingual songs: syllable = { he, en } with lyricsLang: "both". */
(function () {
  const N = (bar, syllable, duration) => ({ bar, syllable, duration: duration || 1 });

  window.SONGS = [
    { id: 'yonatan', title: 'יונתן הקטן', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { notes: [N(5,'יוֹ'),N(3,'נָ'),N(3,'תָן'),N(4,'הַ'),N(2,'קָ'),N(2,'טָן')] },
      { notes: [N(1,'רָץ'),N(2,'בַּ'),N(3,'בֹּ'),N(4,'קֶר'),N(5,'אֶל'),N(5,'הַ'),N(5,'גָּן',2)] },
      { notes: [N(5,'הוּא'),N(3,'טִי'),N(3,'פֵּס'),N(4,'עַל'),N(2,'הָ'),N(2,'עֵץ')] },
      { notes: [N(1,'אֶפ'),N(3,'רוֹ'),N(5,'חִים'),N(5,'חִי'),N(1,'פֵּשׂ',2)] },
      { notes: [N(2,'אוֹי'),N(2,'וַא'),N(2,'בוֹי'),N(2,'לוֹ'),N(3,'לַ'),N(4,'שּׁוֹ'),N(4,'בָב',2)] },
      { notes: [N(3,'חוֹר'),N(3,'גָּ'),N(3,'דוֹל'),N(3,'בְּ'),N(4,'מִכ'),N(5,'נָ'),N(5,'סָיו',2)] },
      { notes: [N(5,'מִן'),N(3,'הָ'),N(3,'עֵץ'),N(4,'הִת'),N(2,'גַּל'),N(2,'גֵּל')] },
      { notes: [N(1,'וְ'),N(3,'עָנ'),N(5,'שׁוֹ'),N(5,'קִ'),N(1,'בֵּל',2)] }
    ]},
    { id: 'twinkle', title: 'Twinkle Twinkle Little Star', difficulty: 'easy', lyricsLang: 'both', phrases: [
      { notes: [N(1,{he:'נִצ',en:'Twin'}),N(1,{he:'נוֹץ',en:'kle'}),N(5,{he:'נִצ',en:'twin'}),N(5,{he:'נוֹץ',en:'kle'}),N(6,{he:'כּוֹ',en:'lit'}),N(6,{he:'כָב',en:'tle'}),N(5,{he:'קָט',en:'star'},2)] },
      { notes: [N(4,{he:'הוֹ',en:'how'}),N(4,{he:'אֵיךְ',en:'I'}),N(3,{he:'נִפ',en:'won'}),N(3,{he:'לָא',en:'der'}),N(2,{he:'מָה',en:'what'}),N(2,{he:'אַ',en:'you'}),N(1,{he:'תָּה',en:'are'},2)] },
      { notes: [N(5,{he:'מֵ',en:'up'}),N(5,{he:'עַל',en:'a'}),N(4,{he:'הָ',en:'bove'}),N(4,{he:'עוֹ',en:'the'}),N(3,{he:'לָם',en:'world'}),N(3,{he:'גָּ',en:'so'}),N(2,{he:'בוֹהַּ',en:'high'},2)] },
      { notes: [N(5,{he:'כְּמוֹ',en:'like'}),N(5,{he:'יַ',en:'a'}),N(4,{he:'הֲ',en:'dia'}),N(4,{he:'לוֹם',en:'mond'}),N(3,{he:'בַּ',en:'in'}),N(3,{he:'שָּׁ',en:'the'}),N(2,{he:'מַיִם',en:'sky'},2)] },
      { notes: [N(1,{he:'נִצ',en:'Twin'}),N(1,{he:'נוֹץ',en:'kle'}),N(5,{he:'נִצ',en:'twin'}),N(5,{he:'נוֹץ',en:'kle'}),N(6,{he:'כּוֹ',en:'lit'}),N(6,{he:'כָב',en:'tle'}),N(5,{he:'קָט',en:'star'},2)] },
      { notes: [N(4,{he:'הוֹ',en:'how'}),N(4,{he:'אֵיךְ',en:'I'}),N(3,{he:'נִפ',en:'won'}),N(3,{he:'לָא',en:'der'}),N(2,{he:'מָה',en:'what'}),N(2,{he:'אַ',en:'you'}),N(1,{he:'תָּה',en:'are'},2)] }
    ]},
    { id: 'mary', title: 'Mary Had a Little Lamb', difficulty: 'easy', lyricsLang: 'en', phrases: [
      { notes: [N(3,'Ma'),N(2,'ry'),N(1,'had'),N(2,'a'),N(3,'lit'),N(3,'tle'),N(3,'lamb',2)] },
      { notes: [N(2,'lit'),N(2,'tle'),N(2,'lamb',2),N(3,'lit'),N(5,'tle'),N(5,'lamb',2)] },
      { notes: [N(3,'Ma'),N(2,'ry'),N(1,'had'),N(2,'a'),N(3,'lit'),N(3,'tle'),N(3,'lamb'),N(3,'its')] },
      { notes: [N(2,'fleece'),N(2,'was'),N(3,'white'),N(2,'as'),N(1,'snow',2)] }
    ]},
    // Note: the עוגה עוגה and הנה מה טוב melodies are plausible arrangements —
    // verify against how the family sings them before ship.
    { id: 'uga', title: 'עוגה עוגה', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { notes: [N(5,'עוּ'),N(3,'גָה'),N(5,'עוּ'),N(3,'גָה'),N(5,'עוּ'),N(3,'גָה')] },
      { notes: [N(4,'בַּ'),N(2,'מַע'),N(4,'גָל'),N(2,'נָ'),N(4,'חוּ'),N(2,'גָה')] },
      { notes: [N(1,'נִס'),N(2,'תּוֹ'),N(3,'בְ'),N(4,'בָה'),N(5,'כָּל'),N(5,'הַ'),N(5,'יּוֹם',2)] },
      { notes: [N(1,'עַד'),N(2,'אֲ'),N(3,'שֶׁר'),N(4,'נִמ'),N(5,'צָא'),N(5,'מָ'),N(5,'קוֹם',2)] },
      { notes: [N(5,'לָ'),N(4,'שֶׁ'),N(3,'בֶת',2),N(2,'לָ'),N(1,'קוּם',2)] }
    ]},
    { id: 'hine', title: 'הנה מה טוב', difficulty: 'medium', lyricsLang: 'he', phrases: [
      { notes: [N(1,'הִ'),N(3,'נֵּה'),N(5,'מַה'),N(5,'טּוֹב',2)] },
      { notes: [N(6,'וּ'),N(5,'מַה'),N(4,'נָּ'),N(3,'עִים',2)] },
      { notes: [N(2,'שֶׁ'),N(3,'בֶת'),N(4,'אַ'),N(2,'חִים',2)] },
      { notes: [N(3,'גַּם'),N(2,'יָ'),N(1,'חַד',2)] }
    ]},
    // Note: the נד נד melody is a plausible arrangement — verify against how
    // the family sings it before ship.
    { id: 'nadned', title: 'נד נד', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { notes: [N(5,'נַד'),N(3,'נֵד'),N(5,'נַד'),N(3,'נֵד')] },
      { notes: [N(5,'רֵד'),N(6,'עֲ'),N(5,'לֵה'),N(6,'עֲ'),N(5,'לֵה'),N(4,'וָ'),N(3,'רֵד',2)] },
      { notes: [N(5,'מַה'),N(5,'לְּ'),N(6,'מַעְ'),N(6,'לָה'),N(3,'מַה'),N(3,'לְּ'),N(4,'מַ'),N(4,'טָּה')] },
      { notes: [N(5,'רַק'),N(4,'אֲ'),N(3,'נִי'),N(2,'אֲ'),N(3,'נִי'),N(2,'וָ'),N(2,'אַ'),N(1,'תָּה',2)] }
    ]},
    // Happy Birthday arranged for an 8-note C-major toy (the melody's usual key
    // needs a Bb — the last line uses the common toy substitution of דו׳ instead).
    { id: 'birthday', title: 'יום הולדת שמח', difficulty: 'medium', lyricsLang: 'he', phrases: [
      { notes: [N(1,'יוֹם'),N(1,'הֻ'),N(2,'לֶּ'),N(1,'דֶת'),N(4,'שָׂ'),N(3,'מֵחַ',2)] },
      { notes: [N(1,'יוֹם'),N(1,'הֻ'),N(2,'לֶּ'),N(1,'דֶת'),N(5,'שָׂ'),N(4,'מֵחַ',2)] },
      { notes: [N(1,'יוֹם'),N(1,'הֻ'),N(8,'לֶּ'),N(6,'דֶת'),N(4,'שָׂ'),N(3,'מֵ'),N(2,'חַ')] },
      { notes: [N(8,'יוֹם'),N(8,'הֻ'),N(6,'לֶּ'),N(4,'דֶת'),N(5,'שָׂ'),N(4,'מֵחַ',2)] }
    ]},
    { id: 'rowboat', title: 'Row Row Row Your Boat', difficulty: 'easy', lyricsLang: 'en', phrases: [
      { notes: [N(1,'Row'),N(1,'row'),N(1,'row'),N(2,'your'),N(3,'boat',2)] },
      { notes: [N(3,'gent'),N(2,'ly'),N(3,'down'),N(4,'the'),N(5,'stream',2)] },
      { notes: [N(8,'mer'),N(8,'ri'),N(8,'ly'),N(5,'mer'),N(5,'ri'),N(5,'ly'),N(3,'mer'),N(3,'ri'),N(3,'ly'),N(1,'mer'),N(1,'ri'),N(1,'ly')] },
      { notes: [N(5,'life'),N(4,'is'),N(3,'but'),N(2,'a'),N(1,'dream',2)] }
    ]},
    { id: 'london', title: 'London Bridge', difficulty: 'easy', lyricsLang: 'en', phrases: [
      { notes: [N(5,'Lon'),N(6,'don'),N(5,'Bridge'),N(4,'is'),N(3,'fall'),N(4,'ing'),N(5,'down',2)] },
      { notes: [N(2,'fall'),N(3,'ing'),N(4,'down',2),N(3,'fall'),N(4,'ing'),N(5,'down',2)] },
      { notes: [N(5,'Lon'),N(6,'don'),N(5,'Bridge'),N(4,'is'),N(3,'fall'),N(4,'ing'),N(5,'down',2)] },
      { notes: [N(2,'my'),N(5,'fair'),N(3,'la'),N(1,'dy',2)] }
    ]},
    // Ode to Joy — no standard Hebrew children's lyric, so it's sung on לה.
    { id: 'odetojoy', title: 'שיר השמחה (בטהובן)', difficulty: 'easy', lyricsLang: 'he', phrases: [
      { notes: [N(3,'לָה'),N(3,'לָה'),N(4,'לָה'),N(5,'לָה'),N(5,'לָה'),N(4,'לָה'),N(3,'לָה'),N(2,'לָה')] },
      { notes: [N(1,'לָה'),N(1,'לָה'),N(2,'לָה'),N(3,'לָה'),N(3,'לָה',2),N(2,'לָה'),N(2,'לָה',2)] },
      { notes: [N(3,'לָה'),N(3,'לָה'),N(4,'לָה'),N(5,'לָה'),N(5,'לָה'),N(4,'לָה'),N(3,'לָה'),N(2,'לָה')] },
      { notes: [N(1,'לָה'),N(1,'לָה'),N(2,'לָה'),N(3,'לָה'),N(2,'לָה',2),N(1,'לָה'),N(1,'לָה',2)] }
    ]}
  ];
})();
