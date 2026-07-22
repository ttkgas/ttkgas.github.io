(function(){"use strict";
var map=document.getElementById("map"); if(!map) return;
var scene=document.getElementById("mapScene"), stage=document.getElementById("mapStage"),
    planes=[].slice.call(scene.querySelectorAll(".plane")),
    rail=[].slice.call(document.querySelectorAll(".yr")),
    prevB=document.getElementById("mapPrev"), nextB=document.getElementById("mapNext"),
    flatB=document.getElementById("flatBtn"), countEl=document.getElementById("mapCount");
var D=620, active=0, rx=0, ry=0, trx=0, try_=0, raf=null, filter="all";
var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function flat(){ return map.classList.contains("flat"); }
function apply(){ scene.style.transform="rotateX("+rx.toFixed(2)+"deg) rotateY("+ry.toFixed(2)+"deg) translateZ("+(active*D)+"px)"; }
function loop(){ rx+=(trx-rx)*.1; ry+=(try_-ry)*.1; apply();
  if(Math.abs(trx-rx)>.05||Math.abs(try_-ry)>.05){ raf=requestAnimationFrame(loop); } else { raf=null; } }
function kick(){ if(!raf && !reduce) raf=requestAnimationFrame(loop); }

/* Cards on hidden planes are still in the tab order under pointer-events:none /
   opacity:0, so keyboard focus lands on links nobody can see. Mirror the visual
   state into focusability. In flat view every plane is visible, so all are live. */
function syncFocusability(){
  var open=flat();
  planes.forEach(function(p,j){
    var live = open || j===active;
    if(live) p.removeAttribute("aria-hidden"); else p.setAttribute("aria-hidden","true");
    p.querySelectorAll(".node").forEach(function(n){
      if(live) n.removeAttribute("tabindex"); else n.setAttribute("tabindex","-1");
    });
  });
}

/* Year pills carry a live count of what the current filter matches, so the
   years you are not looking at still advertise that they hold something. */
function labelRail(){
  rail.forEach(function(b,j){
    var n=0;
    planes[j].querySelectorAll(".node").forEach(function(el){
      if(filter==="all"||el.dataset.kind===filter) n++;
    });
    var c=b.querySelector(".yr__n");
    if(!c){ c=document.createElement("span"); c.className="yr__n"; b.appendChild(c); }
    c.textContent=n;
    b.classList.toggle("empty", n===0);
  });
}

function applyFilter(){
  var shown=0, total=0;
  scene.querySelectorAll(".node").forEach(function(n){
    total++;
    var hide = filter!=="all" && n.dataset.kind!==filter;
    n.classList.toggle("dim", hide);
    if(!hide) shown++;
  });
  countEl.textContent = filter==="all" ? total+" entries" : shown+" of "+total+" shown";
  labelRail();
}

function setYear(i){
  active=Math.max(0,Math.min(planes.length-1,i));
  planes.forEach(function(p,j){
    var d=j-active, s = d<0 ? "behind" : d===0 ? "active" : d===1 ? "near" : "far";
    p.setAttribute("data-state",s);
  });
  rail.forEach(function(b,j){ b.setAttribute("aria-current", j===active?"true":"false"); });
  prevB.disabled = active===0; nextB.disabled = active===planes.length-1;
  syncFocusability();
  apply();
}

rail.forEach(function(b){ b.addEventListener("click",function(){ setYear(+b.dataset.i); }); });
prevB.addEventListener("click",function(){ setYear(active-1); });
nextB.addEventListener("click",function(){ setYear(active+1); });

/* Drag sideways to travel through the years. Vertical is deliberately left to
   the browser (see touch-action:pan-y in site.css) so the map never swallows
   page scroll on a phone. Hovering still parallaxes the camera. */
var down=false, sx=0, startActive=0, moved=false;

stage.addEventListener("pointerdown",function(e){
  if(flat()||e.button) return;
  down=true; moved=false; sx=e.clientX; startActive=active;
});

stage.addEventListener("pointermove",function(e){
  if(reduce||flat()) return;
  if(down){
    var dx=e.clientX-sx;
    if(Math.abs(dx)>8) moved=true;
    var want=Math.max(0,Math.min(planes.length-1,startActive+Math.round(-dx/95)));
    if(want!==active) setYear(want);
    return;
  }
  var r=stage.getBoundingClientRect();
  var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
  try_=px*9; trx=-py*6; kick();
});

function endDrag(){ down=false; }
window.addEventListener("pointerup",endDrag);
window.addEventListener("pointercancel",endDrag);
stage.addEventListener("pointerleave",function(){ if(!down){ trx=0; try_=0; kick(); } });

/* A drag that crossed the threshold must not also open the card underneath. */
stage.addEventListener("click",function(e){
  if(moved){ e.preventDefault(); e.stopPropagation(); moved=false; }
},true);

// keyboard
map.setAttribute("tabindex","0");
map.addEventListener("keydown",function(e){
  if(e.key==="ArrowDown"||e.key==="ArrowRight"){ setYear(active+1); e.preventDefault(); }
  if(e.key==="ArrowUp"||e.key==="ArrowLeft"){ setYear(active-1); e.preventDefault(); }
});

// filters
document.querySelectorAll(".mf[data-filter]").forEach(function(btn){
  btn.addEventListener("click",function(){
    document.querySelectorAll(".mf[data-filter]").forEach(function(x){ x.setAttribute("aria-pressed","false"); });
    btn.setAttribute("aria-pressed","true");
    filter=btn.dataset.filter;
    applyFilter();
  });
});

// flat toggle
flatB.addEventListener("click",function(){
  var on=map.classList.toggle("flat");
  flatB.setAttribute("aria-pressed", on?"true":"false");
  flatB.textContent = on ? "3D view" : "Flat view";
  if(!on) setYear(active); else syncFocusability();
});

if(reduce){ map.classList.add("flat"); flatB.setAttribute("aria-pressed","true"); flatB.textContent="3D view"; }
setYear(0);
applyFilter();

/* The depth is the whole point of this figure, but nothing reveals it until you
   interact. Swing the camera once, the first time the map scrolls into view. */
if(!reduce && !flat() && window.IntersectionObserver){
  var seen=false;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){
      if(!en.isIntersecting||seen) return;
      seen=true; io.disconnect();
      try_=-11; trx=4; kick();
      setTimeout(function(){ try_=0; trx=0; kick(); },1000);
    });
  },{threshold:.35});
  io.observe(stage);
}
})();
