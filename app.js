(() => {
  "use strict";

  const ICONS = {
    goods: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    novelty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13"/><path d="M12 8c-1.5-3-5-3.5-5-1.5S10 8 12 8zm0 0c1.5-3 5-3.5 5-1.5S14 8 12 8z"/></svg>',
    photo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    other: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  };

  const seriesById = Object.fromEntries(SERIES.map(s => [s.id, s]));
  const charById = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));

  const state = { chars: new Set(), perks: new Set(), mode: "any", groups: true, q: "" };

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const norm = s => String(s).toLowerCase().normalize("NFKC")
    .replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .replace(/[\s・.]/g, "");

  // ---------- URL state (?c=maki,izumi&p=goods&m=all&g=0&q=...) ----------
  function readUrl() {
    const p = new URLSearchParams(location.search);
    (p.get("c") || "").split(",").filter(id => charById[id]).forEach(id => state.chars.add(id));
    (p.get("p") || "").split(",").filter(id => PERKS.some(k => k.id === id)).forEach(id => state.perks.add(id));
    if (p.get("m") === "all") state.mode = "all";
    if (p.get("g") === "0") state.groups = false;
    state.q = p.get("q") || "";
  }
  function writeUrl() {
    const p = new URLSearchParams();
    if (state.chars.size) p.set("c", [...state.chars].join(","));
    if (state.perks.size) p.set("p", [...state.perks].join(","));
    if (state.mode === "all") p.set("m", "all");
    if (!state.groups) p.set("g", "0");
    if (state.q) p.set("q", state.q);
    const qs = p.toString();
    try { history.replaceState(null, "", qs ? "?" + qs : location.pathname); } catch (_) {}
  }

  // ---------- matching ----------
  // 個別に描かれているか、（切替が有効なら）そのキャラのグループの集合パネルがあるか
  const hasChar = (store, id) => store.chars.includes(id) ||
    (state.groups && (store.groups || []).includes(charById[id].series));

  function storeText(store) {
    const names = store.chars.map(id => charById[id]).flatMap(c => [c.name, c.kana, c.romaji, seriesById[c.series].group, seriesById[c.series].name]);
    const groups = (store.groups || []).map(id => seriesById[id]).flatMap(s => [s.group, s.name]);
    const collab = store.collab.flatMap(c => [c.title, c.text || ""]);
    const places = [...store.shops, ...(store.others || [])].map(sh => sh.name);
    return norm([store.name, store.genre, ...places, ...names, ...groups, ...collab].join(" "));
  }
  const textIndex = new Map(STORES.map(s => [s.id, storeText(s)]));

  function matches(store) {
    if (state.chars.size) {
      const has = [...state.chars].map(id => hasChar(store, id));
      if (state.mode === "all" ? !has.every(Boolean) : !has.some(Boolean)) return false;
    }
    for (const p of state.perks) if (!store.perks.includes(p)) return false;
    if (state.q) {
      const words = state.q.trim().split(/[\s　]+/).filter(Boolean).map(norm);
      const t = textIndex.get(store.id);
      if (!words.every(w => t.includes(w))) return false;
    }
    return true;
  }

  // ---------- filter UI ----------
  // 塗りの上に載せる文字色。淡いメンバーカラーでは白文字が読めないので濃い色にする
  function inkOn(hex) {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? "#3b1d2a" : "#ffffff";
  }

  function charChip(c, extraClass = "") {
    const color = c.color || seriesById[c.series].color;
    const count = STORES.filter(st => hasChar(st, c.id)).length;
    return `<button type="button" class="chip ${extraClass}" style="--c:${color};--ci:${inkOn(color)}" data-char="${c.id}" aria-pressed="${state.chars.has(c.id)}">${esc(c.name)}${count > 1 ? `<span class="n">${count}店</span>` : ""}</button>`;
  }

  function renderFilters() {
    $("series-list").innerHTML = SERIES.map(s => {
      const cs = CHARACTERS.filter(c => c.series === s.id);
      return `<div class="series">
        <button type="button" class="series-name" style="--c:${s.color}" data-series="${s.id}" title="${esc(s.group)}を全員選択／解除">
          <span>${esc(s.group)}<small>${esc(s.name)}</small></span>
        </button>
        <div class="chips">${cs.map(c => charChip(c)).join("")}</div>
      </div>`;
    }).join("");

    $("perk-list").innerHTML = PERKS.map(p => {
      const n = STORES.filter(s => s.perks.includes(p.id)).length;
      return `<button type="button" class="perk-toggle" data-perk="${p.id}" aria-pressed="${state.perks.has(p.id)}" title="${esc(p.long)}">${ICONS[p.id]}${esc(p.label)}<span class="n">${n}店</span></button>`;
    }).join("");
  }

  function syncFilterState() {
    document.querySelectorAll("#series-list .chip").forEach(b => b.setAttribute("aria-pressed", state.chars.has(b.dataset.char)));
    document.querySelectorAll(".perk-toggle").forEach(b => b.setAttribute("aria-pressed", state.perks.has(b.dataset.perk)));
    $("mode-any").setAttribute("aria-pressed", state.mode === "any");
    $("mode-all").setAttribute("aria-pressed", state.mode === "all");
    $("groups").checked = state.groups;
    if ($("q").value !== state.q) $("q").value = state.q;
  }

  // ---------- cards ----------
  function card(store) {
    const perks = PERKS.map(p => {
      const on = store.perks.includes(p.id);
      return `<span class="perk${on ? "" : " off"}" title="${esc(p.long)}${on ? "" : "（なし）"}">${ICONS[p.id]}${esc(p.label)}</span>`;
    }).join("");

    const selectedSeries = new Set([...state.chars].map(id => charById[id].series));
    const groupChips = (store.groups || []).map(id => {
      const s = seriesById[id];
      const on = state.groups && selectedSeries.has(id) ? " on" : "";
      return `<span class="group-chip${on}" style="--c:${s.color}">${esc(s.group)} 集合パネル</span>`;
    }).join("");
    const cast = `<div class="cast">${store.chars.map(id => {
        const dim = state.chars.size && !state.chars.has(id) ? "dim" : "";
        return charChip(charById[id], dim);
      }).join("")}${groupChips}</div>`;

    const collab = store.collab.length
      ? `<ul class="collab">${store.collab.map(c => `<li class="collab-${c.kind}">
          ${ICONS[c.kind] || ICONS.other}
          <div><p class="collab-title">${esc(c.title)}${c.price ? ` <span class="price">${esc(c.price)}</span>` : ""}</p>${c.text ? `<p class="collab-text">${esc(c.text)}</p>` : ""}</div>
        </li>`).join("")}</ul>`
      : `<p class="collab-none">コラボ内容は未発表です。</p>`;

    const mapLink = sh => `<a href="https://www.google.com/maps/search/?api=1&amp;query=${sh.lat},${sh.lng}" target="_blank" rel="noopener">地図</a>`;
    const shops = `<ul class="shops">${store.shops.map(sh => `<li>
        <span class="shop-name">${esc(sh.name)}${sh.stamps ? ` <span class="stamp-count">スタンプ×${sh.stamps}</span>` : ""}${sh.note ? `<small>${esc(sh.note)}</small>` : ""}
          ${sh.alert ? `<span class="shop-alert">${esc(sh.alert)}</span>` : ""}
          ${sh.hours ? `<span class="shop-hours">${esc(sh.hours)}</span>` : ""}
          ${sh.closed ? `<span class="shop-hours">休み：${esc(sh.closed)}</span>` : ""}</span>
        ${mapLink(sh)}
      </li>`).join("")}</ul>`;
    const others = store.others && store.others.length
      ? `<details class="others"><summary>${esc(store.othersLabel || "スタンプなしのコラボ対象店舗")}（${store.others.length}）</summary>
          <ul class="shops">${store.others.map(sh => `<li>
            <span class="shop-name">${esc(sh.name)}${sh.note ? `<small>${esc(sh.note)}</small>` : ""}
              ${sh.hours ? `<span class="shop-hours">${esc(sh.hours)}</span>` : ""}
              ${sh.closed ? `<span class="shop-hours">休み：${esc(sh.closed)}</span>` : ""}</span>${mapLink(sh)}
          </li>`).join("")}</ul></details>`
      : "";

    const L = store.links;
    const links = [
      L.web && `<a href="${esc(L.web)}" target="_blank" rel="noopener">公式サイト</a>`,
      L.x && `<a href="${esc(L.x)}" target="_blank" rel="noopener">X</a>`,
      L.instagram && `<a href="${esc(L.instagram)}" target="_blank" rel="noopener">Instagram</a>`,
    ].filter(Boolean).join("");

    return `<article class="card" id="store-${store.id}">
      <div class="card-img"><img src="${IMG_BASE}img_${store.id}.jpg" alt="${esc(store.name)}×『ラブライブ！シリーズ』キービジュアル" loading="lazy" referrerpolicy="no-referrer" width="1000" height="563"></div>
      <div class="card-body">
        <div class="card-title"><h3>${esc(store.name)}</h3><span class="genre">${esc(store.genre)}</span></div>
        <div class="perks">${perks}</div>
        ${cast}
        ${collab}
        <p class="shops-label">スタンプラリースポット</p>
        ${shops}
        ${others}
        <div class="card-foot">
          ${store.post
            ? `<a class="status" href="${esc(store.post)}" target="_blank" rel="noopener">告知ポストを見る</a>`
            : `<a class="status" href="${esc(SOURCE_URL)}" target="_blank" rel="noopener">特設ページで見る</a>`}
          <span class="links">${links}</span>
        </div>
      </div>
    </article>`;
  }

  function renderResults() {
    const hits = STORES.filter(matches);
    $("grid").innerHTML = hits.map(card).join("");
    const shopCount = hits.reduce((n, s) => n + s.shops.length, 0);
    $("count").innerHTML = `${STORES.length}事業者中 <b>${hits.length}</b> 事業者<span class="sub">（${shopCount}店舗）</span>`;
    $("empty").hidden = hits.length > 0;

    const active = state.chars.size || state.perks.size || state.q;
    $("clear").disabled = !active;

    $("selected").innerHTML = [...state.chars].map(id => charChip(charById[id], "sel")).join("");
  }

  function update() {
    syncFilterState();
    renderResults();
    writeUrl();
  }

  // ---------- events ----------
  document.addEventListener("click", e => {
    const chip = e.target.closest("[data-char]");
    if (chip) {
      const id = chip.dataset.char;
      state.chars.has(id) ? state.chars.delete(id) : state.chars.add(id);
      return update();
    }
    const series = e.target.closest("[data-series]");
    if (series) {
      const ids = CHARACTERS.filter(c => c.series === series.dataset.series).map(c => c.id);
      const allOn = ids.every(id => state.chars.has(id));
      ids.forEach(id => allOn ? state.chars.delete(id) : state.chars.add(id));
      if (!allOn && state.mode === "all") state.mode = "any";
      return update();
    }
    const perk = e.target.closest("[data-perk]");
    if (perk) {
      const id = perk.dataset.perk;
      state.perks.has(id) ? state.perks.delete(id) : state.perks.add(id);
      return update();
    }
  });
  $("mode-any").addEventListener("click", () => { state.mode = "any"; update(); });
  $("mode-all").addEventListener("click", () => { state.mode = "all"; update(); });
  $("groups").addEventListener("change", e => { state.groups = e.target.checked; renderFilters(); update(); });
  $("q").addEventListener("input", e => { state.q = e.target.value; renderResults(); writeUrl(); });
  $("clear").addEventListener("click", () => {
    state.chars.clear(); state.perks.clear(); state.q = ""; state.mode = "any";
    if (!state.groups) { state.groups = true; renderFilters(); }
    update();
  });

  // ---------- boot ----------
  $("link-source").href = SOURCE_URL;
  $("link-source2").href = SOURCE_URL;
  $("link-map").href = MAP_URL;
  $("link-thread").href = THREAD_URL;
  $("map-embed").src = MAP_EMBED_URL;
  $("spot-count").textContent = STORES.reduce((n, s) => n + s.shops.length, 0);
  $("stamp-total").textContent = STORES.reduce((n, s) => n + s.shops.reduce((m, sh) => m + (sh.stamps || 0), 0), 0);
  $("updated").textContent = UPDATED.replace(/-/g, "/");
  $("hours-checked").textContent = HOURS_CHECKED;
  readUrl();
  renderFilters();
  update();
})();
