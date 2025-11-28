# ⏳ FocusGrove 🧘

FocusGrove는 사용자가 작업에 집중하고 작업을 효과적으로 관리할 수 있도록 설계된 웹 애플리케이션입니다. 뽀모도로 타이머, 작업 관리 및 진행 상황 추적 기능을 결합하여 생산적인 환경을 제공합니다.

## 🛠️ 기술 스택

### 백엔드

- **Java 17**
- **Spring Boot3**
- **Spring Security** (JWT 인증 포함)
- **Spring Data JPA (Hibernate)**
- **Gradle**
- **MySQL** (또는 구성된 JPA 호환 데이터베이스)

### 프론트엔드

- **React**
- **Vite**
- **JavaScript**
- **Tailwind CSS**
- **Chart.js** (데이터 시각화용)
- **Axios** (API 통신용)

## 🚀 시작하기

로컬 환경에서 프로젝트를 설정하고 실행하려면 다음의 간단한 단계를 따르세요.

### 필수 조건

- Java JDK 17 이상
- Node.js 및 npm
- 실행 중인 MySQL 데이터베이스 인스턴스 (또는 기타 구성된 데이터베이스)

### 백엔드 설정

1. **리포지토리 클론:**
    
    ```bash
    git clone <https://your-repository-url.com>
    cd your-project-folder
    
    ```
    
2. **데이터베이스 구성:**
    - `src/main/resources/application.yml` 파일을 엽니다.
    - `spring.datasource.url`, `username`, `password`를 데이터베이스 구성에 맞게 업데이트합니다.
3. **백엔드 빌드 및 실행:**
백엔드 서버는 `http://localhost:8080`에서 시작됩니다.
    
    ```bash
    ./gradlew bootRun
    
    ```
    

### 프론트엔드 설정

1. **프론트엔드 디렉토리로 이동:**
    
    ```bash
    cd focusgrove-frontend
    
    ```
    
2. **NPM 패키지 설치:**
    
    ```bash
    npm install
    
    ```
    
3. **환경 파일 생성:**
    - `focusgrove-frontend` 디렉토리에 `.env` 파일을 생성합니다.
    - 백엔드 API URL을 추가합니다:
        
        ```
        VITE_API_BASE_URL=http://localhost:8080/api
        
        ```
        
4. **프론트엔드 개발 서버 실행:**
프론트엔드는 `http://localhost:5173`에서 사용할 수 있습니다.
    
    ```bash
    npm run dev
    
    ```
---

## 💾 데이터베이스 스키마 (Database Schema)

FocusGlove 애플리케이션은 사용자 관리, 일일 기록, 작업 추적, 그리고 뽀모도로 세션 기록을 위한 모듈화된 데이터베이스 구조를 채택하고 있습니다.

<img width="297" height="581" alt="Image" src="https://github.com/user-attachments/assets/c947f722-6de0-431c-a501-b1e54c5b8f70" />


## 🎯 FocusGlove 제작 배경 및 동기

FocusGlove는 **디지털 시대의 집중력 저하 문제**를 해결하고, 사용자의 **노력을 시각화**하여 지속적인 동기 부여를 제공하는 데 중점을 둡니다.

| **동기** | **문제 인식** | **해결 방안 (FocusGlove)** |
| --- | --- | --- |
| **집중력 저하** | 기존 타이머 앱은 Task 관리와 분리되어 집중력 향상에 한계가 있음. | **Task 관리 + Pomodoro 기술**을 결합한 '집중의 울타리' 제공으로 **깊은 집중(Deep Work)** 지원. |
| **노력의 소멸** | 생산성 노력이 기록으로 쌓이지 않아 장기적인 성과 축적이 어려움. | **GitHub 스타일의 기여 그래프(Grass Chart)**를 도입하여 일일 뽀모도로 세션을 '기여' 데이터로 시각화. |
| **비효율적인 UX** | Task 리스트, 타이머, 기록이 파편화되어 데이터 관리가 비효율적임. | Task 선택 → 타이머 시작 → 기록 저장 및 통계 집계를 **하나의 플랫폼**에서 처리하도록 기능 통합. |

---

## ✨ FocusGlove 애플리케이션 기능 상세 설명

FocusGlove는 Task 관리와 집중 기록의 **유기적인 연동**을 통해 사용자 경험을 최적화한 생산성 도구입니다.

### 1. 🔑 사용자 인증

