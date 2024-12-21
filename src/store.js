import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useStore = defineStore({
  id: "app",
  state: () => ({
    isAuthenticated: false,
    isLoading: false,
    tasksFetched: false,
    toast: {
      message: "",
      type: "",
      isVisible: false,
    },
  }),
  actions: {
    async getCurrentUser() {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          getAuth(),
          (user) => {
            unsubscribe();
            resolve(user);
          },
          reject
        );
      });
    },
    async setAuthenticationState() {
      const user = await this.getCurrentUser();
      this.isAuthenticated = user !== null;
      return this.isAuthenticated;
    },
  },
});
