(function(){"use strict";
var map=document.getElementById("map"); if(!map) return;
var scene=document.getElementById("mapScene"), stage=document.getElementById("mapStage"),
    planes=[].slice.call(scene.querySelectorAll(".plane")),
    rail=[].slice.call(document.querySelectorAll(".yr")),
    prevB=document.getElementById("mapPrev"), nextB=document.getElementById("mapNext"),
    flatB=document.getElementById("flatBtn");
var D=620, active=0, rx=0, ry=0, trx=0, try_=0, dragging=false, sx=0, sy=0, raf=null;
var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function apply(){ scene.style.transform="rotateX("+rx.toFixed(2)+"deg) rotateY("+ry.toFixed(2)+"deg) translateZ("+(active*D)+"px)"; }
function loop(){ rx+=(trx-rx)*.1; ry+=(try_-ry)*.1; apply();
  if(Math.abs(trx-rx)>.05||Math.abs(try_-ry)>.05){ raf=requestAnimationFrame(loop); } else { raf=null; } }
function kick(){ if(!raf && !reduce) raf=requestAnimationFrame(loop); }

function setYear(i){
  active=Math.max(0,Math.min(planes.length-1,i));
  planes.forEach(function(p,j){
    var d=j-active, s = d<0 ? "behind" : d===0 ? "active" : d===1 ? "near" : "far";
    p.setAttribute("data-state",s);
  });
  rail.forEach(function(b,j){ b.setAttribute("aria-current", j===active?"true":"false"); });
  prevB.disabled = active===0; nextB.disabled = active===planes.length-1;
  apply();
}

rail.forEach(function(b){ b.addEventListener("click",function(){ setYear(+b.dataset.i); }); });
prevB.addEventListener("click",function(){ setYear(active-1); });
nextB.addEventListener("click",function(){ setYear(active+1); });

// pointer parallax + drag
stage.addEventListener("pointerdown",function(e){ dragging=true; sx=e.clientX; sy=e.clientY; stage.setPointerCapture(e.pointerId); });
stage.addEventListener("pointerup",function(){ dragging=false; trx=0; try_=0; kick(); });
stage.addEventListener("pointerleave",function(){ if(!dragging){ trx=0; try_=0; kick(); } });
stage.addEventListener("pointermove",function(e){
  if(reduce) return;
  var r=stage.getBoundingClientRect();
  if(dragging){ try_=Math.max(-22,Math.min(22,(e.clientX-sx)*0.09)); trx=Math.max(-14,Math.min(14,-(e.clientY-sy)*0.05)); }
  else { var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
         try_=px*9; trx=-py*6; }
  kick();
});

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
    var f=btn.dataset.filter;
    scene.querySelectorAll(".node").forEach(function(n){
      n.classList.toggle("dim", f!=="all" && n.dataset.kind!==f);
    });
  });
});

// flat toggle
flatB.addEventListener("click",function(){
  var on=map.classList.toggle("flat");
  flatB.setAttribute("aria-pressed", on?"true":"false");
  flatB.textContent = on ? "3D view" : "Flat view";
  if(!on) setYear(active);
});

if(reduce){ map.classList.add("flat"); flatB.setAttribute("aria-pressed","true"); flatB.textContent="3D view"; }
setYear(0);
})();
