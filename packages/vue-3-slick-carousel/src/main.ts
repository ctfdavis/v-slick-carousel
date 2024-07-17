import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import './style.css'
import '@lib/styles/theme.scss'
import App from './App.vue'
import Home from './Home.vue'
import Example from './Example.vue'
import examples from './examples'
import NotFound from './NotFound.vue'

const routes = [
  { path: '/', component: Home },
  {
    path: '/example',
    redirect: {
      name: Object.values(examples).find((o) => o.order === 1)!.id
    }
  },
  ...Object.keys(examples).map((k) => ({
    path: `/example/${k}`,
    name: k,
    component: Example
  })),
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App)
  .use(Quasar, {
    plugins: {}
  })
  .use(router)
  .mount('#app')
