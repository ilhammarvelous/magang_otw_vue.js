<template>
    <div>
        <Navbar />
    </div>

    <div class="p-10 bg-gray-200 min-h-screen mt-10">
        <h1 class="text-3xl ml-5 mt-5 uppercase">Tabel Mata Kuliah</h1>
        <div class="grid grid-cols-2 gap-6 mt-5">
            <div class="ml-6 mt-2">
                <button @click="showModalCreate = true" class="flex items-center p-2 text-md font-medium tracking-wide text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition w-28">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Tambah
                </button>

                <!-- Modal create -->
                <CreateModalMatkul
                    v-if="showModalCreate" 
                    @close="showModalCreate = false" 
                    @updateData="GetMatkul(page)"
                />

                <!-- Modal detail -->
                <DetailModalMatkul 
                    v-if="showModalDetail"
                    :matkulId = "selectedId"
                    @close="showModalDetail = false" 
                />

                <!-- Modal edit -->
                <EditModalMatkul 
                    v-if="showModalEdit"
                    :matkulId = "selectedId"
                    @close="showModalEdit = false"
                    @updateData="GetMatkul(page)"
                />

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
            <table v-if="mataKuliahs.data" class="table-auto w-full text-md text-gray-700 border border-gray-300">
                <thead class="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">No</th>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">Kode</th>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">Nama Mata Kuliah</th>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">SKS</th>
                        <th class="p-3 text-md font-semibold tracking-wide text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!mataKuliahs.data || !mataKuliahs.data.data || mataKuliahs.data.data.length === 0">
                        <td colspan="8" class="p-3 text-center bg-white text-sm text-gray-700 whitespace-nowrap">
                            Data mata kuliah belum ada.
                        </td>
                    </tr>
                    <tr 
                        v-else 
                        v-for="(matakuliah, index) in mataKuliahs.data.data"
                        :key="index"
                        class="bg-white border-b odd:bg-gray-100 even:bg-white text-left">
                            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">{{ index + mataKuliahs.data.from }}</td>
                            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">{{ matakuliah.kode_mk }}</td>
                            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">{{ matakuliah.nama_mk }}</td>
                            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">{{ matakuliah.sks }}</td>
                            <td class="flex items-center mt-2 mb-2">
                                <button @click="detailMk(matakuliah.id)" class="flex items-center p-2 px-3 mx-1 text-md font-medium tracking-wide text-white bg-slate-400 rounded-lg hover:bg-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </button>
                                <button @click="editMk(matakuliah.id)" class="flex items-center p-2 px-3 mx-1 text-md font-medium tracking-wide text-white bg-blue-600 rounded-lg hover:bg-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                                <button @click.prevent="destroy(matakuliah.id, index)" class="flex items-center p-2 px-3 mx-1 text-md font-medium tracking-wide text-white bg-red-600 rounded-lg hover:bg-red-500">
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
                @click="GetMatkul(currentPage - 1)">
                << Previous
            </button>

            <button
                v-for="page in totalPages"
                :key="page"
                :class="[
                'px-4 py-2 rounded',
                currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-400'
                ]"
                @click="GetMatkul(page)">
                {{ page }}
            </button>

            <button
                class="px-3 py-2 bg-white text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                :disabled="currentPage === totalPages"
                @click="GetMatkul(currentPage + 1)">
                Next >>
            </button>
        </div>
    </div>
</template>

<script setup>
    import Navbar from '@/components/Navbar.vue';
    import CreateModalMatkul from '@/components/CreateModalMatkul.vue';
    import DetailModalMatkul from '@/components/DetailModalMatkul.vue';
    import EditModalMatkul from '@/components/EditModalMatkul.vue';
    import axios from 'axios';
    import { onMounted, ref } from 'vue';
    import swal from 'sweetalert';

    let showModalCreate = ref(false);
    let mataKuliahs = ref([]);
    const showModalDetail = ref(false);
    const showModalEdit = ref(false);
    const selectedId = ref(null);
    const currentPage = ref(1);
    const totalPages = ref(0);
    const loading = ref(true);

    onMounted(() =>{
        GetMatkul();
    })

    const GetMatkul = async (page = 1) => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(`http://127.0.0.1:8000/api/mata-kuliah?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            mataKuliahs.value.data = response.data.data
            currentPage.value = response.data.data.current_page
            totalPages.value = response.data.data.last_page;
        } catch (err) {
            console.error('Gagal mengambil data:', err.response ? err.response.data : err.message);
        } finally{
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

                        await axios.delete(`http://127.0.0.1:8000/api/mata-kuliah/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        if (mataKuliahs.value && mataKuliahs.value.length > 0) {
                            mataKuliahs.value = mataKuliahs.value.filter((item) => item.id !== id);
                        } else {
                            GetMatkul();
                        }

                        swal({
                            title: "Berhasil!",
                            text: "Data mata kuliah berhasil dihapus",
                            icon: "success",
                            showConfirmButton: true,
                            timer: 2000
                        });
                    } catch (err) {
                        swal("Error!", err.response?.data?.message || "Terjadi kesalahan pada server.", "error");
                    }
                } else {
                    swal("Data mata kuliah tidak jadi dihapus");
                }
            });
    };

    function detailMk(id){
        selectedId.value = id
        showModalDetail.value = true
    }

    function editMk(id){
        selectedId.value = id
        showModalEdit.value = true
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