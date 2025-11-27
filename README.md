# FocusGrove

FocusGrove는 사용자가 작업에 집중하고 작업을 효과적으로 관리할 수 있도록 설계된 웹 입니다. 뽀모도로 타이머, 작업 관리 및 진행 상황 추적 기능을 결합하여 생산적인 환경을 제공합니다.

## 🛠️ 기술 스택

### 백엔드
-   **Java 17**
-   **Spring Boot 3**
-   **Spring Security** (JWT 인증 포함)
-   **Spring Data JPA (Hibernate)**
-   **Gradle**
-   **MySQL** (또는 구성된 JPA 호환 데이터베이스)

### 프론트엔드
-   **React**
-   **Vite**
-   **JavaScript**
-   **Tailwind CSS**
-   **Chart.js** (데이터 시각화용)
-   **Axios** (API 통신용)

## 🚀 시작하기

로컬 환경에서 프로젝트를 설정하고 실행하려면 다음의 간단한 단계를 따르세요.

### 필수 조건

-   Java JDK 17 이상
-   Node.js 및 npm
-   실행 중인 MySQL 데이터베이스 인스턴스 (또는 기타 구성된 데이터베이스)

### 백엔드 설정

1.  **리포지토리 클론:**
    ```sh
    git clone https://your-repository-url.com
    cd your-project-folder
    ```
2.  **데이터베이스 구성:**
    -   `src/main/resources/application.yml` 파일을 엽니다.
    -   `spring.datasource.url`, `username`, `password`를 데이터베이스 구성에 맞게 업데이트합니다.
3.  **백엔드 빌드 및 실행:**
    ```sh
    ./gradlew bootRun
    ```
    백엔드 서버는 `http://localhost:8080`에서 시작됩니다.

### 프론트엔드 설정

1.  **프론트엔드 디렉토리로 이동:**
    ```sh
    cd focusgrove-frontend
    ```
2.  **NPM 패키지 설치:**
    ```sh
    npm install
    ```
3.  **환경 파일 생성:**
    -   `focusgrove-frontend` 디렉토리에 `.env` 파일을 생성합니다.
    -   백엔드 API URL을 추가합니다:
        ```
        VITE_API_BASE_URL=http://localhost:8080/api
        ```
4.  **프론트엔드 개발 서버 실행:**
    ```sh
    npm run dev
    ```
    프론트엔드는 `http://localhost:5173`에서 사용할 수 있습니다.

## 💾 데이터베이스 스키마 (Database Schema)
FocusGlove 애플리케이션은 사용자 관리, 일일 기록, 작업 추적, 그리고 뽀모도로 세션 기록을 위한 모듈화된 데이터베이스 구조를 채택하고 있습니다.

<img width="297" height="581" alt="스크린샷 2025-11-26 22 35 27" src="https://github.com/user-attachments/assets/27ed5053-23d0-4204-abdf-248a635968d4" />

## 🎯 FocusGlove 제작 배경 및 동기

### 1. 📉 디지털 시대의 집중력 저하 문제 인식

기존의 타이머 앱은 Task 관리와 분리되어 있어 실제 집중력 향상에 한계가 있었습니다. 저희는 스마트폰과 웹의 방해 요소로부터 사용자를 보호하고, **Task 관리와 Pomodoro 기술을 결합**한 **'집중의 울타리'**를 제공하여 **깊은 집중(Deep Work)**을 돕고자 FocusGlove를 만들었습니다.

---

### 2. 📊 노력의 시각화 및 데이터 기반 성장 부재

대부분의 생산성 노력은 기록으로 쌓이지 않고 소멸됩니다. 사용자가 자신의 노력을 장기적인 성과로 축적하기 어렵습니다.

* **동기:** **GitHub 스타일의 기여 그래프(Grass Chart)**를 도입하여, 일일 **뽀모도로 세션**을 **'기여' 데이터**로 시각화했습니다. 이를 통해 사용자는 매일의 노력을 눈으로 확인하고, **지속적인 동기 부여**와 **자기 효능감**을 얻도록 시스템을 설계했습니다.

---

### 3. 🔗 기능 통합을 통한 사용자 경험(UX) 개선

Task 리스트, 타이머, 일일 기록이 파편화되어 데이터 관리가 비효율적이었습니다.

* **통합 목표:** FocusGlove는 **Task 선택 → 타이머 시작 → 기록 저장 및 통계 집계**의 모든 과정을 **하나의 플랫폼**에서 처리하도록 통합했습니다. 이 **연결성**을 통해 사용자 흐름을 최적화하고, Task별 성과를 정확하게 측정하는 체계적인 시스템을 제공합니다.

## ✨ FocusGlove 애플리케이션 기능 상세 설명

### 1. 🔑 사용자 인증 (JWT)

애플리케이션은 **JWT(JSON Web Token) 기반의 인증 시스템**을 채택하여 보안과 효율성을 확보했습니다.

* **등록 및 로그인:** 사용자는 안전하게 계정을 생성하고 로그인할 수 있습니다.
* **무상태(Stateless) 세션:** JWT 토큰은 로그인 후 클라이언트(브라우저)에 저장되며, 서버는 세션 상태를 유지하지 않습니다. 이는 API 호출마다 토큰의 유효성만 검증하여 **안정성과 확장성**을 높입니다.
* **프로필 관리 연동:** 로그인된 사용자만이 자신의 **닉네임**과 **프로필 사진**을 변경하는 API에 접근할 수 있습니다.
<img width="642" height="410" alt="스크린샷 2025-11-26 22 49 53" src="https://github.com/user-attachments/assets/ca85be51-61bf-4d5b-830e-757cb667af30" />
<img width="366" height="340" alt="Capture-2025-11-26-221820" src="https://github.com/user-attachments/assets/fa459c34-cb17-4a96-85b0-8c5ab75fd01e" />

