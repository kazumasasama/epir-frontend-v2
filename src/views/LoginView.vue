<template>
  <div class="container">
    <div>
      <h4>Login</h4>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <form v-on:submit.prevent="login()">
          <p>Email: <input type="text" v-model="user.email"></p>
          <p>Password: <input type="password" v-model="user.password"></p>
          <button type="button" class="btn btn-secondary" @click="toHome()">Back to Home</button>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
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

<style>
  
</style>