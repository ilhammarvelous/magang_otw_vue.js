<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="relative bg-white z-50 p-8 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Edit Data</h2>
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
            <!-- Nama -->
            <div>
                <label for="mhs" class="block text-sm font-medium text-gray-700">Mahasiswa</label>
                <input
                    type="text"
                    id="mhs"
                    name="mhs"
                    class="mt-1 block w-full p-3 border bg-slate-200 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama"
                    v-model="mhsMk.mahasiswa"
                    readonly
                />
            </div>

            <div>
                <label for="matkul" class="block text-sm font-medium text-gray-700">Mata kuliah</label>
                <select
                    class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    name="matkul"
                    id="matkul"
                    v-model="mhsMk.mata_kuliah_id">
                    <option v-for="mk in matakuliah" :key="mk.id" :value="mk.id">
                        {{ mk.nama_mk }}
                    </option>
                </select>
            </div>

            <div>
                <label for="semester" class="block text-sm font-medium text-gray-700">Semester</label>
                <select
                    class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    name="semester"
                    id="semester"
                    v-model="mhsMk.semester">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                </select>
                <p v-if="validation.semester" class="mt-1 text-sm text-red-500">{{ validation.semester[0] }}</p>
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
    import { reactive, ref, watch, onMounted } from 'vue'
    import axios from 'axios'
    import swal from 'sweetalert'
    import { useRouter } from 'vue-router';

    const router = useRouter()
    const matakuliah = ref([]);
    const emit = defineEmits(['close', 'updateData'])
    const loading = ref(true);
    const error = ref(null);
    const validation = reactive({})

    const props = defineProps({
        mhsMkId: Number
    })
    
    let mhsMk = reactive({
        mahasiswa: '',
        mata_kuliah_id: '',
        semester: '',
    })

    function fetchData(id){
            if(!id) return
                
            loading.value = true
            error.value = null

            const token = localStorage.getItem('token');
            if(!token){
                swal('Error', 'Token tidak ditemukan. Silakan login ulang!', 'error');
                router.push('/');
                return;
            }

            axios.get(`http://127.0.0.1:8000/api/mahasiswa-mata-kuliah/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => {
                mhsMk.mahasiswa = result.data.data.mahasiswa;
                mhsMk.mata_kuliah_id = result.data.data.mata_kuliah_id;
                mhsMk.semester = result.data.data.semester;
            }).catch((err) => {
                console.error('Gagal memuat data:', err.response ? err.response.data : err.message);
                swal('Error', 'Gagal memuat data!', 'error');
            });
    }

    const fetchMatkul = async () => {
        try {
                const token = localStorage.getItem('token');

                const response = await axios.get(`http://127.0.0.1:8000/api/select-mk`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                matakuliah.value = response.data;
        } catch (err) {
                console.error('Gagal mengambil data:', err.response ? err.response.data : err.message);
        }
    }

    function update() {
            const token = localStorage.getItem('token');

            if(!token){
                swal('Error', 'Token tidak ditemukan. Silakan login ulang!', 'error');
                router.push('/');
                return;
            }

            axios.put(`http://127.0.0.1:8000/api/mahasiswa-mata-kuliah/${props.mhsMkId}`, mhsMk, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                swal({
                    title: 'Berhasil!',
                    text: 'Data mata kuliah berhasil diperbarui.',
                    icon: 'success',
                    showConfirmButton: true,
                    timer: 2000
                })
                emit('close')
                emit('updateData')
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

    onMounted(() => {
        fetchMatkul();
    })

        watch(() => props.mhsMkId, (newId) => {
            fetchData(newId)
        }, {
            immediate: true
        })
</script>