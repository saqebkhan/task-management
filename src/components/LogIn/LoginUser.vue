<template>
  <div v-if="!store.isLoading">
    <div class="text-center mb-6 mt-8">
      <img
        src="@/assets/logo.png"
        alt="Task Manager Logo"
        class="mx-auto h-16 w-auto mb-4"
      />
    </div>
    <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-900 mb-1"
          >Email<span class="text-red-500">*</span></label
        >
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="Email"
          class="block w-full px-4 py-2 text-gray-900 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
        />
      </div>

      <div class="mb-6">
        <label
          for="password"
          class="block text-sm font-medium text-gray-900 mb-1"
          >Password<span class="text-red-500">*</span></label
        >
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="Password"
          class="block w-full px-4 py-2 text-gray-900 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
        />
      </div>

      <div class="mb-6">
        <CaptchaCheck @captcha-validated="validateCaptche" />
      </div>

      <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
        {{ errorMessage }}
      </div>

      <div class="flex flex-col space-y-4">
        <button
          :disabled="!showLogin"
          @click="login"
          class="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 disabled:bg-gray-400"
        >
          Login
        </button>

        <button
          @click="router.push(RouteNames.REGISTER)"
          class="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
        >
          Register
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CaptchaCheck from "./CaptchaCheck.vue";
import { RouteNames } from "@/router.js";
import { useRouter } from "vue-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useStore } from "@/store";

import { ref } from "vue";
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const showLogin = ref(false);
const router = useRouter();
const store = useStore();

const validateCaptche = (value) => {
  value ? (showLogin.value = true) : (showLogin.value = false);
};

const login = () => {
  store.isLoading = true;
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then(() => {
      store.isAuthenticated = true;
      router.push(RouteNames.DASHBOARD);
      store.toast = {
        message: "Successfully logged in",
        type: "success",
        isVisible: true,
      };
    })
    .catch((error) => {
      const errorCode = error.code;
      switch (errorCode) {
        case "auth/invalid-email":
          errorMessage.value = "Invalid email";
          break;
        case "auth/user-not-found":
          errorMessage.value = "User not found";
          break;
        case "auth/wrong-password":
          errorMessage.value = "Wrong password";
          break;
        case "auth/invalid-credential":
          errorMessage.value = "Invalid credential";
          break;
        default:
          errorMessage.value = error.message;
          break;
      }
    })
    .finally(() => {
      store.isLoading = false;
    });
};
</script>

<style scoped>
/* Custom Styling for Professional Look */
body {
  background-color: #f7fafc;
  font-family: "Helvetica", "Arial", sans-serif;
}

h1 {
  font-weight: 700;
  color: #2d3748;
}

h2 {
  font-size: 1.5rem;
  color: #4a5568;
}

p {
  color: #718096;
}

button {
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
}
</style>
