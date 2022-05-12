<template>
  <div class="container">
    <div class="row">
      <div class="col-12 users-btn-container">
        <button class="btn btn-outline-success btn-sm">New user</button>
          <small>Sort by</small>
          <button class="btn btn-outline-primary btn-sm">First name</button>
      </div>
      <div class="col-sm-6">
        <div class="list-group" id="list-tab" v-for="user in users" :key="user.id">
          <a
            class="list-group-item list-group-item-action"
            aria-current="true"
            @click="showUser(user)"
            role="tab"
          >
            <small>No.{{ user.id }}</small>
            <div class="d-flex w-100 justify-content-between">
              <h6 class="mb-1">{{ user.full_name }}</h6>
              <small>{{ user.status }}</small>
            </div>
            <small class="mb-1">{{ user.email }}</small>
          </a>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="tab-content card" id="nav-tabContent">
          <div
            class="container"
            id="list-home"
            aria-labelledby="list-home-list"
          >
            <h6>User detail</h6>
            <form action="">
              <p><small>first_name</small> <input type="text" v-model="user.first_name"></p>
              <p><small>last_name</small><input type="text" v-model="user.last_name"></p>
              <p><small>email</small><input type="text" v-model="user.email"></p>
              <p><small>phone</small><input type="text" v-model="user.phone"></p>
              <p><small>gender</small><input type="text" v-model="user.gender"></p>
              <p><small>zip</small><input type="text" v-model="user.zip"></p>
              <p><small>state</small><input type="text" v-model="user.state"></p>
              <p><small>city</small><input type="text" v-model="user.city"></p>
              <p><small>address</small><input type="text" v-model="user.address"></p>
              <p><small>note</small><input type="text" v-model="user.note"></p>
              <p><small>birthday</small><input type="text" v-model="user.birthday"></p>
              <p><small>status</small><input type="text" v-model="user.status"></p>
            </form>
          </div>
        </div>
      </div>
    </div>

    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        users: [],
        sortedUsers: [],
        user: {},
      }
    },
    created() {
      this.indexUsers();
    },
    methods: {
      indexUsers() {
        axios.get('/users.json')
        .then((res)=> {
          this.sortedUsers = res.data.sort((a, b)=> {
            let nameA = a.first_name.toUpperCase();
            let nameB = b.first_name.toUpperCase();
            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          this.users = res.data
        })
      },
      showUser(user) {
        this.user = user;
      },
    },
  }
</script>

<style scoped>
  #list-home {
    text-align: left;
  }
  .list-group-item {
    text-align: left;
  }
  .users-btn-container {
    text-align: left;
  }
</style>