import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectsOverviewView from '../views/ProjectsOverviewView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: HomeView
    },
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectsView
    },
    {
      path: '/projects/:projectId',
      component: ProjectsOverviewView
    },
    {
      path: '/projects/:projectId/articles/new',
      component: () => import('../views/NewArticleView.vue')
    },
    {
      path: '/projects/:projectId/articles/:articleId',
      component: () => import('../views/ArticleView.vue')
    }
  ]
})

export default router
