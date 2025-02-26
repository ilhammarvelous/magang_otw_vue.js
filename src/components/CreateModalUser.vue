<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="relative bg-white z-50 p-8 rounded-lg shadow-xl w-full max-w-3xl">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Tambah user baru</h2>
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
        <!-- Nama -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nama</label>
          <input
            type="text"
            id="name"
            name="name"
            class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan nama"
            v-model="user.name"
          />
          <p v-if="validation.name" class="mt-1 text-sm text-red-500">{{ validation.name[0] }}</p>
        </div>

        <!-- email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan email"
            v-model="user.email"
          />
          <p v-if="validation.email" class="mt-1 text-sm text-red-500">{{ validation.email[0] }}</p>
        </div>

        <!-- password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan password"
            v-model="user.password"
          />
          <p v-if="validation.password" class="mt-1 text-sm text-red-500">{{ validation.password[0] }}</p>
        </div>

        <!-- No hp -->
        <div>
          <label for="no_wa" class="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
          <input
            type="text"
            id="no_wa"
            name="no_wa"
            class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan nomor whatsapp"
            v-model="user.no_wa"
          />
          <p v-if="validation.no_wa" class="mt-1 text-sm text-red-500">{{ validation.no_wa[0] }}</p>
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

const user = reactive({
    name: '',
    email: '',
    no_wa: '',
    password: '',
})
const validation = reactive({})

async function store() {
    try {
        const token = localStorage.getItem('token');

        await axios.post(`http://127.0.0.1:8000/api/user`, user, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        swal({
            title: 'Berhasil!',
            text: 'Data user berhasil ditambahkan.',
            icon: 'success',
        });

        emit('close');
        emit('updateData');

        Object.assign(user, {
            name: '',
            email: '',
            no_wa: '',
            password: '',
        });
    } catch (err) {
      if (err.response && err.response.status === 422) {
            Object.assign(validation, err.response.data.errors)
            swal({
                title: 'Gagal!',
                icon: 'error',
                text: 'Terjadi kesalahan, Silahkan cek inputan anda !!!',
                showConfirmButton: true,
                timer: 2000
              });
          } else {
            swal({
                title: 'Gagal!',
                icon: 'error',
                text: 'Terjadi kesalahan pada server.',
                showConfirmButton: true,
                timer: 2000
              });
          }
    }
}


</script>