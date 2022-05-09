<template>
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
      <!-- <div class="col-sm-4">
        <h4>New Event</h4>
        <form method="dialog">
          <vue-cal
            class="vuecal--date-picker"
            xsmall
            hide-view-selector
            :time="false"
            :transitions="false"
            active-view="month"
            :disable-views="['week']"
            style="width: 210px;height: 230px"
            :on-event-click="onEventDateClick"
            @cell-focus="selectedDate = $event"
          >
          </vue-cal>
          <h5>User</h5>
          <p>
            Name 
            <input
              type="search"
              name="userSearch"
              placeholder="search by name"
              onkeyup="filterUser()"
            >
          </p>
          <p>
            <input
              class="form-check-input me-1"
              type="checkbox"
            >
            {{ }}
          </p>
          <p>{{ selectedDateString }}</p>
          <div class="btn-container">
            <button v-on:click="updatePhoto(currentPhoto)">Create</button>
            <button>Close</button>
          </div>
        </form>
      </div> -->
    </div>

    <dialog id="event-details">
      <form method="dialog">
        <h4>Event Detail</h4>
        <p>Name: {{ selectedEvent.title }}</p>
        <p>
          Start:
          <input type="text" v-model="selectedEvent.start" />
        </p>
        <p>
          End:
          <input type="text" v-model="selectedEvent.end" />
        </p>
        <p v-for="menu in selectedEvent.content_object" :key="menu">
          Menu:
          <input type="text" :placeholder="menu.title" v-model="newMenus" />
        </p>
        <div class="btn-container">
          <button>Update</button>
          <button>Delete</button>
          <button>Close</button>
        </div>
      </form>
    </dialog>

    <!-- <dialog id="new-event-dialog">
      <form method="dialog">
        <h4>New Event</h4>
        <p>Name: {{ newEvent.first_name }}</p>
        <vue-cal
          class="vuecal--date-picker"
          xsmall
          hide-view-selector
          :time="false"
          :transitions="false"
          active-view="month"
          :disable-views="['week']"
          style="width: 210px;height: 230px"
          :on-event-click="onEventDateClick"
          @cell-focus="selectedDate = $event"
        >
        </vue-cal>
        <p>{{ selectedDateString }}</p>
        <p v-for="menu in selectedEvent.content" :key="menu">
          Menu:
          <input type="text" :value="menu"/>
        </p>
        <div class="btn-container">
          <button v-on:click="updatePhoto(currentPhoto)">Create</button>
          <button>Close</button>
        </div>
      </form>
    </dialog> -->

  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import axios from 'axios'
import * as moment from 'moment-timezone';
  export default {
    components: { VueCal },
    data() {
      return {
        events: [],
        selectedEvent: {},
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
          this.events = res.data.map((e)=> e.event);
        })
      },
      indexUsers() {
        axios.get('/users.json')
        .then((res)=> {
          this.users = res.data;
        })
      },
      indexMenus() {
        axios.get('/menus')
        .then((res)=> {
          this.menus = res.data;
        })
      },
      onEventClick (event, e) {
        this.selectedEvent = event;
        // Prevent navigating to narrower view (default vue-cal behavior).
        e.stopPropagation();
        document.querySelector("#event-details").showModal();
      },
      onEventDateClick (event, e) {
        this.selectedDate = event;
        e.stopPropagation();
      },
      openNewEventDialog() {
        document.querySelector("#new-event-dialog").showModal();
      },
      filterUser() {
        console.log("aaa")
      },
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