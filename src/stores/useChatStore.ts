import {defineStore} from "pinia";
import router from "@/router";
import {useWebSocket} from "@/stores/useWebSocket.ts"
import {useChatApi} from "@/stores/useChatApi.ts";

interface ChatRoom {
  id: number;
  name: string;
  roomType: 'PRIVATE' | 'GROUP';
}

interface ChatMessage {
  id: number;
  roomId: number,
  senderId: string;
  messageType: 'ENTER' | 'TALK' | 'LEAVE';
  content: string;
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    userId: localStorage.getItem('userId') || '익명',
    newMessage: '',
    receivedMessages: [] as ChatMessage[],
    rooms: [] as ChatRoom[],
  }),
  actions: {
    // WebSocket 연결 (해당 채팅방 입장 시 호출)
    async connect(roomId: Number) {
      useWebSocket.connect(roomId, msg => {
        this.receivedMessages.push(msg);
      });
    },
    // 메시지 전송
    send(roomId: Number) {
      if (!this.newMessage.trim()) return;
      useWebSocket.sendMessage(roomId ,this.newMessage);
      this.newMessage = '';
    },
    // WebSocket 연결 해제 (퇴장 처리)
    async disconnect(roomId: Number) {
      useWebSocket.disconnect(roomId);
      await router.push("/login");
    },
    // 채팅방 목록 조회
    async getChatRooms() {
      this.rooms = await useChatApi.getChatRooms(this.userId);
    },
    // 해당 채팅방의 메시지 목록 조회
    async getMessages(roomId: Number) {
      this.receivedMessages = await useChatApi.getMessage(roomId);
    }
  }
});
