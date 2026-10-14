'use strict';
const exportFiles=[
  'index.html','badges.html','export.html','deployment.html','manifest.webmanifest','sw.js','README.md','DEPLOYMENT.md','DUPLICATES.md',
  'css/style.css','css/updates.css','css/badges.css','css/pwa.css','css/line5.css','css/deployment.css',
  'js/vendor/lucide.min.js','js/questions.js','js/questions-2016.js','js/badges.js','js/app.js','js/pwa.js','js/export.js',
  'images/line5-train.jpg','images/icon-192.png','images/icon-512.png',
  'materials/operating-regulations.pdf','materials/2016-training-questions.pdf'
];
const fallbackWorkflow='name: Deploy LINE 5 to GitHub Pages\non:\n  push:\n    branches: [main]\n  workflow_dispatch:\npermissions:\n  contents: read\n  pages: write\n  id-token: write\nconcurrency:\n  group: pages\n  cancel-in-progress: false\njobs:\n  deploy:\n    environment: github-pages\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/configure-pages@v5\n      - name: Prepare static site\n        run: |\n          mkdir -p public\n          cp index.html badges.html export.html deployment.html manifest.webmanifest sw.js README.md DEPLOYMENT.md DUPLICATES.md .nojekyll public/\n          cp -R css js images materials public/\n      - uses: actions/upload-pages-artifact@v3\n        with:\n          path: public\n      - uses: actions/deploy-pages@v4\n';
async function buildProjectZip(onProgress=()=>{}){
  if(!window.JSZip)throw new Error('압축 라이브러리를 불러오지 못했습니다. 인터넷 연결 후 다시 시도하세요.');
  const zip=new JSZip();let done=0;
  // Bound concurrent requests so preview and small static hosts are not flooded.
  for(let offset=0;offset<exportFiles.length;offset+=4){
    await Promise.all(exportFiles.slice(offset,offset+4).map(async path=>{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
      try{
        const response=await fetch(path,{cache:'no-store',signal:controller.signal});
        if(!response.ok)throw new Error(`${path} 파일을 가져오지 못했습니다 (${response.status}).`);
        zip.file(path,await response.arrayBuffer());onProgress(++done,exportFiles.length);
      }catch(error){if(error.name==='AbortError')throw new Error(`${path} 파일 요청이 시간 초과되었습니다. 다시 시도해 주세요.`);throw error;}
      finally{clearTimeout(timer);}
    }));
  }
  // Generate this public deployment descriptor locally: hidden repository paths need not be exposed by hosting.
  zip.file('.nojekyll','');zip.file('.github/workflows/deploy-pages.yml',fallbackWorkflow);
  return zip;
}
document.getElementById('download-project').addEventListener('click',async()=>{
  const button=document.getElementById('download-project'),status=document.getElementById('export-status');button.disabled=true;
  try{
    status.textContent='파일을 준비하고 있어요…';
    const zip=await buildProjectZip((done,total)=>{status.textContent=`파일 준비 ${done} / ${total}`;});
    status.textContent='브라우저에서 압축 파일을 생성하고 있어요…';
    const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='line5-study-github.zip';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
    status.textContent='ZIP 다운로드를 시작했습니다. 압축 해제 후 GitHub 저장소에 업로드해 주세요.';
  }catch(error){status.textContent=`다운로드 실패: ${error.message}`;}
  finally{button.disabled=false;}
});
