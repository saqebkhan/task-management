import { createRouter, createWebHistory } from "vue-router";
import { useStore } from "@/store";

import DashboardComponent from "./components/DashboardComponent.vue";
import LoginUser from "@/components/LogIn/LoginUser.vue";
import RegisterUser from "@/components/LogIn/RegisterUser.vue";
import TaskManagement from "@/components/TaskManagement/TaskManagement.vue";
import AddEditForm from "@/components/TaskManagement/AddEditForm.vue";
import NotFound from "@/components/common/NotFound.vue";
import { ROUTE_NAMES, TOAST_TYPES } from "@/components/utils/constant";

const routes = [
  {
    path: "/dashboard",
    component: DashboardComponent,
    meta: { requiresAuth: true },
    name: ROUTE_NAMES.DASHBOARD,
  },
  {
    path: "/addEditForm",
    component: AddEditForm,
    meta: { requiresAuth: true },
    name: ROUTE_NAMES.ADD_EDIT_FORM,
  },
  { path: "/", component: LoginUser, name: ROUTE_NAMES.LOGIN },
  { path: "/register", component: RegisterUser, name: ROUTE_NAMES.REGISTER },
  {
    path: "/taskManagement",
    component: TaskManagement,
    meta: { requiresAuth: true },
    name: ROUTE_NAMES.TASK_MANAGEMENT,
  },
  { path: "/:pathMatch(.*)", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const store = useStore();
  store.isLoading = true;
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await store.getCurrentUser()) {
      store.isAuthenticated = true;
      next();
    } else {
      store.toast = {
        message: "Login or register to access the page.",
        type: TOAST_TYPES.ERROR,
        isVisible: true,
      };
      next({ name: ROUTE_NAMES.LOGIN });
    }
  } else {
    next();
  }
  store.isLoading = false;
});

export { ROUTE_NAMES };
export default router;
