import axios from 'axios';

export const useUserApi = {
  // 로그인 실행
  async login(userId: string, password: string) {
    const res = await axios.post('/api/user/login', {
      userId,
      password,
    });
    return res.data;
  },
  // 자신을 제외한 사용자 목록 조회
  async getUserList(userId: string) {
    const res = await axios.get('/api/user/users', { params: { userId } });
    return res.data;
  },
};
