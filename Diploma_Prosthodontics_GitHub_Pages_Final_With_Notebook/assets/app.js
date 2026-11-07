/* Diploma in Prosthodontics SBA study app. All content comes from the supplied Edition 2 question bank. */
(() => {
'use strict';
const $ = (q) => document.querySelector(q);
const letters = ['A', 'B', 'C', 'D', 'E'];
const rawData = $('#question-data');
const root = $('#app');
if (!rawData) { root.textContent = 'Question data is missing. Re-upload the complete website folder.'; return; }
let bank;
try { bank = JSON.parse(rawData.textContent); } catch (e) { root.textContent = 'The question file could not be opened.'; return; }
const questions = bank.questions, blocks = bank.blocks;
const questionById = new Map(questions.map(q => [q.id, q]));
const blockById = new Map(blocks.map(b => [b.id, b]));
const notesPages = {A:4,B:9,C:13,D:21,E:26,F:32,G:37,H:42,I:49,J:53,K:58,L:62,M:66,N:1};
const storageKey = 'dip-pros-clinical-sba-ed2-progress';
const sessionKey = 'dip-pros-clinical-sba-ed2-session';
const escapeHTML = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct = (a,b) => b ? Math.round(a*100/b) : 0;
const dateText = (date) => { try { return new Date(date).toLocaleString(undefined,{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}); } catch(e) { return '—'; } };
const getStore = (key) => {try {return JSON.parse(localStorage.getItem(key));}catch(e){return null;}};
const putStore = (key, value) => {try{localStorage.setItem(key,JSON.stringify(value));}catch(e){notify('Local storage is unavailable; export progress regularly.');}};
const defaultProgress = () => ({version:2,updated:Date.now(),answers:{},bookmarks:[],history:[]});
function sanitiseProgress(raw) {
  const p=defaultProgress(); if(!raw || typeof raw !== 'object')return p;
  if(raw.answers && typeof raw.answers === 'object')for(const [id,item] of Object.entries(raw.answers)){
    if(questionById.has(+id) && item && letters.includes(item.selected))p.answers[id]={selected:item.selected,correct:item.selected===questionById.get(+id).answer,attempts:Math.max(1,Math.min(999,Number(item.attempts)||1)),lastAttempt:Number(item.lastAttempt)||Date.now()};
  }
  if(Array.isArray(raw.bookmarks))p.bookmarks=[...new Set(raw.bookmarks.map(Number).filter(n=>questionById.has(n)))];
  if(Array.isArray(raw.history))p.history=raw.history.slice(-200).filter(x=>x && typeof x==='object' && Number.isFinite(Number(x.total))).map(x=>({date:Number(x.date)||Date.now(),block:String(x.block||'ALL').slice(0,20),mode:String(x.mode||'practice').slice(0,12),correct:Number(x.correct)||0,total:Number(x.total)||0,answered:Number(x.answered)||0}));
  p.updated=Number(raw.updated)||Date.now();return p;
}
let progress=sanitiseProgress(getStore(storageKey));
let activeTab='practice'; let currentBlock='ALL';let studyFilter='all';let studyCount='20';let studyMode='practice';let randomise=true;
let searchTerm='';let searchBlock='ALL';let searchShown=30;let session=null;
function persist(){progress.updated=Date.now();putStore(storageKey,progress)}
function keepSession(){ if(session && !session.completed)putStore(sessionKey,session);else try{localStorage.removeItem(sessionKey)}catch(e){} }
function notify(message) {const n=$('#status-message');if(n){n.textContent=message;n.hidden=false;setTimeout(()=>{if(n)n.hidden=true},4500);}}
function selectedIds(){let arr=questions.filter(q=>currentBlock==='ALL'||q.block===currentBlock);
 if(studyFilter==='unseen')arr=arr.filter(q=>!progress.answers[q.id]);
 if(studyFilter==='wrong')arr=arr.filter(q=>progress.answers[q.id] && !progress.answers[q.id].correct);
 if(studyFilter==='saved')arr=arr.filter(q=>progress.bookmarks.includes(q.id));
 return arr.map(q=>q.id);
}
function shuffled(a){const b=a.slice();for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function startSession(ids, mode=studyMode, keepOrder=false){
 if(!ids.length){notify('No questions match these filters. Choose another topic or selection.');return;}
 const list=keepOrder?ids.slice():randomise?shuffled(ids):ids.slice();const count=studyCount==='all'?list.length:Math.min(Number(studyCount),list.length);
 const filtered=list.slice(0,count);session={ids:filtered,index:0,selections:{},checked:{},started:Date.now(),deadline:mode==='timed'?Date.now()+filtered.length*72*1000:0,mode,completed:false,recorded:false};
 activeTab='practice';keepSession();render();window.scrollTo({top:0,behavior:'smooth'});
}
function startSelected(){startSession(selectedIds());}
function getQuestion(){return session&&questionById.get(session.ids[session.index]);}
function recordAttempt(id,letter){if(!letters.includes(letter))return;const before=progress.answers[id];progress.answers[id]={selected:letter,correct:letter===questionById.get(id).answer,attempts:(before?.attempts||0)+1,lastAttempt:Date.now()};persist();}
function finishSession(){if(!session||session.completed)return;
 if(session.mode==='timed')for(const id of session.ids){const selected=session.selections[id];if(selected)recordAttempt(id,selected);}
 const s=getSessionResult();session.result=s;session.completed=true;
 progress.history.push({date:Date.now(),block:currentBlock,mode:session.mode,correct:s.correct,total:s.total,answered:s.answered});progress.history=progress.history.slice(-200);persist();keepSession();render();window.scrollTo({top:0,behavior:'smooth'});
}
function getSessionResult(){let correct=0,answered=0;for(const id of session.ids){let selected=session.mode==='timed'?session.selections[id]:session.checked[id]?session.selections[id]:null;
 if(selected){answered++;if(selected===questionById.get(id).answer)correct++;}}
 return {correct,answered,total:session.ids.length};
}
function summarise(){const attempted=Object.values(progress.answers),correct=attempted.filter(x=>x.correct).length;return {answered:attempted.length,correct,accuracy:pct(correct,attempted.length),saved:progress.bookmarks.length};}
const statsTile=(label,value,foot)=>`<div class="stat"><div class="label">${escapeHTML(label)}</div><div class="value">${escapeHTML(value)}</div><div class="foot">${escapeHTML(foot)}</div></div>`;
function header(){return `<div class="topline"><div class="shell"><small>Diploma in Prosthodontics</small><span class="right-meta">Volume II · Edition 2 · 2026</span></div></div>
<header class="hero"><div class="shell hero-inner"><div><div class="eyebrow">Independent clinical revision companion</div><h1>Clinical SBA<br>Question Bank</h1><p>1,000 single-best-answer questions across 14 topic blocks, with answer notes, clinical reasoning, and learning-outcome pointers. Designed for responsive study on iPhone, iPad and desktop.</p><div class="author"><strong>Dr. Kam O Man, Owen</strong><br>BDS (HK) · MFDS RCSEd · MFDS RCPS (Glasg)<br>MClinDent (Fixed and Removable Prosthodontics) (KCL)<br>MImpDent (RCSEd) · MGDS RCSI</div></div><div class="hero-number"><b>II</b><span>The question bank</span></div></div></header>
<div class="shell"><div class="notice"><strong>Revision resource only.</strong> Not an official RCSEd examination product. The source gives inconsistent exam formats; timed mode uses an illustrative 72 seconds per question, not a verified examination specification. Check current guidance and clinical references.</div>
<nav class="tabs" aria-label="Main sections">${[['practice','Practice'],['search','Find questions'],['progress','My progress'],['about','About & setup']].map(([key,txt])=>`<button class="tab ${activeTab===key?'active':''}" data-action="tab" data-tab="${key}" aria-current="${activeTab===key?'page':'false'}">${txt}</button>`).join('')}<a class="tab" href="notes.html">Read Volume I</a></nav><div id="view"></div><p id="status-message" class="small-callout" aria-live="polite" hidden></p>
<footer class="fineprint">© Revision companion · Dr. Kam O Man, Owen. Independent learning material, not endorsed by the Royal College of Surgeons of Edinburgh or other regulatory bodies. Progress remains on this device unless exported. <a href="notes.html">Read Volume I</a> · <a href="assets/notes-volume-i.pdf" target="_blank" rel="noopener">Volume I PDF</a> · <a href="assets/question-bank-volume-ii.pdf" target="_blank" rel="noopener">Volume II PDF</a></footer></div>`;}
function dashboard(){const s=summarise();const section=`<div class="section-heading"><div><h2>Study dashboard</h2><p>Practise by topic or create a mixed examination-style session.</p></div></div>
<div class="grid stats-grid">${statsTile('Total questions','1,000','14 curriculum blocks')}${statsTile('Attempted',s.answered,'of 1,000 questions')}${statsTile('Recent accuracy',s.accuracy+'%','based on your latest answers')}${statsTile('Saved',s.saved,'bookmarked questions')}</div>`;
const topics=blocks.map(b=>{const attempted=questions.filter(q=>q.block===b.id&&progress.answers[q.id]).length;return `<button class="topic ${currentBlock===b.id?'selected':''}" data-action="choose-block" data-block="${b.id}" aria-pressed="${currentBlock===b.id}"><span class="topic-id">${b.id}</span><span style="flex:1;min-width:0"><span class="topic-title">${escapeHTML(b.title)}</span><span class="topic-count">${attempted}/${b.count} answered · Q${b.start}–${b.end}</span><span class="topic-bar"><i style="width:${pct(attempted,b.count)}%"></i></span></span></button>`}).join('');
return section+`<div class="resource-banner"><div><strong>Volume I · Final Integrated Revision Notebook</strong><p>Read all 72 original pages in the mobile HTML reader, with unit navigation and zoom.</p></div><a href="notes.html" class="btn secondary">Read Volume I →</a></div><div class="content-columns"><section class="panel" id="settings"><h3>Start a revision session</h3><p class="help">Every question offers five options (A–E). Combined answers such as “all of the above” are still selected as one letter.</p>
<div class="form-grid"><label class="field"><span>Topic block</span><select id="study-block"><option value="ALL">All blocks · mixed practice</option>${blocks.map(b=>`<option value="${b.id}" ${currentBlock===b.id?'selected':''}>${b.id} · ${escapeHTML(b.title)}</option>`).join('')}</select></label>
<label class="field"><span>Questions per session</span><select id="study-count">${['10','20','30','50','90','150','all'].map(n=>`<option value="${n}" ${studyCount===n?'selected':''}>${n==='all'?'All available':n+' questions'}</option>`).join('')}</select></label>
<label class="field"><span>Choose questions</span><select id="study-filter">${[['all','All questions'],['unseen','Not attempted'],['wrong','Previously incorrect'],['saved','Bookmarked']].map(([k,label])=>`<option value="${k}" ${studyFilter===k?'selected':''}>${label}</option>`).join('')}</select></label>
<label class="field"><span>Ordering</span><select id="study-order"><option value="random" ${randomise?'selected':''}>Shuffled</option><option value="sequential" ${!randomise?'selected':''}>Question number</option></select></label></div>
<div class="chapter-label" style="margin-top:19px">Study mode</div><div class="radio-row"><button class="segment ${studyMode==='practice'?'selected':''}" data-action="mode" data-mode="practice" aria-pressed="${studyMode==='practice'}">Practice · instant explanations</button><button class="segment ${studyMode==='timed'?'selected':''}" data-action="mode" data-mode="timed" aria-pressed="${studyMode==='timed'}">Timed · results at finish</button></div>
<div class="small-callout" style="margin-bottom:18px">${studyMode==='timed'?'Timed sessions use 72 seconds per question as an optional training pace. The current official Diploma exam format has not been independently confirmed.':'Practice mode shows the source answer notes after you check each question.'}</div>
<div class="btn-row"><button class="btn" data-action="start">Start session <span aria-hidden="true">→</span></button><span class="subtle" id="available-count">${selectedIds().length} questions available with these filters</span></div></section>
<section class="panel"><h3>Explore the 14 blocks</h3><p class="help">Tap a topic to select it for your next session.</p><div class="topic-list">${topics}</div><div class="divider"></div><button class="btn secondary" data-action="choose-block" data-block="ALL">All topics</button></section></div>`;}
function optionMarkup(q,selected,showAnswer){return q.options.map((option,i)=>{const letter=letters[i],css=[selected===letter?'selected':'',showAnswer&&q.answer===letter?'correct':'',showAnswer&&selected===letter&&selected!==q.answer?'wrong':''].join(' ');return `<button class="choice ${css}" data-action="answer" data-letter="${letter}" ${showAnswer||session.completed?'disabled':''} aria-pressed="${selected===letter}"><span class="letter">${letter}</span><span>${escapeHTML(option)}</span></button>`;}).join('');}
function answerCard(q,selected){const correct=selected===q.answer;return `<div class="answer-card ${correct?'':'wrong'}" aria-live="polite"><h3>${correct?'Correct answer':'The source answer'}: ${q.answer} — ${escapeHTML(q.options[letters.indexOf(q.answer)])}</h3><p>${selected?correct?'Your response is correct.':`Your response was ${escapeHTML(selected)}.`:'No answer selected.'}</p>${q.brief?`<div class="rationale"><strong>Source answer note</strong><p>${escapeHTML(q.why)}</p></div>`:`<div class="rationale"><strong>Justification</strong><p>${escapeHTML(q.why)}</p></div>`}${q.others?`<div class="rationale"><strong>Why not the others</strong><p>${escapeHTML(q.others)}</p></div>`:''}<div class="rationale"><strong>Revise in Volume I / learning outcomes</strong><p>${escapeHTML(q.revise||'See the topic block and notebook mapping.')}</p><p><a href="notes.html?page=${notesPages[q.block]||1}" target="_blank" rel="noopener">Open matching unit in the final notebook ↗</a></p></div>${q.brief?'<p class="subtle">This question has a concise source note rather than a separate distractor analysis.</p>':''}</div>`;}
function sessionUI(){const q=getQuestion(),selected=session.selections[q.id],checked=session.mode==='practice'&&!!session.checked[q.id],index=session.index,progressPct=pct(index+1,session.ids.length);
 const controls=`<div class="session-actions"><div class="left"><button class="btn secondary" data-action="previous" ${index===0?'disabled':''}>← Previous</button><button class="btn secondary" data-action="next" ${index===session.ids.length-1?'disabled':''}>Next →</button></div><div class="right">${session.mode==='practice'?`<button class="btn" data-action="check" ${!selected||checked?'disabled':''}>${checked?'Answer checked':'Check answer'}</button>`:''}<button class="btn ghost" data-action="finish">Finish ${session.mode==='timed'?'exam':'session'}</button></div></div>`;
 const seen=Object.keys(session.mode==='practice'?session.checked:session.selections).length;
 return `<div class="session-wrap"><div class="session-header"><div><div class="chapter-label">${session.mode==='timed'?'Timed exam practice':'Guided practice'} · ${escapeHTML(q.block)}: ${escapeHTML(blockById.get(q.block).title)}</div><h2>Question ${index+1} <span class="subtle">of ${session.ids.length}</span></h2><p class="subtle">Original bank question #${q.id} · ${seen} marked / selected in this session</p></div>${session.mode==='timed'?`<div id="clock" class="timer" role="timer">—:—</div>`:''}</div>
<div class="progress-line" aria-label="Session progress: ${progressPct} percent"><span style="width:${progressPct}%"></span></div>
<section class="question-panel"><div class="question-meta"><span class="pill">Block ${q.block} · Q${q.id}</span><button class="bookmark ${progress.bookmarks.includes(q.id)?'on':''}" data-action="bookmark" aria-pressed="${progress.bookmarks.includes(q.id)}">${progress.bookmarks.includes(q.id)?'★ Saved':'☆ Save question'}</button></div>
<h3 class="question-title">${escapeHTML(q.stem)}</h3><div class="choices" role="group" aria-label="Answer options">${optionMarkup(q,selected,checked)}</div>${checked?answerCard(q,selected):''}</section>
${controls}<div class="jumpbox"><label for="jump">Jump to question</label><select id="jump" aria-label="Jump to question">${session.ids.map((id,i)=>`<option value="${i}" ${i===index?'selected':''}>${i+1} · Q${id} ${session.mode==='practice'&&session.checked[id]?'✓':session.selections[id]?'•':''}</option>`).join('')}</select></div><div class="session-status">${session.mode==='timed'?'Answers are hidden until you finish. Your selections are saved during this session.':'Check an answer to see its explanation. Your checked responses are saved locally.'}</div></div>`;
}
function resultsUI(){const score=session.result,rate=pct(score.correct,score.total);const topicTally={};for(const id of session.ids){const q=questionById.get(id);const o=topicTally[q.block]||(topicTally[q.block]={total:0,correct:0});o.total++;const chosen=session.selections[id],done=session.mode==='timed'?Boolean(chosen):Boolean(session.checked[id]);if(done&&chosen===q.answer)o.correct++;}
 const breakdown=Object.entries(topicTally).map(([block,stat])=>`<tr><td><strong>${block}</strong> · ${escapeHTML(blockById.get(block).title)}</td><td>${stat.correct}/${stat.total}</td><td><div class="meter ${pct(stat.correct,stat.total)>=70?'good':'low'}"><span style="width:${pct(stat.correct,stat.total)}%"></span></div></td></tr>`).join('');
 return `<div class="session-wrap"><section class="result-banner"><div class="eyebrow">Session complete</div><h2>Review your results</h2><div class="result-score">${rate}% <small>${score.correct} correct / ${score.total} questions</small></div><p>${score.answered} answered · ${score.total-score.answered} unanswered · ${session.mode==='timed'?'Timed':'Practice'} session</p></section>
<div class="panel"><h3>By topic</h3><div class="table-responsive"><table class="score-table"><thead><tr><th>Block</th><th>Score</th><th>Accuracy</th></tr></thead><tbody>${breakdown}</tbody></table></div><div class="btn-row" style="margin-top:19px"><button class="btn" data-action="review">Review every answer</button><button class="btn secondary" data-action="new-session">New session</button><button class="btn ghost" data-action="tab" data-tab="progress">Progress overview</button></div></div></div>`;}
function reviewUI(){const q=getQuestion();const selected=session.selections[q.id];const index=session.index;return `<div class="session-wrap"><div class="session-header"><div><div class="chapter-label">Session answer review</div><h2>Q${q.id} <span class="subtle">${index+1} of ${session.ids.length}</span></h2></div><button class="btn secondary" data-action="new-session">Back to dashboard</button></div>
<div class="question-panel"><div class="question-meta"><span class="pill">Block ${q.block}</span><button class="bookmark ${progress.bookmarks.includes(q.id)?'on':''}" data-action="bookmark">${progress.bookmarks.includes(q.id)?'★ Saved':'☆ Save question'}</button></div><h3 class="question-title">${escapeHTML(q.stem)}</h3><div class="choices">${optionMarkup(q,selected,true)}</div>${answerCard(q,selected)}</div>
<div class="session-actions"><button class="btn secondary" data-action="previous" ${index===0?'disabled':''}>← Previous</button><button class="btn secondary" data-action="next" ${index===session.ids.length-1?'disabled':''}>Next →</button><button class="btn ghost" data-action="results">Session score</button></div></div>`;}
let reviewing=false;
function render(){root.innerHTML=header();const view=$('#view');
 if(activeTab==='practice'){view.innerHTML=session?(session.completed?(reviewing?reviewUI():resultsUI()):sessionUI()):dashboard();if(session?.mode==='timed'&&!session.completed)updateClock();}
 else if(activeTab==='search'){view.innerHTML=searchUI();renderSearchResults();}
 else if(activeTab==='progress')view.innerHTML=progressUI();
 else view.innerHTML=aboutUI();
}
function newSession(){session=null;reviewing=false;keepSession();activeTab='practice';render();}
function blockStats(b){const related=questions.filter(q=>q.block===b.id),attempted=related.filter(q=>progress.answers[q.id]),correct=attempted.filter(q=>progress.answers[q.id].correct);return {attempted:attempted.length,correct:correct.length};}
function progressUI(){const s=summarise();return `<div class="section-heading"><div><h2>Your progress</h2><p>Saved on this device. Export a file to move progress from iPhone to iPad.</p></div></div><div class="grid stats-grid">${statsTile('Attempted',s.answered,'of 1,000')}${statsTile('Not attempted',1000-s.answered,'questions remaining')}${statsTile('Latest accuracy',s.accuracy+'%','per question')}${statsTile('Bookmarks',s.saved,'saved for later')}</div>
<section class="panel"><h3>Learning by block</h3><div class="table-responsive"><table class="score-table"><thead><tr><th>Block</th><th>Answered</th><th>Latest score</th><th>Coverage</th></tr></thead><tbody>${blocks.map(b=>{const v=blockStats(b);return `<tr><td><strong>${b.id}</strong> · ${escapeHTML(b.title)}</td><td>${v.attempted}/${b.count}</td><td>${v.attempted?pct(v.correct,v.attempted)+'%':'—'}</td><td style="min-width:105px"><div class="meter"><span style="width:${pct(v.attempted,b.count)}%"></span></div></td></tr>`;}).join('')}</tbody></table></div></section>
<div class="content-columns" style="margin-top:20px"><section class="panel"><h3>Transfer your progress</h3><p class="help">Progress is stored in your browser only, not in GitHub. Export on your iPhone and import the file on your iPad, or vice versa.</p><div class="btn-row"><button class="btn" data-action="export">Export progress (.json)</button><label class="btn secondary" for="import-file" style="cursor:pointer">Import progress file</label><input id="import-file" type="file" accept=".json,application/json" class="sr-only"></div><p class="subtle" style="margin-top:12px">Import merges saved answers using the latest attempt and combines bookmarks.</p><div class="divider"></div><button class="btn warn" data-action="reset">Clear all progress on this device</button></section>
<section class="panel"><h3>Recent practice sessions</h3>${progress.history.length?`<div class="table-responsive"><table class="score-table"><thead><tr><th>Date</th><th>Mode</th><th>Score</th></tr></thead><tbody>${progress.history.slice(-8).reverse().map(r=>`<tr><td>${escapeHTML(dateText(r.date))}</td><td>${escapeHTML(r.mode)}</td><td>${r.correct}/${r.total} (${pct(r.correct,r.total)}%)</td></tr>`).join('')}</tbody></table></div>`:'<p class="help">Your completed sessions will appear here.</p>'}</section></div>`;}
function searchUI(){return `<div class="section-heading"><div><h2>Find a question</h2><p>Search question numbers, case descriptions, answer notes, and learning-outcome codes.</p></div></div><div class="panel"><div class="search-controls"><label class="field"><span>Search text or question number</span><input id="query" type="search" placeholder="e.g. 725, ferrule, 2c.20, CBCT" value="${escapeHTML(searchTerm)}" autocapitalize="off" autocomplete="off"></label><label class="field"><span>Topic</span><select id="search-block"><option value="ALL">All topics</option>${blocks.map(b=>`<option value="${b.id}" ${searchBlock===b.id?'selected':''}>${b.id} · ${escapeHTML(b.title)}</option>`).join('')}</select></label></div><div id="search-results"></div></div>`;}
function searchMatches(){const needle=searchTerm.toLocaleLowerCase().trim();return questions.filter(q=>{if(searchBlock!=='ALL'&&q.block!==searchBlock)return false;if(!needle)return true;if(/^(?:q\s*)?\d{1,4}$/i.test(needle)&&q.id===Number(needle.replace(/^q\s*/i,'')))return true;return [q.stem,q.why,q.revise,q.others,...q.options].join(' ').toLocaleLowerCase().includes(needle);});}
function renderSearchResults(){const dest=$('#search-results');if(!dest)return;const arr=searchMatches();const visible=arr.slice(0,searchShown);dest.innerHTML=`<p class="subtle" style="margin:16px 0 4px">${arr.length} matching questions · Showing ${visible.length}</p><div class="search-list">${visible.map(q=>`<button class="search-result" data-action="open-question" data-id="${q.id}"><strong>Q${q.id} · Block ${q.block}</strong><span class="snippet">${escapeHTML(q.stem).slice(0,290)}</span><small>${progress.bookmarks.includes(q.id)?'★ Bookmarked · ':''}${progress.answers[q.id]?'Attempted':'Not attempted'} · Tap to practise</small></button>`).join('')}</div>${visible.length<arr.length?'<button class="btn secondary" style="margin-top:16px" data-action="show-more">Load more questions</button>':''}`;}
function aboutUI(){return `<div class="section-heading"><div><h2>About this collection</h2><p>Clinical SBA Question Bank · Volume II · Edition 2</p></div></div>
<div class="content-columns"><section class="panel faq"><h3>Contents of this website</h3><p>All 1,000 questions and their source answer notes from the supplied <em>Dip Pros RCSEd Part 1 — Clinical SBA Bank (Edition 2)</em> are included. Blocks A–M follow 13 course units; Block N contains 50 integrated clinical cases. The answers retain their original learning-outcome and notebook pointers.</p><h3>Author</h3><p><strong>Dr. Kam O Man, Owen</strong><br>BDS (HK) · MFDS RCSEd · MFDS RCPS (Glasg)<br>MClinDent (Fixed and Removable Prosthodontics) (KCL)<br>MImpDent (RCSEd) · MGDS RCSI</p><h3>About the explanations</h3><p>Questions 1–730 contain detailed justification cards in the source. Questions 731–1000 contain concise answer notes; these are shown faithfully, without inventing extra distractor explanations.</p><h3>Level of practice</h3><p>The material follows the August 2026 Diploma in Prosthodontics learning outcomes and focuses on Level 2 / enhanced-skills practice, including recognition of cases requiring specialist referral.</p><h3>Exam-format caution</h3><p>The original documents do not consistently state the number or duration of written papers. The optional timed practice setting uses an illustrative 72-second/question pace, not a confirmed official examination schedule.</p></section>
<section class="panel faq"><h3>Study on iPhone or iPad</h3><ol class="feature-list"><li>Publish this folder using GitHub Pages, then open its website URL in <strong>Safari</strong>.</li><li>Tap the Share icon and choose <strong>Add to Home Screen</strong> for an app-like shortcut.</li><li>The questions can be used offline after the website has loaded and cached successfully.</li><li>Your checked answers and bookmarks stay on that device. To transfer them, use <strong>My progress → Export</strong> and import on the other device.</li></ol><div class="divider"></div><h3>Study resources</h3><p><a href="notes.html">Read Volume I: Notes in Prosthodontics (mobile HTML reader)</a></p><p style="margin-top:12px"><a href="assets/notes-volume-i.pdf" target="_blank" rel="noopener">Open the final Volume I notebook (PDF)</a></p><p style="margin-top:12px"><a href="assets/question-bank-volume-ii.pdf" target="_blank" rel="noopener">Open Volume II: Clinical SBA Question Bank (PDF)</a></p><p class="subtle" style="margin-top:14px">PDF files are included in the GitHub upload folder. They may need to be opened online before they are available offline.</p><div class="divider"></div><h3>Independent revision aid</h3><p>Not an official publication of or endorsed by the Royal College of Surgeons of Edinburgh, the General Dental Council, NHS England, or the Dental Examinations Executive. Check guidance, drug doses, and clinical thresholds against current authoritative sources.</p></section></div>`;}
function updateClock(){if(!session || session.completed || session.mode!=='timed')return;const seconds=Math.max(0,Math.ceil((session.deadline-Date.now())/1000));if(seconds<=0){finishSession();return;}const el=$('#clock');if(!el)return;const m=Math.floor(seconds/60),s=seconds%60;el.textContent=`${m}:${String(s).padStart(2,'0')}`;el.classList.toggle('urgent',seconds<=60);if(seconds<=0)finishSession();}
let lastTab='practice';
root.addEventListener('click',(ev)=>{
 const target=ev.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;
 if(action==='tab'){activeTab=target.dataset.tab;lastTab=activeTab;render();window.scrollTo({top:0});return;}
 if(action==='choose-block'){currentBlock=target.dataset.block;render();$('#settings')?.scrollIntoView({behavior:'smooth',block:'start'});return;}
 if(action==='mode'){studyMode=target.dataset.mode;render();return;}
 if(action==='start'){startSelected();return;}
 if(action==='answer'){
  if(!session || session.completed)return;const q=getQuestion();if(session.mode==='practice'&&session.checked[q.id])return;
  session.selections[q.id]=target.dataset.letter;keepSession();render();return;
 }
 if(action==='check'){
  if(!session||session.completed||session.mode!=='practice')return;const q=getQuestion(),selected=session.selections[q.id];if(!selected||session.checked[q.id])return;
  session.checked[q.id]=true;recordAttempt(q.id,selected);keepSession();render();return;
 }
 if(action==='next'||action==='previous'){
  if(!session)return;session.index=Math.max(0,Math.min(session.ids.length-1,session.index+(action==='next'?1:-1)));keepSession();render();window.scrollTo({top:0,behavior:'smooth'});return;
 }
 if(action==='bookmark'){
  if(!session)return;const id=getQuestion().id;if(progress.bookmarks.includes(id))progress.bookmarks=progress.bookmarks.filter(n=>n!==id);else progress.bookmarks.push(id);persist();render();return;
 }
 if(action==='finish'){
  if(!session)return;const checkedCount=Object.keys(session.mode==='practice'?session.checked:session.selections).length;
  if(checkedCount<session.ids.length&&!window.confirm(`You have ${session.ids.length-checkedCount} unanswered or unchecked questions. Finish and score them as unanswered?`))return;
  finishSession();return;
 }
 if(action==='review'){reviewing=true;session.index=0;render();return;}
 if(action==='results'){reviewing=false;render();return;}
 if(action==='new-session'){newSession();return;}
 if(action==='show-more'){searchShown+=30;renderSearchResults();return;}
 if(action==='open-question'){const id=Number(target.dataset.id);const match=questionById.get(id);if(!match)return;session={ids:[id],index:0,selections:{},checked:{},started:Date.now(),mode:'practice',deadline:0,completed:false};reviewing=false;activeTab='practice';keepSession();render();window.scrollTo({top:0});return;}
 if(action==='export'){
  const file=new Blob([JSON.stringify(progress,null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(file);link.download='dip-pros-sba-progress-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),2000);notify('Progress file created. Save it to Files or iCloud Drive.');return;
 }
 if(action==='reset'){
  if(!window.confirm('Delete all your recorded answers, bookmarks, and study history on THIS device? Export a backup first if needed.'))return;
  progress=defaultProgress();persist();newSession();notify('Device progress cleared.');return;
 }
});
root.addEventListener('change',async ev=>{
 const el=ev.target;switch(el.id){
 case 'study-block':currentBlock=el.value;render();break;
 case 'study-count':studyCount=el.value;render();break;
 case 'study-filter':studyFilter=el.value;render();break;
 case 'study-order':randomise=el.value==='random';render();break;
 case 'jump':if(session){session.index=Number(el.value);keepSession();render();window.scrollTo({top:0});}break;
 case 'search-block':searchBlock=el.value;searchShown=30;renderSearchResults();break;
 case 'import-file':{
  const file=el.files?.[0];if(!file)return;
  try{const payload=JSON.parse(await file.text());if(!payload || typeof payload!=='object' || !payload.answers || !Array.isArray(payload.bookmarks))throw Error('This is not a compatible progress export.');
   const imported=sanitiseProgress(payload);for(const [id,value] of Object.entries(imported.answers))if(!progress.answers[id] || value.lastAttempt>=progress.answers[id].lastAttempt)progress.answers[id]=value;
   progress.bookmarks=[...new Set([...progress.bookmarks,...imported.bookmarks])];progress.history=[...progress.history,...imported.history].sort((a,b)=>a.date-b.date).slice(-200);persist();render();notify('Progress imported successfully.');
  }catch(err){notify('Import failed: '+err.message);}break;
 }
 }
});
root.addEventListener('input',ev=>{if(ev.target.id==='query'){searchTerm=ev.target.value;searchShown=30;renderSearchResults();}});
document.addEventListener('keydown',ev=>{
 if(!session || activeTab!=='practice' || ev.altKey || ev.ctrlKey || ev.metaKey)return;
 const a=document.activeElement; if(a&&(['INPUT','SELECT','TEXTAREA'].includes(a.tagName)||a.isContentEditable))return;
 if(ev.key==='ArrowRight'&&session.index<session.ids.length-1){ev.preventDefault();session.index++;keepSession();render();}
 if(ev.key==='ArrowLeft'&&session.index>0){ev.preventDefault();session.index--;keepSession();render();}
 if(/[1-5]/.test(ev.key)&&ev.key.length===1&&!session.completed){const q=getQuestion();if(session.mode!=='practice'||!session.checked[q.id]){session.selections[q.id]=letters[Number(ev.key)-1];keepSession();render();}}
});
setInterval(updateClock,1000);
const oldSession=getStore(sessionKey);
if(oldSession&&Array.isArray(oldSession.ids)&&oldSession.ids.length>0&&!oldSession.completed&&['practice','timed'].includes(oldSession.mode)&&oldSession.ids.every(n=>questionById.has(n))){
 session=oldSession;session.index=Math.max(0,Math.min(session.ids.length-1,Number(session.index)||0));session.selections=session.selections||{};session.checked=session.checked||{};
}
render();
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
})();
