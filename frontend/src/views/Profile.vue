<template>
  <div class="profile-card">
    <h2>My Profile</h2>
    <div v-if="auth.user">
      <div class="info">
        <p><strong>Username:</strong> {{ auth.user.username }}</p>
        <p><strong>Role:</strong> {{ auth.user.role }}</p>
      </div>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>
        <button type="submit" :disabled="loading">Update Profile</button>
        <p v-if="success" class="success">Profile updated successfully!</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';

const auth = useAuthStore();
const email = ref('');
const loading = ref(false);
const success = ref(false);
const error = ref('');

onMounted(() => {
  if (auth.user) {
    email.value = auth.user.email;
  }
});

const handleUpdate = async () => {
  loading.value = true;
  success.value = false;
  error.value = '';
  try {
    const response = await axios.put('/api/v1/users/me', { email: email.value }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    auth.user = response.data;
    success.value = true;
  } catch (err) {
    error.value = 'Failed to update profile.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.profile-card {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.info {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
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
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.success {
  color: green;
  margin-top: 1rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
