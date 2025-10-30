import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios';

// Axios 전역 설정
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true; // (CORS 쿠키 필요 시)

// 요청 인터셉터 - 모든 요청에 JWT 자동 첨부
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
