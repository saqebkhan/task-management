<template>
  <nav
    class="bg-indigo-600 text-white shadow-md fixed w-full top-0 left-0 z-50"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="text-xl font-semibold">Task Manager</div>
        <div class="lg:hidden">
          <button @click="toggleMenu" class="text-white focus:outline-none">
            <component :is="Bars3Icon" class="w-6 h-6" />
          </button>
        </div>
        <div class="hidden lg:flex space-x-6">
          <router-link
            :to="{ name: RouteNames.DASHBOARD }"
            class="hover:text-indigo-200 transition-all duration-300"
            :class="{ 'text-indigo-200': $route.name === RouteNames.DASHBOARD }"
          >
            Dashboard
          </router-link>
          <router-link
            :to="{ name: RouteNames.TASK_MANAGEMENT }"
            class="hover:text-indigo-200 transition-all duration-300"
            :class="{
              'text-indigo-200': $route.name === RouteNames.TASK_MANAGEMENT,
            }"
          >
            Task Management
          </router-link>
        </div>
        <button
          @click="logout"
          class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 max-sm:hidden"
        >
          Logout
        </button>
      </div>
    </div>
    <div
      v-show="menuOpen"
      class="lg:hidden bg-indigo-600 text-white absolute top-16 left-0 w-full py-4 px-6"
    >
      <router-link
        :to="{ name: RouteNames.DASHBOARD }"
        class="block mb-4 hover:text-indigo-200 transition-all duration-300"
        :class="{ 'text-indigo-200': $route.name === RouteNames.DASHBOARD }"
        @click="toggleMenu"
      >
        Dashboard
      </router-link>
      <router-link
        :to="{ name: RouteNames.TASK_MANAGEMENT }"
        class="block mb-4 hover:text-indigo-200 transition-all duration-300"
        :class="{
          'text-indigo-200': $route.name === RouteNames.TASK_MANAGEMENT,
        }"
        @click="toggleMenu"
      >
        Task Management
      </router-link>
      <button
        @click="logout"
        class="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  </nav>
  <div class="pt-16"></div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signOut } from "firebase/auth";
import { useStore } from "@/store";
import { RouteNames } from "@/components/enums/routeNames";
import { Bars3Icon } from "@heroicons/vue/24/outline";
import { toastTypes } from "./enums/toastTypes";

const router = useRouter();
const store = useStore();
const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const logout = async () => {
  try {
    store.isLoading = true;
    await signOut(getAuth());
    store.isAuthenticated = false;
    store.toast = {
      message: "Successfully logged out",
      type: toastTypes.SUCCESS,
      isVisible: true,
    };
    router.push({ name: RouteNames.LOGIN });
  } catch (error) {
    store.toast = {
      message: error.message,
      type: toastTypes.ERROR,
      isVisible: true,
    };
  } finally {
    store.isLoading = false;
  }
};
</script>
