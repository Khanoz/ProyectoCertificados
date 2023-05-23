import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from '@/stores';

const routes = [
  {
    path: "/",
    name: "Landing",
    component: () => import("@/views/landingPage/landingPageView.vue"),
  },
  {
    path: "/terms",
    name: "Terms",
    component: () => import("@/views/landingPage/termsPageView.vue"),
  },
  {
    path: "/user-setup",
    name: "UserSetup",
    component: () => import("@/views/app/userSetupView.vue"),
  },
  {
    path: "/app",
    name: "App",
    component: () => import("@/views/app/containerView.vue"),
    children: [
      {
        path: "main",
        name: "Main",
        component: () => import("@/views/app/mainView.vue"),
      },
      {
        path: 'search',
        name: "Search",
        component: () => import("@/views/app/searchView.vue"),
        beforeEnter: (to) => {
          const filter = to.query.filter;
          const validFilters=["nextDays", "upcoming", "userAdquired", "search", "own"];
          if(validFilters.indexOf(filter) === -1 ){
            return {name: "Search", query: {filter: "search", q: to.query.filter}}
          }
        },
      }
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: "NotFound",
    component: () => import("@/views/404/notFoundView.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const userStore = useUserStore();


  if(to.name === "Landing" && userStore.authToken){
    return {name: "App"};
  }

  // Redirección a Main
  if(to.name === "App"){
    return {name: "Main"};

  }

  // Path protegidos
  const protectedPath = ["/app", "/user-setup"];
  let isProtectedPath = false;
  protectedPath.forEach((path: string) => isProtectedPath = isProtectedPath || to.fullPath.includes(path));
  if(isProtectedPath && !userStore.authToken){
    return {name: "Landing"}
  }
})

export default router;
