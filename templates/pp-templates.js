/* 프린트팩 템플릿 다운로드 — 렌더/필터 (데이터: <script data-pp-tpl-data> JSON) */
(function () {
  var root = document.querySelector('[data-pp-tpl]');
  if (!root) return;
  var data = JSON.parse(root.querySelector('[data-pp-tpl-data]').textContent);
  var items = data.items, cats = data.categories;
  var state = { cat: 'all', q: '', sub: {} };

  var ICON_DL = '<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>';
  var ICON_ZIP = '<svg viewBox="0 0 24 24"><path d="M4 7h16v13H4zM4 7l2-3h12l2 3M10 11h4"/></svg>';
  var ICON_SEARCH = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // 카테고리별 서브필터 키 (스티커·버튼·부채·와블러·사원증 → shape, 리플렛·전단지·포스터·책자 → paper)
  function subKey(cat) { return ['leaflet', 'flyer', 'poster', 'booklet', 'catalog'].indexOf(cat) >= 0 ? 'paper' : 'shape'; }

  // 형태 미리보기 (preview 이미지가 없을 때 규격 비율 도형)
  function shapeSvg(it) {
    var w = +it.w || 100, h = +it.h || 70, ratio = w / h;
    var W = ratio >= 1 ? 100 : 100 * ratio, H = ratio >= 1 ? 100 / ratio : 100;
    var r = /원형|타원|동글|원통/.test(it.shape) ? '50%' : /둥근/.test(it.shape) ? '12px' : '2px';
    if (/하트/.test(it.shape)) return '<svg viewBox="0 0 24 24" style="width:60%;height:60%;fill:none;stroke:#1746C8;stroke-width:1.2;stroke-dasharray:2 2"><path d="M12 21s-7-4.6-9.3-9A5 5 0 0112 6a5 5 0 019.3 6c-2.3 4.4-9.3 9-9.3 9z"/></svg>';
    return '<div class="pp-tpl-shape" style="width:' + W + '%;height:' + H + '%;border-radius:' + r + '"></div>';
  }

  function card(it) {
    var meta = [];
    if (it.w) meta.push(it.w + '×' + it.h + 'mm');
    if (it.fold) meta.push(it.fold);
    meta.push('<span class="pp-tpl-badge">' + esc(it.format) + '</span>');
    meta.push(it.size);
    return '<article class="pp-tpl-card">' +
      '<div class="pp-tpl-thumb">' + (it.preview ? '<img src="' + esc(it.preview) + '" alt="" loading="lazy">' : shapeSvg(it)) + '</div>' +
      '<h3>' + esc(it.title) + '</h3>' +
      (it.desc ? '<p style="margin:0;font-size:13px;color:#4A5068">' + esc(it.desc) + '</p>' : '') +
      '<div class="pp-tpl-meta">' + meta.join(' · ') + '</div>' +
      '<a class="pp-tpl-dl" href="' + esc(it.url) + '" rel="nofollow">' + ICON_DL + '다운로드</a>' +
      '</article>';
  }

  function matchQ(it) {
    if (!state.q) return true;
    var hay = (it.title + ' ' + it.shape + ' ' + it.paper + ' ' + it.fold + ' ' + it.w + 'x' + it.h).toLowerCase();
    return state.q.split(/\s+/).every(function (t) { return hay.indexOf(t) >= 0; });
  }

  function section(cat) {
    var all = items.filter(function (i) { return i.cat === cat.slug; });
    var bundles = all.filter(function (i) { return i.kind === 'bundle'; });
    var singles = all.filter(function (i) { return i.kind === 'single' && matchQ(i); });
    var key = subKey(cat.slug);
    var subs = []; singles.forEach(function (i) { if (i[key] && subs.indexOf(i[key]) < 0) subs.push(i[key]); });
    var cur = state.sub[cat.slug] || 'all';
    var shown = cur === 'all' ? singles : singles.filter(function (i) { return i[key] === cur; });
    if (!singles.length && state.q) return '';

    var html = '<section class="pp-tpl-section" data-cat="' + cat.slug + '"><div class="pp-tpl-section-head">' +
      '<h2>' + esc(cat.label) + '<small>' + singles.length + '종</small></h2>';
    if (subs.length > 1) {
      html += '<div class="pp-tpl-chips"><button class="pp-tpl-chip' + (cur === 'all' ? ' is-active' : '') + '" data-sub="all">전체</button>' +
        subs.map(function (s) { return '<button class="pp-tpl-chip' + (cur === s ? ' is-active' : '') + '" data-sub="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div>';
    }
    html += '</div>';
    var shownBundles = cur === 'all' ? bundles : bundles.filter(function (b) { return !b[key] || b[key] === cur; });
    if (shownBundles.length) html += '<div class="pp-tpl-bundles">';
    shownBundles.forEach(function (b) {
      html += '<div class="pp-tpl-bundle"><div class="pp-tpl-bundle-ico">' + ICON_ZIP + '</div><div class="pp-tpl-bundle-body"><b>' + esc(b.title) + '</b><span>' + esc(cat.label) + (b[key] ? ' ' + esc(b[key]) : '') + ' 전체 규격 · ZIP · ' + esc(b.size) + '</span></div>' +
        '<a class="pp-tpl-dl pp-tpl-dl--ghost" href="' + esc(b.url) + '" rel="nofollow">' + ICON_DL + '전체 다운로드</a></div>';
    });
    if (shownBundles.length) html += '</div>';
    html += shown.length ? '<div class="pp-tpl-grid">' + shown.map(card).join('') + '</div>' : '<div class="pp-tpl-empty">조건에 맞는 템플릿이 없습니다.</div>';
    return html + '</section>';
  }

  function render() {
    var visible = state.cat === 'all' ? cats : cats.filter(function (c) { return c.slug === state.cat; });
    var body = visible.map(section).join('');
    root.querySelector('[data-pp-tpl-body]').innerHTML = body || '<div class="pp-tpl-empty">검색 결과가 없습니다.</div>';
    root.querySelectorAll('.pp-tpl-tab').forEach(function (b) { b.classList.toggle('is-active', b.dataset.cat === state.cat); });
  }

  function shell() {
    var counts = {}; items.forEach(function (i) { if (i.kind === 'single') counts[i.cat] = (counts[i.cat] || 0) + 1; });
    var tabs = '<button class="pp-tpl-tab is-active" data-cat="all">전체<small>' + items.filter(function (i) { return i.kind === 'single'; }).length + '</small></button>' +
      cats.map(function (c) { return '<button class="pp-tpl-tab" data-cat="' + esc(c.slug) + '">' + esc(c.label) + '<small>' + (counts[c.slug] || 0) + '</small></button>'; }).join('');
    var el = document.createElement('div');
    el.innerHTML = '<div class="pp-tpl-toolbar">' +
      '<label class="pp-tpl-search">' + ICON_SEARCH + '<input type="search" placeholder="규격·형태 검색 (예: 50x50, 3단접지)" data-pp-tpl-q></label>' +
      '<div class="pp-tpl-tabs">' + tabs + '</div></div>' +
      '<div data-pp-tpl-body></div>';
    while (el.firstChild) root.appendChild(el.firstChild);
  }

  shell(); render();
  root.addEventListener('click', function (e) {
    var tab = e.target.closest('.pp-tpl-tab'); if (tab) { state.cat = tab.dataset.cat; render(); return; }
    var chip = e.target.closest('.pp-tpl-chip'); if (chip) { state.sub[chip.closest('section').dataset.cat] = chip.dataset.sub; render(); }
  });
  root.querySelector('[data-pp-tpl-q]').addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase().replace(/×/g, 'x'); render(); });
})();
