<template>
  <div class="flex items-center justify-center h-screen bg-gray-50">
    <div class="w-96 bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-2xl font-semibold text-center mb-6 text-gray-800">
        로그인
      </h2>

      <div class="space-y-4">
        <input
          v-model="store.userId"
          type="text"
          placeholder="아이디"
          class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-sm outline-none transition-all"
        />

        <input
          v-model="store.password"
          type="password"
          placeholder="비밀번호"
          class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-sm outline-none transition-all"
        />

        <button
          @click="store.login()"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-all"
        >
          로그인
        </button>
      </div>

      <p
        v-if="store.error"
        class="text-red-500 text-sm mt-3 text-center"
      >
        {{ store.error }}
      </p>

      <div class="flex justify-between text-xs text-gray-500 mt-6">
        <a href="#" class="hover:text-gray-700 transition-colors">아이디 찾기</a>
        <a href="#" class="hover:text-gray-700 transition-colors">비밀번호 찾기</a>
      </div>

      <div class="mt-8 text-center">
        <button
          class="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          회원가입
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useUserStore} from "@/stores/useUserStore.js";
const store = useUserStore();

</script>

<style scoped>
body {
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
}
</style>
