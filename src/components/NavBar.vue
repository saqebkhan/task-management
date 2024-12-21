<template>
  <nav
    class="bg-indigo-600 text-white shadow-md fixed w-full top-0 left-0 z-50"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="text-xl font-semibold">Task Manager</div>
        <div class="flex space-x-6">
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
          class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>

  <!-- Main content, add padding top to avoid overlap with navbar -->
  <div class="pt-16">
    <!-- Your page content goes here -->
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { getAuth, signOut } from "firebase/auth";
import { useStore } from "@/store";
import { RouteNames } from "@/router";

const router = useRouter();
const store = useStore();

const logout = async () => {
  try {
    await signOut(getAuth());
    store.isLoading = true;
    store.isAuthenticated = false;
    store.toast = {
      message: "Successfully logged out",
      type: "success",
      isVisible: true,
    };
    router.push({ name: RouteNames.LOGIN });
  } catch (error) {
    store.toast = {
      message: error.message,
      type: "error",
      isVisible: true,
    };
  } finally {
    store.isLoading = false;
  }
};
</script>

<style scoped>
nav {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

/* Ensure content does not overlap with navbar */
.pt-20 {
  padding-top: 5rem; /* Adjust to the height of your navbar */
}

a:hover,
button:hover {
  transition: all 0.3s ease;
}
</style>
