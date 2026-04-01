import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', component: () => import('@/views/Home.vue') },
      { path: 'web-design', name: 'WebDesign', component: () => import('@/views/WebDesign.vue') },
      { path: 'web-design/edit/:id?', name: 'WebDesignEdit', component: () => import('@/views/WebDesignEdit.vue') },
      { path: 'graduation', name: 'Graduation', component: () => import('@/views/Graduation.vue') },
      { path: 'graduation/edit/:id?', name: 'GraduationEdit', component: () => import('@/views/GraduationEdit.vue') },
      { path: 'feedback', name: 'Feedback', component: () => import('@/views/Feedback.vue') },
      { path: 'changelog', name: 'Changelog', component: () => import('@/views/Changelog.vue') },
      { path: 'about', name: 'About', component: () => import('@/views/About.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
