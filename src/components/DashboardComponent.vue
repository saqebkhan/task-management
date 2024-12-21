<template>
  <div v-if="!store.isLoading" class="h-[85vh] bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h2 class="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Dashboard
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          class="bg-blue-600 text-white p-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out"
        >
          <div class="text-4xl font-bold">{{ totalTasks }}</div>
          <div class="text-lg">Total Tasks</div>
        </div>

        <div
          class="bg-yellow-600 text-white p-6 rounded-lg shadow-lg hover:bg-yellow-700 transition-all duration-300 ease-in-out"
        >
          <div class="text-4xl font-bold">{{ pendingTasks }}</div>
          <div class="text-lg">Pending Tasks</div>
        </div>
        <div
          class="bg-green-600 text-white p-6 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 ease-in-out"
        >
          <div class="text-4xl font-bold">{{ doneTasks }}</div>
          <div class="text-lg">Done Tasks</div>
        </div>
      </div>
      <div class="mt-12">
        <h3 class="text-2xl font-semibold text-gray-800 mb-4">Task Progress</h3>
        <div class="h-2 w-full bg-gray-300 rounded-full">
          <div
            class="h-full bg-green-500"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="flex justify-between text-sm mt-2 text-gray-600">
          <span>Pending</span>
          <span>Done</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { onMounted, ref } from "vue";
import axios from "axios";

const store = useStore();

const totalTasks = ref(0);
const pendingTasks = ref(0);
const doneTasks = ref(0);
const progressPercentage = ref(0);

const fetchTasks = async () => {
  try {
    store.isLoading = true;
    const response = await axios.get(
      "https://admin-app-d7o3iig0l-saqebkhans-projects.vercel.app/tasks"
    );
    const tasks = response.data;
    totalTasks.value = tasks.length;
    // Filter tasks by stage
    pendingTasks.value = tasks.filter((task) => task.stage !== 3).length;
    doneTasks.value = tasks.filter((task) => task.stage === 3).length;
    if (totalTasks.value > 0) {
      progressPercentage.value = (doneTasks.value / totalTasks.value) * 100;
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  } finally {
    store.isLoading = false;
  }
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
input {
  margin-right: 10px;
}
</style>
