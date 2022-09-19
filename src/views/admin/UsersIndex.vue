<template>
  <nav class="navbar navbar-light user-index-nav">
    <div class="col-12 users-btn-container">
      <button class="btn btn-outline-success btn-sm" @click.prevent="openNewUserDialog()">{{ $t('Btn.addCustomer') }}</button>
      <div class="control-navbar-items">
        <div class="control-navbar-item">
          <input v-model="keyword" type="text" class="form-control" placeholder="Search Users">
        </div>
        <div class="control-navbar-item">
          <small>{{ $t('Customers.sortBy') }}</small>
          <button class="btn btn-outline-primary btn-sm control-navbar-item" @click.prevent="sortById()">{{ $t('Btn.customerId') }}</button>
          <button class="btn btn-outline-primary btn-sm control-navbar-item" @click.prevent="sortByFirstName()">{{ $t('Btn.firstName') }}</button>
          <button class="btn btn-outline-primary btn-sm control-navbar-item" @click.prevent="sortByLastName()">{{ $t('Btn.lastName') }}</button>
        </div>
      </div>
    </div>
  </nav>

  <div class="container">

    <div class="modal fade" id="new-user-dialog">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New Customer</h5>
          </div>
          <div class="modal-body event-detail-modal-body">
            <form v-on:submit.prevent="createUser()">
              <div class="row">
                <div class="col-sm-6">
                  <p><strong>Required</strong></p>
                  <small>First Name</small>
                  <input type="text" v-model="newUser.first_name" class="form-control" autocomplete="given-name">
                  <small>Last Name</small>
                  <input type="text" v-model="newUser.last_name" class="form-control" autocomplete="family-name">
                  <small>Email</small>
                  <input type="text" v-model="newUser.email" class="form-control" autocomplete="email">
                  <small>Phone</small>
                  <input type="text" v-model="newUser.phone" class="form-control" autocomplete="tel-national">
                  <small>Gender</small>
                  <select v-model="newUser.gender" class="form-select" autocomplete="sex">
                    <option
                      v-for="gender in genders"
                      :key="gender"
                      :value="gender"
                    >
                      {{ gender }}
                    </option>
                  </select>
                </div>
                <div class="col-sm-6">
                  <p><strong>Optional</strong></p>
                  <small>State</small>
                  <select v-model="newUser.state" class="form-select" autocomplete="address-level1">
                    <option
                      v-for="state in states"
                      :key="state"
                      :value="state"
                    >
                      {{ state }}
                    </option>
                  </select>
                  <small>City</small>
                  <input type="text" v-model="newUser.city" class="form-control" autocomplete="address-level2">
                  <small>Address</small>
                  <input autocomplete="street-address" type="text" v-model="newUser.address" class="form-control">
                  <small>Zip</small>
                  <input type="text" v-model="newUser.zip" class="form-control" autocomplete="postal-code">
                  <small>Requirements/Note</small><br>
                  <small class="smaller-text">(Customer can see this field)</small>
                  <textarea v-model="newUser.note" col-sm-6s="30" rows="3" class="user-note form-control"></textarea>
                  <small>Birthday</small>
                  <input type="date" v-model="newUser.birthday" class="form-control" autocomplete="bday">
                  <small>Status</small>
                  <input type="text" v-model="newUser.status" class="form-control">
                </div>
                <div class="modal-footer btn-container col-sm-12">
                  <!-- <button class="btn btn-primary">Update</button> -->
                  <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button class="btn btn-primary" type="submit">Add</button>
                  <!-- <small>パスワードが自動生成されメルアドレスにお知らせが送付されます</small> -->
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

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
import * as bootstrap from 'bootstrap'
export default {
  data() {
    return {
      users: [],
      user: {},
      displayUsers: [],
      keyword: "",
      sort: 'id',
      newUser: {},
      genders: [
        'Male',
        'Female',
        'Non Binary',
        'Rather not to descrive',
        'N/A'
      ],
      states: [
        'AL', 'AK', 'AZ', 'AR', 'CA',
        'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA',
        'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO',
        'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH',
        'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT',
        'VA', 'WA', 'WV', 'WI', 'WY'
      ],
      newUserDialog: null,
    }
  },
  created() {
    this.indexUsers();
  },
  mounted() {
    this.sortById();
    this.newUserDialog = new bootstrap.Modal(document.getElementById('new-user-dialog'))
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
    createUser() {
      let password_base = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      function genPassword(length = 10)
      {
        let password = '';
        for (let i = 0; i < length; i++) {
          password += password_base.charAt(Math.floor(Math.random() * password_base.length));
        }
        return password
      }
      let pw = genPassword()
      this.newUser.password = pw
      axios
      .post('/users', this.newUser)
      .then((res)=> {
        this.users.push(res.data);
      })
      .then(()=> {
        this.closeNewUserDialog()
      })
    },
    openNewUserDialog() {
      this.newUserDialog.show();
    },
    closeNewUserDialog() {
      this.newUserDialog.hide();
    }
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