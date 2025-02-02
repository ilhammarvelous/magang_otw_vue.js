<template>
    <nav class="absolute top-0 left-0 w-full z-10 bg-blue-500 md:flex-row md:flex-nowrap md:justify-start flex items-center p-3">
        <div class="w-full mx-autp items-center flex md:flex-nowrap flex-wrap md:px-10 px-4">
        <!-- Brand -->
        <a href="" class="text-white hover:text-blue-200 ml-3 text-md tracking-wide lg:inline-block">
            Mahasiswa
        </a>
        <router-link :to="{ name: 'matakuliah.index'}" class="text-white hover:text-blue-200 ml-3 text-md tracking-wide lg:inline-block">
            Mata Kuliah
        </router-link>
        <!-- Form -->

            <!-- User -->
            <ul class="flex-col md:flex-row list-none items-center hidden md:flex">
                <user-dropdown />
            </ul>
        </div>
        <div class="flex justify-end mr-11">
            <button class="flex items-center p-2 px-3 text-md font-medium tracking-wide text-white bg-blue-700 rounded-lg hover:bg-blue-600" @click.prevent="logout()">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>
                    Logout
            </button>
        </div>
    </nav>

    <div class="p-10 bg-gray-200 h-screen mt-10">
        <h1 class="text-3xl ml-5 mt-5 uppercase">Tabel Mahasiswa</h1>
        <div class="grid grid-cols-2 gap-6 mt-5">
            <div class="ml-6 mt-2">

                <button @click="isModalOpen = true" class="flex items-center p-2 text-md font-medium tracking-wide text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition w-28">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Tambah
                </button>

                <!-- Modal create -->
                <createModalMhs v-if="isModalOpen" @close="isModalOpen = false" @updateData="fetchMahasiswa(page)"/>
            </div>
            <form
                    class="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-6">
                    <div class="relative flex w-full flex-wrap items-stretch">
                        <span
                            class="z-10 h-full leading-snug font-normaltext-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 23" stroke-width="1.5" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search here..."
                            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                        />
                    </div>
            </form>
        </div>

        <div v-if="loading" class="flex justify-center items-center">
            <div class="lds-roller">Memuat...<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>

        <div class="overflow-auto rounded-lg shadow mt-3 container">
            <table v-if="mahasiswas.data" class="table-auto w-full text-md text-gray-700 border border-gray-300">
                <thead class="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">No</th>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">Nim</th>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">Nama</th>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">No hp</th>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">Agama</th>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">Prodi</th>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">Status</th>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!mahasiswas.data || !mahasiswas.data.data || mahasiswas.data.data.length === 0">
                        <td colspan="8" class="p-3 text-center bg-white text-sm text-gray-700 whitespace-nowrap">
                            Data mahasiswa belum ada.
                        </td>
                    </tr>
                    <tr 
                        v-else
                        v-for="(mahasiswa, index) in mahasiswas.data.data" 
                        :key="index" 
                        class="bg-white border-b odd:bg-gray-100 even:bg-white text-left">
                            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">{{ index + mahasiswas.data.from }}</td>
                            <td class="p-3 text-sm text-gray-700 whitespace-nowrap"><span class="text-blue-500">{{ mahasiswa.nim }}</span></td>
                            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">{{ mahasiswa.nama }}</td>
                            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">{{ mahasiswa.no_hp }}</td>
                            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">{{ mahasiswa.agama }}</td>
                            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">{{ mahasiswa.prodi }}</td>
                            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                                <span :class="{
                                    'p-1.5 text-xs font-medium uppercase tracking-wide rounded-lg bg-opacity-50': true, 'text-green-800 bg-green-200': mahasiswa.status === 'Aktif',
                                    'text-red-800 bg-red-200': mahasiswa.status === 'Tidak aktif'
                                    }">
                                    {{ mahasiswa.status }}
                                </span>
                            </td>
                            <td class="flex items-center mt-2 mb-2">
                                <button @click="detailMhs(mahasiswa.id)" class="flex items-center p-2 px-3 mx-1 text-md font-medium tracking-wide text-white bg-slate-400 rounded-lg hover:bg-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </button>

                                <button @click="editMhs(mahasiswa.id)" class="flex items-center p-2 px-3 mx-1 text-md font-medium tracking-wide text-white bg-blue-600 rounded-lg hover:bg-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>

                                <!-- <router-link :to="{ name: 'mahasiswa.edit', params:{id: mahasiswa.id}}" >
                                    
                                </router-link> -->

                                <button class="flex items-center p-2 px-3 mx-1 text-md font-medium tracking-wide text-white bg-red-600 rounded-lg hover:bg-red-500" @click.prevent="destroy(mahasiswa.id, index)">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                </tbody>
            </table>
        </div>

        <!-- Paginasi -->
        <div class="mt-3 flex justify-end mr-5 items-center space-x-1.5">
            <button
                class="px-3 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                :disabled="currentPage === 1"
                @click="fetchMahasiswa(currentPage - 1)">
                << Previous
            </button>

            <button
                v-for="page in totalPages"
                :key="page"
                :class="[
                'px-4 py-2 rounded',
                currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-400'
                ]"
                @click="fetchMahasiswa(page)"
            >
                {{ page }}
            </button>

            <button
                class="px-3 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                :disabled="currentPage === totalPages"
                @click="fetchMahasiswa(currentPage + 1)"
            >
                Next >>
            </button>

            <!-- Modal detail -->
            <DetailModalMhs 
                v-if="showModalDetail"
                :mahasiswaId = "selectedId"
                @close="showModalDetail = false" 
            />

            <!-- Modal edit -->
            <EditModalMhs 
                v-if="showModalEdit"
                :mahasiswaId = "selectedId"
                @close="showModalEdit = false"
                @updated="fetchMahasiswa"
            />
        </div>
    </div>
