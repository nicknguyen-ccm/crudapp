import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { createWebHistory, createRouter } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import PostForm from './components/PostForm.vue'
import DetailPage from './components/DetailPage.vue'


const routes = [
    {path: '/' , component: HelloWorld},
    {path: '/form', component: PostForm},
    {path: '/post/:id', name:'post', component: DetailPage, }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
library.add(faArrowUp)
library.add(faArrowDown)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
