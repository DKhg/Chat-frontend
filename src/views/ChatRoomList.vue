<template>
  <div class="flex flex-col h-[calc(100vh-120px)] bg-gray-50">
    <!-- 상단 바 -->
    <div class="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
      <h2 class="text-lg font-bold">💬 Hong Talk</h2>

      <!-- 버튼 그룹 -->
      <div class="flex items-center space-x-1">
        <!-- 채팅방 만들기 버튼 (흰색 배경, 파란 글씨) -->
        <button
          @click="openCreateChatRoomModal"
          class="text-sm font-semibold text-blue-600 bg-white hover:bg-gray-100 border border-blue-200 px-2 py-1 rounded transition"
        >
          ➕ 채팅방 만들기
        </button>

        <!-- 로그아웃 버튼 (파란 배경, 흰 글씨) -->
        <button
          @click="userStore.logout()"
          class="text-sm font-semibold bg-blue-700 hover:bg-blue-800 text-white px-2 py-1 rounded transition"
        >
          로그아웃
        </button>
      </div>
    </div>

    <!-- 채팅방 리스트 -->
    <div class="flex-1 overflow-y-auto p-4">
      <h3 class="text-gray-700 font-semibold mb-3">내 채팅방</h3>

      <div v-if="chatStore.rooms.length === 0" class="text-gray-400 text-sm text-center mt-20">
        참여 중인 채팅방이 없습니다 💭
      </div>

      <ul class="space-y-3">
        <li
          v-for="room in chatStore.rooms"
          :key="room.id"
          @click="enterRoom(room.id)"
          class="cursor-pointer bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-gray-800">{{ room.name || '이름 없는 채팅방' }}</p>
              <p class="text-sm text-gray-500">
                {{ room.roomType === 'GROUP' ? '그룹채팅' : '1:1 채팅' }}
              </p>
            </div>
            <div class="text-blue-500 font-bold text-sm">입장 ▶</div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- ✅ 채팅방 생성 모달 -->
  <div
    v-if="chatStore.showCreateChatRoomModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-[320px]">
      <h3 class="text-center font-semibold text-gray-800 mb-4">새 채팅방 만들기</h3>

      <!-- 🔘 채팅방 유형 선택 -->
      <div class="mb-5">
        <label class="text-sm font-medium text-gray-700 block text-center mb-3">채팅방 유형</label>
        <div class="flex justify-center space-x-6">
          <label
            class="flex items-center space-x-2 cursor-pointer hover:bg-blue-50 px-3 py-2 rounded transition"
          >
            <input
              type="radio"
              value="PRIVATE"
              v-model="chatStore.roomType"
              class="text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-800 font-medium">1:1 채팅</span>
          </label>

          <label
            class="flex items-center space-x-2 cursor-pointer hover:bg-blue-50 px-3 py-2 rounded transition"
          >
            <input
              type="radio"
              value="GROUP"
              v-model="chatStore.roomType"
              class="text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-800 font-medium">그룹 채팅</span>
          </label>
        </div>
      </div>

      <div class="mb-5 text-center">
        <label class="block text-sm font-medium text-gray-700 mb-2">참여자 선택</label>

        <!-- 1:1 (단일 선택) -->
        <select
          v-if="chatStore.roomType === 'PRIVATE'"
          v-model="chatStore.selectedUsers"
          class="w-[80%] mx-auto block border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        >
          <option value="">사용자를 선택하세요</option>
          <option v-for="user in userStore.userList" :key="user.id" :value="user.id">
            {{ user.userId }}
          </option>
        </select>

        <!-- 그룹 (다중 선택) -->
        <select
          v-else
          multiple
          v-model="chatStore.selectedUsers"
          class="w-[80%] mx-auto block border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition h-32"
        >
          <option v-for="user in userStore.userList" :key="user.id" :value="user.id">
            {{ user.userId }}
          </option>
        </select>
      </div>

      <input
        v-model="chatStore.roomName"
        type="text"
        placeholder="채팅방 이름을 입력하세요"
        class="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div class="flex justify-end space-x-2">
        <button
          @click="closeModal()"
          class="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
        >
          취소
        </button>
        <button
          @click=""
          class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          생성
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useChatStore } from '@/stores/useChatStore';
  import { useUserStore } from '@/stores/useUserStore';

  const chatStore = useChatStore();
  const userStore = useUserStore();
  const router = useRouter();

  onMounted(async () => {
    if (!chatStore.userId) {
      await router.push('/login');
      return;
    }
    // 채팅방 목록 조회
    await chatStore.getChatRooms();
  });

  // 채팅방 입장
  const enterRoom = (roomId) => {
    router.push(`/chat/${roomId}`);
  };

  const openCreateChatRoomModal = () => {
    chatStore.showCreateChatRoomModal = true;
    // 사용자 목록 조회
    userStore.getUserList();
  };
  const closeModal = () => {
    chatStore.showCreateChatRoomModal = false;
  };
</script>
