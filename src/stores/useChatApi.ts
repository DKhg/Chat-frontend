import axios from 'axios';

export const useChatApi = {
  async getChatRooms(userId: string) {
    const res = await axios.get('/api/chat/getChatRooms', {
      params: { userId },
    });
    return res.data;
  },
  async getMessage(roomId: Number, includeUnreadCount: boolean) {
    const res = await axios.get(`/api/chat/${roomId}/messages`, { params: { includeUnreadCount } });
    return res.data;
  },
};
