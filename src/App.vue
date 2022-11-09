<template>
<div id="app">
  <div class="vld-parent">
    <loading v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page=true
      color="rgb(140, 146, 232)"
      loader="dots"
      :height=100
      :width=150
      :opacity=1
    >
      <template v-slot:after>
        <p class="spinner-after">{{ systemStore.LoadingMessage }}</p>
      </template>
    </loading>

    <HeaderNav
    />

    <div class="alert alert-danger" role="alert" v-if="error">
      {{ error }}
    </div>
    <div class="alert alert-info" role="alert" v-if="message">
      {{ message }}
    </div>

    <router-view/>

  </div>
</div>

</template>

<script>
import { mapWritableState } from 'pinia'
import { useSystemStore } from '@/store/systemStore'
import { useUserStore } from '@/store/userStore'
import { useEventStore } from '@/store/eventStore'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import HeaderNav from '@/components/HeaderNav.vue'
import axios from 'axios'
import * as moment from 'moment-timezone'

export default {
  setup() {
    const systemStore = useSystemStore();
    const userStore = useUserStore();
    const eventStore = useEventStore();
    return {
      systemStore,
      userStore,
      eventStore,
    }
  },
  components: {
    Loading,
    HeaderNav,
  },
  created() {
    this.autoLogin();
    this.systemStore.initCategories();
    this.systemStore.initMenus();
    this.systemStore.initBusiness();
    this.systemStore.initConfig();
    this.systemStore.initClosingDays();
    this.systemStore.initBusinessTimes();
    this.userStore.initStatuses();
    this.eventStore.initEvents();
  },
  computed: {
    ...mapWritableState(useSystemStore, ['isLoading']),
    ...mapWritableState(useSystemStore, ['message']),
    ...mapWritableState(useUserStore, ['isLoggedin']),
    ...mapWritableState(useUserStore, ['isAdmin']),
  },
  data() {
    return {
      error: null,
    }
  },
  methods: {
    autoLogin() {
      const lastLogin = moment.utc(localStorage.getItem('last_login'))
      const expire = lastLogin.clone().add(1, 'day')
      const now = moment.utc()
      if (expire < now) {
        localStorage.removeItem('user_id')
        localStorage.removeItem('jwt')
        localStorage.removeItem('last_login')
        return
      }
      if (!this.isLoggedin && localStorage.jwt) {
        const userId = localStorage.getItem('user_id')
        axios.get(`/users/${userId}.json`)
        .then((res)=> {
          const user = res.data;
          this.userStore.switchLoggedin(true)
          this.userStore.pushUser(user);
          this.isAdmin = user.admin;
        })
        .catch((error)=> {
          this.error = error.response;
        })
      }
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(44, 62, 80);
  background-color: rgb(246, 243, 255);
}

html {
  background-color: rgb(246, 243, 255);
}

.navbar-white {
  background-color: white;
}

nav a {
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: #42b983;
}

input {
  width: 100%;
}
textarea {
  width: 100%;
}
ul {
    list-style: none;
  }
hr {
  border-top: 1px;
}

.container {
  padding-top: 12px;
  padding-bottom: 12px;
  margin-top: 25px;
  margin-bottom: 25px;
}
.btn-container * {
  margin: 5px 8px;
}
.card {
  padding: 30px;
}
.card-base {
  padding: 0px;
}
.card-base-body {
  padding: 30px;
}

#bisiness-name-logo {
  /* font-family: Helvetica;
  font-weight: bold;
  color: white;
  font-size: 20pt;
  margin-bottom: 0px; */
  max-width: 150px;
}

.spinner-after {
  color: rgb(140, 146, 232);
  font-size: larger;
  font-weight: 600;
}
/* .dropdown-menu-dark .admin-dropdown-item {
  color: rgb(44, 62, 80);
} */

.white-background {
  background-color: white;
}

/* Vue Cal */
.vuecal__title-bar {
  background-color: rgba(140,146,232, 0.2) !important;
}
.vuecal__cell-date {
  margin-top: 9px;
  margin-bottom: 18px;
  padding-bottom: 18px;
}
.vuecal__event-title {
  font-size: small;
  font-weight: bold;
}
.vuecal__event-time {
  font-size: 10px;
  color: rgb(50, 126, 161);
}
.vuecal__cell-events-count {
  background-color: rgba(255, 205, 86) !important;
  min-width: 20px !important;
  height: 20px !important;
  line-height: 20px !important;
  font-size: 16px !important;
  border-radius: 20px !important;
  padding: 5px, 8px !important;
}
.vuecal__event.danger {
  background-color: rgba(255, 99, 132, 0.2);
  border: 2px solid rgba(255, 99, 132, 0.8);
}
.vuecal__event.primary {
  background-color: rgba(140,146,232, 0.2);
  border: 2px solid rgba(140,146,232, 0.8);
}
.vuecal__event.warning {
  background-color: rgba(255, 159, 64, 0.2);
  border: 2px solid rgba(255, 159, 64, 0.8);
}
.vuecal__event.gray {
  background-color: rgba(201, 203, 207, 0.2);
  border: 2px solid rgba(201, 203, 207, 0.8);
}
.vuecal__event.closing {
  border: 2px solid rgba(255, 159, 64);
  background:
    rgba(255, 247, 240)
    repeating-linear-gradient(
      -45deg,
      rgba(255, 162, 87, 0.25),
      rgba(255, 162, 87, 0.25) 5px,
      rgba(255, 255, 255, 0) 5px,
      rgba(255, 255, 255, 0) 15px
    );
  color: rgba(255, 159, 64)
}

.margin-top-16 {
  margin-top: 16px;
}
</style>
