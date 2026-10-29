// 出典: https://www.mwt.co.jp/kokunai/chubu/special/lovelive2026/ （2026-10-29 更新分まで反映）
// キャラクターは各事業者キービジュアルに記載された名前から整理。
// shops は「ラブナゴヤ！フェス スタンプラリースポットマップ」（Googleマイマップ）の地点。
// collab は各事業者の X 投稿（名鉄観光の告知ツリー、2026-10-26 18:00）から整理。

const SOURCE_URL = "https://www.mwt.co.jp/kokunai/chubu/special/lovelive2026/";
const THREAD_URL = "https://x.com/MWT_Travel/status/2114643206629675493";
const MAP_ID = "1gvdgaUiNzDugl8GMDz6dLPA-JiHM5l4";
const MAP_URL = `https://www.google.com/maps/d/viewer?mid=${MAP_ID}&hl=ja&ll=35.146779642004724%2C136.91725911958216&z=13`;
const MAP_EMBED_URL = `https://www.google.com/maps/d/embed?mid=${MAP_ID}&hl=ja&ll=35.146779642004724%2C136.91725911958216&z=12`;
const IMG_BASE = SOURCE_URL + "img/";
const UPDATED = "2026-10-29";
const HOURS_CHECKED = "2026-10-26";
// shops[].hours / closed / alert は各事業者の公式サイト・公式Xで 2026-10-26 に確認した内容。

const SERIES = [
  { id: "mus",     name: "ラブライブ！",               group: "μ's",           color: "#e4007f" },
  { id: "aqours",  name: "ラブライブ！サンシャイン!!",   group: "Aqours",        color: "#1c9ad6" },
  { id: "niji",    name: "虹ヶ咲学園",                  group: "虹ヶ咲",         color: "#e8a200" },
  { id: "liella",  name: "ラブライブ！スーパースター!!", group: "Liella!",       color: "#9b4fb0" },
  { id: "hasu",    name: "蓮ノ空女学院",                group: "蓮ノ空",         color: "#e8698a" },
  { id: "ikzl",    name: "イキヅライブ！",               group: "いきづらい部！", color: "#ec7a1c" },
  { id: "sim",     name: "スクールアイドルミュージカル", group: "ミュージカル",   color: "#c8323c" },
];

