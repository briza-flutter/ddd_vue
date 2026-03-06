<template>
  <div class="home-container">
    <header class="header">
      <h1>DDD Vue 管理系统</h1>
      <div class="user-info">
        <span>欢迎, {{ authStore.user?.username }}</span>
        <button @click="handleLogout" :disabled="authStore.loading">
          {{ authStore.loading ? '退出中...' : '退出登录' }}
        </button>
      </div>
    </header>
    <main class="main-content">
      <div class="welcome-card">
        <h2>欢迎回来</h2>
        <p>你已成功登录系统。当前用户ID: {{ authStore.user?.id }}</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f0f2f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.header h1 {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info span {
  color: #666;
  font-size: 14px;
}

.user-info button {
  padding: 6px 16px;
  background: #f56c6c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.user-info button:hover:not(:disabled) {
  background: #f78989;
}

.user-info button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.main-content {
  padding: 24px;
}

.welcome-card {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.welcome-card h2 {
  margin: 0 0 12px;
  color: #333;
}

.welcome-card p {
  color: #666;
  margin: 0;
}
</style>
