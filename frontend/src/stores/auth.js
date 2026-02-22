import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'ADMIN',
    },
    actions: {
        async login(username, password) {
            try {
                const response = await axios.post('/api/v1/auth/authenticate', { username, password });
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
                await this.fetchUser();
            } catch (error) {
                throw error;
            }
        },
        async register(userData) {
            try {
                const response = await axios.post('/api/v1/auth/register', userData);
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
                await this.fetchUser();
            } catch (error) {
                throw error;
            }
        },
        async fetchUser() {
            if (!this.token) return;
            try {
                const response = await axios.get('/api/v1/users/me', {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                this.user = response.data;
            } catch (error) {
                this.logout();
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
        }
    }
});
