<template>
  <div class="container">
    <div class="calendar-container">
      <vue-cal
        today-button
        :time-from="8 * 60"
        :time-to="20 * 60"
        :time-step="30"
        :events="events"
        :disable-views="['years', 'year', 'month', 'day']"
        :on-event-click="onEventClick"
      />
    </div>

    <dialog id="event-details">
      <form method="dialog">
        <h1>Event info</h1>
        <p>Name: {{ selectedEvent.title }}</p>
        <p>
          Start:
          <input type="text" v-model="selectedEvent.start" />
        </p>
        <p>
          End:
          <input type="text" v-model="selectedEvent.end" />
        </p>
        <p v-for="menu in selectedEvent.content" :key="menu">
          Menu:
          <input type="text" :value="menu"/>
        </p>
        <button v-on:click="updatePhoto(currentPhoto)">Update</button>
        <button>Delete</button>
        <button>Close</button>
      </form>
    </dialog>

  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import axios from 'axios'
  export default {
    components: { VueCal },
    data() {
      return {
        events: [],
        selectedEvent: {},
      }
    },
    created() {
      this.indexEvents();
    },
    methods: {
      indexEvents() {
        axios.get('/events.json')
        .then((res)=> {
          this.events = res.data.map((e)=> e.event);
        })
      },
      onEventClick (event, e) {
        this.selectedEvent = event
        // Prevent navigating to narrower view (default vue-cal behavior).
        e.stopPropagation()
        document.querySelector("#event-details").showModal();
      },
    },
  }
</script>

<style>
  .calendar-container {
    height: 800px;
  }
  .modal {
    position: fixed;
  }
</style>