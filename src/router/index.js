import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/emergencies/pages/home-view.component.vue";
import UrgenciesView from "@/emergencies/pages/urgencies-view.component.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/guardians/:id/urgencies",
      name: "Urgencies",
      component: UrgenciesView,
    },
  ],
});

export default router;
