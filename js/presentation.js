'use strict';
const PRESENTATION_STORAGE_KEY='line5-presentation-v1';
const freshPresentationState=()=>({answered:[],correct:[],wrong:[],attempts:0,right:0,lastResult:null});
let presentationState=freshPresentationState(),presentationStorageAvailable=true;
function normalizePresentationState(saved){
  const clean=freshPresentationState(),valid=new Set(presentationQuestions.map(q=>q.id));
  if(!saved||typeof saved!=='object')return clean;
  for(const key of ['answered','correct','wrong'])clean[key]=[...new Set((Array.isArray(saved[key])?saved[key]:[]).filter(id=>valid.has(id)))];
  clean.answered=[...new Set([...clean.answered,...clean.correct,...clean.wrong])];
  clean.attempts=Number.isFinite(saved.attempts)?Math.max(0,Math.floor(saved.attempts)):0;
  clean.right=Number.isFinite(saved.right)?Math.min(clean.attempts,Math.max(0,Math.floor(saved.right))):0;
  if(saved.lastResult&&Number.isFinite(saved.lastResult.score)&&Number.isFinite(saved.lastResult.total))clean.lastResult={score:saved.lastResult.score,total:saved.lastResult.total};
  return clean;
}
try{presentationState=normalizePresentationState(JSON.parse(localStorage.getItem(PRESENTATION_STORAGE_KEY)));}catch(error){presentationStorageAvailable=false;}
function persistPresentation(){try{localStorage.setItem(PRESENTATION_STORAGE_KEY,JSON.stringify(presentationState));}catch(error){presentationStorageAvailable=false;toast('발표자료 풀이 기록을 저장하지 못했습니다. 이번 방문에서만 유지됩니다.');}}
function resetPresentationProgress(){presentationState=freshPresentationState();persistPresentation();}
function presentationEntry(){return `<section class="presentation-entry" aria-label="발표자료 전용 학습"><div><span class="presentation-tag">발표자료 전용 · 15문항</span><h2>발표에서 배운 내용을 바로 확인해 보세요</h2><p>제1장 총칙부터 제5장 사고의 조치까지 순서대로 풀어요.</p></div><a class="button primary" href="#presentation">운전취급규정 발표자료 문제 ${icon('arrow-right')}</a></section>`;}
function presentationPage(){
  const progress=presentationState.correct.length,wrong=presentationState.wrong.length;
  return `${heading('운전취급규정 발표자료 문제','첨부해 주신 발표자료 문제 15개를 제1장부터 제5장까지 차례대로 풀어보세요.')}
  ${!presentationStorageAvailable?'<p class="storage-warning">발표자료 기록은 이번 방문에서만 유지됩니다.</p>':''}
  <section class="presentation-overview"><div><span class="presentation-tag">별도 문제은행 · 5개 장</span><h2>총칙에서 사고의 조치까지</h2><p>기본 168문항과 별도 기록입니다. 기본 학습의 XP·배지·하루 목표에는 중복 반영하지 않습니다.</p><div class="presentation-actions"><button class="button primary" data-quiz="presentation:all">15문제 순서대로 풀기 ${icon('arrow-right')}</button><button class="button" data-quiz="presentation:review" ${wrong?'':'disabled'}>발표자료 오답 복습 (${wrong}) ${icon('rotate-ccw')}</button></div></div><div class="presentation-score"><strong>${progress}<small> / 15</small></strong><span>서로 다른 문제 정답</span><div class="progress-track"><span style="width:${Math.round(progress/15*100)}%"></span></div></div></section>
  <div class="presentation-summary"><span>풀이한 문제 <b>${presentationState.answered.length} / 15</b></span><span>누적 정답률 <b>${presentationState.attempts?Math.round(presentationState.right/presentationState.attempts*100):0}%</b></span>${presentationState.lastResult?`<span>최근 결과 <b>${presentationState.lastResult.score} / ${presentationState.lastResult.total}</b></span>`:''}</div>
  <section class="presentation-chapters" aria-label="발표자료 제1장부터 제5장 순서"><div class="section-heading"><h2>${icon('list-ordered')}장별 순서대로 학습</h2><span class="sample-chip">2 · 3 · 4 · 3 · 3문항</span></div>${chapters.map((c,i)=>{
    const list=presentationQuestions.filter(q=>q.chapter===c.id),done=list.filter(q=>presentationState.correct.includes(q.id)).length;
    return `<article class="presentation-chapter" data-presentation-chapter="${c.id}"><div class="presentation-chapter-heading"><span class="presentation-chapter-number">${String(i+1).padStart(2,'0')}</span><div><h2>제${i+1}장 ${c.name}</h2><p>${list.length}문항 · 정답 ${done} / ${list.length}</p></div><button class="button" data-quiz="presentation:${c.id}">이 장 풀기 ${icon('chevron-right')}</button></div><ol>${list.map(q=>`<li>${q.title}</li>`).join('')}</ol></article>`;
  }).join('')}</section>
  <p class="intro-note presentation-source-note">사용자 제공 발표자료 문제 이미지의 문항·보기·표기 정답을 기준으로 구성했습니다. 원본 PPT 슬라이드 번호는 제공되지 않아 장·문제 번호로 출처를 표시합니다. 실제 운전은 현행 공식 규정과 관제 지시를 따르세요.</p>
  <div class="presentation-footer"><a class="button" href="#study">기본 단원 학습으로 돌아가기</a><button class="text-button" id="reset-presentation">발표자료 기록만 초기화</button></div>`;
}
function startPresentationQuiz(mode){
  let list;
  if(mode==='all')list=[...presentationQuestions];
  else if(mode==='review')list=presentationQuestions.filter(q=>presentationState.wrong.includes(q.id));
  else list=presentationQuestions.filter(q=>q.chapter===mode);
  if(!list.length){toast('복습할 발표자료 문제가 없습니다.');return;}
  session={list,index:0,score:0,selected:null,gained:0,mode,bank:'presentation',newBadges:[],combo:0};
  renderQuiz();const dialog=document.getElementById('quiz-dialog');if(!dialog.open)dialog.showModal();raiseCurrentAchievement();
}
function answerPresentationQuestion(index){
  const q=session.list[session.index];if(session.selected!==null||!Number.isInteger(index)||index<0||index>=q.options.length)return;
  session.selected=index;presentationState.attempts++;
  if(!presentationState.answered.includes(q.id))presentationState.answered.push(q.id);
  if(index===q.answer){
    session.score++;session.combo++;presentationState.right++;
    if(!presentationState.correct.includes(q.id))presentationState.correct.push(q.id);
    presentationState.wrong=presentationState.wrong.filter(id=>id!==q.id);
  }else{session.combo=0;if(!presentationState.wrong.includes(q.id))presentationState.wrong.push(q.id);}
  persistPresentation();renderQuiz();render();
}
function nextPresentationQuestion(){
  if(session.selected===null)return;
  if(session.index+1<session.list.length){session.index++;session.selected=null;renderQuiz();document.querySelector('.option')?.focus();return;}
  presentationState.lastResult={score:session.score,total:session.list.length};persistPresentation();render();
  const wrong=presentationState.wrong.length;
  document.getElementById('quiz-content').innerHTML=`<div class="dialog-heading"><h2 id="quiz-title">발표자료 학습 결과</h2><button class="icon-button" data-close="quiz-dialog" aria-label="결과 닫기">${icon('x')}</button></div><section class="quiz-result"><div class="result-symbol">${session.score===session.list.length?'🎉':'📖'}</div><h2>발표자료 문제 풀이를 마쳤어요</h2><p>${session.list.length}문제 중 ${session.score}문제를 맞혔어요.</p><div class="result-stats"><div><strong>${Math.round(session.score/session.list.length*100)}%</strong><small>이번 발표자료 정답률</small></div><div><strong>${presentationState.correct.length}/15</strong><small>발표자료 고유 정답</small></div></div><button class="button primary full" data-close="quiz-dialog">학습 화면으로 돌아가기</button>${wrong?`<button class="text-button" style="margin-top:16px" data-quiz="presentation:review">발표자료 오답 ${wrong}개 복습하기 →</button>`:''}</section>`;refreshIcons();
}
document.addEventListener('click',event=>{
  if(event.target.closest('#reset-presentation')&&confirm('발표자료 풀이 기록만 초기화할까요? 기본 학습 기록과 배지는 유지됩니다.')){resetPresentationProgress();render();toast('발표자료 기록을 초기화했어요.');}
});
