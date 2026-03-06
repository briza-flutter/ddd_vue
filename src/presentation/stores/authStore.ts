import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "../../domain/auth/entities/User";
import { Credentials } from "../../domain/auth/value-objects/Credentials";
import { di } from "../../config/di";
import { LoginUseCase } from "../../application/auth/LoginUseCase";
import { LogoutUseCase } from "../../application/auth/LogoutUseCase";
import { GetCurrentUserUseCase } from "../../application/auth/GetCurrentUserUseCase";
import { to } from "../../common/utils/promise_to";

export const useAuthStore = defineStore("auth", () => {
  const loginUseCase = di.get<LoginUseCase>(LoginUseCase);
  const logoutUseCase = di.get<LogoutUseCase>(LogoutUseCase);
  const getCurrentUserUseCase = di.get<GetCurrentUserUseCase>(
    GetCurrentUserUseCase,
  );

  const user = ref<User | null>(getCurrentUserUseCase.execute());
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = () => user.value !== null;

  async function login(username: string, password: string) {
    loading.value = true;
    error.value = null;
    const credentials = Credentials.create(username, password);
    const [err, userData] = await to(loginUseCase.execute(credentials));
    loading.value = false;
    if (err) {
      error.value = err.message || "登录失败";
      throw err;
    }
    user.value = userData;
  }

  async function logout() {
    loading.value = true;
    try {
      await logoutUseCase.execute();
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  function initialize() {
    user.value = getCurrentUserUseCase.execute();
  }

  return { user, loading, error, isAuthenticated, login, logout, initialize };
});
