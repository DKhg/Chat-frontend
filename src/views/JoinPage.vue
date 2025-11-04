<template>
  <div class="flex items-center justify-center h-screen bg-gray-50">
    <div class="w-96 bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-2xl font-semibold text-center mb-6 text-gray-800">
        회원가입
      </h2>

      <div class="space-y-4">

        <input
          v-model="store.userId"
          type="text"
          placeholder="아이디"
          class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-sm outline-none transition-all"
        />

        <input
          v-model="store.username"
          type="text"
          placeholder="이름"
          class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-sm outline-none transition-all"
        />

        <input
          v-model="store.email"
          type="email"
          placeholder="이메일"
          class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-sm outline-none transition-all"
        />

        <input
          v-model="store.nickname"
          type="text"
          placeholder="닉네임"
          class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-sm outline-none transition-all"
        />

        <input
          v-model="store.password"
          type="password"
          placeholder="비밀번호"
          class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-sm outline-none transition-all"
        />

        <input
          v-model="store.confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
          class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 w-full text-sm outline-none transition-all"
        />

        <button
          @click="store.joinUser()"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-all"
        >
          회원가입
        </button>
      </div>

      <p
        v-if="store.error"
        class="text-red-500 text-sm mt-3 text-center"
      >
        {{ store.error }}
      </p>

      <div class="mt-6 text-center text-sm text-gray-600">
        이미 계정이 있으신가요?
        <a href="/login" class="text-blue-600 hover:underline font-medium">로그인</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/useUserStore.js";
const store = useUserStore();
</script>

<style scoped>
body {
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
}
</style>