---

### 2. 📝 작업 관리 (Task Management)

일일 단위로 Task를 관리하고 생산성을 높이는 핵심 기능입니다.

* **Task CRUD:** 사용자는 오늘의 Task를 **생성(Create), 조회(Read), 완료/수정(Update), 삭제(Delete)** 할 수 있습니다.
* **상태 추적:** 각 Task는 완료 여부(`is_completed`)와 **Pomodoro 진행 횟수(`pomodoroCount`)**를 독립적으로 추적합니다.
* **주간 진행 상황 연동:** Task의 완료 상태는 **주간 완료율 차트**의 데이터 소스가 됩니다.

<img width="366" height="471" alt="Capture-2025-11-26-221836" src="https://github.com/user-attachments/assets/1c1cea82-e7bf-482c-a05e-8d09ea583f7f" />

---

### 3. 🍅 뽀모도로 타이머 & 작업 연관성 (핵심 연동)

이 기능은 단순한 타이머를 넘어, Task 관리 시스템과 **통합**되어 사용자의 집중 기록을 데이터화합니다.

| 기능 | 설명 | 작업 관리 연관성 (핵심) |
| :--- | :--- | :--- |
| **타이머 제어** | Focus(25분), Short Break(5분), Long Break(15분) 모드를 제공합니다. | **Task 선택 기반 작동** |
| **기록 방식** | 포커스 세션이 완료될 때마다 백엔드 API를 호출하여 기록을 남깁니다. | **Task-기록 1:1 연동:** 사용자가 Task 목록에서 특정 Task를 선택하고 타이머를 시작하면, 세션 완료 시 해당 **Task의 `pomodoroCount`가 정확히 1 증가**합니다. |
| **일반 세션 처리** | Task를 선택하지 않고 타이머를 돌려도 세션 완료는 기록되며, 이는 **일일 총 뽀모도로 통계**에 합산됩니다. | **정확한 성과 측정:** 사용자가 *무엇*에 집중했는지 Task별로 추적하고, Daily Log의 총 뽀모도로 통계와 일관성을 유지합니다. |

여러가지 기능 테스트를 효율적으로 하기 위해 Short Break 버튼을 누르고 Focus 버튼을 누르면 25분이 6초로 바뀌고 이를 이용해서 다른 연관 기능들을 테스트 해 볼 수 있습니다.

<img width="773" height="357" alt="Capture-2025-11-26-221748" src="https://github.com/user-attachments/assets/d70ff492-3390-4062-8884-4bdbbe0a32ef" />

---

### 4. 📖 오늘의 한마디 (Daily Log)
사용자의 감정, 목표, 또는 그날의 생각을 간단하게 기록하고 관리하는 기능입니다.
일일 기록: 사용자는 매일의 **'오늘의 한마디'**를 작성하고 수정(Upsert)할 수 있습니다.
대시보드 노출: 이 기록은 대시보드 상단에 바로 노출되어, 사용자가 그날의 핵심 목표나 다짐을 상기하도록 돕습니다.
기록 관리: 이 기록은 날짜 기반으로 관리되어 사용자의 과거 기록을 추적할 수 있습니다.
<img width="765" height="152" alt="Capture-2025-11-26-222255" src="https://github.com/user-attachments/assets/e4826537-2c3b-42ee-a451-6da9102317ce" />


---

### 4. 📊 통계 및 진행 상황 추적

사용자가 자신의 노력과 성과를 시각적으로 확인하고 동기 부여를 받을 수 있도록 합니다.

* **그래스 차트 (Contribution Graph):**  GitHub 스타일의 캘린더 히트맵을 제공합니다. 각 칸은 하루의 **총 집중 세션 수**를 색상 농도로 시각화하여, 사용자가 꾸준히 집중했는지 한눈에 파악할 수 있게 합니다.
* **주간 완료율 차트:** 지난 7일간의 **Task 완료율(%)**을 막대 그래프로 보여줍니다. Task 관리 기능과 연동하여 사용자의 주간 생산성 추이를 분석하는 데 도움을 줍니다.
* **오늘의 통계 위젯:** Pomodoros 횟수, 완료 Tasks 수, 총 집중 시간, Day Streak(연속 기록) 등의 핵심 수치를 실시간으로 요약하여 보여줍니다.

<img width="766" height="242" alt="스크린샷 2025-11-26 22 21 37" src="https://github.com/user-attachments/assets/9185ca98-d3bf-4100-8c4b-378123166d71" />

---<img width="454" height="307" alt="스크린샷 2025-11-26 22 21 47" src="https://github.com/user-attachments/assets/799d59de-bc2a-4adb-8162-e075705b5c07" />

<img width="456" height="327" alt="Capture-2025-11-26-221636" src="https://github.com/user-attachments/assets/0a5d18a2-586d-4ac3-ac26-3ff0f4ed00b9" />

### 5. 🎧 음악 플레이어 및 프로필 관리

* **음악 플레이어:** **비(Rain), 숲(Forest), 로파이(Lofi)** 등 집중력 향상에 도움을 주는 주변 소리를 재생할 수 있습니다. 간단한 볼륨 제어와 재생/정지 기능을 제공하여 학습 또는 작업 환경을 최적화합니다.

<img width="456" height="204" alt="Capture-2025-11-26-221724" src="https://github.com/user-attachments/assets/cebd9c58-3b18-427c-8755-4381af3e12f5" />


## 📸 스크린샷
<img width="1693" height="984" alt="Capture-2025-11-26-222210" src="https://github.com/user-attachments/assets/88234edd-abe5-4e92-86dd-eca597357e2c" />

