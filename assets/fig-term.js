(function(){"use strict";
var out=document.getElementById("termOut"),input=document.getElementById("termIn"),chipsEl=document.getElementById("chips");
if(!out)return;var BLOB="ce013625030ba8dba906f756967f9e9ca394464a",has=false;
function esc(s){return s.replace(/[&<>]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[c];});}
function w(h){out.innerHTML+=h+"\n";var t=document.getElementById("term");t.scrollTop=t.scrollHeight;}
function echo(c){w('<span class="dim">~/repo $</span> '+esc(c));}
var C={"help":function(){w('<span class="p">available:</span> wyag init &middot; wyag hash-object hello.txt &middot; wyag cat-file '+BLOB.slice(0,7)+' &middot; wyag log &middot; whoami &middot; clear');},
"whoami":function(){w('tejas &mdash; builds systems from the bytes up.');},
"wyag init":function(){w('<span class="p">Initialized empty wyag repository in</span> .git/');},
"wyag hash-object hello.txt":function(){w('<span class="dim"># header "blob 6\\0hello\\n" &rarr; SHA-1</span>');w('<span class="hash">'+BLOB+'</span>');w('<span class="dim">stored &rarr; .git/objects/'+BLOB.slice(0,2)+'/'+BLOB.slice(2)+'</span>');has=true;},
"wyag cat-file":function(){if(!has){w('<span class="dim">fatal: object not found &mdash; run hash-object first</span>');return;}w('hello');},
"wyag log":function(){w('<span class="hash">commit a1b2c3d</span> <span class="dim">(HEAD &rarr; main)</span>');w('    feat: round-trip blobs through the object store');w('<span class="hash">commit 9f8e7d6</span>');w('    init: hand-rolled .git layout');},
"clear":function(){out.innerHTML="";}};
function run(raw){var c=raw.trim().replace(/\s+/g," ");if(!c)return;echo(c);
 if(C[c]){C[c]();return;} if(/^wyag cat-file\b/.test(c)){C["wyag cat-file"]();return;}
 if(/^wyag\b/.test(c)){w('<span class="dim">'+esc(c)+': not in this demo. try `help`.</span>');return;}
 w('<span class="dim">'+esc(c)+': command not found. try `help`.</span>');}
input.addEventListener("keydown",function(e){if(e.key==="Enter"){run(input.value);input.value="";}});
["wyag init","wyag hash-object hello.txt","wyag cat-file "+BLOB.slice(0,7),"wyag log","help"].forEach(function(c){
 var b=document.createElement("button");b.className="chip";b.type="button";b.textContent=c;
 b.addEventListener("click",function(){run(c);input.focus();});chipsEl.appendChild(b);});
w('<span class="p">wyag</span> <span class="dim">&mdash; a git you can read. type `help` or tap a chip.</span>');
w('<span class="dim">tip: hash-object, then cat-file the same hash.</span>');})();