</template>

<script>
import createModalMhs from '@/components/createModalMhs.vue';
import DetailModalMhs from '@/components/DetailModalMhs.vue';
import EditModalMhs from '@/components/EditModalMhs.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import swal from 'sweetalert';

export default {
    components:{
        createModalMhs,
        DetailModalMhs,
        EditModalMhs
    },
    setup(){
        let isModalOpen = ref(false);
        let mahasiswas = ref([]);
        const showModalDetail = ref(false);
        const showModalEdit = ref(false);
        const selectedId = ref(null);
        const currentPage = ref(1);
        const totalPages = ref(0);

        const loading = ref(true);
        const router = useRouter();

        const bukaModal = () => isModalOpen.value = true;
        const tutupModal = () => isModalOpen.value = false; 
        
        onMounted(() => {
            fetchMahasiswa();
        });

        const fetchMahasiswa = async (page = 1) => {
            try {
                const token = localStorage.getItem('token');
                
                const response = await axios.get(`http://127.0.0.1:8000/api/mahasiswas?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                mahasiswas.value.data = response.data.data
                currentPage.value = response.data.data.current_page
                totalPages.value = response.data.data.last_page;
                
            } catch (err) {
                console.error('Gagal mengambil data:', err.response ? err.response.data : err.message);
            } finally {
                loading.value = false
            }
        }

        const destroy = async (id) => {
            swal({
                title: "Apakah Anda yakin?",
                text: "Setelah dihapus, Anda tidak akan dapat memulihkan data ini lagi!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const token = localStorage.getItem("token");
                        if (!token) {
                            swal("Gagal!", "Anda harus login terlebih dahulu!", "error");
                            return;
                        }

                        // Hapus data di backend
                        await axios.delete(`http://127.0.0.1:8000/api/mahasiswas/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        if (mahasiswas.value && mahasiswas.value.length > 0) {
                            mahasiswas.value = mahasiswas.value.filter((item) => item.id !== id);
                        } else {
                            fetchMahasiswa();
                        }

                        swal({
                            title: "Berhasil!",
                            text: "Data mahasiswa berhasil dihapus!",
                            icon: "success",
                        });
                    } catch (err) {
                        swal("Error!", err.response?.data?.message || "Terjadi kesalahan pada server.", "error");
                    }
                } else {
                    swal("Data mahasiswa tidak jadi dihapus");
                }
            });
        };

        function detailMhs(id){
            selectedId.value = id
            showModalDetail.value = true
        }

        function editMhs(id){
            selectedId.value = id
            showModalEdit.value = true
        }

        function logout(){
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

        return {
            mahasiswas,
            currentPage,
            totalPages,
            destroy,
            fetchMahasiswa,
            loading,
            logout,
            detailMhs,
            editMhs,
            showModalDetail,
            showModalEdit,
            selectedId,
            isModalOpen,
            bukaModal,
            tutupModal,
        }
    }
}
</script>

<style>
    .lds-roller,
    .lds-roller div,
    .lds-roller div:after {
        box-sizing: border-box;
    }
    .lds-roller {
        display: inline-block;
        position: relative;
        width: 100vh;
        height: 100vh;
        align-items: center;
        z-index: 9999;
    }
    .lds-roller div {
        animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        transform-origin: 40px 40px;
    }
    .lds-roller div:after {
        content: " ";
        display: block;
        position: absolute;
        width: 7.2px;
        height: 7.2px;
        border-radius: 50%;
        background: currentColor;
        margin: -3.6px 0 0 -3.6px;
    }
    .lds-roller div:nth-child(1) {
        animation-delay: -0.036s;
    }
    .lds-roller div:nth-child(1):after {
        top: 62.62742px;
        left: 62.62742px;
    }
    .lds-roller div:nth-child(2) {
        animation-delay: -0.072s;
    }
    .lds-roller div:nth-child(2):after {
        top: 67.71281px;
        left: 56px;
    }
    .lds-roller div:nth-child(3) {
        animation-delay: -0.108s;
    }
    .lds-roller div:nth-child(3):after {
        top: 70.90963px;
        left: 48.28221px;
    }
    .lds-roller div:nth-child(4) {
        animation-delay: -0.144s;
    }
    .lds-roller div:nth-child(4):after {
        top: 72px;
        left: 40px;
    }
    .lds-roller div:nth-child(5) {
        animation-delay: -0.18s;
    }
    .lds-roller div:nth-child(5):after {
        top: 70.90963px;
        left: 31.71779px;
    }
    .lds-roller div:nth-child(6) {
        animation-delay: -0.216s;
    }
    .lds-roller div:nth-child(6):after {
        top: 67.71281px;
        left: 24px;
    }
    .lds-roller div:nth-child(7) {
        animation-delay: -0.252s;
    }
    .lds-roller div:nth-child(7):after {
        top: 62.62742px;
        left: 17.37258px;
    }
    .lds-roller div:nth-child(8) {
        animation-delay: -0.288s;
    }
    .lds-roller div:nth-child(8):after {
        top: 56px;
        left: 12.28719px;
    }
    @keyframes lds-roller {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
