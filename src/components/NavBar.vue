<template>
  <nav
    class="bg-indigo-600 text-white shadow-md fixed w-full top-0 left-0 z-50"
  >
    <!-- {{ store.user.displayName }} -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Title -->
        <div class="text-xl font-semibold">Task Manager</div>

        <!-- Hamburger menu (mobile) -->
        <div class="lg:hidden flex items-center ml-auto">
          <button @click="toggleMenu" class="text-white focus:outline-none">
            <component :is="Bars3Icon" class="w-6 h-6" />
          </button>
        </div>

        <!-- Desktop menu -->
        <div class="hidden lg:flex space-x-6">
          <router-link
            :to="{ name: ROUTE_NAMES.DASHBOARD }"
            class="hover:text-indigo-200 transition-all duration-300"
            :class="{
              'text-indigo-200': $route.name === ROUTE_NAMES.DASHBOARD,
            }"
          >
            Dashboard
          </router-link>
          <router-link
            :to="{ name: ROUTE_NAMES.TASK_MANAGEMENT }"
            class="hover:text-indigo-200 transition-all duration-300"
            :class="{
              'text-indigo-200': $route.name === ROUTE_NAMES.TASK_MANAGEMENT,
            }"
          >
            Task Management
          </router-link>
        </div>

        <!-- User info and Logout (Desktop) -->
        <div class="hidden lg:flex items-center space-x-4">
          <span class="font-medium">
            {{ store.user.displayName ? store.user.displayName : "Guest" }}
          </span>
          <button
            @click="logout"
            class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu (active) -->
    <div
      v-show="menuOpen"
      class="lg:hidden bg-indigo-600 text-white absolute top-16 left-0 w-full py-4 px-6"
    >
      <router-link
        :to="{ name: ROUTE_NAMES.DASHBOARD }"
        class="block mb-4 hover:text-indigo-200 transition-all duration-300"
        :class="{ 'text-indigo-200': $route.name === ROUTE_NAMES.DASHBOARD }"
        @click="toggleMenu"
      >
        Dashboard
      </router-link>
      <router-link
        :to="{ name: ROUTE_NAMES.TASK_MANAGEMENT }"
        class="block mb-4 hover:text-indigo-200 transition-all duration-300"
        :class="{
          'text-indigo-200': $route.name === ROUTE_NAMES.TASK_MANAGEMENT,
        }"
        @click="toggleMenu"
      >
        Task Management
      </router-link>
      <span class="font-medium my-4">
        {{ store.user.displayName ? store.user.displayName : "Guest" }}
      </span>
      <button
        @click="logout"
        class="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  </nav>

  <div class="pt-16"></div>
  <!-- To push content below the fixed navbar -->
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signOut } from "firebase/auth";
import { useStore } from "@/store";
import { ROUTE_NAMES, TOAST_TYPES } from "@/components/utils/constant";
import { Bars3Icon } from "@heroicons/vue/24/outline";

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
      type: TOAST_TYPES.SUCCESS,
      isVisible: true,
    };
    router.push({ name: ROUTE_NAMES.LOGIN });
  } catch (error) {
    store.toast = {
      message: error.message,
      type: TOAST_TYPES.ERROR,
      isVisible: true,
    };
  } finally {
    store.isLoading = false;
  }
};

onMounted(() => {
  console.log(store.user);
});
</script>
