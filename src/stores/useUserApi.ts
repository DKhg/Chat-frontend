import axios from 'axios';

export const useUserApi = {
  async login(userId: string, password: string) {
    const res = await axios.post('/api/user/login', {
      userId,
      password,
    });
    return res.data;
  },
  async getUserList() {
    const res = await axios.get('/api/user/users', {});
    return res.data;
  },
};
