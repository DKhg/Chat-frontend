import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue';
import ChatRoom from '@/views/ChatRoom.vue';
import ChatRoomList from '@/views/ChatRoomList.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/chat/:roomId', name: 'chat', component: ChatRoom },
    { path: '/chatRooms', name: 'chatRooms', component: ChatRoomList },
  ],
})

export default router
