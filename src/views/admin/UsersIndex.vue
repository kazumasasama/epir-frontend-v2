<template>
  <nav class="navbar navbar-light user-index-nav">
    <div class="col-12 users-btn-container">
      <button class="btn btn-outline-success btn-sm" @click.prevent="$router.push('/signup')">{{ $t('Btn.addCustomer') }}</button>
      <div class="control-navbar-items">
        <div class="control-navbar-item">
          <input v-model="keyword" type="text" class="form-control" placeholder="Search Users">
        </div>
        <div class="control-navbar-item btn-container">
          <small>{{ $t('Customers.sortBy') }}</small>
          <button class="btn btn-outline-primary btn-sm control-navbar-item" @click.prevent="sortByLastName()">{{ $t('Btn.lastName') }}</button>
          <button class="btn btn-outline-primary btn-sm control-navbar-item" @click.prevent="sortByFirstName()">{{ $t('Btn.firstName') }}</button>
          <button class="btn btn-outline-primary btn-sm control-navbar-item" @click.prevent="sortById()">{{ $t('Btn.customerId') }}</button>
        </div>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="row">
      <small>{{ $t('Customers.clickToSee') }}</small>
      <div class="col-lg-4 col-sm-6" v-for="user in filteredUsers" :key="user.id">
        <div class="list-group" id="list-tab" @click="this.$router.push(`/admin/users/${user.id}`)">
          <a
            class="list-group-item list-group-item-action"
            @click="showUser(user)"
            role="tab"
          >
            <div class="d-flex w-100 justify-content-between">
              <small>No.{{ user.id }}</small>
              <small>{{ user.status }}</small>
            </div>
            <h6 class="mb-1">{{ user.full_name }}</h6>
            <small class="mb-1">{{ user.email }}</small>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      error: null,
      users: [],
      user: {},
      displayUsers: [],
      keyword: "",
      sort: 'id',
    }
  },
  created() {
    this.indexUsers();
  },
  mounted() {
    this.sortById();
  },
  computed: {
    filteredUsers() {
      let keyword = this.keyword.toLowerCase()
      let users = [];
      for (let i in this.users) {
        let user = this.users[i];
        if (user.last_name) {
          if (user.first_name.toLowerCase().indexOf(keyword) !== -1 || user.last_name.toLowerCase().indexOf(keyword) !== -1 || user.email.indexOf(keyword) !== -1) {
            users.push(user)
          }
        } else {
          if (user.first_name.toLowerCase().indexOf(keyword) !== -1 || user.email.indexOf(keyword) !== -1) {
            users.push(user)
          }
        }
      }
      return users;
    },
  },
  methods: {
    indexUsers() {
      axios.get('/users.json')
      .then((res)=> {
        this.users = res.data;
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    showUser(user) {
      this.user = user;
    },
    sortById() {
      let users = this.users.sort((a, b)=> {
          let idA = a.id;
          let idB = b.id;
          if (idA < idB) {
            return -1;
          }
          if (idA > idB) {
            return 1;
          }
        });
        this.displayUsers = users;
    },
    sortByFirstName() {
      let sorted = [];
      let unsorted = this.users
      sorted = unsorted.sort((a, b)=> {
        let nameA = a.first_name.toUpperCase();
        let nameB = b.first_name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      this.displayUsers = sorted;
    },
    sortByLastName() {
      let sorted = [];
      let unsorted = this.users
      sorted = unsorted.sort((a, b)=> {
        let nameA = a.last_name.toUpperCase();
        let nameB = b.last_name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      this.displayUsers = sorted;
    },
    // createUser() {
    //   let password_base = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //   function genPassword(length = 10)
    //   {
    //     let password = '';
    //     for (let i = 0; i < length; i++) {
    //       password += password_base.charAt(Math.floor(Math.random() * password_base.length));
    //     }
    //     return password
    //   }
    //   let pw = genPassword()
    //   this.newUser.password = pw
    //   axios
    //   .post('/users', this.newUser)
    //   .then((res)=> {
    //     this.users.push(res.data);
    //   })
    //   .then(()=> {
    //     this.closeNewUserDialog()
    //   })
    //   .catch((error)=> {
    //     this.error = error;
    //   })
    // },
    // openNewUserDialog() {
    //   this.newUserDialog.show();
    // },
    // closeNewUserDialog() {
    //   this.newUserDialog.hide();
    // }
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
.user-index-nav {
  background-color: white;
}
.users-btn-container {
  text-align: left;
  overflow: hidden;
}
.control-navbar-items {
  float: right;
}
.control-navbar-item {
  float: right;
}
.smaller-text {
  font-size: x-small;
}
.modal-footer {
  margin-top: 10px;
}
</style>