- **시스템:** JWT(JSON Web Token) 기반의 인증 시스템 채택.
- **특징:** 무상태(Stateless) 세션으로 안정성과 확장성을 확보하며, 로그인된 사용자만 프로필 관리에 접근 가능.

<img width="765" height="152" alt="Image" src="https://github.com/user-attachments/assets/a0ecff56-faf3-494e-8332-29984f90b238" />

### 2. 📝 작업 관리 (Task Management)

- **기능:** 오늘의 Task에 대한 CRUD (생성, 조회, 완료, 삭제) 제공.
- **핵심 연동:** 각 Task는 완료 여부(is_completed)와 Pomodoro 진행 횟수(pomodoroCount)를 독립적으로 추적하며, 주간 완료율 차트의 데이터 소스가 됨.

<img width="366" height="471" alt="Image" src="https://github.com/user-attachments/assets/89a13265-b8ac-4e5d-a8b2-b6b42b1e7d14" />


### 3. 🍅 뽀모도로 타이머 & 작업 연관성 (핵심 기능)

- **모드:** Focus (25분), Short Break (5분), Long Break (15분) 제공. (테스트를 위해 Short Break 후 Focus 시 6초로 변경되는 기능 포함)
- **Task 연동:** Task를 선택하고 타이머를 시작하면, 세션 완료 시 **해당 Task의 pomodoroCount가 정확히 1 증가**하여 정확한 Task별 성과 측정을 지원.
- **기록:** 포커스 세션 완료 시마다 백엔드 API를 호출하여 기록을 남김 (Task 미선택 시에도 총 통계에는 합산됨).

<img width="773" height="357" alt="Image" src="https://github.com/user-attachments/assets/d5d733eb-c74c-4a3e-8590-ff8384814d90" />

### 4. 📖 오늘의 한마디 (Daily Log)

- **기능:** 매일의 감정, 목표, 또는 다짐을 작성/수정(Upsert)할 수 있는 기능.
- **노출:** 대시보드 상단에 노출되어 사용자가 그날의 핵심 목표를 상기하도록 돕고, 날짜 기반으로 기록 관리.

<img width="765" height="152" alt="Image" src="https://github.com/user-attachments/assets/a0ecff56-faf3-494e-8332-29984f90b238" />

### 5. 📊 통계 및 진행 상황 추적 (시각화)

- **그래스 차트 (Contribution Graph):** GitHub 스타일의 캘린더 히트맵으로, 일일 총 집중 세션 수를 색상 농도로 시각화하여 꾸준함을 독려.
- **주간 완료율 차트:** 지난 7일간의 Task 완료율(%)을 막대 그래프로 보여주어 주간 생산성 추이 분석.
- **오늘의 통계 위젯:** Pomodoros 횟수, 완료 Tasks 수, 총 집중 시간, Day Streak(연속 기록) 등의 핵심 수치를 실시간 요약.

<img width="766" height="242" alt="Image" src="https://github.com/user-attachments/assets/580f0950-637b-4d8a-a431-33289f6358aa" />
<img width="454" height="307" alt="Image" src="https://github.com/user-attachments/assets/890f5186-515e-472a-a6a9-49a0e641c383" />
<img width="456" height="327" alt="Image" src="https://github.com/user-attachments/assets/d71bb057-edc1-4dbc-a0b1-c15692f607d1" />


### 6. 🎧 기타 기능 (UX 보조)

- **음악 플레이어:** rain, fire, classic 등 집중력 향상에 도움을 주는 주변 소리 재생 및 볼륨 제어 기능 제공.
- **사용자 프로필 관리:** 닉네임 변경 및 프로필 사진 업로드를 통해 개인화 가능.
- **현재 날짜 시각화:** 대시보드에 현재 날짜(예: 2025년 11월 26일)를 명확하게 표시하여 사용자가 시간적 맥락을 인지하도록 도움.

<img width="456" height="204" alt="Image" src="https://github.com/user-attachments/assets/efde7b6b-19db-4abd-a18b-e8cd12b7325f" />
<img width="366" height="340" alt="Image" src="https://github.com/user-attachments/assets/be7e9705-a66b-4791-8a08-54ff13b921ff" />
<img width="366" height="314" alt="Image" src="https://github.com/user-attachments/assets/4dde1a26-bc02-4b6e-9ce6-434432fe9213" />

---

## 📸 스크린샷
<img width="1693" height="984" alt="Image" src="https://github.com/user-attachments/assets/f9063d02-0b29-4d49-bf5e-163c4caa91b7" />

