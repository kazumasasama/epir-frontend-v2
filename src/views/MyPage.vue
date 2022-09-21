<template>

  <nav class="navbar navbar-light navbar-white">
    <div class="col-12 user-btn-container btn-container">
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
    </div>
    
  </nav>

  <div class="container">
    <div class="row">
      <div class="col-12">
        <span class="notification">{{ message }}</span>
      </div>

      <div v-if="!showHistory" class="col-12">
        <UserForm/>
      </div>
    </div>

    <div class="row" v-if="showHistory">
      <div class="col-12">
        <p class="userFullName">{{ `${user.first_name} ${user.last_name}` }}</p>
        <small>{{ $t('Customers.statics.totalAppointments') }}: {{ bookedEvent.length }} | </small>
        <small>{{ $t('Customers.statics.lastVisit') }}: {{ lastVisit }}</small>
      </div>
      <hr class="hr-user-statics">
      <div
        class="col-sm-4 col-md-3 col-lg-2 history-event-container card"
        v-for="event in bookedEvent"
        :key="event.id"
      >
        <div class="card-body">
          <p class="card-title fw-bold">{{ event.date }}</p>
          <ul class="list-group list-group-flush">
            <li>
              <small>{{ event.start }} - {{ event.end }}</small>
            </li>
          </ul>
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
import { mapWritableState } from 'pinia'
import { useUserStore } from '@/store/userStore'
import axios from 'axios'
import UserForm from '@/components/UserForm.vue'

export default {
components: {
  UserForm
},
  data() {
    return {
      error: null,
      showHistory: false,
      message: null,
    }
  },
  created() {
  },
  computed: {
    ...mapWritableState(useUserStore, ['statuses']),
    ...mapWritableState(useUserStore, ['user']),
    multiselectOptions() {
      const statusIds = this.statuses.map(status => status.id)
      const statusValues = this.statuses.map(status => status.title)
      let options = []
      for (let i in statusIds) {
        options.push({value: Number(statusIds[i]), label: statusValues[i]})
      }
      return options
    },
    multipleselectPlaceholder() {
      if (this.user.status_ids.length === 0) {
        return 'Select Status'
      }
      const statusIds = this.user.status_ids;
      let selectedStatuses = [];
      for (let j in this.multiselectOptions) {
        for (let i in statusIds) {
          if (this.multiselectOptions[j].value === statusIds[i]) {
            selectedStatuses.push(Number(j));
          }
        }
      }
      let result = [];
      for (let k in selectedStatuses) {
        result.push(this.multiselectOptions[selectedStatuses[k]]);
      }
      return result;
    },
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
    bookedEvent() {
      return this.events.filter(event => event.status === 'booked')
    },
  },
  methods: {
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
        status_ids: this.user.status_ids,
        note: this.user.note
      }
      axios.patch(`/users/${id}.json`, user)
      .then((res)=> {
        this.user = res.data;
      })
      .catch((error)=> {
        console.log(error)
        this.error = error;
      })
      this.message = "User updated";
      setTimeout(()=> {this.message = null}, 3000);
    },
  },
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style scoped>
  
  .row {
    text-align: left;
  }
  .user-btn-container {
    text-align: left;
    overflow: hidden;
  }
  .history-event-container {
    text-align: left;
  }
  .update-btn-container {
    margin-top: 20px;
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
  .multiselect-tag-color {
    --ms-tag-bg: rgb(75, 192, 192);
  }
</style>