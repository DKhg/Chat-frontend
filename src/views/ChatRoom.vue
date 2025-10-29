<template>
  <div class="flex flex-col h-[calc(100vh-120px)] bg-gray-50">
    <!-- 상단 바 -->
    <div class="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
      <h2 class="text-lg font-bold">💬 Hong Talk</h2>

      <!-- 오른쪽 버튼 그룹 -->
      <div class="flex items-center space-x-2">
        <!-- 목록으로 버튼 (연한 파랑톤) -->
        <button
          @click="chatStore.goChatRoomList()"
          class="text-sm font-semibold bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition"
        >
          목록으로
        </button>

        <!-- 채팅방 나가기 버튼 (중간 회색톤) -->
        <button
          @click="chatStore.leaveChatRoom(roomId)"
          class="text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition"
        >
          채팅방 나가기
        </button>

        <!-- 로그아웃 버튼 (짙은 파랑톤) -->
        <button
          @click="userStore.logout()"
          class="text-sm font-semibold bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded transition"
        >
          로그아웃
        </button>
      </div>
    </div>

    <!-- 메시지 리스트 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <div
        v-for="(msg, index) in chatStore.receivedMessages"
        :key="index"
        class="flex flex-col w-full"
        :class="msg.senderId === chatStore.userId ? 'items-end' : 'items-start'"
      >
        <!-- 한 줄 구성: 읽음 + 말풍선 -->
        <div
          class="flex items-end w-full"
          :class="msg.senderId === chatStore.userId ? 'justify-end' : 'justify-start'"
        >
          <!-- 내가 보낸 메시지: 읽음 수 왼쪽 -->
          <div
            v-if="msg.senderId === chatStore.userId && msg.unreadCount !== undefined"
            class="text-[11px] text-gray-500 mr-2 min-w-[20px] text-right"
          >
            <span v-if="msg.unreadCount > 0">{{ msg.unreadCount }}</span>
            <span v-else>읽음</span>
          </div>

          <!-- 말풍선 -->
          <div
            :class="[
              'max-w-[70%] px-3 py-2 rounded-lg shadow text-sm break-words',
              msg.senderId === chatStore.userId
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-bl-none',
            ]"
          >
            <p class="whitespace-pre-wrap">
              <template v-if="msg.messageType === 'TALK'">{{ msg.senderId }} : </template>
              {{ msg.content }}
            </p>
          </div>

          <!-- 상대방 메시지: 읽음 수 오른쪽 -->
          <div
            v-if="msg.senderId !== chatStore.userId && msg.unreadCount !== undefined"
            class="text-[11px] text-gray-500 ml-2 min-w-[20px] text-left"
          >
            <span v-if="msg.unreadCount > 0">{{ msg.unreadCount }}</span>
            <span v-else>읽음</span>
          </div>
        </div>

        <!-- 시간 -->
        <div
          class="text-[11px] text-gray-400 mt-1"
          :class="msg.senderId === chatStore.userId ? 'text-right pr-2' : 'text-left pl-2'"
        >
          {{ useCommon.formatDate(msg.createdAt) }}
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
  import { computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useChatStore } from '@/stores/useChatStore.js';
  import { useUserStore } from '@/stores/useUserStore.js';
  import { useCommon } from '@/stores/useCommon.js';

  const chatStore = useChatStore();
  const userStore = useUserStore();
  const router = useRouter();

  // 현재 라우트 경로에서 채팅방 아이디를 반응형으로 추출
  const roomId = computed(() => Number(router.currentRoute.value.params.roomId));

  onMounted(async () => {
    // 로그인 안 된 상태면 접근 차단
    if (!chatStore.userId) {
      await router.push('/login');
      return;
    }

    // 채팅방 메시지 목록 조회
    await chatStore.getMessages(roomId.value, true);
    // 채팅방 연결
    await chatStore.connect(roomId.value);
    chatStore.sendRead(roomId.value);
  });

  // 채팅방 나가기
  onUnmounted(() => {
    chatStore.send(roomId.value); // 퇴장 메시지
    chatStore.disconnect(roomId.value);
  });
</script>
