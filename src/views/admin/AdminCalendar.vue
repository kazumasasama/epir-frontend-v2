<template>

  <!-- <nav class="navbar navbar-light" style="background-color: #f5f6fe;">
    <div class="col-12 users-btn-container">
      <button class="btn btn-outline-success btn-sm">New appointment</button>
    </div>
  </nav> -->

  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="calendar-container">
          <vue-cal
            small
            today-button
            class="vuecal--blue-theme"
            :selected-date="selectedDate"
            :time-from="9.5 * 60"
            :time-to="20 * 60"
            :time-step="30"
            :events="events"
            :disable-views="['years', 'year']"
            :disable-days="disableDays"
            :on-event-click="onEventClick"
            :max-date="maxDate"
            events-count-on-year-view
            hide-week-number
          />
        </div>
      </div>
    </div>

    <div class="modal fade" id="event-details">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Event Detail</h5>
          </div>
          <div class="modal-body">
            <form>
              <p data-bs-toggle="modal">
                Name: 
                <a id="linkToUserDetail" data-bs-target="#event-details" data-bs-dismiss="modal" href="#" @click="redirectToUser(selectedEvent.user.id)">{{ selectedEvent.user.full_name }}</a>
              </p>
            </form>
          </div>
          <div class="modal-footer btn-container">
            <button>Update</button>
            <button @click="destroyEvent()">Delete</button>
            <button>Close</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import axios from 'axios'
import * as moment from 'moment-timezone';
import * as bootstrap from 'bootstrap'
  export default {
    components: { 
      VueCal,
      },
    data() {
      return {
        events: [],
        selectedEvent: {
          user: {},
        },
        selectedDate: moment().format('YYYY-MM-DD'),
        disableDays: [],
        newEvent: {},
        users: [],
        menus: [],
        new_menus: [],
      }
    },
    created() {
      this.indexEvents();
      this.indexUsers();
      this.indexMenus();
    },
    computed: {
      maxDate() {
        return moment().add(90, 'days').format('YYYY-MM-DD');
      },
      selectedDateString() {
        return moment(this.selectedDate).format('YYYY-MM-DD')
      }
    },
    methods: {
      indexEvents() {
        axios.get('/events.json')
        .then((res)=> {
          this.events = res.data;
        })
      },
      indexUsers() {
        axios.get('/users.json')
        .then((res)=> {
          this.users = res.data;
        })
      },
      indexMenus() {
        axios.get('/menus.json')
        .then((res)=> {
          this.menus = res.data;
        })
      },
      onEventClick (event, e) {
        this.selectedEvent = event;
        // Prevent navigating to narrower view (default vue-cal behavior).
        e.stopPropagation();
        var myModal = new bootstrap.Modal(document.getElementById('event-details'));
        myModal.show();
      },
      // onEventDateClick (event, e) {
      //   this.selectedDate = event;
      //   e.stopPropagation();
      // },
      openNewEventDialog() {
        document.querySelector("#new-event-dialog").showModal();
      },
      redirectToUser(id) {
        this.$router.push(`/admin/users/${id}`);
      },
      destroyEvent() {
        let id = this.selectedEvent.id
        axios
        .delete(`/events/${id}`)
        .then(()=> {
          this.selectedEvent = {};
          let event = this.events.find(event => event.id === id)
          let i = this.events.indexOf(event)
          this.events.splice(i, 1);
        })
      }
    },
  }
</script>

<style>
  .calendar-container {
    height: 100%;
  }
  .modal {
    position: fixed;
  }
  .vuecal__event {
    text-align: left;
    padding: 0px 8px 0px 8px;
    outline: 1px solid rgb(50, 126, 161);
    border-radius: 2%;
  }
  .vuecal__event-title {
    font-size: small;
    font-weight: bold;
  }
  .vuecal__event-time {
    font-size: 10px;
    color: rgb(50, 126, 161);
  }
</style>