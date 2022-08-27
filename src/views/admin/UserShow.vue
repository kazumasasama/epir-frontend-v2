<template>

  <nav class="navbar navbar-light" style="background-color: #f5f6fe;">
    <div class="col-12 user-btn-container">
      <button
        class="btn btn-sm btn-outline-success"
        v-if="showHistory"
        @click="showHistory = false"
      >
        {{ $t('Customers.customerDetail') }}
      </button>
      <button
        class="btn btn-sm btn-outline-success"
        v-if="!showHistory"
        @click="showHistory = true"
      >
        {{ $t('Btn.history') }}
      </button>
      <div class="control-navbar-item">
        <button class="btn btn-sm btn-outline-secondary" @click="$router.push('/admin/users')">{{ $t('Btn.customerIndex') }}</button>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="row">
      <div class="col-12">
        <h5>{{ $t('Customers.customerDetail') }}</h5>
        <span class="notification">{{ message }}</span>
      </div>

      <div v-if="!showHistory" class="col-12">
        <form>
          <div class="row">
            <div class="col-sm-6">
              <small>First Name</small>
              <input type="text" v-model="user.first_name" class="form-control">
              <small>Last Name</small>
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
            </div>
    
            <div class="col-sm-6">
              <small>Zip</small>
              <input class="form-control" type="text" v-model="user.zip">
              <small>State</small>
              <select v-model="user.state" class="form-select" autocomplete="address-level1">
                <option
                  v-for="state in states"
                  :key="state"
                  :value="state"
                >
                  {{ state }}
                </option>
              </select>
              <small>City</small>
              <input class="form-control" type="text" v-model="user.city">
              <small>Address</small>
              <input class="form-control" type="text" v-model="user.address">
              <small>Requirements/Note</small>
              <textarea rows="3" class="form-control" v-model="user.note"></textarea>
              <div class="control-navbar-item">
                <button class="btn btn-sm btn-primary" @click.prevent="updateUser()">{{ $t('Btn.update') }}</button>
                <button class="btn btn-sm btn-danger">{{ $t('Btn.deactivate') }}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="row" v-if="showHistory">
      <div class="col-12">
        <p class="userFullName">{{ `${user.first_name} ${user.last_name}` }}</p>
        <small>{{ $t('Customers.statics.totalAppointments') }}: {{ events.length }} | </small>
        <small>{{ $t('Customers.statics.totalSpent') }}: ${{ totalSpent }} | </small>
        <small>{{ $t('Customers.statics.lastVisit') }}: {{ lastVisit }}</small>
      </div>
      <hr class="hr-user-statics">
      <div
        class="col-sm-4 col-md-3 col-lg-2 history-event-container card"
        v-for="event in events"
        :key="event.id"
      >
        <div class="card-body">
          <small class="card-subtitle">{{ event.status }}</small>
          <h6 class="card-title">{{ event.date }}</h6>
          <ul class="list-group list-group-flush">
            <li
              v-for="menu in event.menus"
              :key="menu.id"
            >
              {{ menu.title }}
            </li>
            <hr class="history-hairline">
            <li>Total: ${{ event.total_spent }}</li>
          </ul>
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
        user: {
          events: [],
        },
        genders: [
          "Male",
          "Female",
          "Non Binary",
          "Rather not to descrive",
          "N/A"
        ],
        states: [
          "AL", "AK", "AZ", "AR", "CA",
          "CO", "CT", "DE", "FL", "GA",
          "HI", "ID", "IL", "IN", "IA",
          "KS", "KY", "LA", "ME", "MD",
          "MA", "MI", "MN", "MS", "MO",
          "MT", "NE", "NV", "NH", "NJ",
          "NM", "NY", "NC", "ND", "OH",
          "OK", "OR", "PA", "RI", "SC",
          "SD", "TN", "TX", "UT", "VT",
          "VA", "WA", "WV", "WI", "WY"
        ],
        showHistory: false,
        message: null,
      }
    },
    created() {
      this.showUser();
    },
    computed: {
      events() {
        let events = this.user.events;
        let sortedEvents = events.sort((a, b)=> {
          let idA = a.date_and_start;
          let idB = b.date_and_start;
          if (idA < idB) {
            return -1;
          }
          if (idA > idB) {
            return 1;
          }
          return 0
        });
        return sortedEvents;
      },
      totalSpent() {
        if (this.events.length === 0) {
          return 0
        }
        let booked = this.events.filter((event)=> event.status === "booked")
        return booked.map((event)=> event.total_spent).reduce((sum, price)=> sum + price, 0)
      },
      lastVisit() {
        if (this.events.length === 0) {
          return "N/A"
        }
        let events = this.user.events;
        let sortedEvents = events.sort((a, b)=> {
          let idA = a.date_and_start;
          let idB = b.date_and_start;
          if (idA < idB) {
            return -1;
          }
          if (idA > idB) {
            return 1;
          }
          return 0
        });
        return sortedEvents[sortedEvents.length -1].date;
      },
    },
    methods: {
      showUser() {
        let id = this.$route.params.id
        axios.get(`/users/${id}.json`)
        .then((res)=> {
          this.user = res.data;
        })
      },
      updateUser() {
        let id = this.user.id;
        let user = {}
        user = {
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          gender: this.user.gender,
          email: this.user.email,
          phone: this.user.phone,
          birthday: this.user.birthday,
          address: this.user.address,
          state: this.user.state,
          city: this.user.city,
          zip: this.user.zip,
          status: this.user.status,
          note: this.user.note
        }
        axios.patch(`/users/${id}.json`, user)
        .then((res)=> {
          this.user = res.data
        })
        this.message = "User updated";
        setTimeout(()=> {this.message = null}, 3000);
      },
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
  .history-event-container {
    text-align: left;
  }
  .notification {
    color: red;
  }
  .history-hairline {
    color:#FFFFFF;
    margin-top: 8px;
    margin-bottom: 8px;
    border: none;
    border-top: 2px dashed gray;
    height: 1px;
  }
  .hr-user-statics {
    border-top: 1px;
  }
  .userFullName {
    margin-top: 8px;
    font-size: larger;
  }
</style>