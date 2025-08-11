import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

// Import components
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Profile from './views/Profile.vue'
import CreatePost from './views/CreatePost.vue'
import PostDetail from './views/PostDetail.vue'

// Define routes
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/create-post', name: 'CreatePost', component: CreatePost },
  { path: '/post/:id', name: 'PostDetail', component: PostDetail, props: true }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})



const app = createApp(App)
app.use(router)
app.mount('#app')
