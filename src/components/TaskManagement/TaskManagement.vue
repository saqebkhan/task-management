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
            <TaskComponent
              :task="task"
              @updateStage="handleUpdateStage"
              @deleteTask="deleteTask"
            />
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
            <TaskComponent
              :task="task"
              @updateStage="handleUpdateStage"
              @deleteTask="deleteTask"
            />
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
            <TaskComponent
              :task="task"
              @updateStage="handleUpdateStage"
              @deleteTask="deleteTask"
            />
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
            <TaskComponent
              :task="task"
              @updateStage="handleUpdateStage"
              @deleteTask="deleteTask"
            />
          </div>
        </div>
      </div>
      <div
        v-if="isDragging"
        class="fixed bottom-8 right-8 p-4 bg-red-600 rounded-full shadow-lg cursor-pointer z-50"
        @dragover.prevent
        @drop="confirmDelete"
      >
        <TrashIcon class="w-8 h-8 text-white" />
      </div>
    </div>
    <ConfirmPopup
      v-if="openDeleteDialog"
      actionButton="Delete"
      closeButton="Cancel"
      description="Are you sure you want to delete this task?"
      title="Delete Task"
      @closeDialog="close"
      @action="deleteTask"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TaskComponent from "./TaskComponent.vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import { ROUTE_NAMES, TOAST_TYPES } from "@/components/utils/constant";
import apiConfig from "../apiConfig";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { TrashIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const store = useStore();

const isDragging = ref(false);
const openDeleteDialog = ref(false);
const deletingId = ref("");

const backlogTasks = ref([]);
const todoTasks = ref([]);
const inProgressTasks = ref([]);
const doneTasks = ref([]);
const tasks = ref([]);

let draggedTask = null;

const fetchTasks = async () => {
  try {
    store.isLoading = true;
    const response = await axios.get(apiConfig.baseURL + "/tasks");
    tasks.value = response.data.filter(
      (tasks) => tasks.userId === store.userId
    );
    // Categorize tasks based on stage
    backlogTasks.value = tasks.value.filter((task) => task.stage === 0);
    todoTasks.value = tasks.value.filter((task) => task.stage === 1);
    inProgressTasks.value = tasks.value.filter((task) => task.stage === 2);
    doneTasks.value = tasks.value.filter((task) => task.stage === 3);
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
  isDragging.value = true; // Show the trash icon
};

const confirmDelete = () => {
  openDeleteDialog.value = true;
  deletingId.value = draggedTask._id;
  isDragging.value = false; // Hide the trash icon once the task is over the trash
};

const close = () => {
  openDeleteDialog.value = false;
  deletingId.value = "";
};

const deleteTask = async (id) => {
  const deleteFromList = (taskId) => {
    backlogTasks.value = backlogTasks.value.filter(
      (task) => task._id !== taskId
    );
    todoTasks.value = todoTasks.value.filter((task) => task._id !== taskId);
    inProgressTasks.value = inProgressTasks.value.filter(
      (task) => task._id !== taskId
    );
    doneTasks.value = doneTasks.value.filter((task) => task._id !== taskId);
  };
  if (id.id) {
    deleteFromList(id.id);
    return;
  }
  try {
    // Remove task from the lists
    deleteFromList(deletingId.value);
    await axios.delete(apiConfig.baseURL + "/tasks/" + deletingId.value);
    store.toast = {
      message: "Task deleted successfully",
      type: TOAST_TYPES.SUCCESS,
      isVisible: true,
    };
    deleteFromList(deletingId.value);
  } catch (error) {
    console.error("Error deleting task:", error);
    store.toast = {
      message: "Error deleting task",
      type: TOAST_TYPES.ERROR,
      isVisible: true,
    };
  } finally {
    close();
  }
};

const onDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

const onDrop = async (event, newStage) => {
  event.preventDefault();
  if (!draggedTask) return;
  if (draggedTask.stage !== newStage) {
    // Update the stage locally
    draggedTask.stage = newStage;

    // Update task in the corresponding list
    if (newStage === 0) {
      backlogTasks.value.push(draggedTask);
      todoTasks.value = todoTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
      inProgressTasks.value = inProgressTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
      doneTasks.value = doneTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
    } else if (newStage === 1) {
      todoTasks.value.push(draggedTask);
      backlogTasks.value = backlogTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
      inProgressTasks.value = inProgressTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
      doneTasks.value = doneTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
    } else if (newStage === 2) {
      inProgressTasks.value.push(draggedTask);
      backlogTasks.value = backlogTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
      todoTasks.value = todoTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
      doneTasks.value = doneTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
    } else if (newStage === 3) {
      doneTasks.value.push(draggedTask);
      backlogTasks.value = backlogTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
      todoTasks.value = todoTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
      inProgressTasks.value = inProgressTasks.value.filter(
        (task) => task._id !== draggedTask._id
      );
    }
    isDragging.value = false;
    try {
      await axios.put(
        apiConfig.baseURL + `/tasks/${draggedTask._id}`,
        draggedTask
      );
      store.toast = {
        message: "Task stage updated successfully",
        type: TOAST_TYPES.SUCCESS,
        isVisible: true,
      };
    } catch (error) {
      console.error("Error updating task stage:", error);
    }
  }
  draggedTask = null;
};

const createTask = () => {
  router.push({ name: ROUTE_NAMES.ADD_EDIT_FORM });
};

const handleUpdateStage = (event) => {
  const updatedTask = tasks.value.find((task) => task._id === event.taskId);
  if (updatedTask) {
    updatedTask.stage = event.newStage;
    if (event.oldStage === 0) {
      backlogTasks.value = backlogTasks.value.filter(
        (task) => task._id !== updatedTask._id
      );
    } else if (event.oldStage === 1) {
      todoTasks.value = todoTasks.value.filter(
        (task) => task._id !== updatedTask._id
      );
    } else if (event.oldStage === 2) {
      inProgressTasks.value = inProgressTasks.value.filter(
        (task) => task._id !== updatedTask._id
      );
    } else if (event.oldStage === 3) {
      doneTasks.value = doneTasks.value.filter(
        (task) => task._id !== updatedTask._id
      );
    }
    if (event.newStage === 0) {
      backlogTasks.value.push(updatedTask);
    } else if (event.newStage === 1) {
      todoTasks.value.push(updatedTask);
    } else if (event.newStage === 2) {
      inProgressTasks.value.push(updatedTask);
    } else if (event.newStage === 3) {
      doneTasks.value.push(updatedTask);
    }
  }
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #b1c1ff;
  border-radius: 10px;
  border: 2px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #3b5bdb;
}

::-webkit-scrollbar-thumb:active {
  background-color: #2d46b9;
}
</style>
