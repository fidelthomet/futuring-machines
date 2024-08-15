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
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/:template/:id?',
      name: 'editor',
      component: () => import('../views/EditorView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const dataStore = useCommandStore()
  if (to.name === 'editor') {
    if (to.params.id == null) {
      return next({
        name: to.name,
        params: { template: to.params.template, id: crypto.randomUUID() }
      })
    }
    dataStore.templateName = to.params.template
    dataStore.storyId = to.params.id
  } else {
    dataStore.templateName = null
  }
  next()
})

export default router
