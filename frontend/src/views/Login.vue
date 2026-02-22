<template>
  <div class="auth-card">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Username</label>
        <input v-model="username" type="text" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit" :disabled="loading">Login</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.ref = true;
  error.value = '';
  try {
    await auth.login(username.value, password.value);
    router.push('/profile');
  } catch (err) {
    error.value = 'Invalid username or password';
  } finally {
    loading.ref = false;
  }
};
</script>

<style scoped>
.auth-card {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 8px;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}
.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
