<template>
  <div id="app">
    <nav v-if="auth.isAuthenticated" class="nav">
      <router-link to="/profile">Profile</router-link>
      <router-link v-if="auth.isAdmin" to="/admin/users">User Management</router-link>
      <button @click="logout" class="logout-btn">Logout</button>
    </nav>
    <main class="container">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<style>
.nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  align-items: center;
}
.container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.logout-btn {
  margin-left: auto;
}
</style>
