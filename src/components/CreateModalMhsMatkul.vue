<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="relative bg-white z-50 p-8 rounded-lg shadow-xl w-full max-w-3xl">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Tambah Data </h2>
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
        <div>
            <label for="mahasiswa" class="block text-sm font-medium text-gray-700">Mahasiswa</label>
            <select
                class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                name="mahasiswa"
                id="mahasiswa"
                v-model="selectedMahasiswa">
                <option value="" disabled selected>-- Pilih Nama --</option>
                <option v-for="mhs in mahasiswa" :key="mhs.id" :value="mhs.id">
                    {{ mhs.nama }}
                </option>
            </select>
            <p v-if="validation.mahasiswa_id" class="mt-1 text-sm text-red-500">{{ validation.mahasiswa_id[0] }}</p>
        </div>

        <div>
            <label for="matkul" class="block text-sm font-medium text-gray-700">Mata Kuliah</label>
            <div @click="toggleDropdown" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm">
              {{ selectedMatkul.length > 0 ? selectedMatkulText : "-- Pilih Mata Kuliah --" }}
            </div>

            <div v-if="isOpen" class="absolute w-96 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              <div v-for="mk in matakuliah" :key="mk.id" class="flex items-center p-2 hover:bg-gray-100">
                <input type="checkbox" :value="mk.id" v-model="selectedMatkul" class="mr-2">
                <span>{{ mk.nama_mk }}</span>
              </div>
            </div>
            <p v-if="validation.mata_kuliah_id" class="mt-1 text-sm text-red-500">{{ validation.mata_kuliah_id[0] }}</p>
        </div>

        <div>
          <label for="semester" class="block text-sm font-medium text-gray-700">Semester</label>
          <select
            class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            name="semester"
            id="semester"
            v-model="semester">
            <option value="" disabled selected>-- Pilih Semester --</option>
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
import { ref, onMounted, computed, reactive, defineEmits } from 'vue'
import axios from 'axios'
import swal from 'sweetalert'

const mahasiswa = ref([]);
const matakuliah = ref([]);
const selectedMahasiswa = ref("");
const selectedMatkul = ref([]);
const semester = ref("");
const isOpen = ref(false);
const emit = defineEmits(['close', 'updateData']);

const validation = reactive({})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
}

  const fetchMahasiswa = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`http://127.0.0.1:8000/api/select-mhs`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        mahasiswa.value = response.data;
    } catch (err) {
        console.error('Gagal mengambil data:', err.response ? err.response.data : err.message);
    }
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

  // Tampilkan nama mata kuliah yang dipilih
  const selectedMatkulText = computed(() => {
    return matakuliah.value
      .filter(mk => selectedMatkul.value.includes(mk.id))
      .map(mk => mk.nama_mk)
      .join(', ');
  });

  function store() {
    const data = {
        mahasiswa_id: selectedMahasiswa.value,
        mata_kuliah_id: [...selectedMatkul.value],
        semester: semester.value
    };

    const token = localStorage.getItem('token');

    axios
        .post(`http://127.0.0.1:8000/api/mahasiswa-mata-kuliah`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response.data.success) {
                swal({
                    title: 'Berhasil!',
                    text: response.data.message,
                    icon: 'success',
                })

                selectedMahasiswa.value = "";
                selectedMatkul.value = [];
                semester.value = "";
                
                emit('close'); 
                emit('updateData')
            } else {
                swal('Gagal!', response.data.message || 'Terjadi kesalahan yang tidak diketahui.', 'error');
            }
        })
        .catch((err) => {
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
        });
  }

  onMounted(() => {
      fetchMahasiswa();
      fetchMatkul();
  });

</script>