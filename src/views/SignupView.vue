<template>
  <div class="container">
    <h2>Signup</h2>
      <div class="col-12">
        <form v-on:submit.prevent="createUser()" class="col-12">
        <div class="row">
          <div class="col-sm-6">
            <p><strong>Required</strong></p>
            <small>First_name</small>
            <input type="text" v-model="user.first_name" class="form-control">
            <small>Last_name</small>
            <input type="text" v-model="user.last_name" class="form-control">
            <small>Email</small>
            <input type="email" v-model="user.email" class="form-control">
            <small>Password</small>
            <input type="password" v-model="user.password" class="form-control">
            <small>Confirm password</small>
            <input type="password" v-model="user.passwordConfirm" class="form-control">
          </div>
          <div class="col-sm-6">
            <p><strong>Optional</strong></p>
            <small>Phone</small>
            <input type="text" v-model="user.phone" class="form-control">
            <small>Zip</small>
            <input type="text" v-model="user.zip" class="form-control">
            <small>State</small>
            <input type="text" v-model="user.state" class="form-control">
            <small>City</small>
            <input type="text" v-model="user.city" class="form-control">
            <small>Address</small>
            <input type="text" v-model="user.address" class="form-control">
            <small>Gender</small>
            <select v-model="user.gender" class="form-select">
              <option
                v-for="gender in genders"
                :key="gender"
                :value="gender"
              >
                {{ gender }}
              </option>
            </select>
            <small>Birthday</small>
            <input type="date" v-model="user.birthday" class="form-control">
          </div>
          <div class="btn-container col-sm-6">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelSignup()"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
          </div>
        </form>
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

<style scoped>
  .col-sm-6 {
    text-align: left;
  }
</style>