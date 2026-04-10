<template>
  <div class="login-container">
    <div class="login-card">
      <h2>系统登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="请输入用户名"
            :disabled="authStore.loading"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :disabled="authStore.loading"
            required
          />
        </div>
        <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
        <button type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? "登录中..." : "登录" }}
        </button>
      </form>
      <p class="hint">默认账号: admin / admin</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
const authStore = useAuthStore();
const router = useRouter();
const form = reactive({
  username: "",
  password: "",
});

async function handleLogin() {
  try {
    await authStore.login(form.username, form.password);
    router.push("/");
  } catch {
    // error is handled by store
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.login-card {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 380px;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #555;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #409eff;
}

button {
  width: 100%;
  padding: 12px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #66b1ff;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #f56c6c;
  font-size: 13px;
  margin: 0 0 12px;
}

.hint {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 16px;
}
</style>
