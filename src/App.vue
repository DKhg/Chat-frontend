
<template>
  <Header/>
    <!-- 메인 콘텐츠 영역 -->
    <main class="flex-grow flex items-center justify-center bg-gray-50">
      <router-view />
    </main>
  <Footer/>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
</script>

<style scoped>
</style>
