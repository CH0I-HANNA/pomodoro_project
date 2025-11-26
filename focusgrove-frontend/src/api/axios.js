import axios from 'axios';

const api = axios.create({
    // .env 파일에서 가져온 백엔드 API 기본 URL 사용
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// 모든 요청에 JWT 토큰을 자동으로 포함하는 인터셉터 설정
api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
