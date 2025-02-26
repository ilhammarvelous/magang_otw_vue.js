<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="relative bg-white z-50 p-8 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Edit otorisasi user</h2>
        <div class="absolute top-0 right-0 p-3">
            <button
                @click="$emit('close')"
                class="text-gray-500 hover:text-gray-800 bg-gray-300 hover:bg-gray-300 rounded-full p-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        
        <div class="modal space-y-2">
            <h3 class="text-lg font-semibold">Izin Menu :</h3>

            <div v-if="loading" class="flex justify-center items-center">
                <div>Memuat....<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>

            <ul class="space-y-2">
                <li v-for="menu in menus" :key="menu.id" class="flex items-center space-x-2">
                    <input type="checkbox" 
                        :value="menu.id"
                        v-model="menu.checked" 
                        class="w-5 h-5 rounded-md border-gray-300 focus:ring-blue-500" />
                    <span class="text-base">{{ menu.name }}</span>
                </li>
            </ul>
        </div>
        <div class="col-span-2">
            <button
                @click="simpanMenu"
                type="submit"
                class="w-50 py-2 px-3 mt-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300">
                Simpan
            </button>
        </div>

        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import axios from 'axios';

    const props = defineProps({
        user: Number,
    });
    const emit = defineEmits(['close']);
    const menus = ref([]);
    const loading = ref(true);
    const selectedMenus = ref([]);
    
    const fetchMenus = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.get(`http://127.0.0.1:8000/api/menus`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            menus.value = response.data.map(menu => ({
                id: menu.id,
                name: menu.menu,
                checked: false
            }));
        } catch (err) {
            console.error('Gagal mengambil data:', err.response ? err.response.data : err.message);
        } finally {
            loading.value = false
        }
    }

    const fetchUserMenus = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(`http://127.0.0.1:8000/api/menus/${props.user}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            selectedMenus.value = response.data.menus

            menus.value = menus.value.map(menu => ({
                ...menu,
                checked: selectedMenus.value.includes(menu.name)
            }));

        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
        } finally{
            loading.value = false
        }
    }

    const simpanMenu = async () => {
        try {
            const token = localStorage.getItem('token');

            const selectedMenusNames = menus.value
                .filter(menu => menu.checked)
                .map(menu => menu.name);
            
            await axios.post(`http://127.0.0.1:8000/api/menus/${props.user}`, 
                {
                    menus: selectedMenusNames
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            swal({
                title: 'Berhasil!',
                text: 'Otorisasi menu berhasil diperbarui',
                icon: 'success',
                showConfirmButton: true,
                timer: 2000
            });
            emit('close');
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
        }
    }

    onMounted(async () => {
        await fetchMenus();
        await fetchUserMenus();
    })
</script>