const CHARACTERS = [
  { id: "honoka",   name: "高坂 穂乃果",   kana: "こうさか ほのか",       romaji: "KOSAKA HONOKA",       series: "mus", color: "#f38500" },
  { id: "rin",      name: "星空 凛",       kana: "ほしぞら りん",         romaji: "HOSHIZORA RIN",       series: "mus", color: "#fff832" },
  { id: "maki",     name: "西木野 真姫",   kana: "にしきの まき",         romaji: "NISHIKINO MAKI",      series: "mus", color: "#ff503e" },
  { id: "hanayo",   name: "小泉 花陽",     kana: "こいずみ はなよ",       romaji: "KOIZUMI HANAYO",      series: "mus", color: "#6ae673" },
  { id: "nico",     name: "矢澤 にこ",     kana: "やざわ にこ",           romaji: "YAZAWA NICO",         series: "mus", color: "#ff4f91" },

  { id: "chika",    name: "高海 千歌",     kana: "たかみ ちか",           romaji: "TAKAMI CHIKA",        series: "aqours", color: "#ff9547" },
  { id: "riko",     name: "桜内 梨子",     kana: "さくらうち りこ",       romaji: "SAKURAUCHI RIKO",     series: "aqours", color: "#ff9eac" },
  { id: "you",      name: "渡辺 曜",       kana: "わたなべ よう",         romaji: "WATANABE YOU",        series: "aqours", color: "#66c0ff" },
  { id: "hanamaru", name: "国木田 花丸",   kana: "くにきだ はなまる",     romaji: "KUNIKIDA HANAMARU",   series: "aqours", color: "#ffd010" },

  { id: "ayumu",    name: "上原 歩夢",     kana: "うえはら あゆむ",       romaji: "UEHARA AYUMU",        series: "niji", color: "#ed7d95" },
  { id: "kasumi",   name: "中須 かすみ",   kana: "なかす かすみ",         romaji: "NAKASU KASUMI",       series: "niji", color: "#e7d600" },
  { id: "shizuku",  name: "桜坂 しずく",   kana: "おうさか しずく",       romaji: "OSAKA SHIZUKU",       series: "niji", color: "#01b7ed" },
  { id: "kanata",   name: "近江 彼方",     kana: "このえ かなた",         romaji: "KONOE KANATA",        series: "niji", color: "#a664a0" },
  { id: "rina",     name: "天王寺 璃奈",   kana: "てんのうじ りな",       romaji: "TENNOJI RINA",        series: "niji", color: "#9ca5b9" },
  { id: "shioriko", name: "三船 栞子",     kana: "みふね しおりこ",       romaji: "MIFUNE SHIORIKO",     series: "niji", color: "#37b484" },

  { id: "kanon",    name: "澁谷 かのん",   kana: "しぶや かのん",         romaji: "SHIBUYA KANON",       series: "liella", color: "#ff7f27" },
  { id: "keke",     name: "唐 可可",       kana: "たん くぅくぅ",         romaji: "TANG KEKE",           series: "liella", color: "#a0fff9" },
  { id: "sumire",   name: "平安名 すみれ", kana: "へあんな すみれ",       romaji: "HEANNA SUMIRE",       series: "liella", color: "#74f466" },
  { id: "shiki",    name: "若菜 四季",     kana: "わかな しき",           romaji: "WAKANA SHIKI",        series: "liella", color: "#b2ffdd" },
  { id: "natsumi",  name: "鬼塚 夏美",     kana: "おにつか なつみ",       romaji: "ONITSUKA NATSUMI",    series: "liella", color: "#ff51c4" },
  { id: "margarete",name: "ウィーン・マルガレーテ", kana: "うぃーん まるがれーて", romaji: "WIEN MARGARETE", series: "liella", color: "#e49dfd" },

  { id: "kaho",     name: "日野下 花帆",   kana: "ひのした かほ",         romaji: "HINOSHITA KAHO",      series: "hasu", color: "#f8b500" },
  { id: "sayaka",   name: "村野 さやか",   kana: "むらの さやか",         romaji: "MURANO SAYAKA",       series: "hasu", color: "#5383c3" },
  { id: "rurino",   name: "大沢 瑠璃乃",   kana: "おおさわ るりの",       romaji: "OSAWA RURINO",        series: "hasu", color: "#e7609e" },
  { id: "ginko",    name: "百生 吟子",     kana: "ももせ ぎんこ",         romaji: "MOMOSE GINKO",        series: "hasu", color: "#a2d7dd" },
  { id: "izumi",    name: "桂城 泉",       kana: "かつらぎ いずみ",       romaji: "KATSURAGI IZUMI",     series: "hasu", color: "#1ebecd" },
  { id: "ceras",    name: "セラス 柳田 リリエンフェルト", kana: "せらす やなぎだ りりえんふぇると", romaji: "CERAS Y. LILIENFELD", series: "hasu", color: "#f56455" },

  { id: "polka",    name: "高橋 ポルカ",   kana: "たかはし ぽるか",       romaji: "TAKAHASHI POLKA",     series: "ikzl", color: "#ffff66" },
  { id: "aurora",   name: "此花 輝夜",     kana: "このはな おーろら",     romaji: "KONOHANA AURORA",     series: "ikzl", color: "#ff5b9d" },
  { id: "mai",      name: "麻布 麻衣",     kana: "あざぶ まい",           romaji: "AZABU MAI",           series: "ikzl", color: "#4d93d9" },
  { id: "hanabi",   name: "駒形 花火",     kana: "こまがた はなび",       romaji: "KOMAGATA HANABI",     series: "ikzl", color: "#ff4747" },
  { id: "miracle",  name: "金澤 奇跡",     kana: "かなざわ みらくる",     romaji: "KANAZAWA MIRACLE",    series: "ikzl", color: "#ffb6c1" },

  { id: "rurika",   name: "椿 ルリカ",     kana: "つばき るりか",         romaji: "TSUBAKI RURIKA",      series: "sim", color: "#73b8e2" },
  { id: "anzu",     name: "滝沢 アンズ",   kana: "たきざわ あんず",       romaji: "TAKIZAWA ANZU",       series: "sim", color: "#d81f35" },
];

// CHARACTERS[].color は「ラブライブ！シリーズ メンバーカラーまとめ」(https://ratius.github.io/LLS/color.html) の
// メンバー紹介（総合）の値。

