<template>
  <ConfirmPopup
    v-if="openDeleteDialog"
    actionButton="Delete"
    closeButton="Cancel"
    description="Are you sure you want to delete this task?"
    title="Delete Task"
    @closeDialog="close"
    @action="deleteTask"
  />

  <p class="font-medium text-gray-800 text-lg mb-2">{{ task.title }}</p>

  <div class="flex justify-between items-center space-x-4 mb-2">
    <span
      :class="{
        'bg-green-100 text-green-800': task.priority === 'low',
        'bg-yellow-100 text-yellow-800': task.priority === 'medium',
        'bg-red-100 text-red-800': task.priority === 'high',
      }"
      class="px-3 py-1 text-xs font-medium rounded-full"
    >
      {{ capitalizePriority(task.priority) }}
    </span>

    <div class="flex space-x-2">
      <button
        @click="editTask(task._id)"
        class="text-blue-500 hover:text-blue-600"
      >
        <PencilIcon class="w-5 h-5" />
      </button>
      <button
        @click="confirmDelete(task._id)"
        class="text-red-500 hover:text-red-600"
      >
        <TrashIcon class="w-5 h-5" />
      </button>
    </div>
  </div>

  <p class="text-sm text-gray-600">Due: {{ formatDate(task.deadline) }}</p>

  <div class="flex justify-between items-center mt-4">
    <button
      :disabled="task.stage === 0"
      @click="updateStage(-1)"
      class="flex items-center justify-center w-10 h-10 rounded-full border border-indigo-600 bg-white text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
    >
      <ChevronLeftIcon class="w-5 h-5" />
    </button>

    <span class="text-sm font-medium text-gray-700"
      >Stage: {{ task.stage }}</span
    >

    <button
      :disabled="task.stage === 3"
      @click="updateStage(1)"
      class="flex items-center justify-center w-10 h-10 rounded-full border border-indigo-600 bg-white text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
    >
      <ChevronRightIcon class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup>
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import { defineProps, ref, watch, defineEmits } from "vue";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useStore } from "@/store";
import { formatDate, capitalizePriority } from "@/components/utils/utils";
import { ROUTE_NAMES, TOAST_TYPES } from "@/components/utils/constant";
import apiConfig from "../apiConfig";

const router = useRouter();

const props = defineProps({
  task: Object,
});

const emit = defineEmits(["updateStage", "deleteTask"]);

const task = ref({ ...props.task });

const openDeleteDialog = ref(false);
const deletingId = ref("");

watch(
  () => props.task,
  (newTask) => {
    task.value = { ...newTask };
  }
);

const confirmDelete = (id) => {
  openDeleteDialog.value = true;
  deletingId.value = id;
};

const deleteTask = () => {
  const store = useStore();
  emit("deleteTask", { id: deletingId.value });
  axios
    .delete(apiConfig.baseURL + "/tasks/" + deletingId.value)
    .then(() => {
      close();
      store.toast = {
        message: "Task deleted successfully",
        type: TOAST_TYPES.SUCCESS,
        isVisible: true,
      };
    })
    .catch((error) => {
      console.error("Error deleting task: ", error);
      store.toast = {
        message: "Error deleting task",
        type: TOAST_TYPES.ERROR,
        isVisible: true,
      };
    });
  close();
};

const close = () => {
  openDeleteDialog.value = false;
  deletingId.value = "";
};

const editTask = (id) => {
  router.push({
    name: ROUTE_NAMES.ADD_EDIT_FORM,
    query: { param: "edit", id: id },
  });
};

const updateStage = async (increment) => {
  const newStage = task.value.stage + increment;
  const oldStage = task.value.stage;
  await axios
    .put(apiConfig.baseURL + `/tasks/${task.value._id}`, {
      stage: newStage,
    })
    .then(() => {
      task.value.stage = newStage;
      const store = useStore();
      store.toast = {
        message: "Task Successfully updated.",
        type: TOAST_TYPES.SUCCESS,
        isVisible: true,
      };

      emit("updateStage", {
        taskId: task.value._id,
        newStage,
        oldStage: oldStage,
      });
    })
    .catch((error) => {
      console.error("Error updating task stage:", error);
      const store = useStore();
      store.toast = {
        message: "Error updating task stage",
        type: TOAST_TYPES.ERROR,
        isVisible: true,
      };
    });
};
</script>
