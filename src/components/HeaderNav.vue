<template>
  <nav class="navbar navbar-expand-lg navbar-light app-page-nav">
    <div class="container-fluid">
      <div @click.prevent="this.$router.push('/')">
        <a href="#">
          <img
            id="bisiness-name-logo"
            src="@/assets/Biznesu-logo-white.png"
            alt="Biznesu company logo"
          >
          <!-- <h1 id="bisiness-name-logo">Biznesu</h1> -->
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        </ul>
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li v-if="isAdmin" class="nav-item dropdown dropstart header-nav-menu">
            <a
              class="nav-link"
              id="navbar-link-admin"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span class="header-nav-menu">
                <font-awesome-icon icon="fa-solid fa-bars" /> メニュー
              </span>
            </a>
            <ul
              class="dropdown-menu"
            >
              <li @click.prevent="routeNavigation('/mypage')">
                <a class="dropdown-item admin-dropdown-item" href="#"><font-awesome-icon icon="fa-solid fa-user" /> マイページ</a>
              </li>
              <li @click.prevent="routeNavigation('/appointments')">
                <a class="dropdown-item admin-dropdown-item" href="#"><font-awesome-icon icon="fa-solid fa-calendar-days" /> 予約する</a>
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
              <span class="header-nav-menu">
                <font-awesome-icon icon="fa-solid fa-lock" /> 管理メニュー
              </span>
            </a>
            <ul
              class="dropdown-menu"
            >
              <li @click.prevent="routeNavigation('/admin/dashboard')">
                <a class="dropdown-item admin-dropdown-item" href="#"><font-awesome-icon icon="fa-solid fa-gauge" /> ダッシュボード</a>
              </li>
              <li @click.prevent="routeNavigation('/admin/calendar')">
                <a class="dropdown-item" href="#"><font-awesome-icon icon="fa-solid fa-calendar-days" /> カレンダー</a>
              </li>
              <li @click.prevent="routeNavigation('/admin/menus')">
                <a class="dropdown-item" href="#"><font-awesome-icon icon="fa-solid fa-book-open" /> メニュー</a>
              </li>
              <li @click.prevent="routeNavigation('/admin/users')">
                <a class="dropdown-item" href="#"><font-awesome-icon icon="fa-solid fa-users" /> 顧客</a>
              </li>
              <li @click.prevent="routeNavigation('/admin/config')">
                <a class="dropdown-item" href="#"><font-awesome-icon icon="fa-solid fa-screwdriver-wrench" /> 設定</a>
              </li>
              <li @click.prevent="routeNavigation('/complete')">
                <a class="dropdown-item" href="#"><font-awesome-icon icon="fa-solid fa-circle-check" /> 予約完了画面</a>
              </li>
            </ul>
          </li>
          <!-- <li class="nav-item dropdown dropstart header-nav-menu">
            <a
              class="nav-link"
              id="navbar-link-admin"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
            <span class="header-nav-menu">
              <font-awesome-icon icon="fa-solid fa-language" /> 言語
            </span>
            </a>
            <ul
              class="dropdown-menu"
            >
              <li @click.prevent="changeLocale('en')">
                <a class="dropdown-item admin-dropdown-item" href="#">ENG</a>
              </li>
              <li @click.prevent="changeLocale('ja')">
                <a class="dropdown-item" href="#">日本語</a>
              </li>
            </ul>
          </li> -->
          <li class="nav-item header-nav-menu" @click.prevent="logout()" v-if="isLoggedin">
            <a class="nav-link">
              <span class="header-nav-menu">
                <font-awesome-icon icon="fa-solid fa-right-from-bracket" /> ログアウト
              </span>
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
      popover: null,
    }
  },
  mounted() {
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
    routeNavigation(route) {
      const popover = document.getElementsByClassName('navbar-toggler')[0]
      popover.classList.add('collapsed');
      popover.setAttribute('aria-expanded', false)
      
      const collapse = document.getElementsByClassName('navbar-collapse')[0]
      collapse.classList.remove('show')
      this.$router.push(route);
    }
  },
}
</script>

<style scoped>
  .app-page-nav {
    background-color: rgb(140, 146, 232);
    /* background: -moz-linear-gradient(45deg, rgb(140, 146, 232), rgb(75, 192, 192));
    background: -webkit-linear-gradient(45deg, rgb(140, 146, 232), rgb(75, 192, 192));
    background: linear-gradient(45deg, rgb(140, 146, 232) 30%, rgba(75, 192, 192, 0.9)); */
  }
  .header-nav-menu {
    color: rgb(70, 70, 70);
    font-size: 16px;
  }
  .header-nav-menu:hover {
    color: white;
  }
  .nav-item {
    padding-left: 5px;
  }
  .dropdown-item {
    color: rgb(90, 90, 90);
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>