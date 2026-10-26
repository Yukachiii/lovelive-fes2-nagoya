# ラブナゴヤ！コラボ店さがし

『ラブライブ！シリーズ』×「ラブナゴヤ！フェス」（2026年11月6日〜12月6日）のコラボ店を、キャラクターと特典（グッズ販売・ノベルティ・フォトスポット）で絞り込める非公式ファンサイトです。

出典: [名鉄観光 特設ページ](https://www.mwt.co.jp/kokunai/chubu/special/lovelive2026/)

## ファイル

| ファイル | 内容 |
| --- | --- |
| `index.html` | ページ本体 |
| `style.css` | 見た目 |
| `app.js` | 絞り込みの処理 |
| `data.js` | 店舗・キャラクター・特典のデータ |

## データの更新

公式の発表が更新されたら `data.js` を編集します。

- `STORES[].chars` にキャラクターの `id` を並べると、その店舗に紐づきます。
- `STORES[].shops` は参加店舗（スタンプラリースポット）。`name` / `lat` / `lng` と、必要なら `note`。出典は[スタンプラリースポットマップ](https://www.google.com/maps/d/viewer?mid=1gvdgaUiNzDugl8GMDz6dLPA-JiHM5l4)。
- `STORES[].collab` はコラボ内容。`{ kind: "goods" | "novelty" | "photo" | "other", title, price?, text? }`。`post` に告知ポストのURL。
- `STORES[].groups` は集合パネルのあるグループ（`SERIES` の id）。そのグループのキャラで絞り込んだときにも表示されます。
- `STORES[].perks` は `goods`（グッズ販売）/ `novelty`（ノベルティ）/ `photo`（フォトスポット）。
- `UPDATED` を更新日に書き換えると、フッターの「◯時点」に反映されます。

## 共有用URL

絞り込み条件はURLに入ります。

- `?c=maki,izumi` … キャラクター（いずれか）
- `?c=you,keke&m=all` … 全員そろう店舗
- `?p=goods,novelty` … 特典（すべてある店舗）
- `?q=うどん` … キーワード

## ローカルで確認

```bash
python -m http.server 8000
```

ブラウザで http://localhost:8000/ を開きます。
