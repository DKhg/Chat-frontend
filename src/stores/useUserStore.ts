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
    nickname: '',
    email: '',
    username: '',
    confirmPassword: '',
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

      /*this.$reset(); // 로그인 정보 완전 초기화 ( 이걸로도 가능!!!!! )
      localStorage.clear(); // 앱 내 다른 store 데이터도 날려서 위험 */

      await router.push('/login');
    },
    // 참가자 선택 목록 조회 ( 자기 자신 제외 )
    async getUserList(userId: string) {
      this.userList = await useUserApi.getUserList(userId);
    },
    // 회원가입
    async joinUser() {
      // 유효성 검사
      if (!this.userId || !this.password || !this.confirmPassword || !this.email || !this.nickname || !this.username) {
        this.error = '필수 정보를 모두 입력해주세요.';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.error = '비밀번호가 일치하지 않습니다.';
        return;
      }

      try {
        const payload = {
          userId: this.userId,
          email: this.email,
          password: this.password,
          nickname: this.nickname,
          username: this.username,
        }
        // 회원가입 처리
        const res = await useUserApi.join(payload);
        console.log(res);
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        // Pinia state 값 초기화
        this.$reset();
        await router.push('/login');
      } catch(err) {
        console.error("회원가입 실패", err);
      }

    }
  },
});
