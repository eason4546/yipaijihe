/* 一拍即合 進場動畫：橘色蹦蹦跳跳、藍色搖搖擺擺走進來，蓄力、擊掌、彩紙爆開、一起跳一下。
   每次開啟網站播一次，點一下可以跳過。全部只動 transform／opacity，交給 GPU 跑。 */
(function(){
  try{ if(sessionStorage.getItem('ypjh_splash')) return; sessionStorage.setItem('ypjh_splash','1'); }catch(e){}
  if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(!document.documentElement.animate) return;

  var css=''+
  '#ypjh-splash{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:var(--bg,#fff);cursor:pointer;overflow:hidden;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}'+
  '#ypjh-splash .stage{position:relative;width:min(78vw,420px);aspect-ratio:560/322}'+
  '#ypjh-splash .L{position:absolute;inset:0;will-change:transform}'+
  '#ypjh-splash .L img,#ypjh-splash img.L{position:absolute;inset:0;width:100%;height:100%;display:block}'+
  '#ypjh-splash:not(.on) .stage,#ypjh-splash:not(.on) .t{visibility:hidden}'+
  '#ypjh-splash .ao{transform-origin:25% 88%}'+
  '#ypjh-splash .ab{transform-origin:74% 96%}'+
  '#ypjh-splash .g1{transform-origin:48.6% 29%}'+
  '#ypjh-splash .g2{transform-origin:50% 96%}'+
  '#ypjh-splash .sh{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(40,60,120,.22),rgba(40,60,120,0));will-change:transform,opacity}'+
  '#ypjh-splash .so{left:10%;width:30%;top:84%;height:9%}'+
  '#ypjh-splash .sb{left:52%;width:44%;top:91%;height:10%}'+
  '#ypjh-splash .fx{position:absolute;left:48.6%;top:29%;width:0;height:0}'+
  '#ypjh-splash .fx>*{position:absolute;will-change:transform,opacity;opacity:0}'+
  '#ypjh-splash .ring{width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;border:3px solid #F5B301}'+
  '#ypjh-splash .flash{width:90px;height:90px;margin:-45px 0 0 -45px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,214,90,.85),rgba(255,214,90,0))}'+
  '#ypjh-splash .ray{width:22px;height:5px;margin:-2.5px 0 0 0;border-radius:3px;background:#F5B301;transform-origin:0 50%}'+
  '#ypjh-splash .cf{border-radius:2px}'+
  '#ypjh-splash .puff{width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;background:radial-gradient(closest-side,rgba(150,160,185,.5),rgba(150,160,185,0));position:absolute;opacity:0;will-change:transform,opacity}'+
  '#ypjh-splash .spark{transform-origin:46% 14%;opacity:0}'+
  '#ypjh-splash .t{text-align:center;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;color:var(--ink,#1F2328)}'+
  '#ypjh-splash .t b{display:block;font-size:clamp(30px,8vw,44px);font-weight:900;letter-spacing:.12em;line-height:1.25}'+
  '#ypjh-splash .t b i{display:inline-block;font-style:normal;opacity:0;will-change:transform,opacity}'+
  '#ypjh-splash .t b i.o{color:var(--orange,#E8561C)}#ypjh-splash .t b i.b{color:var(--blue,#3E63DD)}'+
  '#ypjh-splash .t span{display:block;margin-top:4px;font-size:clamp(13px,3.4vw,16px);letter-spacing:.14em;color:var(--muted,#5F6670);opacity:0}'+
  '#ypjh-splash .skip{position:absolute;bottom:calc(24px + env(safe-area-inset-bottom,0px));font:13px system-ui,sans-serif;color:var(--muted,#5F6670);opacity:0}';

  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  var el=document.createElement('div'); el.id='ypjh-splash'; el.setAttribute('role','presentation');
  el.innerHTML='<div class="stage">'+
      '<div class="sh so"></div><div class="sh sb"></div><div class="puffs L" style="will-change:auto"></div>'+
      '<div class="fx"><div class="flash"></div></div>'+
      '<div class="L g1"><div class="L g2">'+
        '<div class="L ao"><img src="m_orange.png" alt=""><img class="cap" src="cap_o.png" alt=""></div>'+
        '<div class="L ab"><img src="m_blue.png" alt=""><img class="cap" src="cap_b.png" alt=""></div>'+
        '<img class="L spark" src="m_spark.png" alt="">'+
      '</div></div>'+
      '<div class="fx fx2"><div class="ring"></div></div>'+
    '</div>'+
    '<div class="t"><b><i class="o">一</i><i class="o">拍</i><i class="b">即</i><i class="b">合</i></b><span>互相合作　創造無間成就</span></div>'+
    '<div class="skip">點一下跳過</div>';

  function q(s){return el.querySelector(s);}
  function qa(s){return el.querySelectorAll(s);}

  /* ---- 小工具 ---- */
  var FPS=30;   // 一般動作每秒取 30 格（中間由瀏覽器線性補間），快的動作用 60
  function clamp(v,a,b){return v<a?a:v>b?b:v;}
  function eOut(u){u=clamp(u,0,1);return 1-Math.pow(1-u,3);}
  function eIn(u){u=clamp(u,0,1);return u*u*u;}
  function back(u){u=clamp(u,0,1);var c1=1.9,c3=c1+1;return 1+c3*Math.pow(u-1,3)+c1*Math.pow(u-1,2);}
  /* 落地後的彈簧回彈：A 是壓扁量，τ 是落地後經過的毫秒 */
  function spring(A,tau){return tau<0?0:1.6*A*Math.exp(-tau/80)*Math.sin(tau/180*2*Math.PI);}
  /* 起跳、落地前後 12% 的時間把拉長量收掉，避免跳格 */
  function win(p){return clamp(Math.min(p,1-p)/.12,0,1);}
  /* 依時間函式取樣成關鍵影格（t0~t1，每秒 fps 格），交給瀏覽器的動畫引擎播放 */
  function play(node,t0,t1,fn,extra){
    var fps=(extra&&extra.fps)||FPS, ks=[],n=Math.max(2,Math.ceil((t1-t0)/1000*fps)),i;
    for(i=0;i<=n;i++){var t=t0+(t1-t0)*i/n,f=fn(t);f.offset=i/n;ks.push(f);}
    var o={duration:t1-t0,delay:t0,fill:'both',easing:'linear'};
    if(extra) for(var k in extra) if(k!=='fps') o[k]=extra[k];
    var a=node.animate(ks,o); anims.push(a); return a;
  }
  function tf(x,y,r,sx,sy){return 'translate3d('+x.toFixed(2)+'px,'+y.toFixed(2)+'px,0) rotate('+r.toFixed(2)+'deg) scale('+sx.toFixed(4)+','+sy.toFixed(4)+')';}
  var anims=[];

  /* ---- 時間軸（毫秒） ---- */
  var HIT=1060;                       // 擊掌瞬間
  var OH=[[0,300,.20],[300,570,.15],[570,820,.10]];     // 橘色三次跳：起、落、高度（舞台寬的比例）
  var BS=[120,370,600,820];          // 藍色步伐落地時間
  var JUMP=[[1300,1560,.10],[1660,1860,.045]];         // 擊掌後一起跳
  var EXIT=2650;

  function build(){
    var S=q('.stage').getBoundingClientRect().width||320;

    /* 橘色：彈跳進場 */
    function orange(t){
      var x,y=0,r=0,sq=0,str=0,i;
      if(t<820){ x=-1.12*S+(1.12-.05)*S*eOut(t/820); }
      else if(t<980){ var u=eOut((t-820)/160); x=-.05*S-.05*S*u; r=-13*u; sq+=.09*u; }
      else if(t<HIT){ var v=eIn((t-980)/(HIT-980)); x=-.1*S*(1-v); r=-13*(1-v)+4*Math.sin(v*Math.PI); sq+=.09*(1-v); str+=.05*Math.sin(v*Math.PI); }
      else { x=0; }
      for(i=0;i<OH.length;i++){
        var h=OH[i];
        if(t>=h[0]&&t<h[1]){ var p=(t-h[0])/(h[1]-h[0]); y=-h[2]*S*4*p*(1-p); str+=.1*Math.abs(1-2*p)*win(p); r+=-7*Math.sin(p*Math.PI*2); }
        sq+=spring(.15-i*.025,t-h[1]); r+=spring(3,t-h[1]);
      }
      var sy=1+str-sq, sx=1+(1-sy)*.9;
      return {x:x,y:y,r:r,sy:sy,sx:sx};
    }
    /* 藍色：搖擺走進場 */
    function blue(t){
      var x,y=0,r=0,sq=0,str=0,i;
      if(t<BS[0]){ x=1.12*S; }
      else if(t<820){ var u=(t-BS[0])/(820-BS[0]); x=1.12*S-(1.12-.05)*S*eOut(u);
        var ph=0; for(i=1;i<BS.length;i++){ if(t<BS[i]){ ph=(t-BS[i-1])/(BS[i]-BS[i-1]); r=(i%2?7:-7)*Math.sin(ph*Math.PI); y=-.035*S*Math.sin(ph*Math.PI); break; } } }
      else if(t<980){ var w=eOut((t-820)/160); x=.05*S+.05*S*w; r=11*w; sq+=.08*w; }
      else if(t<HIT){ var v=eIn((t-980)/(HIT-980)); x=.1*S*(1-v); r=11*(1-v)-4*Math.sin(v*Math.PI); sq+=.08*(1-v); str+=.04*Math.sin(v*Math.PI); }
      else { x=0; }
      for(i=1;i<BS.length;i++) sq+=spring(.07,t-BS[i]);
      var sy=1+str-sq, sx=1+(1-sy)*.9;
      return {x:x,y:y,r:r,sy:sy,sx:sx};
    }
    /* 擊掌後：整組一起震一下、跳兩下 */
    function g1(t){ var d=t-HIT, s=1, x=0;
      if(d>=0){ s=1+.075*Math.exp(-d/90)*Math.sin(Math.min(d,400)/260*Math.PI*2+.5)*(d<60?d/60:1); x=S*.012*Math.exp(-d/70)*Math.sin(d/45*Math.PI*2); }
      return {x:x,y:0,r:0,sx:s,sy:s}; }
    function g2(t){ var y=0,sq=0,str=0,i;
      for(i=0;i<JUMP.length;i++){ var j=JUMP[i];
        var k=i?0.6:1;
        if(t>=j[0]-90&&t<j[0]) sq+=.07*k*Math.sin((t-j[0]+90)/90*Math.PI/2);          // 起跳前蹲
        if(t>=j[0]&&t<j[0]+50) sq+=.07*k*(1-(t-j[0])/50);                              // 蹬地放開
        if(t>=j[0]&&t<j[1]){ var p=(t-j[0])/(j[1]-j[0]); y=-j[2]*S*4*p*(1-p); str+=.06*k*Math.abs(1-2*p)*win(p); }
        sq+=spring(i?.05:.09,t-j[1]); }
      if(t>1950) str+=.012*Math.sin((t-1950)/700*Math.PI*2);  // 呼吸
      var sy=1+str-sq; return {x:0,y:y,r:0,sx:1+(1-sy)*.9,sy:sy}; }

    function T(fn){return function(t){var m=fn(t);return {transform:tf(m.x,m.y,m.r,m.sx,m.sy)};};}
    var END=EXIT;
    play(q('.ao'),0,HIT,T(orange),{fps:60});
    play(q('.ab'),0,HIT,T(blue),{fps:60});
    play(q('.g1'),HIT,HIT+700,T(g1),{fps:60});
    play(q('.g2'),1200,END,T(g2));
    /* 手的圓角補片：擊掌瞬間收掉，兩張圖剛好拼回原圖 */
    qa('.cap').forEach(function(c){ anims.push(c.animate([{opacity:1},{opacity:0}],{delay:HIT-10,duration:70,fill:'both'})); });

    /* 地上的影子：跟著 x 走，跳越高越小越淡 */
    function shadow(fn){ return function(t){ var m=fn(t), gy=t>=1200?g2(t).y:0, gx=g1(t).x, h=-(m.y+gy)/S;
        var k=clamp(1-h*2.6,.35,1); return {transform:'translate3d('+(m.x+gx).toFixed(2)+'px,0,0) scale('+k.toFixed(3)+','+(k*.9+.1).toFixed(3)+')',opacity:(.25+.75*k).toFixed(3)}; }; }
    play(q('.so'),0,END,shadow(orange));
    play(q('.sb'),0,END,shadow(blue));

    /* 落地揚起的小煙 */
    var pf=q('.puffs');
    function puff(cx,cy,t0,dir,size){
      var d=document.createElement('div'); d.className='puff'; d.style.left=(cx/S*100)+'%'; d.style.top=(cy/S*100*560/322)+'%'; pf.appendChild(d);
      play(d,t0,t0+380,function(t){ var u=(t-t0)/380, e=eOut(u); return {transform:'translate3d('+(dir*S*.07*e).toFixed(2)+'px,'+(-S*.02*e).toFixed(2)+'px,0) scale('+(size*(.4+1.2*e)).toFixed(3)+')',opacity:(u<.15?u/.15:1-(u-.15)/.85)*.9}; });
    }
    OH.forEach(function(h,i){ var x=orange(h[1]).x+.247*S, y=.876*S*322/560; puff(x-S*.06,y,h[1],-1,1-i*.15); puff(x+S*.06,y,h[1],1,1-i*.15); });
    BS.slice(1).forEach(function(t,i){ var x=blue(t).x+.736*S, y=.955*S*322/560; puff(x+(i%2?-1:1)*S*.07,y,t,i%2?-1:1,.7); });
    JUMP.forEach(function(j,i){ var s=i?.6:1; puff(.18*S,.876*S*322/560,j[1],-1,s); puff(.86*S,.955*S*322/560,j[1],1,s); });

    /* 擊掌特效：閃光、光圈、光芒、彩紙 */
    var fx=q('.fx2');
    anims.push(q('.flash').animate([{opacity:0,transform:'scale(.3)'},{opacity:1,transform:'scale(1.15)',offset:.3},{opacity:0,transform:'scale(1.7)'}],{delay:HIT-20,duration:300,fill:'forwards',easing:'ease-out'}));
    anims.push(q('.ring').animate([{opacity:.95,transform:'scale(.25)'},{opacity:0,transform:'scale(2.6)'}],{delay:HIT,duration:560,fill:'forwards',easing:'cubic-bezier(.2,.7,.3,1)'}));
    var RAYS=[-165,-138,-112,-90,-68,-42,-15];
    RAYS.forEach(function(a,i){ var r=document.createElement('div'); r.className='ray'; fx.appendChild(r);
      var L0=S*.05, L1=S*(.19+(i%2)*.05);
      play(r,HIT+10,HIT+470,function(t){ var u=(t-HIT-10)/460, e=eOut(u); return {transform:'rotate('+a+'deg) translate3d('+(L0+(L1-L0)*e).toFixed(2)+'px,0,0) scale('+(1.3-.9*e).toFixed(3)+','+(1-.4*e).toFixed(3)+')',opacity:u<.1?u*10:1-eIn(u)}; });
    });
    var COLS=['#FF7A45','#E8561C','#5B7CFA','#3E63DD','#F5B301','#FFD45A','#FF9FB0'];
    var seed=7; function rnd(){ seed=(seed*16807)%2147483647; return seed/2147483647; }
    for(var i=0;i<18;i++){
      var c=document.createElement('div'); c.className='cf'; fx.appendChild(c);
      var big=rnd()<.5, w=big?8:6, h=big?12:6; c.style.cssText='width:'+w+'px;height:'+h+'px;margin:'+(-h/2)+'px 0 0 '+(-w/2)+'px;background:'+COLS[i%COLS.length]+(big?'':';border-radius:50%');
      (function(c){
        var ang=(-170+rnd()*160)*Math.PI/180, sp=S*(.75+rnd()*.75), vx=Math.cos(ang)*sp, vy=Math.sin(ang)*sp, g=S*2.4, spin=(rnd()-.5)*900, dur=900+rnd()*350, t0=HIT+rnd()*40;
        play(c,t0,t0+dur,function(t){ var s=(t-t0)/1000, u=(t-t0)/dur, drag=1-.35*u;
          return {transform:'translate3d('+(vx*s*drag).toFixed(2)+'px,'+(vy*s*drag+.5*g*s*s).toFixed(2)+'px,0) rotate('+(spin*s).toFixed(1)+'deg) scale('+(u<.08?u/.08:1).toFixed(3)+')',opacity:u>.7?(1-u)/.3:1}; });
      })(c);
    }
    /* 擊掌的黃色小光芒：彈出、之後輕輕閃 */
    play(q('.spark'),HIT+20,END,function(t){ var d=t-HIT-20, s, o=1, r=0;
      if(d<320){ s=back(d/320)*1.0; r=-12*(1-eOut(d/320)); o=clamp(d/80,0,1); }
      else { s=1+.06*Math.sin((d-320)/520*Math.PI*2); }
      return {transform:'rotate('+r.toFixed(2)+'deg) scale('+Math.max(s,0).toFixed(4)+')',opacity:o}; });

    /* 標題逐字跳出 */
    qa('.t b i').forEach(function(n,i){ var t0=1230+i*85;
      play(n,t0,t0+520,function(t){ var u=(t-t0)/520, b=back(u); return {transform:'translate3d(0,'+((1-b)*28).toFixed(2)+'px,0) rotate('+((1-eOut(u))*(i%2?14:-14)).toFixed(2)+'deg) scale('+(.2+.8*b).toFixed(4)+')',opacity:clamp(u*4,0,1)}; });
    });
    anims.push(q('.t span').animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{delay:1650,duration:420,fill:'both',easing:'cubic-bezier(.2,.8,.3,1)'}));
    anims.push(q('.skip').animate([{opacity:0},{opacity:.7}],{delay:500,duration:400,fill:'both'}));
    el.classList.add('on');
  }

  var done=false, timer;
  function close(fast){
    if(done) return; done=true; clearTimeout(timer);
    var content=[q('.stage'),q('.t'),q('.skip')];
    content.forEach(function(n){ n.animate([{opacity:getComputedStyle(n).opacity,transform:'scale(1)'},{opacity:0,transform:'scale(.92)'}],{duration:fast?160:230,fill:'forwards',easing:'cubic-bezier(.4,0,1,1)'}); });
    var f=el.animate([{opacity:1},{opacity:0}],{delay:fast?90:150,duration:fast?220:320,fill:'forwards',easing:'ease-out'});
    f.onfinish=function(){ anims.forEach(function(a){try{a.cancel();}catch(e){}}); el.remove(); st.remove(); };
  }
  function mount(){ (document.body||document.documentElement).appendChild(el); el.addEventListener('click',function(){close(true);}); }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded',mount);

  /* 圖片解碼好再開演（避免第一格卡住）；最多等 1.5 秒 */
  var started=false;
  function go(){
    if(started||done) return; started=true;
    if(!el.parentNode) mount();
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ build(); timer=setTimeout(function(){close(false);},EXIT); }); });
  }
  var imgs=['m_orange.png','m_blue.png','m_spark.png','cap_o.png','cap_b.png'].map(function(s){ var i=new Image(); i.src=s; return i.decode?i.decode().catch(function(){}):new Promise(function(r){i.onload=i.onerror=r;}); });
  Promise.all(imgs).then(function(){ if(document.body) go(); else document.addEventListener('DOMContentLoaded',go); });
  setTimeout(go,1500);
})();
