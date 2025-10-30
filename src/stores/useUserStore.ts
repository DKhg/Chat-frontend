import { defineStore } from 'pinia';
import router from '@/router';
import { useUserApi } from '@/stores/useUserApi.ts';
import { useWebSocket } from '@/stores/useWebSocket.ts';
import { useChatStore } from '@/stores/useChatStore.ts';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
    password: '',
    error: '',
    userList: [],
  }),
  actions: {
    // 로그인
    async login() {
      if (!this.userId || !this.password) {
        this.error = '아이디와 비밀번호를 입력하세요.';
        return;
      }

      try {
        // 로그인 실행
        const res = await useUserApi.login(this.userId, this.password);
        // 토큰, 사용자 아이디 저장
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('userId', res.user.userId);
        // Pinia 상태에도 저장
        this.userId = res.user.userId;
        await router.push('/chatRooms');
      } catch (e) {
        console.error('로그인 에러', e);
        this.error = '로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.';
      }
    },
    // 로그아웃
    async logout() {
      // 접속했던 채팅방이 있으면 소켓 연결 끊어주기
      const lastRoomId = useChatStore().receivedMessages[0]?.roomId;
      if (lastRoomId) {
        useWebSocket.disconnect(lastRoomId);
      }

      // 사용자 상태 초기화, 제거
      this.userId = '';
      this.password = '';
      localStorage.removeItem('userId');
      await router.push('/login');
    },
    // 참가자 선택 목록 조회 ( 자기 자신 제외 )
    async getUserList(userId: string) {
      this.userList = await useUserApi.getUserList(userId);
    },
  },
});
