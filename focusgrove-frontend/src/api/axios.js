import axios from 'axios';

const api = axios.create({
    // .env 파일에서 가져온 백엔드 API 기본 URL 사용
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. 요청 인터셉터 (기존 로직: 토큰 추가)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 2. 응답 인터셉터 (추가/수정 로직: 401 및 403 에러 핸들링)
api.interceptors.response.use(
    response => response,
    error => {
        // 응답 객체가 있고, 상태 코드가 401 (Unauthorized) 또는 403 (Forbidden)일 경우
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {

            console.error("인증 오류 발생:", error.response.status, error.response.data.message);

            // 🚨 Step 1: 클라이언트 측에 저장된 만료된 토큰 제거 (필수)
            localStorage.removeItem('jwtToken');

            // 🚨 Step 2: 사용자에게 경고 메시지 표시
            // (사용자 친화적인 알림 라이브러리를 사용하는 것이 좋으나, 여기서는 기본 alert 사용)
            alert('세션이 만료되었거나 인증에 실패했습니다. 다시 로그인해주세요.');

            // 🚨 Step 3: 로그인 페이지로 리다이렉트 (필수)
            // 브라우저의 전역 객체인 window.location을 사용합니다.
            // 만약 React Router나 Vue Router를 사용한다면, 해당 라우터의 navigate 함수를 사용해야 합니다.
            window.location.href = '/login';

            // 리다이렉션 후, 해당 요청은 실패로 처리
            return Promise.reject(error);
        }

        // 401/403이 아닌 다른 오류는 그대로 반환
        return Promise.reject(error);
    }
);

export default api;