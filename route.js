(() => {
  "use strict";

  const YAHOO = "https://transit.yahoo.co.jp/search/result";
  const CENTER = [136.912, 35.158];

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const norm = s => String(s).toLowerCase().normalize("NFKC")
    .replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .replace(/[\s・.]/g, "");
  const walkMin = m => Math.max(1, Math.round(m * 1.25 / 80));

  // ---------- places: stamp spots + collab-only stores that have access data ----------
  const PLACES = [];
  for (const store of STORES) {
    const add = (shop, stamp) => {
      const key = `${store.id}/${shop.name}`;
      const access = ACCESS[key];
      if (!access) return;
      // 店舗名だけで通じるもの（施設名・ブランド名入り）は事業者名を前に付けない
      const label = /科学館|案内所|iセンター|側島製罐|矢場とん/.test(shop.name) ? shop.name : `${store.name} ${shop.name}`;
      PLACES.push({ key, store, shop, stamp, access, label });
    };
    store.shops.forEach(sh => add(sh, true));
    (store.others || []).forEach(sh => add(sh, false));
  }
  const placeByKey = Object.fromEntries(PLACES.map(p => [p.key, p]));
  for (const p of PLACES) {
    p.text = norm([p.label, p.store.genre, ...p.access.st.map(s => s[0] + "駅")].join(" "));
  }

  // ---------- state ----------
  // from / to: { text, key } — key points at a place, text is what the input shows.
  const state = { from: { text: "", key: "" }, to: { text: "", key: "" }, lq: "", stampOnly: false };

  function readUrl() {
    const p = new URLSearchParams(location.search);
    const pick = (keyName, textName) => {
      const k = p.get(keyName);
      if (k && placeByKey[k]) return { text: placeByKey[k].label, key: k };
      return { text: p.get(textName) || "", key: "" };
    };
    state.to = pick("to", "tot");
    state.from = pick("froms", "from");
  }
  function writeUrl() {
    const p = new URLSearchParams();
    if (state.from.key) p.set("froms", state.from.key); else if (state.from.text) p.set("from", state.from.text);
    if (state.to.key) p.set("to", state.to.key); else if (state.to.text) p.set("tot", state.to.text);
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  }

  const queryOf = pt => pt.key ? placeByKey[pt.key].access.q : pt.text.trim();
  const stationQuery = st => st[3] || st[0];

  // ---------- Yahoo!乗換案内 ----------
  function yahooUrl(from, to) {
    const p = new URLSearchParams({ from, to, type: $("type").value });
    const [y, m, d] = ($("date").value || "").split("-");
    const [hh, mm] = ($("time").value || "").split(":");
    if (y && hh && $("type").value !== "3" && $("type").value !== "2") {
      p.set("y", y); p.set("m", m); p.set("d", d);
      p.set("hh", hh); p.set("m1", mm[0]); p.set("m2", mm[1]);
    } else if (y) {
      p.set("y", y); p.set("m", m); p.set("d", d);
    }
    return `${YAHOO}?${p}`;
  }

  function setNow() {
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    $("date").value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    $("time").value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  // ---------- rendering ----------
  function syncInputs() {
    $("from").value = state.from.text;
    $("to").value = state.to.text;
    $("from").classList.toggle("is-place", !!state.from.key);
    $("to").classList.toggle("is-place", !!state.to.key);
  }

  const hoursHtml = sh => [
    sh.alert && `<span class="shop-alert">${esc(sh.alert)}</span>`,
    sh.hours && `<span class="shop-hours">${esc(sh.hours)}</span>`,
    sh.closed && `<span class="shop-hours">休み：${esc(sh.closed)}</span>`,
  ].filter(Boolean).join("");

  const linesShort = l => {
    const xs = l.split("・");
    return xs.length > 3 ? `${xs.slice(0, 3).join("・")} ほか` : l;
  };

  function renderDest() {
    const box = $("dest");
    const place = state.to.key && placeByKey[state.to.key];
    if (!place) { box.hidden = true; box.innerHTML = ""; return; }
    const { store, shop, access } = place;
    const from = queryOf(state.from);
    const stations = access.st.map(st => `<li>
        <span><b>${esc(st[0])}駅</b> 徒歩約${walkMin(st[1])}分<small>${esc(linesShort(st[2]))}</small></span>
        ${from ? `<a href="${esc(yahooUrl(from, stationQuery(st)))}" target="_blank" rel="noopener">駅までの経路</a>` : ""}
      </li>`).join("");
    box.innerHTML = `
      <p class="dest-eyebrow">到着地の店舗</p>
      <h2 class="dest-name">${esc(place.label)}${shop.stamps ? ` <span class="stamp-count">スタンプ×${shop.stamps}</span>` : ""}</h2>
      ${shop.note ? `<p class="dest-note">${esc(shop.note)}</p>` : ""}
      <p class="dest-hours">${hoursHtml(shop) || '<span class="shop-hours">営業時間は未確認です</span>'}</p>
      ${access.memo ? `<p class="dest-memo">${esc(access.memo)}</p>` : ""}
      ${stations ? `<p class="dest-sub">最寄り駅（目安）</p><ul class="dest-stations">${stations}</ul>` : ""}
      <p class="dest-links">
        <a href="./?q=${encodeURIComponent(store.name)}">コラボ内容を見る</a>
        <a href="https://www.google.com/maps/search/?api=1&amp;query=${shop.lat},${shop.lng}" target="_blank" rel="noopener">Googleマップ</a>
      </p>`;
    box.hidden = false;
  }

  function renderList() {
    const q = norm(state.lq);
    const hits = PLACES.filter(p => (!state.stampOnly || p.stamp) && (!q || p.text.includes(q)));
    $("list-count").textContent = `${hits.length} / ${PLACES.length} 店舗`;
    const groups = [];
    for (const p of hits) {
      const g = groups.find(g => g.store === p.store);
      if (g) g.items.push(p); else groups.push({ store: p.store, items: [p] });
    }
    $("shop-list").innerHTML = groups.length ? groups.map(g => `
      <div class="sl-group">
        <h3 class="sl-store">${esc(g.store.name)}<span class="genre">${esc(g.store.genre)}</span></h3>
        <ul class="sl-items">${g.items.map(p => {
          const st = p.access.st[0];
          return `<li class="sl-item${p.key === state.to.key ? " is-to" : ""}${p.key === state.from.key ? " is-from" : ""}" data-key="${esc(p.key)}">
            <button type="button" class="sl-main" data-act="focus">
              <span class="sl-name">${esc(p.shop.name)}${p.shop.stamps ? ` <span class="stamp-count">スタンプ×${p.shop.stamps}</span>` : ""}</span>
              <span class="sl-meta">${st ? `${esc(st[0])}駅 徒歩約${walkMin(st[1])}分` : esc(p.access.memo ? "高速道路のSA内" : "")}${p.shop.hours ? ` ／ ${esc(p.shop.hours)}` : ""}</span>
            </button>
            <span class="sl-acts">
              <button type="button" class="mini mini-to" data-act="to">ここへ</button>
              <button type="button" class="mini" data-act="from">ここから</button>
            </span>
          </li>`;
        }).join("")}</ul>
      </div>`).join("") : `<p class="empty">条件に合う店舗がありません。</p>`;
  }

  function renderStations() {
    const names = new Map();
    for (const p of PLACES) for (const st of p.access.st) names.set(st[0], stationQuery(st));
    $("station-list").innerHTML = [...names].sort((a, b) => a[0].localeCompare(b[0], "ja"))
      .map(([name, q]) => `<option value="${esc(q)}">${esc(name)}駅</option>`).join("");
  }

  function update() {
    syncInputs();
    renderDest();
    renderList();
    updateMarkers();
    writeUrl();
    $("form-msg").textContent = "";
  }

  // ---------- map ----------
  let map = null;
  const markers = new Map();
  let popup = null;

  function popupHtml(p) {
    const st = p.access.st[0];
    return `<div class="pop" data-key="${esc(p.key)}">
      <p class="pop-store">${esc(p.store.name)}</p>
      <p class="pop-name">${esc(p.shop.name)}${p.shop.stamps ? ` <span class="stamp-count">スタンプ×${p.shop.stamps}</span>` : ""}</p>
      ${p.shop.hours ? `<p class="pop-hours">${esc(p.shop.hours)}${p.shop.closed ? `<br>休み：${esc(p.shop.closed)}` : ""}</p>` : ""}
      ${st ? `<p class="pop-hours">${esc(st[0])}駅 徒歩約${walkMin(st[1])}分（目安）</p>` : ""}
      <p class="pop-acts">
        <button type="button" class="mini mini-to" data-act="to">ここへ行く</button>
        <button type="button" class="mini" data-act="from">ここから出発</button>
      </p>
    </div>`;
  }

  function openPopup(p) {
    if (!map) return;
    if (popup) popup.remove();
    popup = new mapboxgl.Popup({ offset: 16, maxWidth: "280px", focusAfterOpen: false })
      .setLngLat([p.shop.lng, p.shop.lat]).setHTML(popupHtml(p)).addTo(map);
  }

  function focusPlace(p, zoom) {
    if (!map) return;
    map.flyTo({ center: [p.shop.lng, p.shop.lat], zoom: Math.max(map.getZoom(), zoom || 14), essential: true });
    openPopup(p);
  }

  function updateMarkers() {
    for (const [key, m] of markers) {
      const el = m.getElement();
      el.classList.toggle("is-to", key === state.to.key);
      el.classList.toggle("is-from", key === state.from.key);
      const p = placeByKey[key];
      el.classList.toggle("is-dim", state.stampOnly && !p.stamp);
    }
  }

  function initMap() {
    const msg = text => { $("map-msg").innerHTML = text; $("map-msg").hidden = false; $("map").hidden = true; };
    if (typeof mapboxgl === "undefined") { msg("地図を読み込めませんでした。通信状況を確認して再読み込みしてください。店舗一覧からも経路を検索できます。"); return; }
    if (!MAPBOX_TOKEN) { msg("地図は準備中です。店舗一覧から店舗を選んで経路を検索できます。"); return; }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const dark = matchMedia("(prefers-color-scheme: dark)").matches;
    try {
      map = new mapboxgl.Map({
        container: "map",
        style: dark ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12",
        center: CENTER, zoom: 11.3, language: "ja", cooperativeGestures: matchMedia("(pointer: coarse)").matches,
      });
    } catch (e) {
      msg("この端末では地図を表示できません。店舗一覧から経路を検索できます。");
      return;
    }
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false, showUserHeading: true }), "top-right");
    map.on("error", e => { if (e && e.error && /401|403|token/i.test(String(e.error.message || e.error.status))) msg("地図を表示できませんでした（Mapbox のトークンを確認してください）。店舗一覧から経路を検索できます。"); });

    for (const p of PLACES) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `pin ${p.stamp ? "pin-stamp" : "pin-other"}`;
      el.textContent = p.stamp ? String(p.shop.stamps) : "";
      el.setAttribute("aria-label", p.label);
      el.addEventListener("click", ev => { ev.stopPropagation(); openPopup(p); });
      markers.set(p.key, new mapboxgl.Marker({ element: el }).setLngLat([p.shop.lng, p.shop.lat]).addTo(map));
    }
    updateMarkers();
    const target = placeByKey[state.to.key];
    if (target) map.once("load", () => focusPlace(target, 14));
  }

  // ---------- actions ----------
  function setPoint(which, key) {
    const p = placeByKey[key];
    if (!p) return;
    const other = which === "to" ? "from" : "to";
    if (state[other].key === key) state[other] = { text: "", key: "" };
    state[which] = { text: p.label, key };
    update();
    if (popup) popup.remove();
    if (matchMedia("(max-width: 860px)").matches) $("route-form").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onAct(ev) {
    const btn = ev.target.closest("[data-act]");
    if (!btn) return;
    const holder = btn.closest("[data-key]");
    const key = holder && holder.dataset.key;
    if (!key) return;
    const act = btn.dataset.act;
    if (act === "focus") {
      const p = placeByKey[key];
      if (map) {
        focusPlace(p, 15);
        if (matchMedia("(max-width: 860px)").matches) $("map").scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setPoint("to", key);
      }
    } else {
      setPoint(act, key);
    }
  }

  document.addEventListener("click", onAct);

  for (const which of ["from", "to"]) {
    $(which).addEventListener("input", e => {
      state[which] = { text: e.target.value, key: "" };
      e.target.classList.remove("is-place");
      renderDest();
      renderList();
      updateMarkers();
      writeUrl();
    });
  }

  $("swap").addEventListener("click", () => {
    [state.from, state.to] = [state.to, state.from];
    update();
  });

  $("now").addEventListener("click", () => { setNow(); $("type").value = "1"; $("time").disabled = false; renderDest(); });
  $("type").addEventListener("change", () => {
    const noTime = $("type").value === "3" || $("type").value === "2";
    $("time").disabled = noTime;
  });
  // 駅までの経路リンクにも日時を反映する
  for (const id of ["type", "date", "time"]) $(id).addEventListener("change", renderDest);

  $("route-form").addEventListener("submit", e => {
    e.preventDefault();
    const from = queryOf(state.from), to = queryOf(state.to);
    if (!from || !to) {
      $("form-msg").textContent = !to ? "到着地を選ぶか入力してください。" : "出発地を入力してください（例：名古屋）。";
      (!from ? $("from") : $("to")).focus();
      return;
    }
    window.open(yahooUrl(from, to), "_blank", "noopener");
  });

  $("lq").addEventListener("input", e => { state.lq = e.target.value; renderList(); });
  $("stamp-only").addEventListener("change", e => { state.stampOnly = e.target.checked; renderList(); updateMarkers(); });

  // ---------- boot ----------
  $("hours-checked").textContent = HOURS_CHECKED;
  readUrl();
  setNow();
  renderStations();
  update();
  initMap();
})();
