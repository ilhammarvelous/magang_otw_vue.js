<template>
  <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="relative bg-white z-50 p-8 rounded-lg shadow-xl w-full max-w-3xl">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Tambah Data Mahasiswa</h2>
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
        <!-- Nim -->
        <div>
          <label for="nim" class="block text-sm font-medium text-gray-700">Nim</label>
          <input
            type="text"
            id="nim"
            name="nim"
            class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan nim"
            v-model="mahasiswa.nim"
          />
          <p v-if="validation.nim" class="mt-1 text-sm text-red-500">{{ validation.nim[0] }}</p>
        </div>

        <!-- Nama -->
        <div>
          <label for="nama" class="block text-sm font-medium text-gray-700">Nama</label>
          <input
            type="text"
            id="nama"
            name="nama"
            class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan nama"
            v-model="mahasiswa.nama"
          />
          <p v-if="validation.nama" class="mt-1 text-sm text-red-500">{{ validation.nama[0] }}</p>
        </div>

        <!-- No hp -->
        <div>
          <label for="no_hp" class="block text-sm font-medium text-gray-700">No hp</label>
          <input
            type="text"
            id="no_hp"
            name="no_hp"
            class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan no hp"
            v-model="mahasiswa.no_hp"
          />
          <p v-if="validation.no_hp" class="mt-1 text-sm text-red-500">{{ validation.no_hp[0] }}</p>
        </div>

        <!-- agama -->
        <div>
          <label for="agama" class="block text-sm font-medium text-gray-700">Agama</label>
          <select
            class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            name="agama"
            id="agama"
            v-model="mahasiswa.agama"
          >
            <option value="" disabled selected>-- Pilih Agama --</option>
            <option value="Islam">Islam</option>
            <option value="Protestan">Protestan</option>
            <option value="Katholik">Katholik</option>
            <option value="Hindu">Hindu</option>
            <option value="Budha">Budha</option>
            <option value="Konghucu">Konghucu</option>
          </select>
          <p v-if="validation.agama" class="mt-1 text-sm text-red-500">{{ validation.agama[0] }}</p>
        </div>

        <!-- prodi -->
        <div>
          <label for="prodi" class="block text-sm font-medium text-gray-700">Prodi</label>
          <select
            class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            name="prodi"
            id="prodi"
            v-model="mahasiswa.prodi"
          >
            <option value="" disabled selected>-- Pilih Prodi --</option>
            <option value="Teknik Informatika">Teknik Informatika</option>
            <option value="Teknik Sipil">Teknik Sipil</option>
            <option value="Teknik Industri">Teknik Industri</option>
            <option value="Teknik Mesin">Teknik Mesin</option>
            <option value="Teknik Elektro">Teknik Elektro</option>
            <option value="Teknik Arsitektur">Teknik Arsitektur</option>
          </select>
          <p v-if="validation.prodi" class="mt-1 text-sm text-red-500">{{ validation.prodi[0] }}</p>
        </div>

        <!-- status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            name="status"
            id="status"
            v-model="mahasiswa.status"
          >
            <option value="" disabled selected>-- Pilih Status --</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak aktif">Tidak aktif</option>
          </select>
          <p v-if="validation.status" class="mt-1 text-sm text-red-500">{{ validation.status[0] }}</p>
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

<script>
import { reactive, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import swal from 'sweetalert'
export default {
  setup(_,{emit}) {
    const mahasiswa = reactive({
      nim: '',
      nama: '',
      no_hp: '',
      agama: '',
      prodi: '',
      status: '',
    })

    const validation = reactive({})

    const router = useRouter()

    function store() {
      const token = localStorage.getItem('token')

      axios
        .post(`http://127.0.0.1:8000/api/mahasiswas`, mahasiswa, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          swal({
            title: 'Berhasil!',
            text: 'Data mahasiswa berhasil ditambahkan.',
            icon: 'success',
          })
            emit('close') 
            emit('updateData')
            Object.assign(mahasiswa, {
              nim: '',
              nama: '',
              no_hp: '',
              agama: '',
              prodi: '',
              status: '',
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

        return {
            mahasiswa,
            validation,
            router,
            store,
        }
    },
}
</script>
