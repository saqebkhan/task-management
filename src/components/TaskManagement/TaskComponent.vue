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
  <p class="font-medium text-gray-800 text-lg mb-2">{{ props.task.title }}</p>

  <div class="flex justify-between items-center space-x-4 mb-2">
    <span
      :class="{
        'bg-green-100 text-green-800': props.task.priority === 'low',
        'bg-yellow-100 text-yellow-800': props.task.priority === 'medium',
        'bg-red-100 text-red-800': props.task.priority === 'high',
      }"
      class="px-3 py-1 text-xs font-medium rounded-full"
    >
      {{ capitalizePriority(props.task.priority) }}
    </span>

    <div class="flex space-x-2">
      <button
        @click="editTask(props.task._id)"
        class="text-blue-500 hover:text-blue-600"
      >
        <PencilIcon class="w-5 h-5" />
      </button>
      <button
        @click="confirmDelete(props.task._id)"
        class="text-red-500 hover:text-red-600"
      >
        <TrashIcon class="w-5 h-5" />
      </button>
    </div>
  </div>

  <p class="text-sm text-gray-600">
    Due: {{ formatDate(props.task.deadline) }}
  </p>
</template>

<script setup>
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { defineProps } from "vue";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { RouteNames } from "@/router";
import axios from "axios";
import { useStore } from "@/store";

const router = useRouter();
const store = useStore();

const props = defineProps({
  task: Object,
});

const openDeleteDialog = ref(false);
const deletingId = ref("");

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

const capitalizePriority = (priority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const confirmDelete = (id) => {
  openDeleteDialog.value = true;
  deletingId.value = id;
};

const deleteTask = () => {
  console.log("Deleting task with id: ", deletingId.value);
  axios
    .delete("https://admin-app-d7o3iig0l-saqebkhans-projects.vercel.app/tasks/" + deletingId.value)
    .then(() => {
      close();
      router.go();
      store.toast = {
        message: "Task deleted successfully",
        type: "success",
        isVisible: true,
      };
    })
    .catch((error) => {
      console.error("Error deleting task: ", error);
      store.toast = {
        message: "Error deleting task",
        type: "error",
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
  console.log("Editing task with id: ", id);
  router.push({
    name: RouteNames.ADD_EDIT_FORM,
    query: { param: "edit", id: id },
  });
};
</script>

<style scoped>
span {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
