<template>
  <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #e3e5fd;">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="@/assets/epiRLogo70x40.png" alt="epiR logo">
      </a>
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
          <li class="nav-item dropdown" v-if="showNavMenu">
            <a
              class="nav-link dropdown-toggle"
              id="navbar-link-admin"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Admin
            </a>
            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
              <li><a class="dropdown-item" href="/admin/calendar">Admin Cal</a></li>
              <li><a class="dropdown-item" href="/admin/menus">Admin Menu</a></li>
              <li><a class="dropdown-item" href="/admin/users">Users Index</a></li>
            </ul>
          </li>
          <li class="nav-item" @click="logout()">
            <a class="nav-link">Logout</a>
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link" href="/mypage">My Page</a>
          </li> -->
        </ul>
      </div>
    </div>
  </nav>
  <div class="alert alert-info" role="alert" v-if="message">
    {{ message }}
  </div>

  <router-view/>

</template>

<script>
  export default {
    data() {
      return {
        user: {
          email: "",
          password: "",
          passwordConfirm: "",
        },
        showNavMenu: false,
        message: null,
      }
    },
    watch: {
      $route(to, from) {
        from
        if (to.path === '/admin/menus' || to.path === '/admin/calendar' || to.path === '/admin/users') {
          this.showNavMenu = true;
        }
      }
    },
    methods: {
      logout() {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user_id");
        this.message = "Successfully logged out. Redirecting to the top page.";
        if (this.$route.path === '/') {
          setTimeout(()=> {this.message = null}, 3000);
        } else {
          setTimeout(()=> {this.$router.push('/')}, 3000);
          setTimeout(()=> {this.message = null}, 3000);
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
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
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

.container {
  padding-top: 12px;
  padding-bottom: 12px;
  margin-top: 25px;
  margin-bottom: 25px;
}
</style>
