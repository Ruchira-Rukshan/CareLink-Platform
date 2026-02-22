<template>
  <div class="admin-panel">
    <h2>User Management</h2>
    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <span :class="['badge', user.isBanned ? 'banned' : 'active']">
              {{ user.isBanned ? 'Banned' : 'Active' }}
            </span>
          </td>
          <td>
            <button 
              @click="toggleBan(user.id)" 
              :class="['action-btn', user.isBanned ? 'unban' : 'ban']"
            >
              {{ user.isBanned ? 'Unban' : 'Ban' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';

const auth = useAuthStore();
const users = ref([]);
const error = ref('');

const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/v1/users', {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    users.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch users.';
  }
};

const toggleBan = async (id) => {
  try {
    const response = await axios.post(`/api/v1/users/${id}/ban`, {}, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    const index = users.value.findIndex(u => u.id === id);
    if (index !== -1) {
      users.value[index] = response.data;
    }
  } catch (err) {
    error.value = 'Failed to update user status.';
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.admin-panel {
  margin: 2rem 0;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.user-table th, .user-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
.active { background: #d4edda; color: #155724; }
.banned { background: #f8d7da; color: #721c24; }
.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.ban { background: #dc3545; color: white; }
.unban { background: #28a745; color: white; }
.error { color: red; margin-top: 1rem; }
</style>
