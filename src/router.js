import { createRouter, createWebHistory } from "vue-router";
import { useStore } from "@/store";

import DashboardComponent from "./components/DashboardComponent.vue";
import LoginUser from "@/components/LogIn/LoginUser.vue";
import RegisterUser from "@/components/LogIn/RegisterUser.vue";
import TaskManagement from "@/components/TaskManagement/TaskManagement.vue";
import AddEditForm from "@/components/TaskManagement/AddEditForm.vue";
import NotFound from "@/components/common/NotFound.vue";
import NoAccess from "@/components/common/NoAccess.vue";
import { RouteNames } from "@/components/enums/routeNames";
import { toastTypes } from "@/components/enums/toastTypes";

const routes = [
  {
    path: "/dashboard",
    component: DashboardComponent,
    meta: { requiresAuth: true },
    name: RouteNames.DASHBOARD,
  },
  {
    path: "/addEditForm",
    component: AddEditForm,
    meta: { requiresAuth: true },
    name: RouteNames.ADD_EDIT_FORM,
  },
  { path: "/", component: LoginUser, name: RouteNames.LOGIN },
  { path: "/register", component: RegisterUser, name: RouteNames.REGISTER },
  {
    path: "/taskManagement",
    component: TaskManagement,
    meta: { requiresAuth: true },
    name: RouteNames.TASK_MANAGEMENT,
  },
  { path: "/noAccess", component: NoAccess, name: RouteNames.NO_ACCESS },
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
        type: toastTypes.ERROR,
        isVisible: true,
      };
      next({ name: RouteNames.LOGIN });
    }
  } else {
    next();
  }
  store.isLoading = false;
});

export { RouteNames };
export default router;
