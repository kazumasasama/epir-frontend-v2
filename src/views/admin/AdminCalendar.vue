<template>

  <!-- <nav class="navbar navbar-light" style="background-color: #f5f6fe;">
    <div class="col-12 users-btn-container">
      <button class="btn btn-outline-success btn-sm">New appointment</button>
    </div>
  </nav> -->

  <div class="container">
    <div class="row">
      <div class="col-12">
        <small>Don't see appointments? Try reflesh this page.</small>
        <div class="calendar-container card">
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
            locale="en"
          />
        </div>
      </div>
    </div>

    <div class="modal fade" id="event-details">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="modal-title">{{ eventStartEndDateTime }}</h6>
          </div>
          <div class="modal-body event-detail-modal-body">
            <form>
              <div class="row">
                <div class="col-sm-6">
                  <small class="event-details-tag">Name</small>
                  <p data-bs-toggle="modal" class="event-detail-item">
                    <a
                      class="link-primary"
                      href="#"
                      id="linkToUserDetail"
                      data-bs-dismiss="modal"
                      @click="redirectToUser(selectedEvent.user.id)"
                  >
                    {{ selectedEvent.user.full_name }}
                  </a>
                  </p>
                  <small class="event-details-tag">Note</small>
                  <p class="event-detail-item">{{ selectedEvent.user.note }}</p>
                </div>
                <div class="col-sm-6">
                  <small class="event-details-tag">Menus</small>
                  <div>
                    <ul class="event-detail-item">
                      <li v-for="menu in selectedEvent.menus" :key="menu.id">{{ menu.title }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer btn-container">
            <!-- <button class="btn btn-primary">Update</button> -->
            <button class="btn btn-danger" @click="destroyEvent()">Delete</button>
            <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
            <small>To reschedule, delete the appointment then make a new appointment.</small>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/ja.js'
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
        eventDetailsModal: null,
      }
    },
    created() {
      this.indexEvents();
      this.indexUsers();
      this.indexMenus();
    },
    mounted() {
      this.eventDetailsModal = new bootstrap.Modal(document.getElementById('event-details'));
    },
    computed: {
      maxDate() {
        return moment().add(90, 'days').format('YYYY-MM-DD');
      },
      selectedDateString() {
        return moment(this.selectedDate).format('YYYY-MM-DD')
      },
      eventStartEndDateTime() {
        let start = moment(this.selectedEvent.start).format('MM-DD-YYYY / HH:mm')
        let end = moment(this.selectedEvent.end).format('HH:mm')
        return `${start} - ${end}`
      }
    },
    methods: {
      indexEvents() {
        axios.get('/events.json')
        .then((res)=> {
          this.events = res.data.filter((event)=> event.status === "booked")
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
        this.eventDetailsModal.show();
      },
      redirectToUser(id) {
        this.$router.push(`/admin/users/${id}`);
      },
      destroyEvent() {
        let id = this.selectedEvent.id
        axios
        .delete(`/events/${id}`)
        .then(()=> {
          let event = this.events.find(event => event.id === id);
          let i = this.events.indexOf(event);
          this.events.splice(i, 1);
          this.eventDetailsModal.hide();
        })
      }
    },
  }
</script>

<style>
  .calendar-container {
    height: 98%;
  }
  .modal {
    position: fixed;
  }
  .event-detail-modal-body {
    text-align: left;
  }
  .event-details-tag {
    font-weight: bold;
  }
  .event-detail-item {
    padding-left: 8px;
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