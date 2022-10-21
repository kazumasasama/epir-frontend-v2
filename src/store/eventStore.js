import { defineStore } from "pinia";
import axios from 'axios'

export const useEventStore = defineStore("eventStore", {
  state() {
    return {
      error: null,
      event: {},
      events: [],
      canceledEvents: [],
    }
  },
  actions: {
    initEvents() {
      axios.get('/events.json')
      .then((res)=> {
        this.events = res.data.filter((event)=> event.status === "booked")
        this.canceledEvents = res.data.filter((event)=> event.status === "canceled" && event.title !== "準備時間 30分")
      })
      .then(()=> {
        axios.get('/closing_days.json')
        .then((res)=> {
          this.events.push(...res.data)
        })
        .catch((error)=> {
          this.error = error;
        })
      })
      .catch((error)=> {
        this.error = error;
      })
    },
  }
});