(function(){"use strict";
var barsEl=document.getElementById("bars"),noteEl=document.getElementById("chartNote");
if(!barsEl)return;
var DATA={ner:[
 {l:"v1 defs, zero-shot",v:0.729,n:"Baseline. Over-predicts <b>YIELD_OTHER</b> &mdash; 549 false positives. Precision-poor at .697."},
 {l:"v2 definitions",v:0.756,n:"First refinement round. Precision jumps to .771 by teaching the model what <b>not</b> to extract."},
 {l:"v3 definitions",v:0.748,n:"Exact stalls, but relaxed F1 hits <b>0.906</b> &mdash; proof the residual is boundaries, not comprehension."},
 {l:"v4 definitions",v:0.768,n:"Rule refinement is <b>saturated</b>. Four rounds, exact F1 flat within &plusmn;0.02."},
 {l:"+ boundary trimming",v:0.811,n:"Deterministic post-processing. <b>+0.063 for zero model cost</b>, and it generalized to held-out data."},
 {l:"+ few-shot examples",v:0.880,n:"<b>Examples beat rules.</b> +0.158 in one step &mdash; more than four rounds of rule-writing combined."},
 {l:"frontier + v2 + 7-shot",v:0.918,n:"Project best on dev. P .930 / R .907. Boundary errors collapsed from 598 to 65.",b:1},
 {l:"held-out (unseen 100)",v:0.910,n:"<b>The honest number.</b> Drops only 0.008 on never-seen documents &mdash; the gain is real, not fitted.",b:1},
 {l:"leaderboard (supervised)",v:0.957,n:"ChEMU 2020 winner, supervised fine-tuning on the full training set. Our gap: <b>0.047</b>.",r:1}],
ee:[
 {l:"v1 defs, zero-shot",v:0.648,n:"Marks almost every verb a trigger. Badly precision-poor at <b>.589</b>."},
 {l:"v2 definitions",v:0.769,n:"<b>Largest single prompt win of the project (+0.121).</b> Product-formation verbs are REACTION_STEP, not WORKUP."},
 {l:"v3 definitions",v:0.792,n:"Further gains from definition work. Recall reaches .810."},
 {l:"v4 definitions",v:0.792,n:"Saturated, same as v3 &mdash; though precision improves to .802."},
 {l:"two-pass detect&rarr;link",v:0.748,n:"<b>Abandoned.</b> +0.017 for double the cost and double the latency. Not worth it."},
 {l:"frontier + v2 + 7-shot",v:0.850,n:"Best dev result. P .847 / R .852.",b:1},
 {l:"held-out (unseen 100)",v:0.792,n:"Drops 0.058 &mdash; part of the dev gain was fitted to dev. <b>This is why EE, not NER, is the fine-tuning target.</b>",b:1},
 {l:"leaderboard (supervised)",v:0.954,n:"Remaining gap: <b>0.162</b>. Every EE error is genuine chemistry judgement, not formatting.",r:1}]};
var task="ner";
function render(){
 var rows=DATA[task];barsEl.innerHTML="";
 rows.forEach(function(d,i){
  var el=document.createElement("div");el.className="bar";
  if(d.b)el.setAttribute("data-best","1"); if(d.r)el.setAttribute("data-ref","1");
  el.innerHTML='<span class="bar__lbl">'+d.l+'</span><span class="bar__track"><span class="bar__fill"></span></span><span class="bar__val">'+d.v.toFixed(3)+'</span>';
  el.addEventListener("mouseenter",function(){noteEl.innerHTML=d.n;});
  el.addEventListener("click",function(){noteEl.innerHTML=d.n;});
  barsEl.appendChild(el);
  setTimeout(function(){el.querySelector(".bar__fill").style.width=(d.v*100)+"%";},60+i*55);
 });
 noteEl.innerHTML=task==="ner"?"Hover any bar for what that step established. <b>NER fails on formatting</b> &mdash; 54% of errors were pure boundary problems.":"Hover any bar. <b>EE fails on understanding</b> &mdash; exact and relaxed F1 are identical, so there is not one boundary point to recover.";
}
document.querySelectorAll(".chart__tab").forEach(function(t){
 t.addEventListener("click",function(){
  document.querySelectorAll(".chart__tab").forEach(function(x){x.setAttribute("aria-selected","false");});
  t.setAttribute("aria-selected","true");task=t.dataset.task;render();});});
render();})();
