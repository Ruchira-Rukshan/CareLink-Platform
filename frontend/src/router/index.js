import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';
import UserManagement from '../views/UserManagement.vue';

const routes = [
    { path: '/login', component: Login, meta: { public: true } },
    { path: '/register', component: Register, meta: { public: true } },
    { path: '/profile', component: Profile },
    { path: '/admin/users', component: UserManagement, meta: { requiresAdmin: true } },
    { path: '/', redirect: '/profile' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();

    if (!auth.user && auth.token) {
        await auth.fetchUser();
    }

    if (!to.meta.public && !auth.isAuthenticated) {
        next('/login');
    } else if (to.meta.requiresAdmin && !auth.isAdmin) {
        next('/profile');
    } else {
        next();
    }
});

export default router;
