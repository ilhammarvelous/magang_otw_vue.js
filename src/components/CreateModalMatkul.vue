<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="relative bg-white z-50 p-8 rounded-lg shadow-xl w-full max-w-3xl">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">Tambah Data Mata Kuliah</h2>
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

            <form @submit.prevent="store()" class="grid grid-cols-2 gap-4">
                <!-- Kode -->
                <div>
                    <label for="kode" class="block text-sm font-medium text-gray-700">Kode</label>
                    <input
                        type="text"
                        id="kode"
                        name="kode"
                        class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Masukkan kode"
                        v-model="matakuliah.kode_mk"
                    />
                    <p v-if="validation.kode_mk" class="mt-1 text-sm text-red-500">{{ validation.kode_mk[0] }}</p>
                </div>

                <!-- Nama -->
                <div>
                    <label for="nama_mk" class="block text-sm font-medium text-gray-700">Nama</label>
                    <input
                        type="text"
                        id="nama_mk"
                        name="nama_mk"
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

                <!-- Tombol Submit -->
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
import { reactive } from 'vue'
import axios from 'axios'
import swal from 'sweetalert'

const emit = defineEmits(['close', 'updateData'])

const matakuliah = reactive({
    kode_mk: '',
    nama_mk: '',
    sks: '',
})

const validation = reactive({})

function store(){
    const token = localStorage.getItem('token')

    axios
        .post(`http://127.0.0.1:8000/api/mata-kuliah`, matakuliah, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            swal({
                title: 'Berhasil!',
                text: 'Data mata kuliah berhasil ditambahkan.',
                icon: 'success',
            })
            emit('close') 
            emit('updateData')
            Object.assign(matakuliah, {
                kode_mk: '',
                nama_mk: '',
                sks: '',
            })
        })
        .catch((err) => {
            if (err.response && err.response.status === 422) {
                Object.assign(validation, err.response.data.errors)
                swal('Gagal!', 'Terjadi kesalahan, Silahkan cek inputan data !!!', 'error')
            } else {
                swal('Error', 'Terjadi kesalahan pada server.', 'error')
            }
        })
}
</script>