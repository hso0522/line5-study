# GitHub 처음 설정부터 LINE 5 웹앱 공개까지

**PC의 Chrome/Edge와 GitHub 브라우저 화면을 기준으로 안내합니다.** 무료 Public 저장소와 GitHub Pages를 사용하며 서버·API 키·유료 도메인이 필요하지 않습니다. 메뉴 명칭은 GitHub 화면 변경이나 언어 설정에 따라 조금 다를 수 있습니다.

실제 GitHub 계정 연결·저장소 생성·공개 배포는 아직 하지 않았습니다. 비밀번호·토큰·인증코드를 채팅에 보내지 마세요. 이 안내를 따라 본인 계정에서 진행합니다. 웹에서 읽기 편한 안내: `deployment.html`.

## 0. 공개 전 준비
- 제공 PDF·열차 사진을 인터넷에 공개할 권한을 먼저 확인하세요. 출처 표기만으로 허가가 생기는 것은 아닙니다.
- Public 저장소와 Pages 주소는 누구나 볼 수 있습니다. 개인정보·비밀번호·기관 내부 비공개 자료를 넣지 마세요.
- 이 앱은 비공식 학습용이며 2016년 문제의 정답이 현행 규정과 같음을 보증하지 않습니다.

## 1. GitHub 계정 만들기·초기 설정
1. https://github.com 을 엽니다.
2. 계정이 없으면 **Sign up** → 이메일·비밀번호·사용자명 입력 → 안내에 따라 가입합니다. 계정이 있으면 **Sign in**.
3. 가입 메일의 링크/코드로 이메일 인증을 완료합니다.
4. **사용자명(username)**을 기록합니다. 예: `rail-learner`. 이 이름이 사이트 주소의 앞부분이 됩니다. 표시 이름과 사용자명은 다릅니다.
5. 우측 프로필 사진 → **Settings → Password and authentication**에서 2단계 인증/패스키 설정을 권장합니다. 복구코드는 안전한 곳에 보관합니다. Pages를 위한 별도 API 토큰은 필요 없습니다.

## 2. 웹앱 ZIP 다운로드·압축 해제
1. 이 학습실에서 **학습 자료실 → GitHub 배포 ZIP 다운로드**를 선택하거나 `export.html`을 엽니다.
2. **GitHub 배포 ZIP 다운로드** 버튼을 누릅니다. 브라우저에서 파일을 준비한 후 `line5-study-github.zip`이 다운로드됩니다. 인터넷 연결이 필요합니다.
3. Windows: ZIP 우클릭 → **압축 풀기/모두 추출**. macOS: ZIP 더블클릭.
4. 압축 푼 폴더를 열어 `index.html`과 `css`, `js`, `images`, `materials` 폴더가 보이는지 확인합니다.
5. ZIP 파일 자체를 업로드하지 마세요. 압축을 푼 **폴더 안의 파일·하위 폴더**를 업로드해야 합니다.

## 3. 새 저장소(repository) 생성
1. https://github.com/new 또는 GitHub 우측 상단 **+ → New repository**.
2. **Owner**: 본인 계정 선택.
3. **Repository name**: `line5-study` 입력. 영문 소문자와 하이픈 사용을 권장합니다. 이 이름은 사이트 주소의 뒷부분이 됩니다.
4. **Description**: 선택 사항. 예: `5호선 기관사 운전취급규정 학습 웹앱`.
5. **Public** 선택. 무료 개인 계정에서 Pages를 시작하기 가장 간단한 방식입니다.
6. **Add a README file** 또는 README 초기화 옵션을 켭니다. 나머지 `.gitignore`, 라이선스 선택은 일단 비워도 됩니다. 원문·사진에 대한 사용권을 확인하지 않은 상태에서 임의로 전체 자료에 오픈소스 라이선스를 부여하지 마세요.
7. **Create repository** 클릭.
8. 저장소 상단 **Code** 탭에서 브랜치 이름이 `main`인지 확인합니다. 다른 이름이면 이후 Pages에서 그 브랜치를 선택합니다.

## 4. 파일 삽입: Add file → Upload files
1. 생성한 저장소의 **Code** 탭으로 이동합니다.
2. **Add file → Upload files**를 누릅니다. 화면 너비에 따라 Add file이 메뉴 안에 있을 수 있습니다.
3. PC 파일 탐색기에서 압축 푼 폴더를 엽니다.
4. **그 폴더 자체가 아니라, 폴더 안의 일반 파일과 `css`, `js`, `images`, `materials` 폴더를 선택해서** GitHub 업로드 영역으로 끌어다 놓습니다.
5. 하위 폴더 구조가 유지되는지 업로드 목록을 확인합니다. 예: `css/style.css`, `js/app.js`, `images/icon-192.png`.
6. 업로드 중에는 창을 닫지 마세요. 브라우저 파일 선택창으로 폴더를 선택할 수 없다면 드래그 앤 드롭을 사용하세요. 폴더 업로드가 막히면 아래 GitHub Desktop 대안을 사용합니다.
7. 아래 **Commit changes** 영역의 메시지에 `Add LINE 5 web app` 입력.
8. **Commit directly to the main branch** 선택 → **Commit changes** 클릭. 버튼을 눌러야 저장소에 파일이 저장됩니다.
9. `README.md`가 이미 있으면 ZIP의 최신 README로 덮어써도 됩니다.

