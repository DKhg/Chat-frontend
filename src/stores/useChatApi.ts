import axios from "axios";

export const useChatApi = {
  async getChatRooms(userId: string) {
    const res = await axios.get('/api/chat/getChatRooms', {
      params: { userId }
    })
    return res.data;
  },
  async getMessage(roomId: Number) {
    const res = await axios.get(`/api/chat/${roomId}/messages`);
    return res.data;
  }
}
