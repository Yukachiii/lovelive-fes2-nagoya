// 出典: https://www.mwt.co.jp/kokunai/chubu/special/lovelive2026/ （2026-10-26 時点）
// キャラクターは各事業者キービジュアルに記載された名前から整理。
// shops は「ラブナゴヤ！フェス スタンプラリースポットマップ」（Googleマイマップ）の地点。

const SOURCE_URL = "https://www.mwt.co.jp/kokunai/chubu/special/lovelive2026/";
const MAP_ID = "1gvdgaUiNzDugl8GMDz6dLPA-JiHM5l4";
const MAP_URL = `https://www.google.com/maps/d/viewer?mid=${MAP_ID}&hl=ja&ll=35.146779642004724%2C136.91725911958216&z=13`;
const MAP_EMBED_URL = `https://www.google.com/maps/d/embed?mid=${MAP_ID}&hl=ja&ll=35.146779642004724%2C136.91725911958216&z=12`;
const IMG_BASE = SOURCE_URL + "img/";
const UPDATED = "2026-10-26";

const SERIES = [
  { id: "mus",     name: "ラブライブ！",               group: "μ's",           color: "#e4007f" },
  { id: "aqours",  name: "ラブライブ！サンシャイン!!",   group: "Aqours",        color: "#1c9ad6" },
  { id: "niji",    name: "虹ヶ咲学園",                  group: "虹ヶ咲",         color: "#e8a200" },
  { id: "liella",  name: "ラブライブ！スーパースター!!", group: "Liella!",       color: "#9b4fb0" },
  { id: "hasu",    name: "蓮ノ空女学院",                group: "蓮ノ空",         color: "#e8698a" },
  { id: "sim",     name: "スクールアイドルミュージカル", group: "ミュージカル",   color: "#c8323c" },
  { id: "ikzl",    name: "イキヅライブ！",               group: "イキヅライブ！", color: "#ec7a1c" },
];

const CHARACTERS = [
  { id: "honoka",   name: "高坂 穂乃果",   kana: "こうさか ほのか",       romaji: "KOSAKA HONOKA",       series: "mus" },
  { id: "rin",      name: "星空 凛",       kana: "ほしぞら りん",         romaji: "HOSHIZORA RIN",       series: "mus" },
  { id: "maki",     name: "西木野 真姫",   kana: "にしきの まき",         romaji: "NISHIKINO MAKI",      series: "mus" },
  { id: "hanayo",   name: "小泉 花陽",     kana: "こいずみ はなよ",       romaji: "KOIZUMI HANAYO",      series: "mus" },
  { id: "nico",     name: "矢澤 にこ",     kana: "やざわ にこ",           romaji: "YAZAWA NICO",         series: "mus" },

  { id: "chika",    name: "高海 千歌",     kana: "たかみ ちか",           romaji: "TAKAMI CHIKA",        series: "aqours" },
  { id: "riko",     name: "桜内 梨子",     kana: "さくらうち りこ",       romaji: "SAKURAUCHI RIKO",     series: "aqours" },
  { id: "you",      name: "渡辺 曜",       kana: "わたなべ よう",         romaji: "WATANABE YOU",        series: "aqours" },
  { id: "hanamaru", name: "国木田 花丸",   kana: "くにきだ はなまる",     romaji: "KUNIKIDA HANAMARU",   series: "aqours" },

  { id: "kasumi",   name: "中須 かすみ",   kana: "なかす かすみ",         romaji: "NAKASU KASUMI",       series: "niji" },
  { id: "shizuku",  name: "桜坂 しずく",   kana: "おうさか しずく",       romaji: "OSAKA SHIZUKU",       series: "niji" },
  { id: "kanata",   name: "近江 彼方",     kana: "このえ かなた",         romaji: "KONOE KANATA",        series: "niji" },
  { id: "rina",     name: "天王寺 璃奈",   kana: "てんのうじ りな",       romaji: "TENNOJI RINA",        series: "niji" },
  { id: "shioriko", name: "三船 栞子",     kana: "みふね しおりこ",       romaji: "MIFUNE SHIORIKO",     series: "niji" },

  { id: "keke",     name: "唐 可可",       kana: "たん くぅくぅ",         romaji: "TANG KEKE",           series: "liella" },
  { id: "sumire",   name: "平安名 すみれ", kana: "へあんな すみれ",       romaji: "HEANNA SUMIRE",       series: "liella" },
  { id: "shiki",    name: "若菜 四季",     kana: "わかな しき",           romaji: "WAKANA SHIKI",        series: "liella" },
  { id: "natsumi",  name: "鬼塚 夏美",     kana: "おにつか なつみ",       romaji: "ONITSUKA NATSUMI",    series: "liella" },
  { id: "margarete",name: "ウィーン・マルガレーテ", kana: "うぃーん まるがれーて", romaji: "WIEN MARGARETE", series: "liella" },

  { id: "sayaka",   name: "村野 さやか",   kana: "むらの さやか",         romaji: "MURANO SAYAKA",       series: "hasu" },
  { id: "rurino",   name: "大沢 瑠璃乃",   kana: "おおさわ るりの",       romaji: "OSAWA RURINO",        series: "hasu" },
  { id: "ginko",    name: "百生 吟子",     kana: "ももせ ぎんこ",         romaji: "MOMOSE GINKO",        series: "hasu" },
  { id: "izumi",    name: "桂城 泉",       kana: "かつらぎ いずみ",       romaji: "KATSURAGI IZUMI",     series: "hasu" },
  { id: "ceras",    name: "セラス 柳田 リリエンフェルト", kana: "せらす やなぎだ りりえんふぇると", romaji: "CERAS Y. LILIENFELD", series: "hasu" },

  { id: "rurika",   name: "椿 ルリカ",     kana: "つばき るりか",         romaji: "TSUBAKI RURIKA",      series: "sim" },
  { id: "anzu",     name: "滝沢 アンズ",   kana: "たきざわ あんず",       romaji: "TAKIZAWA ANZU",       series: "sim" },

  { id: "aurora",   name: "此花 輝夜",     kana: "このはな おーろら",     romaji: "KONOHANA AURORA",     series: "ikzl" },
  { id: "mai",      name: "麻布 麻衣",     kana: "あざぶ まい",           romaji: "AZABU MAI",           series: "ikzl" },
  { id: "hanabi",   name: "駒形 花火",     kana: "こまがた はなび",       romaji: "KOMAGATA HANABI",     series: "ikzl" },
  { id: "miracle",  name: "金澤 奇跡",     kana: "かなざわ みらくる",     romaji: "KANAZAWA MIRACLE",    series: "ikzl" },
  { id: "polka",    name: "高橋 ポルカ",   kana: "たかはし ぽるか",       romaji: "TAKAHASHI POLKA",     series: "ikzl" },
];

