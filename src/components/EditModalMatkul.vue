<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="relative bg-white z-50 p-8 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Edit Data Mata Kuliah</h2>
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
        <form @submit.prevent="update()" class="grid grid-cols-2 gap-4">
            <!-- Kode -->
            <div>
            <label for="kode" class="block text-sm font-medium text-gray-700">Kode</label>
            <input
                type="text"
                id="kode"
                name="kode"
                class="mt-1 block w-full p-3 border bg-slate-200 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan kode"
                v-model="matakuliah.kode_mk"
                readonly
            />
            <p v-if="validation.kode_mk" class="mt-1 text-sm text-red-500">{{ validation.kode_mk[0] }}</p>
            </div>

            <!-- Nama -->
            <div>
            <label for="nama" class="block text-sm font-medium text-gray-700">Nama</label>
            <input
                type="text"
                id="nama"
                name="nama"
                class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama mata kuliah"
                v-model="matakuliah.nama_mk"
            />
            <p v-if="validation.nama_mk" class="mt-1 text-sm text-red-500">{{ validation.nama_mk[0] }}</p>
            </div>

            <!-- SKS -->
            <div>
                <label for="sks" class="block text-sm font-medium text-gray-700">SKS</label>
                <input
                    type="text"
                    id="sks"
                    name="sks"
                    class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan sks"
                    v-model="matakuliah.sks"
                />
                <p v-if="validation.sks" class="mt-1 text-sm text-red-500">{{ validation.sks[0] }}</p>
            </div>

            <div class="col-span-2">
                <button
                    type="submit"
                    class="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300">
                    Submit
                </button>
            </div>
        </form>
        </div>
    </div>
</template>

<script setup>
    import { reactive, ref, watch } from 'vue'
    import axios from 'axios'
    import swal from 'sweetalert'
    import { useRouter } from 'vue-router';

    const router = useRouter()
    const emit = defineEmits(['close', 'updateData'])
    const loading = ref(true);
    const error = ref(null);
    const validation = reactive({})
    
    const props = defineProps({
        matkulId: Number
    })

    let matakuliah = reactive({
        kode_mk: '',
        nama_mk: '',
        sks: '',
    })

    function editMatkul(id){
            if(!id) return
                
            loading.value = true
            error.value = null

            const token = localStorage.getItem('token');
            if(!token){
                swal('Error', 'Token tidak ditemukan. Silakan login ulang!', 'error');
                router.push('/');
                return;
            }

            axios.get(`http://127.0.0.1:8000/api/mata-kuliah/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => {
                matakuliah.kode_mk = result.data.data.kode_mk;
                matakuliah.nama_mk = result.data.data.nama_mk;
                matakuliah.sks = result.data.data.sks;
            }).catch((err) => {
                console.log(err.response.data);
                swal('Error', 'Gagal memuat data mata kuliah!', 'error');
            });
    }

    function update() {
            const token = localStorage.getItem('token');

            if(!token){
                swal('Error', 'Token tidak ditemukan. Silakan login ulang!', 'error');
                router.push('/');
                return;
            }

            axios.put(`http://127.0.0.1:8000/api/mata-kuliah/${props.matkulId}`, matakuliah, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                swal({
                    title: 'Berhasil!',
                    text: 'Data mata kuliah berhasil diperbarui.',
                    icon: 'success',
                })
                emit('updateData')
                emit('close')
            })
            .catch((err) => {
                if (err.response && err.response.status === 422) {
                    Object.assign(validation, err.response.data.errors)
                    swal('Gagal!', 'Terjadi kesalahan saat memperbarui data. Silahkan cek inputan data Anda !!', 'error');
                } else {
                    swal('Error', 'Terjadi kesalahan pada server.', 'error');
                }
            })
    }

        watch(() => props.matkulId, (newId) => {
            editMatkul(newId)
        }, {
            immediate: true
        })
</script>