### 반드시 확인할 최상위 구조
```text
line5-study 저장소
├── index.html               ← 반드시 Code 첫 화면에 있어야 함
├── badges.html
├── export.html
├── deployment.html
├── manifest.webmanifest
├── sw.js
├── README.md
├── DEPLOYMENT.md
├── DUPLICATES.md
├── css/
├── js/
│   └── vendor/
├── images/
├── materials/
└── .nojekyll
```
잘못된 예: 저장소 안에 `line5-study-github/index.html`로 한 단계 더 들어간 경우, ZIP만 올라간 경우, `css/style.css`가 `style.css`로 바뀐 경우.

### 숨김 파일과 .github 폴더
- **브라우저 업로드 + 아래 브랜치 배포 방식에서는 `.github/`를 업로드하지 않아도 됩니다.** 폴더가 숨김으로 보이지 않으면 우선 일반 파일·폴더만 올립니다. 브랜치 방식과 사용자 workflow 방식을 혼용하지 않는 것을 권장합니다.
- `.nojekyll`은 정적 파일을 그대로 서비스하도록 하는 파일입니다. 누락되면 **Add file → Create new file** → 파일명 `.nojekyll` → 내용에 `Static site` 입력 → **Commit changes**. 파일의 내용은 중요하지 않습니다.
- `tests/`, `.meta/`, `.tables/`는 공개 업로드하지 않습니다. 제공 ZIP에는 들어 있지 않습니다.
- 웹 업로드는 파일 하나당 25MB 한도가 있습니다. 현재 앱의 개별 파일은 이보다 작습니다. 파일 수가 많아지면 나누어 commit하거나 Desktop을 이용합니다.

## 5. GitHub Pages 설정
1. 저장소 상단 **Settings** 클릭. 프로필의 Settings가 아니라 **저장소의 Settings**입니다. 메뉴가 안 보이면 본인 소유 저장소인지 확인합니다.
2. 왼쪽 메뉴 **Pages** 클릭.
3. **Build and deployment → Source**에서 **Deploy from a branch** 선택.
4. **Branch** 첫 선택칸: `main` (파일을 올린 실제 브랜치).
5. 두 번째 폴더 선택칸: **/(root)** 선택. `docs`를 선택하지 않습니다.
6. **Save** 클릭.
7. **Custom domain**은 비워 둡니다. 무료 기본 주소 사용에는 도메인 구매가 필요 없습니다.
8. 최초 배포는 보통 몇 분 걸리며 상황에 따라 더 오래 걸릴 수 있습니다.
9. 저장소 **Actions** 탭에서 `pages build and deployment` 실행 상태를 확인합니다. 초록 체크면 성공, 노란색은 진행 중, 빨간색은 실패입니다.
10. **Settings → Pages**로 돌아가 **Your site is live at … / Visit site**에 나온 주소를 엽니다.

주소 형식: `https://사용자명.github.io/line5-study/`
예: 사용자명이 `rail-learner`라면 `https://rail-learner.github.io/line5-study/`.
이 주소는 예시이며 실제 운영 주소는 본인 Pages 화면에서 확인하세요. `github.com/사용자명/line5-study`는 코드 저장소 주소이고, `github.io` 주소가 웹앱입니다.

## 6. 공개 후 확인·휴대폰 설치
- 홈의 **168문항**, 각 단원 학습 버튼, 퀴즈 채점, 오답 노트, 배지, 사진·PDF 링크가 동작하는지 확인합니다.
- 휴대폰에서 같은 **HTTPS github.io 주소**를 엽니다.
- Android Chrome: 브라우저 메뉴 **앱 설치/홈 화면에 추가**, 또는 학습실의 앱 설치 버튼.
- iPhone Safari: **공유 → 홈 화면에 추가 → 추가**.
- PC Chrome/Edge: 주소창 설치 아이콘/브라우저 설치 메뉴.
- 설치 메뉴는 브라우저별로 다를 수 있습니다. PWA이며 앱스토어 네이티브 앱이 아닙니다.
- 처음 온라인으로 앱을 열어 캐시가 완료된 뒤 오프라인 학습을 시험합니다. PDF는 온라인으로 열어본 뒤에만 캐시될 수 있습니다. 실제 HTTPS 배포 후 오프라인 동작을 최종 확인하세요.
- 학습 기록은 기기·브라우저에 저장됩니다. 미리보기 기록이 GitHub 주소로 자동 이전되거나 다른 기기로 동기화되지는 않습니다. 같은 `사용자명.github.io` origin의 다른 앱은 저장소가 공유될 수 있습니다.

