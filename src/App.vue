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
          <li class="nav-item">
            <a class="nav-link" href="/admin">Admin</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/admin/calendar">Admin Cal</a>
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

  <router-view/>

</template>

<script>
// import axios from 'axios'
  export default {
    data() {
      return {
        user: {
          email: "",
          password: "",
          passwordConfirm: "",
        },
      }
    },
    methods: {
      logout() {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user_id");
        this.$router.push('/');
      },
      openLoginDialog() {
        document.querySelector("#login-dialog").showModal();
      },
      closeLoginDialog() {
        document.querySelector("#login-dialog").modal('hide');
      }
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
