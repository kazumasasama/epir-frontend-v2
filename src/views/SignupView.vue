<template>
  <div class="container">
    <h2>Signup</h2>
    <div class="row">
      <div class="col-sm-12">
        <form v-on:submit.prevent="createUser()">
          <strong>Required</strong>
          <p>First_name: <input type="text" v-model="user.first_name"></p>
          <p>Last_name: <input type="text" v-model="user.last_name"></p>
          <p>Email: <input type="email" v-model="user.email"></p>
          <p>Password: <input type="password" v-model="user.password"></p>
          <p>Confirm: <input type="password" v-model="user.passwordConfirm"></p>
          <strong>Optional</strong>
          <p>Phone: <input type="text" v-model="user.phone"></p>
          <p>Zip: <input type="text" v-model="user.zip"></p>
          <p>State: <input type="text" v-model="user.state"></p>
          <p>City: <input type="text" v-model="user.city"></p>
          <p>Address: <input type="text" v-model="user.address"></p>
          <p>
            Gender: 
            <select v-model="user.gender">
              <option
                v-for="gender in genders"
                :key="gender"
                :value="gender"
              >
                {{ gender }}
              </option>
            </select>
          </p>
          <p>Birthday: <input type="date" v-model="user.birthday"></p>
          <div class="btn-container">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelSignup()"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
  export default {
    data() {
      return {
        user: {},
        genders: [
          "Male",
          "Female",
          "N/A",
          "Rather not to say"
        ],
      }
    },
    methods: {
      createUser() {
        if (this.user.password === this.user.passwordConfirm) {
          axios.post('/users', this.user)
          .then((res)=> {
            localStorage.setItem("user_id", res.data.user_id);
            let user = {
              email: res.data.email,
              password: this.user.password
            }
            axios.post('/sessions', user)
            .then((res)=> {
              axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.jwt;
              localStorage.setItem("jwt", res.data.jwt);
              localStorage.setItem("user_id", res.data.user_id);
            })
            this.user = {};
            this.$router.push('/appointments');
          })
          .catch((error)=> {
            console.log(error);
          })
        }
      },
      cancelSignup() {
        this.user = {};
        this.$router.push('/');
      },
    }
  }
</script>

<style>
  
</style>