## 7. 나중에 수정해서 다시 배포
1. 새 버전 ZIP을 다운로드·압축 해제합니다.
2. 같은 저장소 **Code → Add file → Upload files**에서 같은 상대 경로로 수정 파일을 올립니다. 동일 파일은 덮어써집니다.
3. **Commit changes** 메시지 예: `Update questions and theme`.
4. Pages가 자동 재배포합니다. Actions의 초록 체크 후 실제 사이트를 확인합니다.
5. 업로드만으로 기존 파일을 삭제할 수는 없습니다. 더 이상 쓰지 않는 파일이 있으면 저장소에서 해당 파일을 열어 삭제 메뉴 → commit합니다. 사용 중인 폴더/파일을 먼저 삭제하지 마세요.
6. 문항: `js/questions.js`, `js/questions-2016.js`. 문구·로직: `js/app.js`. 배지: `js/badges.js`. 디자인: `css/`.
7. PWA 변경 때 `sw.js`의 `CACHE_NAME` 버전도 올립니다. 현재 `line5-v0.6.0`.
8. 이전 설치 앱이 계속 보이면 앱/탭을 모두 닫고 다시 열어 새 워커 활성화를 확인합니다. 그래도 안 바뀌면 PC에서 Ctrl+Shift+R(macOS Cmd+Shift+R). 사이트 데이터 삭제는 학습 기록도 지우므로 최후 수단입니다.

## 8. 오류별 점검
| 증상 | 점검 |
|---|---|
| Pages 메뉴/Save 선택 불가 | 본인 저장소 권한, Public 여부, 이메일 인증, 최소 한 번 commit 여부 확인 |
| main 선택칸이 비어 있음 | 파일을 commit했는지, 실제 브랜치 이름이 무엇인지 확인 |
| 404 | Pages 주소인지, index.html이 루트인지, main / (root) 설정인지, Actions 성공인지 확인 |
| README만 보임 | index.html이 최상위에 있는지 확인 |
| 글자만 나오고 디자인/아이콘 없음 | css/, js/vendor/ 등 하위 경로와 대소문자 확인. 경로 앞에 /를 붙이지 않기 |
| PDF/사진 없음 | materials/, images/ 누락 여부·파일명 대소문자 확인 |
| Actions 빨간 X | 실패 실행 → job → 빨간 단계 클릭. 로그를 확인하되 토큰/비밀정보를 공유하지 않기 |
| Deploy LINE 5 workflow 권한 오류 | 초보 브랜치 방식이면 .github/ workflow를 생략. Actions 방식이면 아래 별도 설정 확인 |
| 옛 화면이 계속 보임 | commit/배포 완료 여부 확인 → 앱 창 모두 닫고 다시 접속 |

## 대안 A. 폴더 업로드가 어려울 때 GitHub Desktop
1. https://desktop.github.com 에서 설치하고 본인 GitHub 계정으로 로그인합니다.
2. **File → Clone repository** → 위에서 만든 `line5-study` 저장소 선택 → 저장할 위치 선택 → **Clone**.
3. **Repository → Show in Explorer/Finder**로 복제 폴더를 엽니다.
4. ZIP을 압축 푼 폴더의 **내용물**을 복제 폴더 안으로 복사합니다. `.git/` 폴더는 삭제하거나 덮어쓰지 않습니다.
5. 브랜치 배포를 사용할 때 ZIP의 `.github/` workflow는 생략할 수 있습니다.
6. Desktop의 Changes 목록에서 폴더 구조 확인 → Summary에 `Add LINE 5 app` → **Commit to main → Push origin**.
7. GitHub 웹 저장소에서 파일이 올라온 것을 확인하고 위 5단계 Pages 설정을 진행합니다.

## 대안 B. 개발자용 GitHub Actions 배포
브랜치 방식 대신 이 방식을 선택할 때만 진행합니다.
1. `.github/workflows/deploy-pages.yml`까지 포함해 저장소에 commit/push합니다.
2. **Settings → Pages → Source → GitHub Actions** 선택.
3. 저장소 정책이 Actions 실행을 막으면 **Settings → Actions → General**에서 포함된 공식 GitHub actions 사용을 허용하도록 확인합니다. 조직 정책에 따라 관리자의 승인이 필요할 수 있습니다.
4. **Actions → Deploy LINE 5 to GitHub Pages → Run workflow → main → Run workflow** 또는 main에 새 commit.
5. 초록 체크 후 **Settings → Pages → Visit site**. workflow가 contents: read, pages: write, id-token: write를 선언하므로 별도 앱 API 키/토큰은 필요하지 않습니다.
6. 공개 파일만 artifact에 복사하며 개발 테스트는 배포하지 않습니다.

Git 명령이 익숙한 경우, 새 로컬 폴더에서만 다음을 참고하세요(여기서 대신 실행하지 않았습니다).
```sh
git init
git add .
git commit -m "Add LINE 5 learning app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/line5-study.git
git push -u origin main
```
이미 clone한 저장소는 다시 초기화하거나 remote를 덮어쓰지 말고 commit/push만 합니다. `YOUR_USERNAME`은 본인 사용자명으로 바꿉니다. 인증은 GitHub의 공식 로그인 절차를 사용하고 비밀번호/토큰을 채팅에 보내지 않습니다.
