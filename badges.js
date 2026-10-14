'use strict';
// Inspired by RailStudy's progression, correct-answer, combo, subject, accuracy,
// level and consistency collections. Stable rank milestones preserve previously earned badges.
const rankTiers=[
  {id:'bronze',name:'브론즈',goal:3,icon:'medal'},
  {id:'silver',name:'실버',goal:10,icon:'medal'},
  {id:'gold',name:'골드',goal:20,icon:'award'},
  {id:'platinum',name:'플래티넘',goal:30,icon:'gem'},
  {id:'diamond',name:'다이아몬드',goal:40,icon:'crown'}
];
const badgeCategories=[
  {id:'rank',name:'정답 승급',icon:'medal',desc:'서로 다른 문제를 맞힐수록 배지가 성장해요.'},
  {id:'journey',name:'학습 여정',icon:'footprints',desc:'첫 시작부터 전 단원 정복까지.'},
  {id:'combo',name:'연속 정답',icon:'zap',desc:'한 세션에서 끊기지 않는 집중력을 보여주세요.'},
  {id:'chapter',name:'단원별 성장',icon:'book-open-check',desc:'단원마다 입문 → 성장 → 숙달 배지를 모아요.'},
  {id:'consistency',name:'꾸준한 학습',icon:'calendar-check',desc:'매일 조금씩 쌓는 안전한 습관.'},
  {id:'accuracy',name:'정확한 학습',icon:'target',desc:'충분한 풀이 횟수와 높은 정답률을 함께 달성해요.'},
  {id:'level',name:'기관사 레벨',icon:'train-front',desc:'경험치를 쌓으며 기관사로 성장하세요.'},
  {id:'review',name:'오답 극복',icon:'notebook-pen',desc:'틀린 문제를 다시 맞혀 진짜 내 것으로 만들어요.'}
];
const previousChapterGoals={general:13,operation:43,block:38,signal:28,incident:18};
const badgeDefs=[
  ...rankTiers.map(t=>({id:`rank-${t.id}`,name:t.name,desc:`서로 다른 ${t.goal}문제 정답`,icon:t.icon,tier:t.id,category:'rank',metric:'correct',goal:t.goal})),
  {id:'first',name:'처음 한 걸음',desc:'첫 번째 문제 풀이 완료',icon:'flag',tier:'bronze',category:'journey',metric:'solved',goal:1},
  ...[10,20,40].map((n,i)=>({id:`solved-${n}`,name:['꾸준한 발걸음','학습 탐험가','40문제 완주'][i],desc:`서로 다른 ${n}문제 풀이`,icon:['footprints','compass','route'][i],tier:['silver','gold','platinum'][i],category:'journey',metric:'solved',goal:n})),
  {id:'perfect',name:'정확한 한 걸음',desc:'한 세션의 모든 문제 정답',icon:'star',tier:'gold',category:'journey',metric:'perfect',goal:1},
  {id:'all-v2',name:'40문제 마스터',desc:'서로 다른 40문제 모두 정답 달성',icon:'shield-check',tier:'diamond',category:'journey',metric:'correct',goal:40},
  {id:'all-v4',name:'140문제 마스터',desc:'서로 다른 140문제 정답 달성',icon:'crown',tier:'diamond',category:'journey',metric:'correct',goal:140},
  {id:'all-v6',name:'전 단원 마스터',desc:`전체 ${questions.length}문제 모두 정답 달성`,icon:'crown',tier:'diamond',category:'journey',metric:'correct',goal:questions.length},
  ...[3,5,10,20,30].map((n,i)=>({id:`combo-${n}`,name:['집중의 시작','좋은 흐름','콤보 마스터','흔들림 없는 집중','완벽한 흐름'][i],desc:`한 세션 ${n}연속 정답`,icon:'zap',tier:['bronze','silver','gold','platinum','diamond'][i],category:'combo',metric:'combo',goal:n})),
  ...chapters.flatMap(c=>[
    {id:`chapter-${c.id}-bronze`,name:`${c.name} 입문`,desc:`${c.name} 서로 다른 3문제 정답`,icon:c.icon,tier:'bronze',category:'chapter',metric:'chapter',chapter:c.id,goal:3},
    {id:`chapter-${c.id}-silver`,name:`${c.name} 성장`,desc:`${c.name} 서로 다른 5문제 정답`,icon:c.icon,tier:'silver',category:'chapter',metric:'chapter',chapter:c.id,goal:5},
    {id:`chapter-${c.id}`,name:`${c.name} 기본 숙달`,desc:`${c.name} 서로 다른 8문제 정답`,icon:c.icon,tier:'gold',category:'chapter',metric:'chapter',chapter:c.id,goal:8},
    {id:`chapter-${c.id}-full`,name:`${c.name} 확장 숙달`,desc:`${c.name} 서로 다른 ${previousChapterGoals[c.id]}문제 정답`,icon:c.icon,tier:'platinum',category:'chapter',metric:'chapter',chapter:c.id,goal:previousChapterGoals[c.id]},
    {id:`chapter-${c.id}-complete-v6`,name:`${c.name} 완전 숙달`,desc:`${c.name} ${questions.filter(q=>q.chapter===c.id).length}문제 모두 정답`,icon:c.icon,tier:'diamond',category:'chapter',metric:'chapter',chapter:c.id,goal:questions.filter(q=>q.chapter===c.id).length}
  ]),
  ...[3,7,14,30].map((n,i)=>({id:i===0?'streak':`days-${n}`,name:['꾸준한 기관사','일주일 동행','2주 챌린저','한 달의 습관'][i],desc:`${n}일 연속 학습`,icon:'calendar-check',tier:['bronze','silver','gold','platinum'][i],category:'consistency',metric:'days',goal:n})),
  ...[{n:10,rate:80,name:'정확한 시작',tier:'bronze'},{n:20,rate:90,name:'정밀한 판단',tier:'silver'},{n:30,rate:95,name:'안전한 명사수',tier:'gold'}].map(t=>({id:`accuracy-${t.rate}`,name:t.name,desc:`${t.n}회 이상 풀이 · 누적 정답률 ${t.rate}% 이상`,icon:'target',tier:t.tier,category:'accuracy',metric:'accuracy',goal:t.rate,minAttempts:t.n})),
  ...[2,4,7].map((n,i)=>({id:`level-${n}`,name:['루키 기관사','성장하는 기관사','기본기 전문가'][i],desc:`레벨 ${n} 달성`,icon:'train-front',tier:['bronze','silver','gold'][i],category:'level',metric:'level',goal:n})),
  ...[1,3,8].map((n,i)=>({id:`review-${n}`,name:['다시 한 걸음','오답 해결사','오답 정복자'][i],desc:`서로 다른 오답 ${n}문제 정답 복습`,icon:'notebook-pen',tier:['bronze','silver','gold'][i],category:'review',metric:'review',goal:n}))
];
// Retired completion badges remain visible only to learners who already earned them.
const legacyChapterGoals={general:16,operation:65,block:49,signal:40,incident:20};
const legacyBadgeDefs=[
  {id:'all-v5',name:'190문제 마스터 · 이전',desc:'이전 190문항 버전에서 획득한 전 단원 마스터',icon:'crown',tier:'diamond',category:'journey',metric:'archive',goal:190},
  ...chapters.map(c=>({id:`chapter-${c.id}-complete-v5`,name:`${c.name} 완전 숙달 · 이전`,desc:`이전 ${legacyChapterGoals[c.id]}문항 버전에서 획득한 단원 마스터`,icon:c.icon,tier:'diamond',category:'chapter',metric:'archive',goal:legacyChapterGoals[c.id]}))
];
function restoreLegacyBadges(ids){
  for(let i=badgeDefs.length-1;i>=0;i--)if(badgeDefs[i].metric==='archive')badgeDefs.splice(i,1);
  for(const b of legacyBadgeDefs)if(ids.includes(b.id)&&!badgeDefs.some(x=>x.id===b.id))badgeDefs.push(b);
}
function uniqueCorrectCount(){return questions.filter(q=>state.correct.includes(q.id)).length;}
function badgeProgress(b,perfect=false){
  let value=0,met=false,label='';
  switch(b.metric){
    case 'archive':return {value:b.goal,met:false,percent:100,label:'이전 버전 획득 기록'};
    case 'correct':value=uniqueCorrectCount();break;
    case 'solved':value=questions.filter(q=>state.answered.includes(q.id)).length;break;
    case 'chapter':value=chapterQuestions(b.chapter).filter(q=>state.correct.includes(q.id)).length;break;
    case 'combo':value=state.bestCombo||0;break;
    case 'days':value=streak();break;
    case 'level':value=Math.floor(state.xp/100)+1;break;
    case 'review':value=(state.reviewed||[]).filter(id=>questions.some(q=>q.id===id)).length;break;
    case 'perfect':value=(perfect||state.badges.includes(b.id))?1:0;label=value?'세션 전부 정답':'세션 전부 정답 도전';break;
    case 'accuracy':{
      const rate=state.attempts?state.right/state.attempts*100:0;
      met=state.attempts>=b.minAttempts&&rate>=b.goal;
      return {value:rate,met,percent:Math.round(Math.min(state.attempts/b.minAttempts,rate/b.goal,1)*100),label:`${state.attempts}/${b.minAttempts}회 · 정답률 ${Math.floor(rate)}%`};
    }
  }
  met=value>=b.goal;
  return {value,met,percent:Math.min(100,Math.round(value/b.goal*100)),label:label||`${Math.min(value,b.goal)} / ${b.goal}${b.metric==='days'?'일':b.metric==='level'?' 레벨':'문제'}`};
}
function getRank(){
  const count=uniqueCorrectCount();
  const current=[...rankTiers].reverse().find(t=>count>=t.goal)||{id:'starter',name:'승급 준비',goal:0,icon:'sprout'};
  const next=rankTiers.find(t=>count<t.goal)||null;
  return {count,current,next,percent:next?Math.round(count/next.goal*100):100};
}
function rankSummary(compact=false){
  const {count,current,next,percent}=getRank();
  return `<section class="rank-summary ${compact?'compact':''}" data-tier="${current.id}" aria-label="정답 승급 현황"><span class="rank-emblem">${icon(current.icon)}</span><div class="rank-summary-details"><small>CORRECT ANSWER RANK</small><h2>${current.name}<span>정답 승급 배지</span></h2><p>${next?`${next.name}까지 <strong>${next.goal-count}문제</strong> 남았어요.`:'최고 등급 달성! 다이아몬드 기관사예요.'}</p><div class="rank-progress-caption"><span>서로 다른 문제 정답 ${count}개</span><strong>${next?count:current.goal} / ${next?next.goal:current.goal}</strong></div><div class="progress-track"><span style="width:${percent}%"></span></div></div></section>`;
}
function badgeCard(b){
  const earned=state.badges.includes(b.id),p=badgeProgress(b);
  return `<article class="badge-card ${earned?'earned':'unearned'}" data-tier="${b.tier}"><span class="tier-label">${rankTiers.find(t=>t.id===b.tier)?.name||b.tier}</span><span class="badge-image">${icon(b.icon)}</span><h3>${b.name}</h3><p>${b.desc}</p><div class="badge-progress-caption">${earned?'✓ 획득 완료':p.label}</div><div class="progress-track" aria-label="${b.name} 달성 ${earned?100:p.percent}%"><span style="width:${earned?100:p.percent}%"></span></div></article>`;
}
function badgeCollection(){
  return `<div class="badge-collection"><div class="badge-filters" role="group" aria-label="배지 표시 필터">${[{id:'all',name:'전체'},{id:'earned',name:'획득'},{id:'locked',name:'도전 중'}].map(f=>`<button class="badge-filter ${badgeFilter===f.id?'active':''}" data-badge-filter="${f.id}" aria-pressed="${badgeFilter===f.id}">${f.name} <span>${f.id==='all'?badgeDefs.length:f.id==='earned'?state.badges.length:badgeDefs.length-state.badges.length}</span></button>`).join('')}</div>${badgeCategories.map(c=>{
    const list=badgeDefs.filter(b=>b.category===c.id&&(badgeFilter==='all'||(badgeFilter==='earned'?state.badges.includes(b.id):!state.badges.includes(b.id))));
    return list.length?`<section class="badge-category"><div class="section-heading"><h2>${icon(c.icon)}${c.name}<span class="sample-chip">${badgeDefs.filter(b=>b.category===c.id&&state.badges.includes(b.id)).length} / ${badgeDefs.filter(b=>b.category===c.id).length}</span></h2></div><p class="badge-category-description">${c.desc}</p><div class="badges-grid">${list.map(badgeCard).join('')}</div></section>`:'';
  }).join('')}${(badgeFilter==='earned'&&!state.badges.length)||(badgeFilter==='locked'&&state.badges.length===badgeDefs.length)?'<section class="content-panel empty-state"><h2>아직 표시할 배지가 없어요</h2><p>학습을 진행하며 나만의 배지를 모아보세요.</p><button class="button primary" data-quiz="daily">오늘의 퀴즈 시작하기</button></section>':''}</div>`;
}
let badgeFilter='all';
