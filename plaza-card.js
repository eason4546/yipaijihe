/* 招募廣場入口小方框
   用法：<a class="pz" href="plaza.html" data-plaza-card></a>
   加 data-sub 會在左下角多一行說明；加 class="pz wide" 是 2:1 扁版。
   頁面載入時自動掛上；畫面重畫後呼叫 PlazaCard.mount(容器)。 */
(function(){
  if (window.PlazaCard) return;
  var CSS =
  '.pz{position:relative;display:block;aspect-ratio:16/9;border-radius:18px;overflow:hidden;container-type:inline-size;text-decoration:none;color:#1F2328;background:#CBE5B0;box-shadow:0 10px 28px rgba(40,60,20,.18),0 0 0 1px rgba(0,0,0,.06);isolation:isolate;-webkit-tap-highlight-color:transparent;transition:transform .2s ease}' +
  '.pz.wide{aspect-ratio:2/1}' +
  '.pz:active{transform:scale(.985)}' +
  '.pz:focus-visible{outline:3px solid #E8561C;outline-offset:3px}' +
  '.pz-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}' +
  '@media (hover:hover){.pz:hover .pz-bg{transform:scale(1.035)}.pz:hover .pz-go{transform:translateY(-2px)}}' +
  /* 走路的拍檔：外層橫移＋轉身，內層一跳一跳 */
  '.pz-w{position:absolute;left:0;bottom:15%;height:23%;aspect-ratio:1;will-change:transform;animation:pz-walk 10s linear infinite}' +
  '.pz-w.o{z-index:2}' +
  '.pz.wide .pz-w{bottom:21%}.pz.wide .pz-spark{bottom:42%}' +
  '.pz-w.b{z-index:1;animation-name:pz-walk-b}' +
  '.pz-w img{display:block;width:100%;height:100%;object-fit:contain;transform-origin:50% 100%;animation:pz-hop .46s ease-in-out infinite alternate}' +
  '.pz-w.b img{animation-delay:-.23s}' +
  '.pz-w::after{content:"";position:absolute;left:18%;right:18%;bottom:-3%;height:12%;border-radius:50%;background:rgba(60,70,30,.22);z-index:-1;animation:pz-sh .46s ease-in-out infinite alternate}' +
  '@keyframes pz-walk{0%{transform:translateX(-16cqw) scaleX(1)}40%,55%{transform:translateX(37.5cqw) scaleX(1)}55.1%{transform:translateX(37.5cqw) scaleX(-1)}95%,100%{transform:translateX(-16cqw) scaleX(-1)}}' +
  '@keyframes pz-walk-b{0%{transform:translateX(104cqw) scaleX(1)}40%,55%{transform:translateX(49cqw) scaleX(1)}55.1%{transform:translateX(49cqw) scaleX(-1)}95%,100%{transform:translateX(104cqw) scaleX(-1)}}' +
  '@keyframes pz-hop{0%{transform:translateY(0) scale(1.04,.96)}35%{transform:translateY(-4%) scale(1,1)}100%{transform:translateY(-13%) scale(.98,1.03) rotate(-3deg)}}' +
  '@keyframes pz-sh{0%{transform:scale(1);opacity:1}100%{transform:scale(.7);opacity:.55}}' +
  /* 兩人擦身而過時擊掌 */
  '.pz-spark{position:absolute;left:50%;bottom:35%;width:10cqw;transform:translateX(-50%);z-index:3;opacity:0;animation:pz-spark 10s linear infinite}' +
  '@keyframes pz-spark{0%,40.5%{opacity:0;transform:translateX(-50%) scale(.3)}43%{opacity:1;transform:translateX(-50%) scale(1.2)}48%{opacity:1;transform:translateX(-50%) scale(1)}53%,100%{opacity:0;transform:translateX(-50%) translateY(-30%) scale(1.3)}}' +
  /* 飛鴿傳書 */
  '.pz-p{position:absolute;left:0;top:6%;height:24%;aspect-ratio:200/254;z-index:3;will-change:transform;animation:pz-fly 12s linear infinite 1s;transform:translateX(-30cqw)}' +
  '.pz-p img{display:block;width:100%;height:100%;object-fit:contain;animation:pz-flap .32s ease-in-out infinite alternate}' +
  '@keyframes pz-fly{0%{transform:translate(-30cqw,9cqw)}55%{transform:translate(112cqw,-3cqw)}100%{transform:translate(112cqw,-3cqw)}}' +
  '@keyframes pz-flap{0%{transform:translateY(-5%) rotate(-5deg)}100%{transform:translateY(5%) rotate(3deg) scaleY(.9)}}' +
  /* 掃光 */
  '.pz::after{content:"";position:absolute;inset:0;z-index:4;pointer-events:none;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.38) 50%,transparent 62%);transform:translateX(-110%);animation:pz-shine 6s ease-in-out infinite 2s}' +
  '@keyframes pz-shine{0%{transform:translateX(-110%)}28%,100%{transform:translateX(110%)}}' +
  /* 畫面上的介面 */
  '.pz-hud{position:absolute;z-index:5;display:flex;align-items:center;gap:6px;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;line-height:1.2;white-space:nowrap}' +
  '.pz-t{top:clamp(8px,2.2cqw,14px);left:clamp(8px,2.2cqw,14px);background:rgba(255,255,255,.95);color:#1F2328;border-radius:999px;padding:4px 12px 4px 4px;box-shadow:0 4px 14px rgba(0,0,0,.14);font-weight:900;font-size:clamp(14px,2.6cqw,18px)}' +
  '.pz-t img{width:1.7em;height:1.7em;border-radius:50%;background:#FFF1E8;object-fit:contain;padding:2px}' +
  '.pz-t em{font-style:normal;font-size:.68em;font-weight:700;background:#E8561C;color:#fff;border-radius:999px;padding:2px 7px;margin-left:2px}' +
  '.pz-go{right:clamp(8px,2.2cqw,14px);bottom:clamp(8px,2.2cqw,14px);background:#E8561C;color:#fff;border-radius:999px;padding:.5em 1em;font-weight:900;font-size:clamp(14px,2.6cqw,18px);box-shadow:0 6px 16px rgba(232,86,28,.45);transition:transform .2s ease}' +
  '.pz-go::before{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 0 rgba(232,86,28,.55);animation:pz-pulse 2s ease-out infinite}' +
  '@keyframes pz-pulse{0%{box-shadow:0 0 0 0 rgba(232,86,28,.55)}70%,100%{box-shadow:0 0 0 12px rgba(232,86,28,0)}}' +
  '.pz-sub{left:clamp(8px,2.2cqw,14px);bottom:clamp(8px,2.2cqw,14px);background:rgba(24,28,32,.64);color:#fff;border-radius:999px;padding:.45em .95em;font-weight:700;font-size:clamp(12px,2.1cqw,15px);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}' +
  '@container (max-width:350px){.pz-sub{display:none}}' +
  '.pz-pause *,.pz-pause::after,.pz-pause *::before,.pz-pause *::after{animation-play-state:paused!important}' +
  '@media (prefers-reduced-motion:reduce){.pz *,.pz::after,.pz *::before,.pz *::after{animation:none!important}.pz-w.o{transform:translateX(37.5cqw)}.pz-w.b{transform:translateX(49cqw)}.pz-p{transform:translate(70cqw,0)}.pz-spark{opacity:1}}';

  function css(){
    if (document.getElementById('pz-css')) return;
    var s = document.createElement('style'); s.id = 'pz-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
    es.forEach(function(e){ e.target.classList.toggle('pz-pause', !e.isIntersecting); });
  }) : null;

  function build(a){
    if (a.getAttribute('data-pz')) return;
    a.setAttribute('data-pz', '1');
    if (!a.classList.contains('pz')) a.classList.add('pz');
    var sub = a.hasAttribute('data-sub');
    a.innerHTML =
      '<img class="pz-bg" src="plaza/card_s.webp" srcset="plaza/card_s.webp 800w, plaza/card.webp 1600w" sizes="(min-width:760px) 720px, 100vw" alt="" decoding="async">' +
      '<span class="pz-w b" aria-hidden="true"><img src="plaza/walker_b.webp" alt=""></span>' +
      '<span class="pz-w o" aria-hidden="true"><img src="plaza/walker_o.webp" alt=""></span>' +
      '<img class="pz-spark" src="plaza/spark.webp" alt="" aria-hidden="true">' +
      '<span class="pz-p" aria-hidden="true"><img src="plaza/pigeon_fly.webp" alt=""></span>' +
      '<span class="pz-hud pz-t"><img src="plaza/walker_o.webp" alt="">招募廣場<em>新玩法</em></span>' +
      (sub ? '<span class="pz-hud pz-sub">招募處越蓋越大・拍檔一路升級</span>' : '') +
      '<span class="pz-hud pz-go">點擊進入 ›</span>';
    if (io) io.observe(a);
  }
  function mount(root){
    css();
    (root || document).querySelectorAll('[data-plaza-card]').forEach(build);
  }
  window.PlazaCard = { mount: mount };
  css();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ mount(); });
  else mount();
})();
