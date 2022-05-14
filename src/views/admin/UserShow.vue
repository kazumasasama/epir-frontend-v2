<template>

  <nav class="navbar navbar-light" style="background-color: #f5f6fe;">
    <div class="col-12 user-btn-container">
      <button
        class="btn btn-sm btn-outline-success"
        v-if="showHistory"
        @click="showHistory = false"
      >
        User Detail
      </button>
      <button
        class="btn btn-sm btn-outline-success"
        v-if="!showHistory"
        @click="showHistory = true"
      >
        History
      </button>
      <div class="control-navbar-item">
        <button class="btn btn-sm btn-outline-secondary" @click="$router.back()">Go back</button>
        <button class="btn btn-sm btn-outline-primary">Update</button>
        <button class="btn btn-sm btn-outline-danger">Delete</button>
      </div>
    </div>
  </nav>

  <div class="container">
    <form action="" v-if="!showHistory">
      <div class="row">

        <div class="col-12">
          <h4>User Detail</h4>
        </div>

        <div class="col-sm-6">
          <small>First name</small>
          <input type="text" v-model="user.first_name" class="form-control">
          <small>Last name</small>
          <input type="text" v-model="user.last_name" class="form-control">
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
          <small>Email</small>
          <input type="text" v-model="user.email" class="form-control">
          <small>Phone</small>
          <input type="text" v-model="user.phone" class="form-control">
          <small>Birthday</small>
          <input class="form-control" type="text" v-model="user.birthday">
          <small>Status</small>
          <input class="form-control" type="text" v-model="user.status">
          <small>Admin</small>
          <input class="form-control" type="text" v-model="user.admin">
        </div>

        <div class="col-sm-6">
          <small>Zip</small>
          <input class="form-control" type="text" v-model="user.zip">
          <small>State</small>
          <input class="form-control" type="text" v-model="user.state">
          <small>City</small>
          <input class="form-control" type="text" v-model="user.city">
          <small>Address</small>
          <input class="form-control" type="text" v-model="user.address">
          <small>Note</small>
          <textarea rows="3" class="form-control" v-model="user.note"></textarea>
        </div>

      </div>
    </form>

    <div v-if="showHistory">
      <p>in history</p>
    </div>
  </div>  
</template>

<script>
import axios from 'axios'
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
        showHistory: false,
      }
    },
    created() {
      this.showUser();
    },
    methods: {
      showUser() {
        let id = this.$route.params.id
        axios.get(`/users/${id}.json`)
        .then((res)=> {
          this.user = res.data;
        })
      }
    },
  }
</script>

<style scoped>
  .row {
    text-align: left;
  }
  .btn-container {
    margin-top: 15px;
  }
  .user-btn-container {
    text-align: left;
    overflow: hidden;
  }
  .control-navbar-item {
    float: right;
  }
</style>