(function(){"use strict";
/* The Record: filter the chronological list, and keep the counts honest.
   Non-matching cards are dimmed in place rather than removed, so the year
   groups never reflow underneath you while you toggle. */
var map=document.getElementById("map"); if(!map) return;
var planes=[].slice.call(map.querySelectorAll(".plane")),
    countEl=document.getElementById("mapCount"),
    filter="all";

function render(){
  var shown=0, total=0;
  planes.forEach(function(p){
    var hit=0;
    p.querySelectorAll(".node").forEach(function(n){
      total++;
      var off = filter!=="all" && n.dataset.kind!==filter;
      n.classList.toggle("dim", off);
      if(!off){ hit++; shown++; }
    });
    // per-year tally, so a filter still reads on years further down the page
    var y=p.querySelector(".plane__year");
    if(y){
      var c=y.querySelector(".plane__n");
      if(!c){ c=document.createElement("span"); c.className="plane__n"; y.appendChild(c); }
      c.textContent = filter==="all" ? "" : hit;
    }
  });
  countEl.textContent = filter==="all" ? total+" entries" : shown+" of "+total+" shown";
}

document.querySelectorAll(".mf[data-filter]").forEach(function(btn){
  btn.addEventListener("click",function(){
    document.querySelectorAll(".mf[data-filter]").forEach(function(x){ x.setAttribute("aria-pressed","false"); });
    btn.setAttribute("aria-pressed","true");
    filter=btn.dataset.filter;
    render();
  });
});

render();
})();
