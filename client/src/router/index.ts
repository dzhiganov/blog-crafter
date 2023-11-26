import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectsOverviewView from '../views/ProjectsOverviewView.vue'
import NewArticleView from '../views/NewArticleView.vue'
import ArticleView from '../views/ArticleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectsView,
      children: [
        {
          path: '/projects/:projectId',
          component: ProjectsOverviewView,
          children: [
            {
              path: '/projects/:projectId/articles/new',
              component: NewArticleView
            },
            {
              path: '/projects/:projectId/articles/:articleId',
              component: ArticleView
            }
          ]
        }
      ]
    }
  ]
})

export default router
