import axios from 'axios'

export const useUserApi = {
  async login(userId: string, password: string) {
    const res = await axios.post('/api/user/login', {
      userId, password
    });
    return res.data;
  }
}
