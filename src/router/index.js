import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useCommandStore } from '@/stores/commands'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/index.html',
      name: 'index',
      component: HomeView
    },
    {
      path: '/settings',
      name: 'settings',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/:template',
      name: 'editor',
      component: () => import('../views/EditorView.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  const dataStore = useCommandStore()
  if (to.name === 'editor') {
    dataStore.templateName = to.params.template
  } else {
    dataStore.templateName = null
  }
})

export default router
