# LINE 5 · 기관사 학습실 v0.6

## 프로젝트 목표
서울 지하철 5호선 보라색 테마의 신입기관사 운전취급규정 학습용 정적 웹앱입니다. 참고 플랫폼 https://mari-100-an.github.io/RailStudy/ 의 퀴즈·성장 배지 개념을 참고한 자체 UI입니다. 공식 서울교통공사 서비스가 아니며 실제 운전 지침을 대체하지 않습니다.

## 현재 완료 기능
- 반응형 홈, PC 사이드바, 모바일 하단 내비게이션
- 5호선 원형 숫자, 역명판형 학습실, 방화/하남검단산·마천 방향 안내, 강동 분기 주요역 발췌 노선도
- 측면 중심 열차 사진 크롭, 요청한 사진 아래 영문 색상 노선 문구와 이전 슬로건 삭제
- **중복 22문항 제거: 190 → 168문항**. 기존 학습용 39 + 기출 129
- 총칙 15 / 운전 56 / 폐색 44 / 신호 35 / 사고의 조치 18
- 본문·보기·정답을 비교하여 동일 판단 반복을 통합. 조건·질문 방향·정답이 다른 문항은 유지. 상세 목록: `DUPLICATES.md`
- 단원/전체/오늘의 퀴즈, 총칙 목적·적용범위·용어 짧은 학습, 즉시 채점·해설·출처·결과
- 원문 번호·연도에 기대지 않는 문제 본문. 기출은 2016년 자료 기준 표시
- 오답 자동 수집·정답 복습 후 제거, 고유 오답 극복 기록
- 최초 풀이 +5 XP / 최초 정답 추가 +10 XP / 반복 중복 보상 없음 / 100 XP마다 레벨 상승
- **현재 도전 배지 56개 / 8개 컬렉션**. 기존 190문항 및 단원 완전 숙달 배지 6종은 이미 획득한 사람에게만 이전 기록으로 추가 표시(따라서 표시 총수는 사용자별로 달라질 수 있음)
- 브론즈 3 → 실버 10 → 골드 20 → 플래티넘 30 → 다이아몬드 40 고유 정답 승급
- 기존 40/140문제 마스터 조건 보존. 현재 168문항 전 단원 마스터 및 단원 완전 숙달은 새 v6 ID
- 등급·다음 목표·진행률, 금속 색상, 전체/획득/도전 중 배지 필터
- 하루 목표 5/8문제, 주간 기록, 연속 학습일, 누적 시도 정답률
- 목표·배지·레벨 달성 즉시 top-layer 배너, 약 3초 자동 퇴장, 순차 알림
- localStorage 진도·XP·배지 저장, 중복 삭제 ID를 대표 ID로 이전
- PDF 자료실, 브라우저에서 공개 배포 ZIP 생성(계정 연결/토큰/서버 다운로드 엔드포인트 없음)
- **상세 GitHub 안내**: 계정/이메일 인증/보안 설정 → 저장소 생성 → ZIP 압축 해제 → 폴더 구조를 유지한 파일 업로드 → commit → Pages main/root 설정 → 실제 주소 확인 → PWA 설치 → 수정 재배포·오류 해결
- 읽기 편한 `deployment.html` 및 상세 `DEPLOYMENT.md`, GitHub Desktop/Actions 대안
- GitHub Pages용 상대 경로, `.nojekyll`, Actions workflow
- PWA manifest, 192/512 PNG 아이콘, 설치 안내 및 지원 브라우저 설치 prompt
- 서비스 워커 온라인 우선/오프라인 fallback, 핵심 앱 사전 캐시, 로컬 Lucide

## 기능 진입 URI / 경로와 매개변수
- `/` 또는 `/index.html#home`: 홈
- `/index.html#study`: 단원 학습
- `/index.html#review`: 오답 노트
- `/index.html#badges`, `/badges.html`: 배지
- `/index.html#resources`: PDF·배포 도구·중복 정리 링크
- `/export.html`: 배포 ZIP 생성
- `/deployment.html`: GitHub 상세 안내. `#account`, `#download`, `#repository`, `#upload`, `#pages`, `#install`, `#update`, `#troubleshoot` 단계 바로가기
- `/DEPLOYMENT.md`: 전체 배포 문서
- `/DUPLICATES.md`: 중복 22문항 정리 내역
- `/materials/operating-regulations.pdf`, `/materials/2016-training-questions.pdf`: 제공 원문
- `/manifest.webmanifest`, `/sw.js`: 설치/캐시 설정
- `/tests/smoke.html`: 기능 검사(기록 잠시 교체 후 이전 저장값 복원)
- `/tests/verify-source.html`: 원문 표기 정답 대조
- `/tests/deploy.html`: ZIP/PWA 검사
- `/tests/audit.html`: 문자열 유사도로 중복 후보 탐색(자동 삭제 기준 아님)
- 퀴즈/설정/설치 안내는 dialog이며 별도 URL 매개변수 없음

