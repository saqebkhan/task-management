import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useStore = defineStore({
  id: "app",
  state: () => ({
    isAuthenticated: false,
    isLoading: false,
    userId: null,
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
            this.userId = user.uid;
          },
          reject
        );
      });
    },
    async setAuthenticationState() {
      const user = await this.getCurrentUser();
      this.userId = user.uid;
      this.isAuthenticated = user !== null;
      return this.isAuthenticated;
    },
  },
});