// perks: goods = コラボグッズなどの販売 / novelty = ノベルティ配布 / photo = パネルなどのフォトスポット
// groups: 集合パネルが設置されるグループ（SERIES の id）。そのグループのキャラで絞り込むと表示される。
// collab: { kind: goods | novelty | photo | other, title, price?, text? }
// shops: スタンプラリースポット（stamps = 設置スタンプ数）。others: スタンプなしのコラボ対象店舗など（マイマップより）。
const STORES = [
  { id: "mwt", name: "名鉄観光サービス", genre: "旅行",
    perks: ["goods", "novelty", "photo"],
    chars: ["honoka", "chika", "ayumu", "kanon", "kaho", "rurika", "anzu", "polka"],
    groups: ["aqours", "niji", "liella", "hasu"],
    post: "https://x.com/MWT_Travel/status/2114643216037191722",
    collab: [
      { kind: "goods", title: "選べる「ラブナゴヤ！フェス」コラボアクリルスタンド付きスタンプラリー手帳", price: "2,500円",
        text: "アクリルスタンドは全7種から1つ選択。スタンプを15個集めると「KVポストカード」をプレゼント（金山駅旅行センターで配布）" },
      { kind: "goods", title: "選べる「ラブナゴヤ！フェス」コラボアクリルキーホルダー付き やみつき なごやめしきっぷ", price: "3,500円",
        text: "名古屋市交通局 バス・地下鉄全線一日乗車券＋デジタルお食事券（2,000円分）。キーホルダーは全7種から1つ選択" },
      { kind: "novelty", title: "ノベルティカード", text: "カウンター店舗でお会計2,000円（税込）以上で1枚（1会計1枚まで）" },
      { kind: "photo", title: "集合フォトパネル", text: "名駅地下支店：Aqours＆虹ヶ咲／金山駅旅行センター：Liella!＆蓮ノ空" },
      { kind: "other", title: "販売場所・支払い", text: "名駅地下支店・金山駅旅行センター。現金のみ（QRコード決済・クレジット不可）" },
    ],
    shops: [
      { name: "名駅地下支店", stamps: 1, lat: 35.1699422, lng: 136.884366, note: "スタンプ帳販売", hours: "10:00〜18:30（予約業務は18:00まで）", closed: "地下街休業日・年末年始" },
      { name: "金山駅旅行センター", stamps: 1, lat: 35.1427366, lng: 136.9013824, note: "スタンプ帳販売・景品引換場所", hours: "10:00〜18:30（新規受付は18:00まで）", closed: "年末年始" },
    ],
    links: { web: "https://www.mwt.co.jp/", x: "https://twitter.com/MWT_Travel" } },

  { id: "aokis", name: "アオキーズ・ピザ", genre: "ピザ",
    perks: ["novelty", "photo"], chars: ["maki", "izumi"],
    post: "https://x.com/aokis_pizza/status/2114643202636484625",
    collab: [
      { kind: "novelty", title: "ノベルティカード", text: "お持ち帰り限定でお会計1,500円（税込）以上で1枚（1会計1枚まで、デリバリーは対象外）" },
      { kind: "photo", title: "フォトパネル", text: "全対象店舗に設置。池下店は等身大、栄店・中村公園店・土古店・大江店は小パネル" },
      { kind: "other", title: "対象店舗", text: "池下店、栄店、中村公園店、土古店、大江店" },
    ],
    shops: [
      { name: "池下店", stamps: 1, lat: 35.1684202, lng: 136.9446173, hours: "11:00〜22:00", closed: "火曜（祝日の場合は翌日）" },
      { name: "中村公園店", stamps: 1, lat: 35.1669523, lng: 136.8557206, hours: "11:00〜22:00", closed: "火曜（祝日の場合は翌日）" },
    ],
    others: [
      { name: "栄店", lat: 35.1627776, lng: 136.8936747, note: "パネルあり" },
      { name: "土古店", lat: 35.111638, lng: 136.858614, note: "パネルあり" },
      { name: "大江店", lat: 35.0872074, lng: 136.9140292, note: "パネルあり" },
    ],
    links: { web: "https://www.aokispizza.co.jp/", x: "https://x.com/aokis_pizza" } },

  { id: "aoyagi", name: "青柳総本家", genre: "ういろう",
    perks: ["goods", "novelty", "photo"], chars: ["honoka", "rina", "margarete"],
    post: "https://x.com/aoyagi_souhonke/status/2114643193979355426",
    collab: [
      { kind: "goods", title: "青柳ういろう 3本入 ラブナゴヤver.", price: "2,400円", text: "ノベルティカード付き" },
      { kind: "novelty", title: "ノベルティカード", text: "お会計2,500円（税込）以上ごとに1枚（コラボ商品を含まなくても可、1会計1枚まで）" },
      { kind: "photo", title: "コラボパネル", text: "KITTE名古屋店（小パネル）" },
    ],
    shops: [
      { name: "KITTE名古屋店", stamps: 3, lat: 35.1732412, lng: 136.8821961, hours: "10:00〜20:00（飲食メニューは11:00〜）", closed: "1月1日" },
    ],
    links: { web: "https://www.aoyagiuirou.co.jp/", x: "https://twitter.com/aoyagi_souhonke" } },

  { id: "ebisenbe", name: "えびせんべいの里", genre: "えびせんべい",
    perks: ["novelty", "photo"], chars: ["mai", "ginko"],
    post: "https://x.com/Ebisato1989/status/2114643195992908198",
    collab: [
      { kind: "novelty", title: "ノベルティカード（全2種）", text: "お会計2,000円（税込）ごとにランダムで1枚（1会計2枚まで）" },
      { kind: "photo", title: "フォトパネル", text: "店内に麻布麻衣・百生吟子のフォトパネル" },
      { kind: "other", title: "対象店舗", text: "あつたnagAya店（名鉄神宮前駅西口、10:00〜18:00）。スタンプラリーのスタンプも設置" },
    ],
    shops: [
      { name: "あつたnagAya店", stamps: 2, lat: 35.1254506, lng: 136.9118531, hours: "10:00〜18:00" },
    ],
    links: { web: "https://www.ebisato.co.jp/index.php", x: "https://x.com/Ebisato1989" } },

  { id: "kiyome", name: "きよめ餅総本家", genre: "和菓子",
    perks: ["goods", "novelty", "photo"], chars: ["shioriko", "hanabi", "rurika"],
    post: "https://x.com/kiyome_honke/status/2114643232042701182",
    collab: [
      { kind: "goods", title: "きよめぱん コラボ限定パッケージ", price: "2,000円", text: "オリジナルアクリルキーホルダー付き" },
      { kind: "novelty", title: "ノベルティカード（全3種）", text: "コラボ商品以外も含むお会計2,000円（税込）以上でランダムに1枚（1会計1枚まで）" },
      { kind: "photo", title: "フォトパネル＆コラボのぼり", text: "名鉄神宮前駅前売店" },
    ],
    shops: [
      { name: "名鉄神宮駅前喫茶部", stamps: 3, lat: 35.1264325, lng: 136.9111846, hours: "平日 9:00〜17:30／土日祝 8:30〜18:00", closed: "水曜（祝日の場合は木曜）と公式サイトに記載" },
    ],
    links: { web: "https://kiyome.net/", x: "https://x.com/kiyome_honke" } },

  { id: "kohgen", name: "香源", genre: "お香",
    perks: ["goods", "novelty", "photo"], chars: ["aurora", "riko", "hanayo"],
    post: "https://x.com/kohgen_official/status/2114643194918879625",
    collab: [
      { kind: "goods", title: "ラブナゴヤ！フェスお香（各30本入・煙控えめ・簡易香立て付）", price: "各2,200円",
        text: "桜内梨子：桜の香り／此花輝夜：ココナッツバニラハニーの香り／小泉花陽：ホワイトフローラルの香り。名古屋本店限定、各種1人5個まで" },
      { kind: "novelty", title: "ノベルティカード", text: "コラボ商品を含むお会計2,000円（税込）以上で1枚（1会計1枚まで）" },
      { kind: "photo", title: "等身大フォトパネル", text: "名古屋本店 2階" },
    ],
    shops: [
      { name: "名古屋本店", stamps: 3, lat: 35.1729777, lng: 136.8666777, hours: "9:17〜18:17" },
    ],
    links: { web: "https://www.kohgen.com/", x: "https://x.com/kohgen_official" } },

  { id: "sobajima", name: "側島製罐", genre: "缶",
    perks: ["goods", "novelty", "photo"], chars: ["chika"],
    post: "https://x.com/sobajimacan/status/2114643194436588016",
    collab: [
      { kind: "goods", title: "高海千歌 メモリアルワーク缶", price: "3,850円", text: "11月6日発売" },
      { kind: "goods", title: "高海千歌 カードケース（オリジナルラバーバンド付き）", price: "2,200円", text: "11月6日発売" },
      { kind: "novelty", title: "ノベルティカード", text: "コラボ商品を1缶購入するごとに1枚" },
      { kind: "photo", title: "フォトパネル", text: "SOBAJIMA shop" },
      { kind: "other", title: "SOBAJIMA shop", text: "土日祝は休業" },
    ],
    shops: [
      { name: "側島製罐（そばじまSHOP）", stamps: 1, lat: 35.1862033, lng: 136.8100391, note: "土日祝は休業", hours: "平日のみ営業（営業時間は公式に記載なし）" },
    ],
    links: { web: "https://sobajima.jp/", x: "https://x.com/sobajimacan" } },

  { id: "kagakukan", name: "FUJIなごや科学館", genre: "科学館",
    perks: ["photo"], chars: ["shiki"],
    post: "https://x.com/ncsm_Nagoya/status/2114643194701021502",
    collab: [
      { kind: "photo", title: "若菜四季フォトパネル", text: "生命館地下2階 あいち・なごやノーベル賞受賞者記念室" },
    ],
    shops: [
      { name: "FUJIなごや科学館", stamps: 1, lat: 35.1650768, lng: 136.8997026, hours: "9:30〜17:00（入館は16:30まで）", closed: "月曜（祝日の場合は直後の平日）、第3金曜（祝日の場合は第4金曜）" },
    ],
    links: { web: "https://www.ncsm.city.nagoya.jp/", x: "https://x.com/ncsm_Nagoya" } },

  { id: "convention", name: "名古屋観光コンベンションビューロー", genre: "観光案内",
    perks: ["photo"], chars: ["nico"],
    groups: ["mus", "sim", "ikzl"],
    post: "https://x.com/nagoyainfojp/status/2114643202313486378",
    collab: [
      { kind: "photo", title: "オアシス21 iセンター", text: "μ's 集合パネル＋矢澤にこフォトパネル" },
      { kind: "photo", title: "名古屋市金山観光案内所", text: "スクールアイドルミュージカル＆いきづらい部！ 集合パネル" },
    ],
    shops: [
      { name: "オアシス21 iセンター（名古屋市観光案内所）", stamps: 1, lat: 35.1705798, lng: 136.9094715, hours: "10:00〜20:00（物販は18:00まで）", closed: "1月1日、法定点検日" },
      { name: "名古屋市金山観光案内所", stamps: 1, lat: 35.1433255, lng: 136.9014746, hours: "9:00〜19:00（物販は17:00まで）", closed: "12月29日〜1月1日" },
    ],
    links: { web: "https://www.nagoya-info.jp/", x: "https://x.com/nagoyainfojp" } },

  { id: "uya", name: "ひつまぶし う家", genre: "ひつまぶし",
    perks: ["novelty", "photo"], chars: ["miracle", "ceras"],
    post: "https://x.com/hitsumabushiuya/status/2114643202288611555",
    collab: [
      { kind: "novelty", title: "ノベルティカード",
        text: "2,000円（税込）以上のメニューを注文し、会計時に「ノベルティーカードをください」と伝えると1枚（1会計1枚まで）。八事本店：金澤奇跡／名駅店：セラス" },
      { kind: "photo", title: "フォトパネル", text: "八事本店：金澤奇跡／名駅店：セラス 柳田 リリエンフェルト" },
    ],
    shops: [
      { name: "名駅店", stamps: 1, lat: 35.1699736, lng: 136.8860368, note: "セラス 柳田 リリエンフェルト", hours: "11:30〜15:00（LO 14:00）／17:00〜21:30（LO 20:30）", closed: "年中無休", alert: "11月9日(月)は臨時休業" },
      { name: "八事本店", stamps: 1, lat: 35.1314761, lng: 136.9555056, note: "金澤奇跡", hours: "平日 11:00〜14:30（LO 14:00）／17:30〜21:00（LO 20:00）、土日祝 11:00〜14:30（LO 14:00）／17:00〜21:00（LO 20:00）" },
    ],
    links: { web: "https://www.hitsumabushiuya.com/", x: "https://x.com/hitsumabushiuya" } },

  { id: "myokoen", name: "妙香園", genre: "日本茶",
    perks: ["goods", "novelty", "photo"], chars: ["hanamaru", "sayaka", "sumire"],
    post: "https://x.com/myokoen_758/status/2114643194033983671",
    collab: [
      { kind: "goods", title: "ハート缶入ほうじ茶ティーバッグ（2g×12袋）", price: "2,640円", text: "1人1点まで" },
      { kind: "goods", title: "ほうじ茶パウンドケーキ（クリアカード付）", price: "3,240円", text: "1人1点まで" },
      { kind: "goods", title: "コラボドリンク「ほうじ茶フルーツティー いちご」", price: "1,540円",
        text: "テイクアウトのみ。アクリルコースター（全3種）から好きな絵柄を選べる。MYOKOEN TEA STORE サカエチカ店・あつたnagAya店" },
      { kind: "novelty", title: "ノベルティカード（全4種）",
        text: "期間中2,000円（税込）購入ごとにランダムで1枚。TEA STOREのイートイン・テイクアウト商品は対象外" },
      { kind: "photo", title: "フォトパネル", text: "本店・サンロード店・サカエチカ店・あつたnagAya店" },
      { kind: "other", title: "対象店舗", text: "本店・サンロード店・サカエチカ店・あつたnagAya店" },
    ],
    shops: [
      { name: "本店", stamps: 1, lat: 35.1398013, lng: 136.9035634, hours: "9:00〜18:00" },
      { name: "サカエチカ店", stamps: 1, lat: 35.1695754, lng: 136.9067532, hours: "10:00〜20:00" },
      { name: "サンロード店", stamps: 1, lat: 35.1700448, lng: 136.8845652, hours: "10:00〜20:30" },
    ],
    others: [
      { name: "あつたnagAya店", lat: 35.1259202, lng: 136.9115101, note: "パネルあり" },
    ],
    links: { web: "https://myokoen.com/", x: "https://x.com/myokoen_758" } },

  { id: "meitetsukyosho", name: "名鉄協商", genre: "パーキング",
    perks: ["photo"], chars: ["kasumi"],
    post: "https://x.com/mkp_jp/status/2114643385713823917",
    collab: [
      { kind: "photo", title: "中須かすみフォトパネル", text: "めきょぱセンター（地下鉄栄駅 名城線15番出口付近）" },
      { kind: "other", title: "のぼり・カリテコバイク", text: "対象駐車場にコラボのぼり。コラボ限定のカリテコバイク30台が登場" },
    ],
    shops: [
      { name: "めきょぱセンター", stamps: 1, lat: 35.1687207, lng: 136.9084662, hours: "営業時間は公式に記載なし" },
    ],
    othersLabel: "コラボのぼり設置駐車場",
    others: [
      { name: "ナゴヤドーム西", lat: 35.1860109, lng: 136.9446058, note: "コラボのぼり" },
      { name: "池下北第７", lat: 35.1687843, lng: 136.9448894, note: "コラボのぼり" },
      { name: "池下北第２", lat: 35.1686215, lng: 136.9455154, note: "コラボのぼり" },
      { name: "吹上第２", lat: 35.1605073, lng: 136.9352895, note: "コラボのぼり" },
      { name: "総合リハビリセンター駅北", lat: 35.1292222, lng: 136.9578139, note: "コラボのぼり" },
      { name: "神宮前北", lat: 35.1266566, lng: 136.9109481, note: "コラボのぼり" },
      { name: "金山駅南第２", lat: 35.1409332, lng: 136.9023919, note: "コラボのぼり" },
      { name: "常滑駅前", lat: 34.8894953, lng: 136.8348397, note: "コラボのぼり" },
      { name: "烏森駅東", lat: 35.1534339, lng: 136.864548, note: "コラボのぼり" },
      { name: "中村公園第１３", lat: 35.1675088, lng: 136.8562008, note: "コラボのぼり" },
      { name: "中村公園第１０", lat: 35.1666238, lng: 136.8563497, note: "コラボのぼり" },
      { name: "松原町第４", lat: 35.1724943, lng: 136.8684117, note: "コラボのぼり" },
      { name: "椿町第３", lat: 35.1682072, lng: 136.8804535, note: "コラボのぼり" },
      { name: "名駅３丁目ＰＢ", lat: 35.1743352, lng: 136.8860321, note: "コラボのぼり" },
      { name: "名駅４丁目", lat: 35.1693866, lng: 136.8882711, note: "コラボのぼり" },
      { name: "名駅４丁目第７", lat: 35.1709822, lng: 136.8882494, note: "コラボのぼり" },
      { name: "白川公園", lat: 35.1653842, lng: 136.8981004, note: "コラボのぼり" },
      { name: "伏見通御園", lat: 35.1667862, lng: 136.897249, note: "コラボのぼり" },
      { name: "錦3丁目第7", lat: 35.1725344, lng: 136.9019131, note: "コラボのぼり" },
      { name: "大須第５", lat: 35.1596043, lng: 136.9005332, note: "コラボのぼり" },
      { name: "大須ＭｕｌｔｉｎａＢｏｘ（マルチナボックス）駐車場", lat: 35.1603974, lng: 136.9058504, note: "コラボのぼり" },
      { name: "栄Ｍ", lat: 35.1661004, lng: 136.9100764, note: "コラボのぼり" },
      { name: "すいほう園", lat: 35.1682003, lng: 136.9105389, note: "コラボのぼり" },
    ],
    links: { web: "https://www.mkyosho.co.jp/business/", x: "https://x.com/mkp_jp" } },

  { id: "meitetsu-souken", name: "名鉄生活創研", genre: "ギフトショップ",
    perks: ["photo"], chars: ["rurino"],
    post: "https://x.com/MWT_Travel/status/2114643194574991464",
    collab: [
      { kind: "photo", title: "大沢瑠璃乃フォトパネル", text: "なごみゃ エスカ店" },
    ],
    shops: [
      { name: "なごみゃエスカ店", stamps: 1, lat: 35.1698128, lng: 136.8804703, hours: "10:00〜20:30", closed: "エスカの定休日に準ずる" },
    ],
    links: { web: "https://www.meitetsu-souken.co.jp/service/2026061816122814.html", x: "https://x.com/nagomiya_esca" } },

  { id: "yabaton", name: "矢場とん", genre: "みそかつ",
    perks: ["novelty", "photo"], chars: ["keke", "you"],
    post: "https://x.com/YabatonO/status/2114643208194134358",
    collab: [
      { kind: "novelty", title: "ノベルティカード（全3種）", text: "対象店舗で税込2,000円以上の飲食・買い物をした希望者にランダムで1枚" },
      { kind: "photo", title: "フォトパネル（全3種）",
        text: "栄LACHIC店、栄セントライズ店、名古屋城金シャチ横丁店、名古屋駅エスカ店、名古屋駅三井ビル北館店、中部国際空港店、イオンモールナゴヤドーム前店、YABATON SHOP" },
      { kind: "other", title: "対象店舗（18店）",
        text: "矢場町本店、栄松坂屋店、栄LACHIC店、栄セントライズ店、名古屋城金シャチ横丁店、名古屋駅エスカ店、名古屋駅三井ビル北館店、名古屋駅ルーセント店、中部国際空港店、イオンモールナゴヤドーム前店、昔の矢場とん 大須観音本店、豊田T-FACE店、NEOPASA岡崎店、三井アウトレットパーク岡崎店、栄松坂屋地下店、名古屋駅ジェイアールタカシマヤ店、JR名古屋駅店、YABATON SHOP" },
    ],
    shops: [
      { name: "YABATON SHOP おうち de 矢場とん", stamps: 2, lat: 35.1617987, lng: 136.9061933, hours: "11:00〜21:00", closed: "なし" },
    ],
    others: [
      { name: "矢場町本店", lat: 35.1616781, lng: 136.9062361 },
      { name: "栄松坂屋店", lat: 35.1646778, lng: 136.9080861 },
      { name: "栄ＬＡＣＨＩＣ店", lat: 35.1673585, lng: 136.9081339, note: "パネルあり" },
      { name: "栄セントライズ店", lat: 35.1679811, lng: 136.905446, note: "パネルあり" },
      { name: "名古屋城金シャチ横丁店", lat: 35.1828827, lng: 136.8991995, note: "パネルあり" },
      { name: "名古屋駅エスカ店", lat: 35.1709921, lng: 136.8797233, note: "パネルあり" },
      { name: "名古屋駅三井ビル北館店", lat: 35.1687756, lng: 136.8852761, note: "パネルあり" },
      { name: "名古屋駅ルーセント店", lat: 35.1749091, lng: 136.8811366 },
      { name: "中部国際空港店", lat: 34.8585151, lng: 136.8148075, note: "パネルあり" },
      { name: "イオンモールナゴヤドーム前店", lat: 35.1870942, lng: 136.9444751, note: "パネルあり" },
      { name: "昔の矢場とん 大須観音本店", lat: 35.1596073, lng: 136.8998569 },
      { name: "豊田Ｔ－ＦＡＣＥ店", lat: 35.0876081, lng: 137.155227 },
      { name: "NEOPASA岡崎店", lat: 35.0339637, lng: 137.2224526 },
      { name: "栄 松坂屋地下店", lat: 35.1654625, lng: 136.9078118 },
      { name: "名古屋駅ジェイアールタカシマヤ店", lat: 35.1711166, lng: 136.8833906 },
      { name: "JR名古屋駅店", lat: 35.1690306, lng: 136.8818247 },
    ],
    links: { web: "https://www.yabaton.com/", x: "https://x.com/YabatonO", instagram: "https://www.instagram.com/yabaton_official/" } },

  { id: "yamamotoya", name: "大久手 山本屋", genre: "煮込みうどん",
    perks: ["novelty", "photo"], chars: ["kanata", "polka", "natsumi", "anzu"],
    collab: [
      { kind: "novelty", title: "ノベルティカード（店舗ごとに絵柄が違う）",
        text: "お会計2,000円（税込）ごとに1枚（1会計1枚まで）。大久手店：高橋ポルカ／桜通大津店：鬼塚夏美／神宮前店：近江彼方／大曽根店：滝沢アンズ" },
      { kind: "photo", title: "フォトパネル・ウォールステッカー",
        text: "大久手店：高橋ポルカ（フォトパネル＋ウォールステッカー）／桜通大津店：鬼塚夏美／神宮前店：近江彼方／大曽根店：滝沢アンズ（各ウォールステッカー）" },
    ],
    shops: [
      { name: "大久手店", stamps: 1, lat: 35.161484, lng: 136.9364074, note: "高橋ポルカ（フォトパネル・ウォールステッカー）", hours: "11:00〜22:00", closed: "年中無休（2026年10月1日から）" },
      { name: "神宮前店", stamps: 1, lat: 35.1261556, lng: 136.9116522, note: "近江彼方（ウォールステッカー）", hours: "平日 11:00〜20:00（LO 19:30）／土日祝 10:00〜20:00（LO 19:30）", closed: "年中無休（臨時休業あり）" },
      { name: "桜通大津店", stamps: 1, lat: 35.1741835, lng: 136.9065618, note: "鬼塚夏美（ウォールステッカー）", hours: "11:00〜22:00", closed: "年中無休（年末年始を除く）" },
      { name: "大曽根店", stamps: 1, lat: 35.1914683, lng: 136.9359879, note: "滝沢アンズ（ウォールステッカー）", hours: "11:00〜22:00", closed: "年中無休" },
    ],
    links: { web: "https://a-yamamotoya.co.jp/", x: "https://x.com/yamamotoya_miso" } },

  { id: "wakashachiya", name: "若鯱家", genre: "カレーうどん",
    perks: ["novelty", "photo"], chars: ["rin", "shizuku"],
    post: "https://x.com/MWT_Travel/status/2114643197259297145",
    collab: [
      { kind: "novelty", title: "ノベルティカード（全1種）",
        text: "お会計税込2,000円以上で1枚。錦店、名古屋駅エスカ店、パレマルシェ池下店、イオンタウン千種店、BINO栄店、アピタ名古屋北店、アピタ千代田橋店、アピタ名古屋南店、アピタ鳴海店、イオンモールナゴヤドーム前店、イオンモール名古屋茶屋店、中部国際空港店" },
      { kind: "photo", title: "フォトパネル", text: "BINO栄店" },
      { kind: "other", title: "スタンプ", text: "星空凛スタンプ：BINO栄店／桜坂しずくスタンプ：イオンタウン千種店（パネルはBINO栄店のみ）" },
    ],
    shops: [
      { name: "BINO栄店", stamps: 1, lat: 35.1692591, lng: 136.906486, hours: "11:00〜21:00（LO 20:15）" },
      { name: "イオンタウン千種店", stamps: 1, lat: 35.1614669, lng: 136.9241457, hours: "11:00〜21:00（LO 20:15）" },
    ],
    others: [
      { name: "錦店", lat: 35.1713804, lng: 136.9041448 },
      { name: "名古屋駅エスカ店", lat: 35.1708516, lng: 136.8798491 },
      { name: "パレマルシェ池下店", lat: 35.1673621, lng: 136.9467199 },
      { name: "アピタ名古屋北店", lat: 35.2096485, lng: 136.9226995 },
      { name: "アピタ千代田橋店", lat: 35.1867782, lng: 136.9690397 },
      { name: "アピタ名古屋南店", lat: 35.1028077, lng: 136.9129022 },
      { name: "アピタ鳴海店", lat: 35.0940356, lng: 136.9583271 },
      { name: "イオンモールナゴヤドーム前店", lat: 35.1871052, lng: 136.9449693 },
      { name: "イオンモール名古屋茶屋店", lat: 35.1032951, lng: 136.8256016 },
      { name: "中部国際空港店", lat: 34.8595168, lng: 136.8144044 },
    ],
    links: { web: "https://www.wakashachiya.co.jp/", instagram: "https://www.instagram.com/wakashachiya/" } },
];

const PERKS = [
  { id: "goods",   label: "グッズ販売",     long: "コラボグッズなどの販売" },
  { id: "novelty", label: "ノベルティ",     long: "ノベルティ配布" },
  { id: "photo",   label: "フォトスポット", long: "パネルなどのフォトスポット" },
];
