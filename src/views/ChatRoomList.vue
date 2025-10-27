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
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/useChatStore'
import { useUserStore } from '@/stores/useUserStore'

const chatStore = useChatStore()
const userStore = useUserStore()
const router = useRouter()


onMounted(async () => {
  if (!chatStore.userId) {
    await router.push('/login')
    return
  }
  // 채팅방 목록 불러오기
  await chatStore.getChatRooms();
})

// 채팅방 입장
const enterRoom = (roomId) => {
  router.push(`/chat/${roomId}`)
}

</script>
