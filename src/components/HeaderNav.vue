<template>
  <nav 
      class="navbar navbar-expand-lg navbar-light"
      style="background-color: rgb(140, 146, 232);"
    >
      <div class="container-fluid">
        <div @click="this.$router.push('/')">
          <a href="#">
            <img
              id="bisiness-name-logo"
              src="@/assets/Biznesu-logo-white.png"
              alt="Biznesu company logo"
            >
            <!-- <h1 id="bisiness-name-logo">Biznesu</h1> -->
          </a>
        </div>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          </ul>
          <ul class="navbar-nav mb-2 mb-lg-0">
            <li v-if="isAdmin" class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                id="navbar-link-admin"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Menu
              </a>
              <ul
                class="dropdown-menu"
              >
                <li @click="this.$router.push('/appointments')">
                  <a class="dropdown-item admin-dropdown-item" href="#">Appointments</a>
                </li>
                <li @click="this.$router.push('/complete')">
                  <a class="dropdown-item" href="#">Complete</a>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown" v-if="isAdmin">
              <a
                class="nav-link dropdown-toggle"
                id="navbar-link-admin"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Admin Menu
              </a>
              <ul
                class="dropdown-menu"
              >
                <li @click="this.$router.push('/admin/dashboard')">
                  <a class="dropdown-item admin-dropdown-item" href="#">Dashboard</a>
                </li>
                <li @click="this.$router.push('/admin/calendar')">
                  <a class="dropdown-item" href="#">Appointments</a>
                </li>
                <li @click="this.$router.push('/admin/menus')">
                  <a class="dropdown-item" href="#">Menus</a>
                </li>
                <li @click="this.$router.push('/admin/users')">
                  <a class="dropdown-item" href="#">Customers</a>
                </li>
              </ul>
            </li>
            <li class="nav-item" @click="logout()" v-if="isLoggedin">
              <a class="nav-link">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>

<script>
import { mapWritableState } from 'pinia'
import { useSystemStore } from '@/store/systemStore'
import { useUserStore } from '@/store/userStore'

export default {
  setup() {
    const userStore = useUserStore;
    const systemStore = useSystemStore;
    return {
      userStore,
      systemStore,
    }
  },
  computed: {
    ...mapWritableState(useUserStore, ['isLoggedin']),
    ...mapWritableState(useUserStore, ['isAdmin']),
  },
  data() {
    return {
      message: null,
    }
  },
  created() {
  },
  methods: {
    async logout() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user_id");
      const message = "Successfully logged out. Redirecting to the top page.";
      this.$emit('getMessage', message)
      await this.resetData()
      .then(()=> {
        location.reload()
      })
    },
    resetData() {
      return new Promise((resolve)=> {
        setTimeout(()=> { resolve(this.$router.push('/')) }, 3000)
      })
    }
  },
}
</script>

<style scoped>
</style>