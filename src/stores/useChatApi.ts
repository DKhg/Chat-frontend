import axios from 'axios';

export const useChatApi = {
  // 채팅방 목록 조회
  async getChatRooms(userId: string) {
    const res = await axios.get('/api/chat/getChatRooms', {
      params: { userId },
    });
    return res.data;
  },
  // 메시지 조회
  async getMessage(roomId: Number, includeUnreadCount: boolean) {
    const res = await axios.get(`/api/chat/${roomId}/messages`, { params: { includeUnreadCount } });
    return res.data;
  },
  // 채팅방 생성
  async createChatRoom(params: URLSearchParams) {
    const res = await axios.post('/api/chat/createChatRoom', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data;
  },
};
