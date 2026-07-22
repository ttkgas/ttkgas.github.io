(function(){"use strict";
var row=document.getElementById("stageRow"),read=document.getElementById("stageRead");
if(!row)return;
var S=[
 {k:"capture",t:"CAPTURE",d:"Electron's <b>setDisplayMediaRequestHandler</b> grants a screen source with system-audio loopback attached; the video track is dropped immediately. The mic arrives separately via getUserMedia. Both join a single Web Audio mix bus &mdash; <b>no native modules, no virtual audio cable</b>."},
 {k:"chunk",t:"CHUNK",d:"A hand-written rolling buffer splits the signal into <b>20-second windows with 2-second overlap</b>, giving the ASR shared context across each seam. Verified by an identity-ramp test covering offsets, per-sample values, and bounded retention."},
 {k:"stt",t:"TRANSCRIBE",d:"Each window goes to Whisper large-v3-turbo through OpenRouter. Batch-only endpoint, so streaming is simulated by chunking. Measured at <b>7.6% WER</b> on a controlled benchmark."},
 {k:"stitch",t:"STITCH",d:"The overlap means words are transcribed twice. Text matching proved fragile &mdash; the model renders the same audio differently by context &mdash; so the default is <b>stitchByTimestamps</b>: arithmetic on word-level timestamps, deterministic rather than probabilistic."},
 {k:"filter",t:"SUPPRESS",d:"Whisper hallucinates on silence (&ldquo;thanks for watching&rdquo;) and transcribes keyboard clicks as Japanese. Fixed by pinning language, dropping high no-speech-probability segments, and gating a curated hallucination list <b>behind a confidence check</b> so a real &ldquo;thank you&rdquo; survives."},
 {k:"correct",t:"CORRECT",d:"Whisper's prompt parameter turned out to be a dead end &mdash; output was byte-identical with and without it. The pivot: correct the <b>output</b> instead of steering the input, using a per-meeting glossary and a temperature-0 model with a deliberately narrow mandate."},
 {k:"enhance",t:"ENHANCE",d:"The core idea, and <b>not summarization</b>. The user's sparse notes are the backbone and the priority signal; the transcript is the fact source used to expand them. Strict grounding rules: never invent names, numbers, dates, or commitments."},
 {k:"chat",t:"CHAT",d:"Grounded Q&amp;A over one meeting, streamed by hand-parsing SSE. <b>Deliberately no RAG</b> &mdash; an hour of speech is ~13k tokens and fits in context, so retrieval would add complexity with no accuracy gain."}];
S.forEach(function(s,i){
 var b=document.createElement("button");b.className="stage";b.type="button";b.textContent=s.t;
 b.setAttribute("aria-current",i===0?"true":"false");
 b.addEventListener("click",function(){
  row.querySelectorAll(".stage").forEach(function(x){x.setAttribute("aria-current","false");});
  b.setAttribute("aria-current","true");read.innerHTML=s.d;});
 row.appendChild(b);});
read.innerHTML=S[0].d;})();
