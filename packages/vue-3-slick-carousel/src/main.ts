import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import './style.css'
import '@lib/styles/theme.scss'
import App from './App.vue'
import Home from './Home.vue'
import Example from './Example.vue'
import examples from './examples'
import NotFound from './NotFound.vue'

const routes = [
  { path: '/', component: Home },
  ...Object.keys(examples).map((o) => ({
    path: `/example/${o}`,
    component: Example
  })),
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')
