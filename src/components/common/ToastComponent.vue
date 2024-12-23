<template>
  <div
    v-if="store.toast.isVisible"
    class="flex items-center fixed bottom-0 right-0 p-4 mb-4 text-gray-500 bg-white rounded-lg shadow"
    role="alert"
  >
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
      :class="
        store.toast.type === toastTypes.SUCCESS
          ? 'bg-green-100 text-green-500'
          : 'bg-red-100 text-red-500'
      "
    >
      <component
        v-if="store.toast.type === toastTypes.SUCCESS"
        :is="CheckCircleIcon"
        class="w-5 h-5"
      />
      <component v-else :is="XCircleIcon" class="w-5 h-5" />
      <span class="sr-only">{{ store.toast.message }}</span>
    </div>
    <div class="ms-3 text-sm font-normal">{{ store.toast.message }}</div>
    <button
      @click="store.toast.isVisible = false"
      type="button"
      class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg ml-1.5 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
      data-dismiss-target="#toast-success"
      aria-label="Close"
    >
      <span class="sr-only">Close</span>
      <component :is="XMarkIcon" class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { toastTypes } from "../enums/toastTypes";
const store = useStore();

store.toast.isVisible = true;

setTimeout(() => {
  store.toast = {
    message: "",
    type: "",
    isVisible: false,
  };
}, 4000);
</script>
