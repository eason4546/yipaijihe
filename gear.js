/* 裝備推薦：職缺頁「出發前備好」與廣場「裝備鋪」共用
   ──────────────────────────────────────────────
   換成分潤連結的方法：
   拿到蝦皮分潤計畫（或 momo 夥伴計畫）的推廣連結後，貼到該項目的 url。
   沒填 url 的項目會連到蝦皮搜尋結果（一般連結，沒有分潤）。
   開始分潤後，把 AFFILIATE 改成 true，頁面會自動顯示分潤揭露文字。 */
(function(){
  var AFFILIATE = false;
  var ITEMS = {
    blackTee:    { name:'黑色素T',     q:'黑色素T 純棉',      url:'' },
    blackPants:  { name:'黑色工作褲',   q:'黑色工作褲 彈性',    url:'' },
    blackShoes:  { name:'黑色布鞋',     q:'全黑布鞋 工作',      url:'' },
    lanyard:     { name:'識別證套',     q:'識別證套 掛繩',      url:'' },
    gloves:      { name:'工作手套',     q:'工作手套 止滑',      url:'' },
    safetyShoes: { name:'安全鞋',       q:'安全鞋 鋼頭 輕量',   url:'' },
    vest:        { name:'反光背心',     q:'反光背心',           url:'' },
    helmet:      { name:'工程安全帽',   q:'工程安全帽',         url:'' },
    kneepad:     { name:'護膝',         q:'護膝 工作',          url:'' },
    raincoat:    { name:'輕便雨衣',     q:'輕便雨衣 一件式',    url:'' },
    warmer:      { name:'暖暖包',       q:'暖暖包 貼式',        url:'' },
    powerbank:   { name:'行動電源',     q:'行動電源 輕巧',      url:'' },
    headlamp:    { name:'頭燈',         q:'頭燈 LED 充電',      url:'' },
    bottle:      { name:'保溫水壺',     q:'保溫瓶 大容量',      url:'' },
    sunscreen:   { name:'防曬袖套',     q:'防曬袖套 涼感',      url:'' }
  };
  /* 裝備鋪的分類 */
  var SHELVES = [
    { title:'活動館：引導、驗票、接待', note:'多數活動要求黑衣黑褲、好走的鞋', ids:['blackTee','blackPants','blackShoes','lanyard'] },
    { title:'搭拆、佈展、工程', note:'搬重物和上下梯一定要護好手腳', ids:['gloves','safetyShoes','vest','helmet','kneepad'] },
    { title:'戶外與夜班', note:'燈會、跨年、市集常常一站就是一整晚', ids:['raincoat','warmer','powerbank','headlamp','bottle','sunscreen'] }
  ];

  function link(id){
    var it = ITEMS[id]; if (!it) return '#';
    return it.url || ('https://shopee.tw/search?keyword=' + encodeURIComponent(it.q));
  }
  function has(s, re){ return re.test(String(s || '')); }

  /* 依職缺內容挑 4 樣 */
  function pick(job){
    var out = [], add = function(id){ if (ITEMS[id] && out.indexOf(id) < 0) out.push(id); };
    var dress = job.dress || '', text = [job.title, job.place, job.notes, dress].join(' ');
    var roles = (job.shifts || []).map(function(s){ return s.role; }).join(' ');
    if (has(dress, /黑衣|黑上衣|黑T|黑色上衣|全黑/i)) add('blackTee');
    if (has(dress, /黑褲|黑色褲|全黑/)) add('blackPants');
    if (has(dress, /黑鞋|黑色鞋|布鞋|全黑/) || (has(dress, /黑/) && has(dress, /鞋/))) add('blackShoes');
    var heavy = job.hall === '工程館' || has(roles + ' ' + text, /搭|拆|佈展|撤場|搬運|水電|木作|泥作|油漆|舞台|燈具|吊/);
    if (heavy) { add('gloves'); add('safetyShoes'); if (job.hall === '工程館') add('helmet'); add('vest'); }
    var night = (job.shifts || []).some(function(s){ var h = parseInt(String(s.end || '').slice(0, 2), 10), st = parseInt(String(s.start || '').slice(0, 2), 10); return st >= 17 || (h >= 0 && h <= 6 && String(s.end||'') !== ''); });
    var outdoor = has(text, /燈會|戶外|沙雕|市集|音樂祭|跨年|廣場|公園|海|河濱|露天|園區|祭/);
    var m = parseInt(String(job.start || '').split('/')[1], 10);
    if (outdoor) { add('raincoat'); if (m === 12 || m <= 2) add('warmer'); else if (m >= 5 && m <= 9) add('sunscreen'); }
    if (night) add('headlamp');
    add('powerbank'); add('bottle'); add('lanyard');
    return out.slice(0, 4);
  }

  window.GEAR = {
    items: ITEMS, shelves: SHELVES, pick: pick, link: link, affiliate: AFFILIATE,
    note: AFFILIATE ? '連到購物網站；透過連結購買，一拍即合可能獲得分潤，不影響你的價格。' : '連到購物網站的搜尋結果，一拍即合不經手商品。'
  };
})();
