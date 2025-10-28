import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient: any = null;

export const useWebSocket = {
  connect(roomId: Number, onMessage: (msg: any) => void) {
    // 서버 연결
    const socket = new SockJS('http://localhost:8080/ws-chat');
    // SockJS 객체 위에 STOMP 프로토콜을 입혀서 메시지 송수신을 STOMP 방식으로 처리
    stompClient = Stomp.over(socket);

    // STOMP 서버(Spring WebSocketConfig)에 연결 요청
    stompClient.connect({}, () => {
      // 구독(서버에서 메시지 받기)
      stompClient.subscribe(`/topic/chatRoom/${roomId}`, (res: any) => {
        const message = JSON.parse(res.body);
        onMessage({
          senderId: message.senderId,
          content: message.content,
          messageType: message.messageType,
          createdAt: message.createdAt,
          unreadCount: message.unreadCount,
        });
      });

      // 읽음 이벤트 구독
      stompClient.subscribe(`/topic/chatRoom/${roomId}/read`, (res: any) => {
        const data = JSON.parse(res.body);
        window.dispatchEvent(new CustomEvent('chat-read-event', { detail: data }));
      });

      // 입장 알림
      stompClient.send(
        '/app/chatSend',
        {},
        JSON.stringify({
          roomId: roomId,
          senderId: localStorage.getItem('userId'),
          messageType: 'ENTER',
          roomType: 'PRIVATE',
          content: '',
        })
      );
    });
  },

  // 메시지 전송
  sendMessage(roomId: Number, content: string) {
    if (!stompClient) return;

    // 메시지 전송
    stompClient.send(
      '/app/chatSend',
      {},
      JSON.stringify({
        roomId: roomId,
        senderId: localStorage.getItem('userId'),
        messageType: 'TALK',
        content: content,
      })
    );
  },
  // 메시지 읽음 처리
  sendRead(roomId: Number) {
    if (!stompClient) return;
    const userId = localStorage.getItem('userId');
    stompClient.send(
      '/app/chatRead',
      {},
      JSON.stringify({
        roomId,
        userId,
      })
    );
  },
  // 채팅방 나가기
  disconnect(roomId: Number) {
    if (!stompClient) return;

    // 퇴장 알림
    stompClient.send(
      '/app/chatSend',
      {},
      JSON.stringify({
        roomId: roomId,
        senderId: localStorage.getItem('userId'),
        messageType: 'LEAVE',
        content: '',
      })
    );

    // WebSocket 연결 해제
    stompClient.disconnect(() => {
      stompClient = null;
    });
  },
};
