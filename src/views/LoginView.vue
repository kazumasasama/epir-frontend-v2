<template>
  <div class="container">
    <div>
      <h4>Login</h4>
    </div>
    <div class="row">
      <div class="col-sm-12 login-form-container">
        <div class="login-form-container">
          <form v-on:submit.prevent="login()">
            <small>Email:</small>
            <input type="text" v-model="user.email" class="form-control">
            <small>Password:</small>
            <input type="password" v-model="user.password" class="form-control">
            <div class="btn-container">
              <button type="button" class="btn btn-secondary" @click="toHome()">Back to Home</button>
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
      <div class="col-sm-6 login-hint">
        <p class="login-hint-title">Login as Admin</p>
        <p class="login-hint-item"><small>Email: test@test.com</small></p>
        <p class="login-hint-item"><small>Password: password</small></p>
      </div>
      <div class="col-sm-6 login-hint">
        <p class="login-hint-title">Login as User</p>
        <p class="login-hint-item"><small>Email: user@user.com</small></p>
        <p class="login-hint-item"><small>Password: password</small></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
  export default {
    data() {
      return {
        user: {
          email: "",
          password: "",
        },
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
        })
        .catch((error)=> {
          console.log(error.response);
        })
      },
      toHome() {
        this.user = {};
        this.$router.push('/');
      },
    }
  }
</script>

<style scoped>
  .row {
    text-align: left;
  }
  .login-form-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .container {
    max-width: 400px;
  }
  .btn-container {
    margin-top: 20px;
  }
  .login-hint {
    margin-top: 20px;
    text-align: center;
  }
  .login-hint-item {
    margin-bottom: 8px;
  }
  .login-hint-title {
    font-weight: bold;
  }
</style>