<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="relative bg-white z-50 p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">Detail Data Mata Kuliah</h2>
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
            <div class="space-y-4">
                <div>
                    <p><strong>Kode</strong> <br> {{ matakuliah.kode_mk }}</p>
                </div>
                <div>
                    <p><strong>Nama</strong> <br> {{ matakuliah.nama_mk }}</p>
                </div>
                <div>
                    <p><strong>SKS</strong> <br> {{ matakuliah.sks }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { reactive, ref, watch } from 'vue';
    import axios from 'axios';
    import swal from 'sweetalert';
    import { useRouter } from 'vue-router';

    const props = defineProps({
        matkulId: Number
    })

    const router = useRouter();
    const matakuliah = reactive({});
    const loading = ref(true);
    const error = ref(null);

    function detailMatkul(id){
        if(!id) return

        loading.value = true
        error.value = null

        const token = localStorage.getItem('token');

        if(!token){
            swal('Error', 'Token tidak ditemukan. Silakan login ulang!', 'error');
            router.push('/');
            return;
        }

        axios
            .get(`http://127.0.0.1:8000/api/mata-kuliah/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                matakuliah.kode_mk = response.data.data.kode_mk;
                matakuliah.nama_mk = response.data.data.nama_mk;
                matakuliah.sks = response.data.data.sks;
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    error.value = 'Data tidak ditemukan!';
                } else {
                    error.value = 'Terjadi kesalahan pada server.';
                }
            })
            .finally(() => {
                loading.value = false;
            });
    }

            watch(() => props.matkulId, (newId) => {
                detailMatkul(newId)
            }, {
                immediate: true
            })  
</script>