<template>
  <div v-if="!store.isLoading" class="bg-gray-100 p-6">
    <div
      class="max-w-6xl mx-auto bg-white p-8 max-h-[82vh] rounded-lg shadow-xl overflow-y-auto"
    >
      <h2 class="text-3xl font-semibold text-gray-800 mb-2 text-center">
        Task Management
      </h2>
      <button
        @click="createTask"
        class="bg-indigo-600 text-white m-4 px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
      >
        Create Task
      </button>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div
          class="bg-gray-100 p-4 rounded-lg shadow-md"
          @dragover="onDragOver($event, 0)"
          @drop="onDrop($event, 0)"
        >
          <h3
            class="text-xl font-semibold text-gray-700 mb-4 sticky rounded-lg p-2 -top-10 bg-gray-100"
          >
            Backlog
          </h3>
          <div
            v-for="task in backlogTasks"
            :key="task._id"
            class="bg-white p-4 mb-4 rounded-lg shadow-md hover:bg-gray-50"
            :draggable="true"
            @dragstart="onDragStart($event, task, 0)"
          >
            <TaskComponent :task="task" @updateStage="handleUpdateStage" />
          </div>
        </div>

        <div
          class="bg-gray-100 p-4 rounded-lg shadow-md"
          @dragover="onDragOver($event, 1)"
          @drop="onDrop($event, 1)"
        >
          <h3
            class="text-xl font-semibold text-gray-700 mb-4 sticky rounded-lg p-2 -top-10 bg-gray-100"
          >
            Todo
          </h3>
          <div
            v-for="task in todoTasks"
            :key="task._id"
            class="bg-white p-4 mb-4 rounded-lg shadow-md hover:bg-gray-50"
            :draggable="true"
            @dragstart="onDragStart($event, task, 1)"
          >
            <TaskComponent :task="task" @updateStage="handleUpdateStage" />
          </div>
        </div>
        <div
          class="bg-gray-100 p-4 rounded-lg shadow-md"
          @dragover="onDragOver($event, 2)"
          @drop="onDrop($event, 2)"
        >
          <h3
            class="text-xl font-semibold text-gray-700 mb-4 sticky rounded-lg p-2 -top-10 bg-gray-100"
          >
            In Progress
          </h3>
          <div
            v-for="task in inProgressTasks"
            :key="task._id"
            class="bg-white p-4 mb-4 rounded-lg shadow-md hover:bg-gray-50"
            :draggable="true"
            @dragstart="onDragStart($event, task, 2)"
          >
            <TaskComponent :task="task" @updateStage="handleUpdateStage" />
          </div>
        </div>
        <div
          class="bg-gray-100 p-4 rounded-lg shadow-md"
          @dragover="onDragOver($event, 3)"
          @drop="onDrop($event, 3)"
        >
          <h3
            class="text-xl font-semibold text-gray-700 mb-4 sticky rounded-lg p-2 -top-10 bg-gray-100"
          >
            Done
          </h3>
          <div
            v-for="task in doneTasks"
            :key="task._id"
            class="bg-white p-4 mb-4 rounded-lg shadow-md hover:bg-gray-50"
            :draggable="true"
            @dragstart="onDragStart($event, task, 3)"
          >
            <TaskComponent :task="task" @updateStage="handleUpdateStage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TaskComponent from "./TaskComponent.vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import { RouteNames } from "@/router";

const router = useRouter();
const store = useStore();

const backlogTasks = ref([]);
const todoTasks = ref([]);
const inProgressTasks = ref([]);
const doneTasks = ref([]);

let draggedTask = null;

const fetchTasks = async () => {
  try {
    store.isLoading = true;
    const response = await axios.get(
      "https://admin-app-d7o3iig0l-saqebkhans-projects.vercel.app/tasks"
    );
    store.isLoading = true;
    const tasks = response.data;
    backlogTasks.value = tasks.filter((task) => task.stage === 0);
    todoTasks.value = tasks.filter((task) => task.stage === 1);
    inProgressTasks.value = tasks.filter((task) => task.stage === 2);
    doneTasks.value = tasks.filter((task) => task.stage === 3);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  } finally {
    store.isLoading = false;
  }
};

const onDragStart = (event, task) => {
  draggedTask = task;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", task._id);
};

const onDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

const onDrop = async (event, newStage) => {
  event.preventDefault();
  if (draggedTask) {
    draggedTask.stage = newStage;

    try {
      store.isLoading = true;
      await axios.put(
        `https://admin-app-d7o3iig0l-saqebkhans-projects.vercel.app/tasks/${draggedTask._id}`,
        draggedTask
      );
      store.toast = {
        message: "Task stage updated successfully",
        type: "success",
        isVisible: true,
      };
      fetchTasks();
    } catch (error) {
      console.error("Error updating task stage:", error);
    } finally {
      store.isLoading = false;
    }
  }
};

const createTask = () => {
  router.push({ name: RouteNames.ADD_EDIT_FORM });
};

const handleUpdateStage = () => {
  fetchTasks();
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
input {
  margin-right: 10px;
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 6px; /* Width of the scrollbar */
}

::-webkit-scrollbar-track {
  background: #f1f1f1; /* Background color of the scrollbar track */
  border-radius: 10px; /* Round the edges of the track */
}

::-webkit-scrollbar-thumb {
  background-color: #b1c1ff; /* Color of the scrollbar thumb */
  border-radius: 10px; /* Round the edges of the thumb */
  border: 2px solid #f1f1f1; /* Add a border around the thumb */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #3b5bdb; /* Change color of the thumb when hovered */
}

::-webkit-scrollbar-thumb:active {
  background-color: #2d46b9; /* Darker color when the thumb is active (clicked) */
}
</style>
