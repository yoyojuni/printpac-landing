/* 프린트팩 랜딩 JS — .pp 내부에서만 동작 (헤더/푸터 영향 없음) */
(function(){
  function ready(fn){ if(document.readyState!="loading") fn(); else document.addEventListener("DOMContentLoaded",fn); }
  ready(function(){
    /* 1) 스크롤 등장 */
    var els=document.querySelectorAll(".pp .reveal");
    if("IntersectionObserver" in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.12});
      els.forEach(function(e){io.observe(e);});
    } else { els.forEach(function(e){e.classList.add("in");}); }
    /* 2) FAQ 아코디언 */
    document.querySelectorAll(".pp .qa button").forEach(function(b){
      b.addEventListener("click",function(){
        var qa=b.parentElement, open=qa.getAttribute("aria-expanded")==="true";
        document.querySelectorAll(".pp .qa").forEach(function(x){x.setAttribute("aria-expanded","false");x.querySelector(".ans").style.maxHeight=null;});
        if(!open){qa.setAttribute("aria-expanded","true");var a=qa.querySelector(".ans");a.style.maxHeight=a.scrollHeight+"px";}
      });
    });
    /* 3) 히어로 캐러셀 */
    (function(){
  var car=document.getElementById('carousel'), track=document.getElementById('track');
  if(!car||!track) return;
  var curEl=document.getElementById('cur'), totEl=document.getElementById('tot'), pp=document.getElementById('pp');
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var GAP=24, N=track.children.length;
  totEl.textContent=String(N).padStart(2,'0');
  var firstClone=track.children[0].cloneNode(true);
  var lastClone=track.children[N-1].cloneNode(true);
  firstClone.setAttribute('aria-hidden','true'); lastClone.setAttribute('aria-hidden','true');
  track.appendChild(firstClone); track.insertBefore(lastClone, track.children[0]);
  var kids=track.children, M=kids.length, pos=1, timer=null, playing=true;
  function slideW(){ return kids[1].getBoundingClientRect().width; }
  function setX(px, animate){ track.style.transition=animate?'':'none'; track.style.transform='translateX('+px+'px)'; if(!animate){ void track.offsetHeight; } }
  function paint(){ for(var k=0;k<M;k++) kids[k].classList.toggle('active', k===pos); var real=((pos-1)%N+N)%N; curEl.textContent=String(real+1).padStart(2,'0'); }
  function center(animate){ var sw=slideW(), vw=car.clientWidth; setX(vw/2 - sw/2 - pos*(sw+GAP), animate); paint(); }
  function settle(){ if(pos===M-1){ pos=1; center(false); } else if(pos===0){ pos=N; center(false); } }
  function go(dir){ pos+=dir; center(true); if(reduce) requestAnimationFrame(settle); }
  track.addEventListener('transitionend', settle);
  function play(){ if(reduce) return; playing=true; pp.textContent='\u275a\u275a'; pp.setAttribute('aria-label','슬라이드 일시정지'); clearInterval(timer); timer=setInterval(function(){go(1);},5000); }
  function pause(){ playing=false; pp.textContent='\u25b6'; pp.setAttribute('aria-label','슬라이드 재생'); clearInterval(timer); }
  function rest(){ if(playing) play(); }
  document.getElementById('next').addEventListener('click',function(){go(1);rest();});
  document.getElementById('prev').addEventListener('click',function(){go(-1);rest();});
  pp.addEventListener('click',function(){ playing?pause():play(); });
  car.addEventListener('mouseenter',function(){clearInterval(timer);});
  car.addEventListener('mouseleave',rest);
  document.addEventListener('visibilitychange',function(){document.hidden?clearInterval(timer):rest();});
  car.addEventListener('keydown',function(e){ if(e.key==='ArrowRight'){go(1);rest();} if(e.key==='ArrowLeft'){go(-1);rest();} });
  var x0=null;
  car.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;clearInterval(timer);},{passive:true});
  car.addEventListener('touchend',function(e){ if(x0===null)return; var dx=e.changedTouches[0].clientX-x0; if(Math.abs(dx)>40) go(dx<0?1:-1); x0=null; rest(); });
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){center(false);},120); });
  center(false); play();
})();
  });
})();
