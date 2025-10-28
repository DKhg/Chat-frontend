<template>
  <Header />
  <!-- 메인 콘텐츠 영역 -->
  <main class="flex-grow flex items-center justify-center bg-gray-50">
    <!-- router-view: 가운데 정렬 + 살짝 넓게 -->
    <div class="w-full max-w-[500px] px-4">
      <router-view />
    </div>
  </main>
  <Footer />
</template>

<script setup>
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
</script>

<style scoped></style>
