<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/"><img src="@/assets/epiRLogo70x40.png" alt="epiR logo"></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        </ul>
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item" v-if="!loggedIn">
            <a class="nav-link" data-bs-toggle="modal" data-bs-target="#login-modal">Login</a>
          </li>
          <li class="nav-item" @click="logout()" v-if="loggedIn">
            <a class="nav-link">Logout</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/signup" v-if="!loggedIn">Signup</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/mypage" v-if="loggedIn">My Page</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="modal" tabindex="-1" id="login-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Login</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <p>Email: <input type="text" v-model="user.email"></p>
            <p>Password: <input type="password" v-model="user.password"></p>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="login()">Login</button>
        </div>
      </div>
    </div>
  </div>

  <router-view/>

</template>

<script>
import axios from 'axios'
  export default {
    data() {
      return {
        user: {
          email: "",
          password: "",
          passwordConfirm: "",
        },
        loggedIn: false,
      }
    },
    created() {
      if (localStorage.jwt) {
        this.loggedIn = true
        this.$router.push('/appointments');
      }
    },
    methods: {
      login() {
        axios.post('/sessions', this.user)
        .then((res)=> {
          axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.jwt;
          localStorage.setItem("jwt", res.data.jwt);
          localStorage.setItem("user_id", res.data.user_id);
          this.$router.push('/appointments');
          document.querySelector("#login-dialog").modal('hide');
        })
        .catch((error)=> {
          console.log(error.response);
        })
      },
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
</style>
