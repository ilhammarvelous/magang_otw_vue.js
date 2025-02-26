import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
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
    path: '/verifikasi-otp',
    name: 'verifikasi',
    component: () => import('../views/login/Verifikasi_OTP.vue'),
  },

  {
    path: '/mahasiswa',
    name: 'mahasiswa.index',
    component: () => import('../views/mahasiswa/Index.vue'),
    meta: { requiredMenu: 'Mahasiswa'}
  },

  {
    path: '/matakuliah',
    name: 'matakuliah.index',
    component: () => import('../views/mataKuliah/Index.vue'),
    meta: { requiredMenu: 'Mata Kuliah' }
  },

  {
    path: '/mahasiswa_mata_kuliah',
    name: 'mahasiswa_mata_kuliah.index',
    component: () => import('../views/mahasiswa_mata_kuliah/index.vue'),
    meta: { requiredMenu: 'Mahasiswa_mata_kuliah' }
  },

  {
    path: '/manage_user',
    name: 'manage_user.index',
    component: () => import('../views/manage_user/index.vue'),
    meta: { requiredMenu: 'Manage User' }
  },

  {
    path: '/otorisasi-menu',
    name: 'otorisasi.index',
    component: () => import('../views/otorisasi_menu/index.vue'),
    meta: { requiredMenu: 'Otorisasi Menu' }
  },

  {
    path: '/menu',
    name: 'menu.index',
    component: () => import('../views/menu/index.vue'),
    meta: { requiredMenu: 'Menu' }
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = JSON.parse(localStorage.getItem('authenticated'));
  const allowedMenus = JSON.parse(localStorage.getItem('allowedMenus')) || [];

  const publicPages = ['login', 'register', 'verifikasi'];

  if (to.meta.requiredMenu && !allowedMenus.includes(to.meta.requiredMenu)) {
    console.warn(`Akses ditolak ke: ${to.path} - Tidak ada izin menu`);
    return next({ name: 'mahasiswa.index' });
  }

  if(!publicPages.includes(to.name) && !isAuthenticated){
    return next({ name: 'login'});
  } 
  
  if(to.name === 'login' && isAuthenticated){
    return next({ name: 'mahasiswa.index'});
  }  
  
  next();

})

export default router
