<template>
  <div v-if="!store.isLoading" class="h-[85vh] bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h2 class="text-3xl font-semibold text-gray-800 mb-8 text-center">
        {{ isEdit ? "Edit Task" : "Create New Task" }}
      </h2>

      <form @submit.prevent="submitForm" class="space-y-6">
        <div>
          <label for="title" class="block text-gray-700 font-medium">
            Task Title<span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            v-model="task.title"
            class="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all duration-300"
            placeholder="Enter task title"
            :class="{ 'border-red-500': titleError }"
          />
          <p v-if="titleError" class="text-red-600 text-sm mt-1">
            Title is required
          </p>
        </div>

        <div>
          <label for="deadline" class="block text-gray-700 font-medium">
            Deadline<span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="deadline"
            v-model="task.deadline"
            :min="todayDate"
            class="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all duration-300"
            :class="{ 'border-red-500': deadlineError }"
          />
          <p v-if="deadlineError" class="text-red-600 text-sm mt-1">
            Deadline is required
          </p>
        </div>

        <div>
          <label for="priority" class="block text-gray-700 font-medium">
            Priority<span class="text-red-500">*</span>
          </label>
          <select
            id="priority"
            v-model="task.priority"
            class="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all duration-300"
            :class="{ 'border-red-500': priorityError }"
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <p v-if="priorityError" class="text-red-600 text-sm mt-1">
            Priority is required
          </p>
        </div>

        <div class="flex m-2">
          <button
            @click="$router.push({ name: RouteNames.TASK_MANAGEMENT })"
            class="w-full m-4 py-3 px-4 border-2 border-gray-400 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 hover:border-gray-500 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="w-full m-4 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 text-nowrap"
          >
            {{ isEdit ? "Edit Task" : "Create Task" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { RouteNames } from "@/components/enums/routeNames";
import { useStore } from "@/store";
import { toastTypes } from "../enums/toastTypes";
import apiConfig from "../apiConfig";

const todayDate = new Date().toISOString().split("T")[0];

const task = ref({
  userId: "",
  title: "",
  description: "",
  deadline: "",
  priority: "",
  stage: 0,
});

const formSubmitted = ref(false);
const isEdit = ref(false);

const store = useStore();
const router = useRouter();
const route = useRoute();

const titleError = ref(false);
const deadlineError = ref(false);
const priorityError = ref(false);

onMounted(() => {
  if (route.query.param === "edit") {
    isEdit.value = true;
    loadTaskData();
  }
});

const loadTaskData = async () => {
  const taskId = route.query.id;

  try {
    store.isLoading = true;
    const response = await axios.get(apiConfig.baseURL + `/tasks/${taskId}`);
    task.value = response.data;
  } catch (error) {
    store.toast = {
      message: "Error fetching task details.",
      type: toastTypes.ERROR,
      isVisible: true,
    };
  } finally {
    store.isLoading = false;
  }
};

const validateForm = () => {
  formSubmitted.value = true;
  titleError.value = !task.value.title;
  deadlineError.value = !task.value.deadline;
  priorityError.value = !task.value.priority;

  return !titleError.value && !deadlineError.value && !priorityError.value;
};

const submitForm = async () => {
  if (!validateForm()) return;

  try {
    store.isLoading = true;
    let response;
    const taskData = {
      userId: store.userId,
      title: task.value.title,
      description: task.value.description,
      deadline: task.value.deadline,
      priority: task.value.priority,
      stage: task.value.stage || 0,
    };

    if (isEdit.value) {
      const taskId = route.query.id;
      response = await axios.put(
        apiConfig.baseURL + `/tasks/${taskId}`,
        taskData
      );
    } else {
      response = await axios.post(apiConfig.baseURL + "/tasks", taskData);
    }

    if (response.status === 200 || response.status === 201) {
      store.toast = {
        message: isEdit.value
          ? "Task updated successfully!"
          : "Task created successfully!",
        type: toastTypes.SUCCESS,
        isVisible: true,
      };
      router.push({ name: RouteNames.TASK_MANAGEMENT });
    }
  } catch (error) {
    store.toast = {
      message: isEdit.value
        ? "Error updating task." + error.response.data.message
        : "Error creating task." + error.response.data.message,
      type: toastTypes.ERROR,
      isVisible: true,
    };
    console.error(error);
  } finally {
    store.isLoading = false;
  }
};
</script>