GitHub 프로젝트 사이트에서는 `https://사용자명.github.io/저장소명/` 아래에 위치합니다. 파일/manifest/SW 모두 상대 경로를 사용합니다.

## 문항 출처 / 중복 삭제 범위
1. `서울교통공사 조별발표(운전취급규정).pdf`: https://www.genspark.ai/api/files/s/HDRF7snB
   - 24쪽 전체 텍스트 확인, 기존 학습용 문항은 주로 5~22쪽 근거
2. `2016년보수교육필기평가(1000문제)-1.pdf`: https://www.genspark.ai/api/files/s/X7Y8T1My
   - 99쪽 중 운전취급규정 1~150번(3~18쪽)을 전사·정답 대조
   - 원문 150개 전사 기록은 출처 검증용으로 유지. **실제 퀴즈는 기출 129개만 제공**
   - 원문 자체 반복 18문항, 기존 문항과 중복되는 기출 3문항, 기존 학습용 폐색 정의 반복 1문항을 제외: 총 22
   - 기존 학습용 40개에서 `block-1` 제외 → 39개
   - 원문 44·111·121·143번의 표기·조건 검토 안내 유지
   - 다른 과목 850문항은 미수록. 1000문항 전체를 수록한 앱이 아님

띄어쓰기·단위·문맥을 정리했으나 원문 정답 인덱스는 바꾸지 않았습니다. 추가 해설은 원문 정답 보기와 자료 기준 안내이며 현행 조문 해석을 임의로 생성하지 않습니다. **2016년 표기 정답 일치는 현행 규정 검수가 아닙니다.** 정식 교육 전 담당 교육자의 현행 공식 규정 대조가 필요합니다.

## 데이터 모델과 저장 서비스
서버·Table API·D1·로그인은 사용하지 않습니다.
- `js/questions.js`: 초기 학습용 40개 전사/단원 메타데이터. 실행 시 중복 1개 제외
- `js/questions-2016.js`:
  - `training2016Rows`: `[원문번호, PDF쪽, 단원, 제목, 보기, 1-based 정답]` 150개 출처 기록
  - `training2016SourceQuestions`: 원문 정답 검증용 150개 객체
  - `questionAliases`: 삭제 ID → 유지 ID, 명시적 22개 매핑
  - `training2016Questions`: 중복 제외한 기출 129개
  - `questions`: **활성 168개**. 모든 퀴즈/통계는 이 배열 사용
  - 문항 모델 `{id,chapter,topic,title,options,answer,explanation,source}` (answer는 0-based)
  - 기출 추가 필드 `sourceType`, `sourceNumber`, `sourcePage`, `reviewNote`; 통합 대표에는 `mergedFrom`
- 단원 ID: `general`, `operation`, `block`, `signal`, `incident`
- `js/badges.js`: 현재 배지 모델, 이전 달성 배지 보존, 진행률
- `js/app.js`: 세션·채점·목표·배너·진도 이전
- localStorage 키 `line5-study-v1`:
  - `answered`, `correct`, `wrong`, `reviewed`: 고유 문항 ID
  - `attempts`, `right`, `xp`: 누적 시도·정답 시도·XP
  - `days`, `daily`: 로컬 날짜별 기록
  - `badges`, `goal`, `notifiedGoals`, `bestCombo`: 배지·목표·알림·최고 연속 정답
- 초기 로드 시 삭제 ID를 대표 ID로 변환, 활성 ID만 유지하고 중복 제거. 따라서 고유 진도/하루 문항 수는 줄어들 수 있음. 누적 XP·시도·레벨은 보존
- 대표 문항의 정답 기록과 오답 기록이 함께 있으면 복습 누락을 피하려고 오답을 남김
- 이미 얻은 배지는 회수하지 않음. 190문항/이전 단원 완전 숙달은 획득자에게만 `archive` 배지 표시, 새 지급 없음
- 연속 정답은 세션 단위, 날짜는 로컬 시간. 기기 간 동기화 없음
- 데이터 삭제 시 기록 소실. 미리보기 → GitHub처럼 origin이 바뀌면 자동 이전되지 않음. 같은 github.io origin의 다른 앱과 localStorage를 공유할 수 있음

