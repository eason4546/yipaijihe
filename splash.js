/* 一拍即合 進場動畫：兩個拍檔從兩側跑進來擊掌。每次開啟網站播一次，點一下可以跳過。 */
(function(){
  try{ if(sessionStorage.getItem('ypjh_splash')) return; sessionStorage.setItem('ypjh_splash','1'); }catch(e){}
  if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var css=''+
  '#ypjh-splash{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:var(--bg,#fff);cursor:pointer;transition:opacity .45s ease,visibility .45s;-webkit-tap-highlight-color:transparent}'+
  '#ypjh-splash.out{opacity:0;visibility:hidden}'+
  '#ypjh-splash .stage{position:relative;width:min(78vw,420px);aspect-ratio:560/322}'+
  '#ypjh-splash .stage>*{position:absolute;inset:0;width:100%;height:100%}'+
  '#ypjh-splash img{display:block;width:100%;height:100%;will-change:transform}'+
  '#ypjh-splash:not(.play) .stage,#ypjh-splash:not(.play) .t{visibility:hidden}'+
  '#ypjh-splash.play .ow{animation:ypO 1s cubic-bezier(.3,.7,.4,1) both}'+
  '#ypjh-splash.play .o{animation:ypHitO .35s ease-out .95s both}'+
  '#ypjh-splash.play .bw{animation:ypB 1s cubic-bezier(.3,.7,.4,1) both}'+
  '#ypjh-splash.play .b{animation:ypHitB .35s ease-out .95s both}'+
  '#ypjh-splash .s{transform-origin:46% 14%;transform:scale(0)}'+
  '#ypjh-splash.play .s{animation:ypS .5s cubic-bezier(.2,1.6,.4,1) 1s both}'+
  '#ypjh-splash .stage>.ring{inset:auto;left:48%;top:24%;width:16%;height:auto;aspect-ratio:1;margin:-8% 0 0 -8%;border-radius:50%;border:3px solid #F5B301;opacity:0}'+
  '#ypjh-splash.play .ring{animation:ypR .55s ease-out .98s forwards}'+
  '#ypjh-splash .t{text-align:center;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;color:var(--ink,#1F2328)}'+
  '#ypjh-splash.play .t{animation:ypT .5s ease-out 1.25s both}'+
  '#ypjh-splash .t b{display:block;font-size:clamp(28px,7vw,40px);font-weight:900;letter-spacing:.12em}'+
  '#ypjh-splash .t span{display:block;margin-top:4px;font-size:clamp(13px,3.4vw,16px);letter-spacing:.14em;color:var(--muted,#5F6670)}'+
  '#ypjh-splash .skip{position:absolute;bottom:calc(24px + env(safe-area-inset-bottom,0px));font:13px system-ui,sans-serif;color:var(--muted,#5F6670);opacity:.7}'+
  /* 橘色：從左邊蹦蹦跳跳進來 */
  '@keyframes ypO{0%{transform:translate(-115%,0) rotate(-12deg)}20%{transform:translate(-86%,-14%) rotate(-6deg)}40%{transform:translate(-57%,0) rotate(-10deg)}60%{transform:translate(-30%,-14%) rotate(-4deg)}80%{transform:translate(-6%,0) rotate(-2deg)}100%{transform:translate(0,0) rotate(0)}}'+
  /* 藍色：從右邊搖搖擺擺走進來 */
  '@keyframes ypB{0%{transform:translate(115%,0) rotate(6deg)}25%{transform:translate(84%,-3%) rotate(-5deg)}50%{transform:translate(52%,0) rotate(5deg)}75%{transform:translate(22%,-3%) rotate(-4deg)}100%{transform:translate(0,0) rotate(0)}}'+
  /* 擊掌瞬間互相推一下 */
  '@keyframes ypHitO{0%{transform:translate(0,0)}35%{transform:translate(-2.5%,1%) rotate(-3deg) scale(1.02,.98)}100%{transform:translate(0,0)}}'+
  '@keyframes ypHitB{0%{transform:translate(0,0)}35%{transform:translate(2.5%,1%) rotate(3deg) scale(1.02,.98)}100%{transform:translate(0,0)}}'+
  '@keyframes ypS{0%{transform:scale(0);opacity:0}60%{opacity:1}100%{transform:scale(1);opacity:1}}'+
  '@keyframes ypR{0%{transform:scale(.3);opacity:.9}100%{transform:scale(2.6);opacity:0}}'+
  '@keyframes ypT{0%{transform:translateY(12px);opacity:0}100%{transform:none;opacity:1}}';

  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  var el=document.createElement('div'); el.id='ypjh-splash'; el.setAttribute('role','presentation');
  el.innerHTML='<div class="stage"><div class="ow"><img class="o" src="m_orange.png" alt=""></div><div class="bw"><img class="b" src="m_blue.png" alt=""></div><div class="ring"></div><img class="s" src="m_spark.png" alt=""></div>'+
    '<div class="t"><b>一拍即合</b><span>互相合作　創造無間成就</span></div><div class="skip">點一下跳過</div>';

  var done=false;
  function close(){ if(done) return; done=true; el.classList.add('out'); setTimeout(function(){ el.remove(); st.remove(); },500); }
  function mount(){ (document.body||document.documentElement).appendChild(el); el.addEventListener('click',close); }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded',mount);
  /* 圖片載好再開演；最多等 1.5 秒 */
  var srcs=['m_orange.png','m_blue.png','m_spark.png'], left=srcs.length, started=false;
  function go(){ if(started) return; started=true; el.classList.add('play'); setTimeout(close,2500); }
  srcs.forEach(function(s){ var i=new Image(); i.onload=i.onerror=function(){ if(--left===0) go(); }; i.src=s; });
  setTimeout(go,1500);
})();
