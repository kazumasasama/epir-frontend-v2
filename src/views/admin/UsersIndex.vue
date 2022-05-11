<template>
  <div class="container">
    <div class="list-group" v-for="user in users" :key="user.id">
      <a href="#" class="list-group-item list-group-item-action" aria-current="true">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ user.full_name }}</h5>
          <small>3 days ago</small>
        </div>
        <p class="mb-1">{{ user.email }}</p>
        <small>And some small print.</small>
      </a>
      {{ user }}
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
      }
    },
    created() {
      this.indexUsers();
    },
    methods: {
      indexUsers() {
        axios.get('/users.json')
        .then((res)=> {
          this.users = res.data;
        })
      },
    },
  }
</script>

<style>
</style>