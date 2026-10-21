'use strict';
let deferredInstallPrompt=null;
const appBase=new URL('../',document.currentScript.src);
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;});
window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;if(typeof toast==='function')toast('LINE 5 학습실이 홈 화면에 설치되었어요.');});
window.addEventListener('load',()=>{
  if('serviceWorker' in navigator && window.isSecureContext && location.protocol!=='file:'){
    navigator.serviceWorker.register(new URL('sw.js',appBase).href,{scope:appBase.href}).catch(error=>console.info('PWA: 이 미리보기 환경에서는 서비스 워커를 사용할 수 없습니다.',error.message));
  }
});
document.addEventListener('click',async event=>{
  const button=event.target.closest('#install-app-button');
  if(button){
    if(deferredInstallPrompt){const prompt=deferredInstallPrompt;deferredInstallPrompt=null;await prompt.prompt();await prompt.userChoice;}
    else {document.getElementById('install-dialog').showModal();if(typeof raiseCurrentAchievement==='function')raiseCurrentAchievement();}
  }
});
