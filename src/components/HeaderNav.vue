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
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          </ul>
          <ul class="navbar-nav mb-2 mb-lg-0">
            <li class="nav-item">
              <a
                class="nav-link"
                id="navbar-link-admin"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                @click.prevent="this.$router.push('/mypage')"
              >
                <span class="header-nav-menu">My Page</span>
              </a>
            </li>
            <li class="nav-item dropdown dropstart header-nav-menu">
              <a
                class="nav-link"
                id="navbar-link-admin"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
              <span class="header-nav-menu">Languages</span>
              </a>
              <ul
                class="dropdown-menu"
              >
                <li @click.prevent="changeLocale('en')">
                  <a class="dropdown-item admin-dropdown-item" href="#">ENG</a>
                </li>
                <li @click="changeLocale('ja')">
                  <a class="dropdown-item" href="#">JPN</a>
                </li>
              </ul>
            </li>
            <li v-if="isAdmin" class="nav-item dropdown dropstart header-nav-menu">
              <a
                class="nav-link"
                id="navbar-link-admin"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span class="header-nav-menu">User Menu</span>
              </a>
              <ul
                class="dropdown-menu"
              >
                <li @click="this.$router.push('/mypage')">
                  <a class="dropdown-item admin-dropdown-item" href="#">My Page</a>
                </li>
                <li @click="this.$router.push('/appointments')">
                  <a class="dropdown-item admin-dropdown-item" href="#">Appointments</a>
                </li>
                <li @click="this.$router.push('/complete')">
                  <a class="dropdown-item" href="#">Complete</a>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown dropstart header-nav-menu" v-if="isAdmin">
              <a
                class="nav-link"
                id="navbar-link-admin"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span class="header-nav-menu">Admin Menu</span>
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
                <li @click="this.$router.push('/admin/config')">
                  <a class="dropdown-item" href="#">Settings</a>
                </li>
              </ul>
            </li>
            <li class="nav-item header-nav-menu" @click="logout()" v-if="isLoggedin">
              <a class="nav-link">
                <span class="header-nav-menu">Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
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
    ...mapWritableState(useUserStore, ['user']),
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
      localStorage.removeItem("last_login");
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
    },
    ...mapActions(useSystemStore, ['changeAppLocale']),
    changeLocale(lang) {
      this.$i18n.locale = lang;
      this.changeAppLocale(lang);
    },
  },
}
</script>

<style scoped>
  .header-nav-menu {
    color: rgb(60, 60, 60);
  }
  .header-nav-menu:hover {
    color: white;
  }
</style>