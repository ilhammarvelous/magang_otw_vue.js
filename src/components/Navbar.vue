<template>
    <nav class="absolute top-0 left-0 w-full z-10 bg-blue-500 md:flex-row md:flex-nowrap md:justify-start flex items-center p-3">
        <div class="w-full mx-auto items-center flex md:flex-nowrap flex-wrap md:px-10 px-4">
            <router-link v-if="isAllowed('Mahasiswa')" :to="{ name: 'mahasiswa.index' }" class="text-white hover:text-blue-200 ml-3 text-sm tracking-wide lg:inline-block">
                Mahasiswa
            </router-link>
            <router-link v-if="isAllowed('Mata Kuliah')" :to="{ name: 'matakuliah.index'}" class="text-white hover:text-blue-200 ml-6 text-sm tracking-wide lg:inline-block">
                Mata Kuliah
            </router-link>
            <router-link v-if="isAllowed('Mahasiswa_mata_kuliah')" :to="{ name: 'mahasiswa_mata_kuliah.index'}" class="text-white hover:text-blue-200 ml-6 text-sm tracking-wide lg:inline-block">
                Mahasiswa_mata_kuliah
            </router-link>
            <router-link v-if="isAllowed('Manage User')" :to="{ name: 'manage_user.index'}" class="text-white hover:text-blue-200 ml-6 text-sm tracking-wide lg:inline-block">
                Manage User
            </router-link>
            <router-link v-if="isAllowed('Otorisasi Menu')" :to="{ name: 'otorisasi.index'}" class="text-white hover:text-blue-200 ml-6 text-sm tracking-wide lg:inline-block">
                Otorisasi Menu
            </router-link>
            <router-link v-if="isAllowed('Menu')" :to="{ name: 'menu.index'}" class="text-white hover:text-blue-200 ml-6 text-sm tracking-wide lg:inline-block">
                Menu
            </router-link>
        </div>
        <div ref="dropdownRef" class="flex justify-end mr-11 text-sm space-x-2">
            <button @click="toggleDropdown" class="flex items-center space-x-2">
                    <span class="text-white">Hi,</span>
                    <span class="text-white">{{ user }}</span>
                    <img src="@/assets/images/aku.jpg" class="w-10 h-10 rounded-full object-cover" />
            </button>
            <div v-if="dropdown" class="absolute right-7 mt-11 bg-white hover:bg-slate-300 text-black rounded-lg shadow-lg">
                <button @click.prevent="logout()" class="flex p-2 px-3 text-md font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                        Logout
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import swal from 'sweetalert';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const router = useRouter();
const user = ref(null);
const dropdown = ref(false);
const dropdownRef = ref(null);

const authStore = useAuthStore();
const { allowedMenus } = storeToRefs(authStore);

const isAllowed = (menuName) => {
    return allowedMenus.value.includes(menuName);
}

const toggleDropdown = (event) => {
    event.stopPropagation();
    dropdown.value = !dropdown.value;
}

const closeDropdown = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        dropdown.value = false;
    }
};

onMounted(() => {
    const simpanUser = localStorage.getItem('user');
    try {
        user.value = JSON.parse(simpanUser);
    } catch (error) {
        console.error("Gagal parsing user data:", error);
        user.value = null;
    }

    window.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
    window.removeEventListener("click", closeDropdown);
});

const logout = () => {
    const token = localStorage.getItem('token');

        axios
        .get(`http://127.0.0.1:8000/api/user/logout`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('authenticated');
            localStorage.removeItem('user');
            localStorage.removeItem('user_id');
            localStorage.removeItem('allowedMenus');
            
            router.push({
                name: 'login'
            })
            swal({
                title:'Berhasil!',
                text: 'Berhasil logout',
                icon: 'success',
            })
        })
        .catch(() => {
            swal('Error', 'Terjadi kesalahan', 'error');
        });
}
</script>