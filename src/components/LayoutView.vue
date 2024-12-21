<template>
  <NavBar v-if="store.isAuthenticated" />
  <LoadingSpinner v-if="store.isLoading" />
  <router-view></router-view>
  <ToastComponent v-if="store.toast.isVisible" />
</template>

<script setup>
import { useStore } from "@/store";
import { onMounted } from "vue";
import ToastComponent from "./common/ToastComponent.vue";
import LoadingSpinner from "./common/LoadingSpinner.vue";
import NavBar from "./NavBar.vue";
import { useRouter, useRoute } from "vue-router";
import { RouteNames } from "@/router";

const store = useStore();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  if (await store.getCurrentUser()) {
    if (route.name === RouteNames.LOGIN)
      router.push({ name: RouteNames.DASHBOARD });
  } else {
    router.push({ name: RouteNames.LOGIN });
  }
});
</script>
