import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient: any = null;

export const useWebSocket = {
  // new Promise 비동기 작업을 감싸는 틀 resolve(성공시 결과 반환), reject(실패시 에러 반환)
  connect(roomId: Number, onMessage: (msg: any) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // SockJS 연결 생성
        const socket = new SockJS('http://localhost:8080/ws-chat');
        stompClient = Stomp.over(socket);

        // STOMP 연결
        stompClient.connect(
          {},
          () => {
            console.log('WebSocket 연결 성공');

            // 메시지 구독
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

            // 입장 알림 (연결 완료 후에만 보냄)
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

            resolve(); // 연결 성공 시점 알림
          },
          () => {
            console.error('WebSocket 연결 실패');
            reject();
          }
        );
      } catch (err) {
        reject(err);
      }
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
