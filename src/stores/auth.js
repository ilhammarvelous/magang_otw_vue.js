import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        allowedMenus: []
    }),
    actions: {
        async fetchUserMenus() {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('user_id');

                if (!userId || !token) return;

                const response = await axios.get(`http://127.0.0.1:8000/api/menus/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                    
                    
                });

                if (response.data.success && Array.isArray(response.data.menus)) {

                    this.allowedMenus = response.data.menus;

                    localStorage.setItem('allowedMenus', JSON.stringify(this.allowedMenus));
                } else {
                    console.warn("Format data menus tidak valid:", response.data);
                }
            } catch (error) {
                console.error('Gagal mengambil izin menu:', error);
            }
        }
    }
});