## 파일 / 실행 구조
```text
index.html / badges.html / export.html / deployment.html
css/style.css / updates.css / badges.css / pwa.css / line5.css / deployment.css
js/questions.js / questions-2016.js / badges.js / app.js / pwa.js / export.js
js/vendor/lucide.min.js
images/line5-train.jpg / icon-192.png / icon-512.png
materials/*.pdf
manifest.webmanifest / sw.js / .nojekyll
.github/workflows/deploy-pages.yml
README.md / DEPLOYMENT.md / DUPLICATES.md
tests/*.html / *.js (개발 전용, 배포 ZIP 제외)
```
빌드 단계 없이 정적 호스팅으로 실행. `file://`에서 SW/설치는 동작하지 않습니다. JSZip CDN은 ZIP 생성에만 사용하고 학습에서는 로드하지 않습니다. 외부 폰트 불가 시 시스템 폰트로 표시합니다.

## PWA / ZIP
- manifest: `scope: ./`, `start_url: ./index.html#home`, standalone
- 현재 SW 캐시 `line5-v0.6.0`. 진행 중 퀴즈 보호를 위해 강제 skipWaiting하지 않음. 앱/탭을 모두 닫고 다시 열어 새 버전 활성화
- 첫 온라인 접속에서 핵심 앱 캐시 완료 필요, PDF는 온라인으로 열어본 뒤 캐시. 206/Range 응답은 저장하지 않음
- 배포 ZIP에 앱·PDF·GitHub 안내 페이지·중복 목록·문서·Actions/nojekyll 포함. tests/.meta/.tables 제외
- JSZip으로 브라우저에서 생성하고 다운로드. GitHub 로그인/업로드/Pages 설정을 대신 수행하지 않음

## 공개 URL / 배포 상태
- **운영 URL: 아직 없음. 실제 사용자 GitHub 저장소 생성·파일 업로드·배포는 미실행**
- 예상 주소 `https://YOUR_USERNAME.github.io/line5-study/` (예시)
- API 엔드포인트 없음, 외부 인증 API 없음
- 참고 플랫폼 https://mari-100-an.github.io/RailStudy/
- GitHub 절차는 `deployment.html` 또는 `DEPLOYMENT.md` 참조
- GitHub Pages와 플랫폼 Publish/Hosted는 다른 대상. 기존 Hosted 도메인도 파일 수정만으로 갱신되지 않음
- 실제 HTTPS 공개 후 설치/오프라인 동작 최종 검증 필요

## 검증
- 원문 표기 정답 150개와 전사 기록 및 활성 기출 정답 대조
- 전체 활성 168개 ID/선택지 유효성, 삭제 22개 미출제, 단원 개수
- 진도 대표 ID 이전·중복 합산, 기존 XP/배지 보존, v6 새 마스터
- 전체 퀴즈·복습·저장·승급·달성 배너·설치 안내 기능 검사
- 실제 ZIP 생성·PDF 바이너리·안내 페이지 포함·workflow/manifest·아이콘·모의 오프라인 fallback
- PC/모바일 홈 및 안내 페이지의 실제 렌더링 확인
- v0.6 실행 결과: 기능 검사 81개 PASS, 원문 150개/활성 기출 129개 정답 일치, ZIP/PWA 검사 20개 PASS
- 홈 및 GitHub 안내 페이지의 PC(1280px)·모바일(390px) 실제 스크린샷에서 문항 수·문구 삭제·레이아웃 확인 완료
- 실제 사용자 GitHub 공개 URL에서의 검증은 아직 수행하지 않음

## 라이선스 / 자료 공개 주의
- 사진 출처 https://mediahub.seoul.go.kr/archives/2006153 (사선 사진을 측면 위주 크롭)
- **사진/PDF 출처 표기는 재사용 허가를 보장하지 않음. 공개 권한 확인 필요**
- 숫자 5 아이콘은 Placehold.co PNG, 로컬 Lucide 0.468.0은 MIT 헤더 포함

## 미구현 / 다음 단계
1. 모든 168문항의 현행 규정 대조 및 교육 담당자 검수
2. PDF·사진의 공개 이용허락 확인 또는 권리 확인된 자료로 교체
3. 본인 GitHub 저장소에 업로드·Pages 설정, 실제 공개 주소에서 설치/오프라인 최종 확인
4. 다른 과목 850문항 추가 범위 결정
5. 로그인·기기 동기화·관리자 편집·리더보드는 별도 설계 필요
6. 제한시간 모의고사·검색·무작위 출제·진도 백업/복원은 미구현

추가 문항은 안정된 ID·출처·단원·정답 인덱스를 지정하고, 문항 수 변경 시 기존 마스터 배지 조건의 의미를 보존하기 위해 새 버전 ID를 사용하세요.
