<template>
  <header class="w-full bg-white shadow-sm border-b border-gray-100">
    <div class="max-w-6xl mx-auto flex items-center gap-3 px-6 py-4 select-none">
      <!-- 로고 (파란색 원 + 대화 아이콘 느낌) -->
      <div
        class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-sm"
      >
        H
      </div>

      <!-- 타이틀 -->
      <h1
        class="text-2xl font-bold text-blue-600 tracking-wide hover:tracking-wider transition-all duration-300"
      >
        Hong Talk
      </h1>
    </div>
  </header>
</template>

<style scoped>
/* 살짝 부드러운 유리 느낌 */
header {
  backdrop-filter: blur(8px);
}
</style>
<script setup lang="ts">
</script>
