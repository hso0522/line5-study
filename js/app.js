'use strict';
const icon = name => `<i data-lucide="${name}"></i>`;
const chapterQuestions = id => questions.filter(q => q.chapter === id);
const chapterName = id => {const i=chapters.findIndex(c=>c.id===id);return i<0?'통합 학습':`제${i+1}장 ${chapters[i].name}`;};
// Badge definitions and progression helpers are loaded from js/badges.js.
const STORAGE_KEY='line5-study-v1';
let storageAvailable=true;
const freshState=()=>({answered:[],correct:[],wrong:[],attempts:0,right:0,xp:0,days:[],daily:{},badges:[],goal:5,notifiedGoals:[],bestCombo:0,reviewed:[]});
let state=freshState();
try {
  const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
  if(saved && ['answered','correct','wrong','days','badges'].every(k=>Array.isArray(saved[k])) && saved.daily && typeof saved.daily==='object') {
    state={...state,...saved,goal:[5,8].includes(saved.goal)?saved.goal:5,notifiedGoals:Array.isArray(saved.notifiedGoals)?saved.notifiedGoals:[],bestCombo:Number.isFinite(saved.bestCombo)?Math.max(0,saved.bestCombo):0,reviewed:Array.isArray(saved.reviewed)?saved.reviewed:[]};
    // Preserve existing progress and translate the original eight-question mastery into general-chapter mastery.
    if(state.badges.includes('all')&&!state.badges.includes('chapter-general'))state.badges.push('chapter-general');
    restoreLegacyBadges(state.badges);
    state.badges=state.badges.filter(id=>badgeDefs.some(b=>b.id===id));
    migrateQuestionProgress(state);
  }
}catch(e){storageAvailable=false;}
// Map removed duplicate IDs onto their retained representative; retain cumulative XP/attempt history.
function migrateQuestionProgress(record){
  const active=new Set(questions.map(q=>q.id));
  const mapped=ids=>[...new Set((ids||[]).map(id=>questionAliases[id]||id).filter(id=>active.has(id)))];
  for(const key of ['answered','correct','wrong','reviewed'])record[key]=mapped(record[key]);
  record.answered=[...new Set([...record.answered,...record.correct,...record.wrong])];
  // Conservatively keep a merged wrong item for review even if another copy was answered correctly.
  for(const date of Object.keys(record.daily))record.daily[date]=mapped(Array.isArray(record.daily[date])?record.daily[date]:[]);
  return record;
}
function dayKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function today(){return dayKey(new Date());}
function streak(){let count=0;const d=new Date();if(!state.days.includes(dayKey(d)))d.setDate(d.getDate()-1);while(state.days.includes(dayKey(d))){count++;d.setDate(d.getDate()-1);}return count;}
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){storageAvailable=false;toast('저장 공간을 사용할 수 없어 기록은 이번 방문에만 유지됩니다.');}}
function refreshIcons(){if(window.lucide)lucide.createIcons();}
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),3500);}
// A manual popover lives in the browser's top layer, above the modal quiz dialog.
const achievementQueue=[];
let achievementActive=false;
function announceAchievement(title,description,symbol='medal',tier='default') {
  achievementQueue.push({title,description,symbol,tier});
  if(!achievementActive)showNextAchievement();
}
function showNextAchievement(){
  if(!achievementQueue.length){achievementActive=false;return;}
  achievementActive=true;
  const item=achievementQueue.shift();
  const banner=document.getElementById('achievement-banner');
  banner.dataset.tier=item.tier;
  banner.innerHTML=`<span class="achievement-emblem">${icon(item.symbol)}</span><div><small>목표 달성 · LINE 5</small><strong>${item.title}</strong><p>${item.description}</p></div><span class="achievement-timer"></span>`;
  if(typeof banner.showPopover==='function'){if(!banner.matches(':popover-open'))banner.showPopover();}
  else {const dialog=document.querySelector('dialog[open]');(dialog||document.body).append(banner);banner.style.display='flex';}
  banner.classList.remove('leaving');
  banner.classList.add('visible');refreshIcons();
  setTimeout(()=>{
    banner.classList.add('leaving');
    setTimeout(()=>{banner.classList.remove('visible','leaving');if(typeof banner.hidePopover==='function'&&banner.matches(':popover-open'))banner.hidePopover();else banner.style.display='none';showNextAchievement();},220);
  },3000);
}
function raiseCurrentAchievement(){
  const banner=document.getElementById('achievement-banner');
  if(banner.classList.contains('visible') && typeof banner.showPopover==='function'){
    if(banner.matches(':popover-open'))banner.hidePopover();
    banner.showPopover();
  }
}
const routeTitles={home:'학습 홈',study:'단원별 학습',review:'오답 노트',badges:'나의 배지',resources:'학습 자료실',presentation:'발표자료 문제'};
function notice(){return `<aside class="notice">${icon('info')}<p><strong>학습 전에 확인해 주세요</strong><br>첨부 자료에 근거한 학습 문항입니다. 2016년 문제와 발표 자료는 현행 규정과 다를 수 있습니다. 실제 운전 업무에서는 최신 공식 규정과 교육 지침, 관제 지시를 따르세요.</p></aside>`;}
function heading(title,desc,date=false){return `<section class="page-heading"><div><h1>${title}</h1><p>${desc}</p></div>${date?`<span class="date-label">${icon('calendar-days')}${new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(new Date())}</span>`:''}</section>`;}
function chapterCard(c,i){
  const list=chapterQuestions(c.id),done=list.filter(q=>state.correct.includes(q.id)).length,pct=Math.round(done/list.length*100);
  return `<article class="chapter-card"><span class="chapter-icon">${icon(c.icon)}<b class="chapter-line-index" aria-hidden="true">5</b></span><div class="chapter-details"><p class="chapter-kicker">CHAPTER ${String(i+1).padStart(2,'0')} · ${list.length}문제</p><h3>제${i+1}장 ${c.name}<span class="sample-chip">${done}/${list.length}</span></h3><p>${c.description}</p><div class="chapter-progress" aria-label="${c.name} 정답 진도 ${pct}%"><span style="width:${pct}%"></span></div></div><button class="button" data-quiz="chapter:${c.id}">${done===list.length?'다시 풀기':'학습하기'} ${icon('chevron-right')}</button></article>`;
}
function trainArtwork(){return `<figure class="hero-side-photo"><img src="images/line5-train.jpg" alt="보라색 띠를 따라 차량 측면이 이어지는 서울 지하철 5호선 전동차" width="760" height="475"><figcaption><span class="line-pill">5</span> 서울 지하철 5호선</figcaption></figure>`;}
function stationSign(){return `<section class="line5-station-sign" aria-label="5호선 역명판 스타일 학습실"><div class="station-sign-name"><span class="station-sign-five">5</span><div><small>서울 지하철 5호선</small><h2>기관사 학습실</h2></div></div><div class="station-sign-directions"><span>${icon('arrow-left')}방화 방면</span><span>하남검단산 · 마천 방면${icon('arrow-right')}</span></div></section>`;}
function routeBoard(){return `<section class="line5-route-board" aria-label="5호선 주요역과 강동 분기 발췌"><div class="route-board-heading"><strong><span class="route-five">5</span>서울 지하철 5호선</strong><small>방화 ↔ 하남검단산 · 마천</small></div><svg class="metro-route-diagram station-line" viewBox="0 0 600 140" role="img" aria-label="방화, 여의도, 광화문, 왕십리, 강동 주요역을 지나 강동에서 하남검단산과 마천 방면으로 분기하는 발췌 노선도"><path d="M22 68H405M405 68C447 68 443 30 477 30H563M405 68C447 68 443 106 477 106H563" fill="none" stroke="#996cac" stroke-width="6" stroke-linecap="round"/>${[['방화',22],['여의도',112],['광화문',205],['왕십리',300],['강동',405]].map(([name,x])=>`<circle cx="${x}" cy="68" r="7" fill="${name==='강동'?'#996cac':'white'}" stroke="#996cac" stroke-width="4"/><text x="${x}" y="99" text-anchor="middle">${name}</text>`).join('')}<circle cx="563" cy="30" r="7" fill="white" stroke="#996cac" stroke-width="4"/><circle cx="563" cy="106" r="7" fill="white" stroke="#996cac" stroke-width="4"/><text x="520" y="15" text-anchor="middle">하남검단산</text><text x="530" y="134" text-anchor="middle">마천</text></svg><p>주요역 발췌 · 강동 분기 <a href="https://mediahub.seoul.go.kr/archives/2006153" target="_blank" rel="noopener">사진 출처: 서울시 ${icon('external-link')}</a></p></section>`;}
function homePage(){
  const daily=(state.daily[today()]||[]).length,earned=state.badges.length,xp=state.xp%100,level=Math.floor(state.xp/100)+1;
  const week=[],monday=new Date();monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
  for(let i=0;i<7;i++){const d=new Date(monday);d.setDate(d.getDate()+i);week.push(`<span class="week-day ${dayKey(d)===today()?'today':''} ${state.days.includes(dayKey(d))?'done':''}">${['월','화','수','목','금','토','일'][i]}<b>${state.days.includes(dayKey(d))?'✓':'·'}</b></span>`);}
  return `${heading('반가워요, 신입 기관사님 👋','오늘의 작은 배움이 내일의 안전한 운전이 됩니다.',true)}${stationSign()}<div class="dashboard-grid"><div class="main-column"><section class="hero"><span class="hero-route">SEOUL METRO · LINE 5</span><div class="hero-text"><div class="hero-eyebrow"><span class="line-pill">5호선</span></div><h2>안전한 운전의 시작,<br>운전취급규정부터.</h2><p>5개 단원 ${questions.length}문제로 운전취급규정의 기본기를 익혀보세요.</p><button class="button" data-quiz="all">${state.answered.length?'이어서 학습하기':'첫 학습 시작하기'} ${icon('arrow-right')}</button></div>${trainArtwork()}</section>${routeBoard()}${presentationEntry()}<section class="stats-grid" aria-label="학습 요약"><article class="stat-card"><span class="stat-icon">${icon('book-open-check')}</span><div><p>학습한 문제</p><strong>${state.answered.length}<small>/ ${questions.length}문제</small></strong></div></article><article class="stat-card"><span class="stat-icon orange">${icon('flame')}</span><div><p>연속 학습</p><strong>${streak()}<small>일</small></strong></div></article><article class="stat-card"><span class="stat-icon green">${icon('target')}</span><div><p>누적 정답률</p><strong>${state.attempts?Math.round(state.right/state.attempts*100):0}<small>%</small></strong></div></article></section><section><div class="section-heading"><h2>${icon('library-big')}단원별 학습</h2><a href="#study">전체 보기 ${icon('chevron-right')}</a></div><div class="chapter-list">${chapters.map(chapterCard).join('')}</div></section>${notice()}</div><aside class="right-column" aria-label="나의 목표와 성장"><section class="panel level-panel"><div class="level-top"><span class="level-medallion">🌱</span><div><small>MY LEVEL</small><h2>${level===1?'새싹 기관사':'성장하는 기관사'}<span class="level-tag">Lv. ${level}</span></h2></div></div><div class="xp-caption"><span>다음 레벨까지</span><strong>${xp} / 100 XP</strong></div><div class="progress-track"><span style="width:${xp}%"></span></div><p>정답을 하나씩 쌓으며 성장해 보세요.</p></section><section class="panel goal-panel"><div class="panel-heading"><h2>오늘의 학습 목표</h2><span class="tag">DAILY GOAL</span></div><div class="goal-ring" style="--progress:${Math.min(daily/state.goal*100,100)}%"><div class="goal-ring-inner"><strong>${daily}<small> / ${state.goal}</small></strong><span>문제 완료</span></div></div><p class="goal-description">${daily>=state.goal?'<strong>오늘의 목표 달성! 수고했어요.</strong>':`오늘도 <strong>${state.goal}문제</strong>, 가볍게 시작해요.`}</p><button class="button primary full" data-quiz="daily">오늘의 퀴즈 ${icon('arrow-right')}</button><div class="week-days">${week.join('')}</div></section><section class="panel badge-panel"><div class="section-heading"><h2>나의 성장 배지</h2><a href="#badges">${icon('chevron-right')}</a></div>${rankSummary(true)}<div class="badge-preview">${badgeDefs.slice(0,3).map(b=>`<div class="badge-item ${state.badges.includes(b.id)?'earned':'unearned'}" data-tier="${b.tier}"><span class="badge-image">${icon(b.icon)}</span><small>${b.name}</small></div>`).join('')}</div><p>지금까지 <strong>${earned}개</strong>의 배지를 모았어요.</p></section></aside></div>`;
}
function studyPage(){return `${heading('단원별 학습','규정의 기본부터 차근차근, 나만의 속도로 익혀보세요.')}<p class="intro-note">5개 단원 · 총 ${questions.length}문제 · 2016년 운전취급규정 기출 ${training2016Questions.length}문제 추가. 문제만 읽고 풀 수 있으며, 출처는 채점 후 해설에서 확인할 수 있어요.</p>${presentationEntry()}<div class="study-layout">${chapters.map(chapterCard).join('')}</div><section class="content-panel" style="margin:24px 0"><div class="section-heading"><h2>제1장 · 주제별 짧은 학습</h2><span class="sample-chip">기본 다지기</span></div><div class="subtopic-list">${[{id:'purpose',name:'규정의 목적'},{id:'scope',name:'규정의 적용범위'},{id:'terms',name:'기본 용어 이해'}].map(t=>`<article class="subtopic"><div><h3>${t.name}</h3><p>${questions.filter(q=>q.topic===t.id).length}문제 · 출처와 해설 포함</p></div><button class="button" data-quiz="${t.id}">학습하기 ${icon('arrow-right')}</button></article>`).join('')}</div><button class="button primary full" style="margin-top:20px" data-quiz="all">전 단원 ${questions.length}문제 이어 풀기 ${icon('arrow-right')}</button></section>${notice()}`;}
function reviewPage(){const list=questions.filter(q=>state.wrong.includes(q.id));return `${heading('오답 노트','헷갈렸던 규정은 한 번 더. 실수를 배움으로 바꿔보세요.')}${list.length?`<div class="section-heading"><h2>복습할 문제 ${list.length}개</h2><button class="button primary" data-quiz="review">오답 다시 풀기 ${icon('rotate-ccw')}</button></div>${list.map(q=>`<article class="review-item"><span class="sample-chip">${chapterName(q.chapter)}</span><h3>${q.title}</h3><button class="text-button" style="margin-top:12px" data-quiz="question:${q.id}">다시 풀기 →</button></article>`).join('')}`:`<section class="content-panel empty-state"><span class="empty-icon">${icon('notebook-pen')}</span><h2>아직 복습할 문제가 없어요</h2><p>틀린 문제는 이곳에 자동으로 모여요.<br>다시 맞히면 오답 노트에서 사라집니다.</p><button class="button primary" data-quiz="all">문제 풀어보기 ${icon('arrow-right')}</button></section>`}<div style="margin-top:24px">${notice()}</div>`;}
function badgesPage(){return `${heading('나의 성장 배지','브론즈부터 다이아몬드까지, 학습과 함께 성장하는 나의 배지.')}<p class="intro-note">획득한 배지 ${state.badges.length} / ${badgeDefs.length} · 8개 컬렉션 · 달성 즉시 자동 지급</p>${rankSummary()}<section class="rank-ladder" aria-label="정답 승급 단계">${rankTiers.map(t=>`<article data-tier="${t.id}" class="rank-step ${state.badges.includes('rank-'+t.id)?'earned':'locked'} ${getRank().current.id===t.id?'current':''}"><span class="rank-step-emblem">${icon(t.icon)}</span><strong>${t.name}</strong><small>${t.goal}문제 정답</small><span class="rank-step-status">${getRank().current.id===t.id?'현재 등급':state.badges.includes('rank-'+t.id)?'✓ 달성':'도전 중'}</span></article>`).join('')}</section><p class="rank-rule-note">정답 승급·단원 배지는 <strong>서로 다른 문제의 정답 수</strong>로 계산해요. 같은 문제를 반복해도 중복 집계되지 않으며, 획득한 배지는 계속 보관됩니다.</p>${badgeCollection()}<section class="content-panel" style="margin-top:24px"><div class="section-heading"><h2>${icon('sparkles')}성장 규칙</h2></div><p class="intro-note" style="margin:0">최초 풀이 +5 XP, 최초 정답 추가 +10 XP · 100 XP마다 레벨 상승<br>연속 정답은 한 세션 기준으로, 오답 선택 또는 새 세션 시작 시 초기화해요. 최고 기록은 저장됩니다.<br>오답 극복은 오답 노트에 있던 서로 다른 문제를 다시 맞혔을 때 집계해요.</p></section>`;}
function resourcesPage(){return `${heading('학습 자료실','학습의 근거가 되는 원문 자료를 확인하세요.')}<article class="resource-card"><span class="resource-icon">${icon('file-text')}</span><div class="resource-details"><small>운전취급규정 · PDF · 약 1.87 MB</small><h2>서울교통공사 운전취급규정</h2><p>제정 2017.05.31. · 제공본 최종 개정 2024.12.03. (규정 제517호)<br>열차 및 차량 운전취급에 관한 규정 원문</p></div><a class="button" href="materials/operating-regulations.pdf" target="_blank" rel="noopener">원문 열기 ${icon('external-link')}</a></article><article class="resource-card"><span class="resource-icon">${icon('files')}</span><div class="resource-details"><small>2016년 보수교육 · PDF · 약 757 KB</small><h2>2016년 보수교육 필기평가 (1000문제)</h2><p>운전취급규정에서 ${training2016Questions.length}문항 선별 수록<br>3~18쪽 운전취급규정 원문에서 중복 문항 정리 · 다른 과목은 미수록</p></div><a class="button" href="materials/2016-training-questions.pdf" target="_blank" rel="noopener">원문 열기 ${icon('external-link')}</a></article>${notice()}<p class="intro-note" style="margin-top:18px">총 ${questions.length}문제는 제공 자료에 근거해 구성한 학습 문항입니다. 기존 문항은 이전 발표 자료와 2016년 운전취급규정 문제에 근거해 작성했습니다. 자료실 PDF는 2024.12.03. 개정 제공본으로 교체했으나, 문항·정답·해설을 이 제공본 기준으로 개정한 것은 아닙니다. 원문과 기존 학습용 문항을 비교해 중복 22문항을 제외했으며, 같은 주제라도 조건·질문 방향·판단할 정답이 다른 문제는 유지했습니다. 기출은 원문에 표시된 정답을 사용하며 표기·조건 검토가 필요한 항목에는 안내를 표시합니다. <a href="DUPLICATES.md" target="_blank" rel="noopener">중복 정리 내역 보기</a> 현행 공식 규정 대조 및 교육 담당자의 최종 검수는 아직 진행하지 않았습니다.</p>`;}
function render(){const route=location.hash.slice(1)||document.body.dataset.startView||'home';const valid=Object.hasOwn(routeTitles,route)?route:'home';document.querySelectorAll('[data-route]').forEach(a=>{const active=a.dataset.route===valid;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});document.getElementById('current-title').textContent=routeTitles[valid];document.getElementById('wrong-count').textContent=state.wrong.length;document.getElementById('main-content').innerHTML=(!storageAvailable?'<p class="storage-warning">브라우저 저장을 사용할 수 없습니다. 학습 기록은 이번 방문에만 유지됩니다.</p>':'')+({home:homePage,study:studyPage,review:reviewPage,badges:badgesPage,resources:resourcesPage,presentation:presentationPage}[valid])();refreshIcons();}
let session=null;
function startQuiz(mode){
  if(mode.startsWith('presentation:')){startPresentationQuiz(mode.slice('presentation:'.length));return;}
  let list;
  if(mode==='review')list=questions.filter(q=>state.wrong.includes(q.id));
  else if(mode.startsWith('question:'))list=questions.filter(q=>q.id===mode.slice(9));
  else if(mode.startsWith('chapter:'))list=chapterQuestions(mode.slice(8));
  else if(mode==='daily'){const done=state.daily[today()]||[];list=[...questions.filter(q=>!done.includes(q.id)),...questions.filter(q=>done.includes(q.id))].slice(0,state.goal);}
  else if(mode==='all')list=[...questions.filter(q=>!state.answered.includes(q.id)),...questions.filter(q=>state.answered.includes(q.id))];
  else list=questions.filter(q=>q.topic===mode);
  if(!list.length){toast('복습할 문제가 없습니다.');return;}
  session={list,index:0,score:0,selected:null,gained:0,mode,newBadges:[],combo:0};renderQuiz();document.getElementById('quiz-dialog').showModal();raiseCurrentAchievement();
}
function renderQuiz(){
  const q=session.list[session.index],answered=session.selected!==null;
  document.getElementById('quiz-content').innerHTML=`<div class="dialog-heading"><h2 id="quiz-title">${session.bank==='presentation'?'발표자료 · '+(session.mode==='review'?'오답 복습':chapterName(q.chapter)):session.mode==='review'?'오답 복습':chapterName(q.chapter)+' · 학습'}</h2><button class="icon-button" data-close="quiz-dialog" aria-label="퀴즈 닫기">${icon('x')}</button></div><div class="quiz-top-progress"><p class="quiz-meta">${session.index+1} / ${session.list.length} · ${chapterName(q.chapter)}${q.sourceType==='training-2016'?' · 2016년 자료 기준':q.sourceType==='presentation-2026'?` · 발표자료 문제 ${q.number}`:''}</p><div class="progress-track"><span style="width:${(session.index+1)/session.list.length*100}%"></span></div></div>${q.reviewNote?`<p class="question-review-note">${icon('info')}${q.reviewNote}</p>`:''}<h3 class="question-title">${q.title}</h3>${q.scenario?`<p class="presentation-scenario">${q.scenario}</p>`:''}<div class="options">${q.options.map((o,i)=>`<button class="option ${answered?(i===q.answer?'correct':i===session.selected?'incorrect':''):''}" data-answer="${i}" ${answered?'disabled':''}><span class="option-number">${i+1}</span><span>${o}</span>${answered&&i===q.answer?icon('check'):''}</button>`).join('')}</div>${answered?`<div class="answer-explanation" role="status"><strong>${session.selected===q.answer?'정답이에요!':'다시 기억해 볼까요?'} · 정답 ${q.answer+1}번</strong><p>${q.explanation}</p><small>출처: ${q.source}<br>제공 자료 기준의 학습 해설입니다. 실제 운전은 현행 규정을 확인하세요.</small></div>`:''}<div class="quiz-bottom"><span>${session.combo?`⚡ ${session.combo}연속 정답 · `:''}풀이 기록 자동 저장</span>${answered?`<button class="button primary" id="next-question">${session.index+1===session.list.length?'결과 보기':'다음 문제'} ${icon('arrow-right')}</button>`:'<span>알맞은 답을 선택하세요.</span>'}</div>`;refreshIcons();
}
function awardBadges(perfect=false){
  const newly=[];for(const b of badgeDefs)if(badgeProgress(b,perfect).met&&!state.badges.includes(b.id)){state.badges.push(b.id);newly.push(b);}
  return newly;
}
function answerQuestion(index){
  if(!session||session.selected!==null)return;
  if(session.bank==='presentation'){answerPresentationQuestion(index);return;}
  const q=session.list[session.index];if(index<0||index>=q.options.length)return;
  const previousLevel=Math.floor(state.xp/100)+1,key=today(),before=(state.daily[key]||[]).length;
  session.selected=index;const correct=index===q.answer;let gain=0;
  if(!state.answered.includes(q.id)){state.answered.push(q.id);gain+=5;}
  if(correct){
    session.score++;state.right++;session.combo++;state.bestCombo=Math.max(state.bestCombo,session.combo);
    if(!state.correct.includes(q.id)){state.correct.push(q.id);gain+=10;}
    if(state.wrong.includes(q.id)&&!state.reviewed.includes(q.id))state.reviewed.push(q.id);
    state.wrong=state.wrong.filter(id=>id!==q.id);
  } else {
    session.combo=0;
    if(!state.wrong.includes(q.id))state.wrong.push(q.id);
  }
  state.attempts++;state.xp+=gain;session.gained+=gain;
  if(!state.days.includes(key))state.days.push(key);
  if(!Array.isArray(state.daily[key]))state.daily[key]=[];
  if(!state.daily[key].includes(q.id))state.daily[key].push(q.id);
  const perfect=session.index===session.list.length-1&&session.score===session.list.length;
  const newly=awardBadges(perfect);session.newBadges.push(...newly.map(b=>b.name));
  const goalKey=`${key}:${state.goal}`;
  const dailyAchieved=before<state.goal&&state.daily[key].length>=state.goal&&!state.notifiedGoals.includes(goalKey);
  if(dailyAchieved)state.notifiedGoals.push(goalKey);
  persist();renderQuiz();render();
  newly.forEach(b=>announceAchievement(`${b.name} ${b.category==='rank'?'승급':'달성'}!`,b.desc,b.icon,b.tier));
  if(dailyAchieved)announceAchievement('오늘의 학습 목표 달성!',`${state.goal}문제 완료 · 오늘도 안전한 한 걸음`,'target');
  const newLevel=Math.floor(state.xp/100)+1;
  if(newLevel>previousLevel)announceAchievement(`레벨 ${newLevel}로 성장했어요!`,'쌓인 기본기가 더 안전한 운전을 만들어요.','sparkles');
}
function nextQuestion(){
  if(!session||session.selected===null)return;
  if(session.bank==='presentation'){nextPresentationQuestion();return;}
  if(session.index+1<session.list.length){session.index++;session.selected=null;renderQuiz();document.querySelector('.option')?.focus();return;}
  document.getElementById('quiz-content').innerHTML=`<div class="dialog-heading"><h2 id="quiz-title">학습 결과</h2><button class="icon-button" data-close="quiz-dialog" aria-label="결과 닫기">${icon('x')}</button></div><section class="quiz-result"><div class="result-symbol">${session.score===session.list.length?'🎉':'🌱'}</div><h2>오늘도 한 걸음 성장했어요!</h2><p>${session.list.length}문제 중 ${session.score}문제를 맞혔어요.</p><div class="result-stats"><div><strong>${Math.round(session.score/session.list.length*100)}%</strong><small>이번 학습 정답률</small></div><div><strong>+${session.gained}</strong><small>획득 경험치 XP</small></div></div>${session.newBadges.length?`<p style="margin-bottom:20px">🏅 ${session.newBadges.join(', ')} 배지를 획득했어요!</p>`:''}<button class="button primary full" data-close="quiz-dialog">학습실로 돌아가기 ${icon('arrow-right')}</button>${state.wrong.length?'<button class="text-button" id="result-review" style="margin:17px auto 0">오답 노트 확인하기 →</button>':''}</section>`;refreshIcons();
}
document.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.quiz){startQuiz(b.dataset.quiz);return;}
  if(b.dataset.close){document.getElementById(b.dataset.close).close();return;}
  if(b.hasAttribute('data-answer')){answerQuestion(Number(b.dataset.answer));return;}
  switch(b.id){
    case 'next-question':nextQuestion();break;
    case 'settings-button':document.getElementById('daily-goal').value=state.goal;document.getElementById('settings-dialog').showModal();raiseCurrentAchievement();break;
    case 'save-settings':state.goal=Number(document.getElementById('daily-goal').value);persist();render();document.getElementById('settings-dialog').close();toast('오늘의 학습 목표가 저장되었어요.');break;
    case 'reset-progress':if(confirm('학습 기록과 배지를 모두 초기화할까요? 이 작업은 되돌릴 수 없습니다.')){state=freshState();restoreLegacyBadges(state.badges);resetPresentationProgress();persist();render();document.getElementById('settings-dialog').close();toast('학습 기록을 초기화했어요.');}break;
    case 'result-review':document.getElementById('quiz-dialog').close();location.hash='review';break;
  }
});
window.addEventListener('hashchange',()=>{render();window.scrollTo({top:0,behavior:'instant'});});
document.addEventListener('click',event=>{const filter=event.target.closest('[data-badge-filter]');if(filter){badgeFilter=filter.dataset.badgeFilter;render();}});
// Backfill newly introduced badges from existing progress, without flooding returning users with banners.
awardBadges();
if(storageAvailable)persist();
render();