// perks: goods = コラボグッズなどの販売 / novelty = ノベルティ配布 / photo = パネルなどのフォトスポット
const STORES = [
  { id: "mwt", name: "名鉄観光サービス", genre: "旅行",
    perks: ["goods", "novelty", "photo"], chars: [],
    note: "シリーズ集合ビジュアル（キャラクター名の記載なし）",
    shops: [
      { name: "名駅地下支店", lat: 35.1699422, lng: 136.884366, note: "スタンプ帳販売" },
      { name: "金山駅旅行センター", lat: 35.1427366, lng: 136.9013824, note: "スタンプ帳販売・景品引換場所" },
    ],
    links: { web: "https://www.mwt.co.jp/", x: "https://twitter.com/MWT_Travel" } },
  { id: "aokis", name: "アオキーズ・ピザ", genre: "ピザ",
    perks: ["novelty", "photo"], chars: ["maki", "izumi"],
    shops: [
      { name: "池下店", lat: 35.1684202, lng: 136.9446173 },
      { name: "中村公園店", lat: 35.1669523, lng: 136.8557206 },
    ],
    links: { web: "https://www.aokispizza.co.jp/", x: "https://x.com/aokis_pizza" } },
  { id: "aoyagi", name: "青柳総本家", genre: "ういろう",
    perks: ["goods", "novelty", "photo"], chars: ["honoka", "rina", "margarete"],
    shops: [
      { name: "KITTE名古屋店", lat: 35.1732412, lng: 136.8821961 },
    ],
    links: { web: "https://www.aoyagiuirou.co.jp/", x: "https://twitter.com/aoyagi_souhonke" } },
  { id: "ebisenbe", name: "えびせんべいの里", genre: "えびせんべい",
    perks: ["novelty", "photo"], chars: ["mai", "ginko"],
    shops: [
      { name: "あつたnagAya店", lat: 35.1254506, lng: 136.9118531 },
    ],
    links: { web: "https://www.ebisato.co.jp/index.php", x: "https://x.com/Ebisato1989" } },
  { id: "kiyome", name: "きよめ餅総本家", genre: "和菓子",
    perks: ["goods", "novelty", "photo"], chars: ["shioriko", "hanabi", "rurika"],
    shops: [
      { name: "名鉄神宮駅前喫茶部", lat: 35.1264325, lng: 136.9111846 },
    ],
    links: { web: "https://kiyome.net/", x: "https://x.com/kiyome_honke" } },
  { id: "kohgen", name: "香源", genre: "お香",
    perks: ["goods", "novelty", "photo"], chars: ["aurora", "riko", "hanayo"],
    shops: [
      { name: "名古屋本店", lat: 35.1729777, lng: 136.8666777 },
    ],
    links: { web: "https://www.kohgen.com/", x: "https://x.com/kohgen_official" } },
  { id: "sobajima", name: "側島製罐", genre: "缶",
    perks: ["goods", "novelty", "photo"], chars: ["chika"],
    shops: [
      { name: "側島製罐（そばじまSHOP）", lat: 35.1862033, lng: 136.8100391, note: "そばじまSHOPは平日限定" },
    ],
    links: { web: "https://sobajima.jp/", x: "https://x.com/sobajimacan" } },
  { id: "kagakukan", name: "FUJIなごや科学館", genre: "科学館",
    perks: ["photo"], chars: ["shiki"],
    shops: [
      { name: "FUJIなごや科学館", lat: 35.1650768, lng: 136.8997026 },
    ],
    links: { web: "https://www.ncsm.city.nagoya.jp/", x: "https://x.com/ncsm_Nagoya" } },
  { id: "convention", name: "名古屋観光コンベンションビューロー", genre: "観光案内",
    perks: ["photo"], chars: ["nico"],
    shops: [
      { name: "オアシス21 iセンター（名古屋市観光案内所）", lat: 35.1705798, lng: 136.9094715 },
      { name: "名古屋市金山観光案内所", lat: 35.1433255, lng: 136.9014746 },
    ],
    links: { web: "https://www.nagoya-info.jp/", x: "https://x.com/nagoyainfojp" } },
  { id: "uya", name: "ひつまぶし う家", genre: "ひつまぶし",
    perks: ["novelty", "photo"], chars: ["miracle", "ceras"],
    shops: [
      { name: "名駅店", lat: 35.1699736, lng: 136.8860368 },
      { name: "八事本店", lat: 35.1314761, lng: 136.9555056 },
    ],
    links: { web: "https://www.hitsumabushiuya.com/", x: "https://x.com/hitsumabushiuya" } },
  { id: "myokoen", name: "妙香園", genre: "日本茶",
    perks: ["goods", "novelty", "photo"], chars: ["hanamaru", "sayaka", "sumire"],
    shops: [
      { name: "本店", lat: 35.1398013, lng: 136.9035634 },
      { name: "サカエチカ店", lat: 35.1695754, lng: 136.9067532 },
      { name: "サンロード店", lat: 35.1700448, lng: 136.8845652 },
    ],
    links: { web: "https://myokoen.com/", x: "https://x.com/myokoen_758" } },
  { id: "meitetsukyosho", name: "名鉄協商", genre: "パーキング",
    perks: ["photo"], chars: ["kasumi"],
    shops: [
      { name: "めきょぱセンター", lat: 35.1687207, lng: 136.9084662 },
    ],
    links: { web: "https://www.mkyosho.co.jp/business/", x: "https://x.com/mkp_jp" } },
  { id: "meitetsu-souken", name: "名鉄生活創研", genre: "商業施設",
    perks: ["photo"], chars: ["rurino"],
    shops: [
      { name: "なごみゃエスカ店", lat: 35.1698128, lng: 136.8804703 },
    ],
    links: { web: "https://www.meitetsu-souken.co.jp/service/2026061816122814.html", x: "https://x.com/nagomiya_esca" } },
  { id: "yabaton", name: "矢場とん", genre: "みそかつ",
    perks: ["novelty", "photo"], chars: ["keke", "you"],
    shops: [
      { name: "YABATON SHOP おうち de 矢場とん", lat: 35.1617987, lng: 136.9061933 },
    ],
    links: { web: "https://www.yabaton.com/", x: "https://x.com/YabatonO", instagram: "https://www.instagram.com/yabaton_official/" } },
  { id: "yamamotoya", name: "大久手 山本屋", genre: "煮込みうどん",
    perks: ["novelty", "photo"], chars: ["kanata", "polka", "natsumi", "anzu"],
    shops: [
      { name: "大久手山本屋", lat: 35.161484, lng: 136.9364074 },
      { name: "神宮前店", lat: 35.1261556, lng: 136.9116522 },
      { name: "桜通大津店", lat: 35.1741835, lng: 136.9065618 },
    ],
    links: { web: "https://a-yamamotoya.co.jp/", x: "https://x.com/yamamotoya_miso" } },
  { id: "wakashachiya", name: "若鯱家", genre: "カレーうどん",
    perks: ["novelty", "photo"], chars: ["rin", "shizuku"],
    shops: [
      { name: "BINO栄店", lat: 35.1692591, lng: 136.906486 },
      { name: "イオンタウン千種店", lat: 35.1614669, lng: 136.9241457 },
    ],
    links: { web: "https://www.wakashachiya.co.jp/", instagram: "https://www.instagram.com/wakashachiya/" } },
];

const PERKS = [
  { id: "goods",   label: "グッズ販売",     long: "コラボグッズなどの販売" },
  { id: "novelty", label: "ノベルティ",     long: "ノベルティ配布" },
  { id: "photo",   label: "フォトスポット", long: "パネルなどのフォトスポット" },
];
