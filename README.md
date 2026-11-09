# ラブナゴヤ！コラボ店さがし

『ラブライブ！シリーズ』×「ラブナゴヤ！フェス」（2026年11月6日〜12月6日）のコラボ店を、キャラクターと特典（グッズ販売・ノベルティ・フォトスポット）で絞り込める非公式ファンサイトです。

出典: [名鉄観光 特設ページ](https://www.mwt.co.jp/kokunai/chubu/special/lovelive2026/)

## ファイル

| ファイル | 内容 |
| --- | --- |
| `index.html` | コラボ店さがし（絞り込みページ） |
| `route.html` | 経路検索ページ（Mapbox の地図＋Yahoo!乗換案内へのリンク） |
| `style.css` | 見た目（両ページ共通） |
| `route.css` | 経路検索ページだけの見た目 |
| `app.js` | 絞り込みの処理 |
| `route.js` | 経路検索ページの処理 |
| `data.js` | 店舗・キャラクター・特典のデータ |
| `access.js` | 経路検索用データ（Yahoo!乗換案内での店舗名、最寄り駅） |
| `config.js` | Mapbox のアクセストークン |

## データの更新

公式の発表が更新されたら `data.js` を編集します。

- `STORES[].chars` にキャラクターの `id` を並べると、その店舗に紐づきます。
- `STORES[].shops` は参加店舗（スタンプラリースポット）。`name` / `lat` / `lng` と、必要なら `note`。出典は[スタンプラリースポットマップ](https://www.google.com/maps/d/viewer?mid=1gvdgaUiNzDugl8GMDz6dLPA-JiHM5l4)。
- `STORES[].collab` はコラボ内容。`{ kind: "goods" | "novelty" | "photo" | "other", title, price?, text? }`。`post` に告知ポストのURL。
- `STORES[].groups` は集合パネルのあるグループ（`SERIES` の id）。そのグループのキャラで絞り込んだときにも表示されます。
- `STORES[].perks` は `goods`（グッズ販売）/ `novelty`（ノベルティ）/ `photo`（フォトスポット）。
- `UPDATED` を更新日に書き換えると、フッターの「◯時点」に反映されます。

## 経路検索ページ

- 地図は Mapbox GL JS。`config.js` の `MAPBOX_TOKEN` に公開トークン（`pk.`）を入れると表示されます。空だと地図なしで動きます。トークンには Mapbox の管理画面で URL 制限をかけてください。
- 経路は Yahoo!乗換案内の検索結果ページを新しいタブで開きます。店舗は `access.js` の `q`（Yahoo!のスポット名）で指定します。
- 店舗を `data.js` に追加したら `access.js` にも `"事業者id/店舗名"` のキーで `q` と最寄り駅 `st` を足してください。ないと経路検索には出ません。
- URL：`route.html?to=yabaton/矢場町本店`（到着に店舗）、`&from=名古屋`（出発に駅名など）、`&froms=事業者id/店舗名`（出発に店舗）。

## 共有用URL

絞り込み条件はURLに入ります。

- `?c=maki,izumi` … キャラクター（いずれか）
- `?c=you,keke&m=all` … 全員そろう店舗
- `?c=maki&g=0` … 集合パネルの店を含めない
- `?p=goods,novelty` … 特典（すべてある店舗）
- `?q=うどん` … キーワード

## ローカルで確認

```bash
python -m http.server 8000
```

ブラウザで http://localhost:8000/ を開きます。
