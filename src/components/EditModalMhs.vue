<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="relative bg-white z-50 p-8 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Edit Data Mahasiswa</h2>
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
            <!-- Nim -->
            <div>
            <label for="nim" class="block text-sm font-medium text-gray-700">Nim</label>
            <input
                type="number"
                id="nim"
                name="nim"
                class="mt-1 block w-full bg-slate-200 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nim"
                v-model="mahasiswa.nim"
                readonly
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
                v-model="mahasiswa.agama">
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
                v-model="mahasiswa.prodi">
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
                v-model="mahasiswa.status">
                <option value="" disabled selected>-- Pilih Status --</option>
                <option value="Aktif">Aktif</option>
                <option value="Tidak aktif">Tidak aktif</option>
            </select>
            <p v-if="validation.status" class="mt-1 text-sm text-red-500">
                {{ validation.status[0] }}
            </p>
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
    import { reactive, ref, watch } from 'vue'
    import axios from 'axios'
    import swal from 'sweetalert'
    import { useRouter } from 'vue-router';

export default {
    props:{
        mahasiswaId: Number
    },
    setup(props, {emit}) {
        let mahasiswa = reactive({
        nim: '',
        nama: '',
        no_hp: '',
        agama: '',
        prodi: '',
        status: '',
        })

        const router = useRouter();
        const loading = ref(true);
        const error = ref(null);

        const validation = reactive({})

        function editMahasiswa(id){
            if(!id) return
                
            loading.value = true
            error.value = null

            const token = localStorage.getItem('token');
            if(!token){
                swal('Error', 'Token tidak ditemukan. Silakan login ulang!', 'error');
                router.push('/');
                return;
            }

            axios.get(`http://127.0.0.1:8000/api/mahasiswas/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => {
                mahasiswa.nim = result.data.data.nim
                mahasiswa.nama = result.data.data.nama
                mahasiswa.no_hp = result.data.data.no_hp
                mahasiswa.agama = result.data.data.agama
                mahasiswa.prodi = result.data.data.prodi
                mahasiswa.status = result.data.data.status
            }).catch((err) => {
                console.log(err.response.data);
                swal('Error', 'Gagal memuat data mahasiswa!', 'error');
            });
        }

        function update() {
            const token = localStorage.getItem('token');
            if(!token){
                swal('Error', 'Token tidak ditemukan. Silakan login ulang!', 'error');
                router.push('/');
                return;
            }

            axios.put(`http://127.0.0.1:8000/api/mahasiswas/${props.mahasiswaId}`, mahasiswa, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                swal({
                    title: 'Berhasil!',
                    text: 'Data mahasiswa berhasil diperbarui.',
                    icon: 'success',
                    showConfirmButton: true,
                    timer: 2000
                })
                emit('updated')
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

        watch(() => props.mahasiswaId, (newId) => {
            editMahasiswa(newId)
        }, {
            immediate: true
        })

        return {
        mahasiswa,
        validation,
        loading,
        error,
        update
        }
    },
}
</script>
