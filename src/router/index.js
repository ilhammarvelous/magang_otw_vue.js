import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/login/register.vue';
import Login from '../views/login/login.vue';


const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },

  {
    path: '/register',
    name: 'register',
    component: Register,
  },

  {
    path: '/mahasiswa',
    name: 'index',
    component: () => import('../views/mahasiswa/Index.vue'),
  },

  {
    path: '/mahasiswa/edit/:id',
    name: 'mahasiswa.edit',
    component: () => import('../views/mahasiswa/Edit.vue'),
  },

  {
    path: '/verifikasi-otp',
    name: 'verifikasi',
    component: () => import('../views/login/Verifikasi_OTP.vue'),
  },

  {
    path: '/matakuliah',
    name: 'matakuliah.index',
    component: () => import('../views/mataKuliah/Index.vue'),
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = JSON.parse(localStorage.getItem('authenticated'));

  const publicPages = ['login', 'register'];

  if(!publicPages.includes(to.name) && !isAuthenticated){
    next({ name: 'login'});
  } else if(to.name === 'login' && isAuthenticated){
    next({ name: 'index'});
  } else {
    next();
  } 
})

export default router
