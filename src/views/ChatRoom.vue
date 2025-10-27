<template>
  <div class="flex flex-col h-[calc(100vh-120px)] bg-gray-50">
    <!-- 상단 바 -->
    <div class="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
      <h2 class="text-lg font-bold">💬 Hong Talk</h2>
      <button
        @click="userStore.logout()"
        class="text-sm bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
      >
        로그아웃
      </button>
    </div>

    <!-- 메시지 리스트 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-2">
      <div
        v-for="(msg, index) in chatStore.receivedMessages"
        :key="index"
        class="flex w-full"
        :class="msg.senderId === chatStore.userId ? 'justify-end' : 'justify-start'"
      >
        <div
          :class="[
        'max-w-[70%] px-3 py-2 rounded-lg shadow text-sm break-words',
        msg.senderId === chatStore.userId
          ? 'bg-blue-500 text-white rounded-br-none'
          : 'bg-white text-gray-800 rounded-bl-none',
      ]"
        >
          <p class="whitespace-pre-wrap">
            <template v-if="msg.messageType === 'TALK'">
              {{ msg.senderId }} :
            </template>
              {{ msg.content }}
          </p>
        </div>
      </div>
    </div>


    <!-- 입력창 -->
    <div class="border-t p-3 flex bg-white">
      <input
        v-model="chatStore.newMessage"
        @keyup.enter="chatStore.send(roomId)"
        type="text"
        placeholder="메시지를 입력하세요..."
        class="flex-grow border rounded px-3 py-2 mr-2"
      />
      <button
        @click="chatStore.send(roomId)"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        전송
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted} from 'vue'
import { useRouter } from 'vue-router'
import {useChatStore} from "@/stores/useChatStore.js";
import {useUserStore} from "@/stores/useUserStore.js";

const chatStore = useChatStore();
const userStore = useUserStore();
const router = useRouter();

// 현재 라우트 경로에서 채팅방 아이디를 반응형으로 추출
const roomId = computed(() => Number(router.currentRoute.value.params.roomId));

const logout = () => {
  chatStore.disconnect(roomId.value);
};

onMounted(async () => {
  // 로그인 안 된 상태면 접근 차단
  if (!chatStore.userId) {
    await router.push('/login');
    return;
  }
  // 채팅방 메시지 목록 조회
  await chatStore.getMessages(roomId.value);
  // 채팅방 연결
  await chatStore.connect(roomId.value);
});

// 채팅방 나가기
onUnmounted(() => {
  // 퇴장 메시지 전송
  chatStore.send(roomId.value);
  // 소켓 연결 해제
  chatStore.disconnect(roomId.value);
});
</script>
