<template :key="reloadKey">
  <div class="container">
    <div class="row">
      <div class="col-12 text-end">
        <small>{{ $t('Calendar.dontSeeAppointments') }}</small>
        <button
          @click="reloadData()"
          class="btn btn-info"
        >
          {{ $t('Btn.reloadData') }}
          <font-awesome-icon icon="fa-solid fa-arrow-rotate-right" />
        </button>
      </div>
      <div class="col-12">
        <div class="calendar-container card">
          <vue-cal
            small
            today-button
            :selected-date="selectedDate"
            :time-from="config.start * 60"
            :time-to="config.end * 60"
            :time-step="30"
            :events="events"
            :disable-views="['years', 'year']"
            :disable-days="disableDays"
            :on-event-click="onEventClick"
            :max-date="maxDate"
            events-count-on-year-view
            hide-week-number
            :locale="config.lang"
          />
        </div>
      </div>
    </div>

    <div class="modal fade calendar-modal" id="event-details">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <form action="">
            <div class="modal-header">
              <h6 class="modal-title">{{ eventStartEndDateTime }}</h6>
            </div>
            <div class="modal-body event-detail-modal-body">
              <div class="row">
                <div class="col-sm-8">
                  <ul
                    v-if="selectedEvent.user.statuses"
                    class="modal-user-statuses"
                  >
                    <li
                      v-for="status in selectedEvent.user.statuses"
                      :key="status.id"
                    >
                      {{ status.title }}
                    </li>
                  </ul>
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
                  <small class="event-details-tag">Menus</small>
                  <div>
                    <ul class="event-detail-item">
                      <li v-for="menu in selectedEvent.menus" :key="menu.id">{{ menu.title }}</li>
                    </ul>
                  </div>
                </div>
                <div class="col-sm-4 text-end">
                  <button
                    v-if="!rescheduleBtn"
                    class="btn btn-success"
                    @click.prevent="rescheduleBtn = true"
                  >
                    Reschedule
                  </button>
                  <button
                    v-if="rescheduleBtn"
                    class="btn btn-outline-success"
                    @click.prevent="rescheduleBtn = false"
                  >
                    Hide Scheduler
                  </button>
                  <button
                    class="btn btn-primary"
                    @click.prevent="updateEvent()"
                  >
                    Update
                  </button>
                  <button
                    class="btn btn-danger"
                    @click.prevent="destroyEvent()"
                  >
                    Delete
                  </button>
                  <button
                    class="btn btn-secondary"
                    @click.prevent="this.eventDetailsModal.hide()"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div v-if="rescheduleBtn" class="row">
                <div class="col-12">
                  <Datepicker
                    v-model="picked"
                    class="datepicker-item"
                    inline
                    autoApply
                    utc="true"
                  />
                  <div v-if="availableTimeSlots.length" class="row">
                    <div
                      class="time-slot-col col-sm-3"
                      v-for="timeSlot in availableTimeSlots"
                      :key="timeSlot.id"
                    >
                      <div class="form-check">
                        <label class="form-check-label">
                          <ul>
                            <input
                              class="form-check-input me-1 booking-checkbox"
                              type="radio"
                              :value="timeSlot.time"
                              v-model="selectedTime"
                            >
                            <li>{{ timeSlot.time.slice(11, -8) }}</li>
                          </ul>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
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
import { useSystemStore } from '@/store/systemStore';
import { mapWritableState } from 'pinia'
import Datepicker from 'vue3-datepicker';
import { ref } from 'vue'

export default {
  setup() {
    const systemStore = useSystemStore();
    return {
      systemStore,
    }
  },
  components: { 
    VueCal,
    Datepicker,
  },
  data() {
    return {
      error: null,
      events: [],
      selectedEvent: {
        user: {},
      },
      selectedDate: moment().format('YYYY-MM-DD'),
      selectedTime: null,
      disableDays: [],
      newEvent: {},
      users: [],
      menus: [],
      new_menus: [],
      eventDetailsModal: null,
      picked: ref(new Date),
      rescheduleBtn: false,
      reloadKey: 0,
    }
  },
  created() {
    this.systemStore.modifyLoadingMessage(this.$t('Spinner.loading'))
    this.systemStore.startLoading();
    this.indexEvents();
    this.indexUsers();
    this.indexMenus();
  },
  mounted() {
    this.eventDetailsModal = new bootstrap.Modal(document.getElementById('event-details'));
    this.$nextTick(function() {
      this.systemStore.endLoading();
    })
  },
  computed: {
    ...mapWritableState(useSystemStore, ['calendarLocale']),
    ...mapWritableState(useSystemStore, ['config']),
    bookingDate() {
      return moment(this.picked).format('YYYY-MM-DD');
    },
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
    },
    availableTimeSlots() {
      // 指定日の時間の呼び出し
      const picked = moment(this.picked).format('YYYY-MM-DD');
      var openTimes = this.systemStore.businessTimes.filter(timeSlots => timeSlots.date === picked).sort((a, b)=> {
        return a.id - b.id;
      }).filter((time)=> time.available === true);
      const totalDuration = this.selectedEvent.endTimeMinutes - this.selectedEvent.startTimeMinutes + this.systemStore.config.interval;
      const keepingTime = totalDuration / 30;
      // 必要時間が最低スロット時間の場合全てのopenTimesを返す
      if (keepingTime === 1) {
        return openTimes;
      }
      // 必要時間分の空きがあるスロットを取得
      var i = 0;
      var available = [];
      var x = keepingTime;
      while (i < openTimes.length - x + 1) {
        if (openTimes[i].id === openTimes[i + x - 1].id - (x - 1)) {
          available.push(openTimes[i]);
        }
        i++;
      }
      return available
    },
  },
  methods: {
    reloadData() {
      this.indexEvents();
      this.indexBusinessTimes();
      this.reloadKey++;
    },
    indexEvents() {
      axios.get('/events.json')
      .then((res)=> {
        this.events = res.data.filter((event)=> event.status === "booked")
      })
    },
    indexBusinessTimes() {
      axios.get("/business_times.json")
      .then((res)=> {
        this.systemStore.businessTimes = res.data;
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
      if (event.user.id !== 2) { // User ID for interval
        this.selectedEvent = event;
        // Prevent navigating to narrower view (default vue-cal behavior).
        e.stopPropagation();
        this.eventDetailsModal.show();
      }
    },
    redirectToUser(id) {
      this.$router.push(`/admin/users/${id}`);
    },
    updateEvent() {
      // prepare update data
      let currentEvent = this.events.filter((event)=> event.id === this.selectedEvent.id)[0];
      const date = this.bookingDate;
      let start = moment.utc(this.selectedTime).format();
      const totalDuration = this.selectedEvent.endTimeMinutes - this.selectedEvent.startTimeMinutes;
      const end = moment.utc(start).clone().add(totalDuration, 'minutes').format();
      const userId = currentEvent.user.id;
      const menus = currentEvent.menus.map((menu)=> menu.id)
      let price = Number(currentEvent.menus.reduce((sum, el)=> {return sum + el.price;},0));
      const tax = price * (Number(this.systemStore.config.tax) / 100)
      const bookingInfo = {
        "date": date,
        "start": start,
        "end": end,
        "user_id": userId,
        "duration_total": totalDuration,
        "menus": menus,
        "price": price,
        "tax": tax,
      }
      // modify time slots for current event and interval
      const currentBusinessTime = this.systemStore.businessTimes.filter((timeSlot)=> timeSlot.date === this.bookingDate && timeSlot.time === this.selectedTime)[0];
      const timeSlots = (totalDuration + this.systemStore.config.interval) / 30;
      let i = 0;
      let current;
      let id = currentBusinessTime.id;
      let index;
      while (i < timeSlots) {
        current = this.systemStore.businessTimes.find(bt => bt.id === id);
        index = this.systemStore.businessTimes.indexOf(current);
        current.available = false;
        this.systemStore.businessTimes.splice(index, 1, current)
        i++;
        id++;
      }
      axios.patch(`/events/${this.selectedEvent.id}.json`, bookingInfo)
      .then((res)=> {
        // replace event with updated event
        let event = this.events.find(event => event.id === res.data.id);
        let eventIndex = this.events.indexOf(event);
        this.events.splice(eventIndex, 1, res.data);
        // modify time slots for prev event and interval
        const currentBusinessTime = this.systemStore.businessTimes.filter((timeSlot)=> timeSlot.date === currentEvent.date && moment.utc(timeSlot.time).format('HH:mm') === 
        moment(this.selectedEvent.start).format('HH:mm'))[0];
        const timeSlots = (totalDuration + this.systemStore.config.interval) / 30;
        let i = 0;
        let current;
        let id = currentBusinessTime.id;
        let index;
        while (i < timeSlots) {
          current = this.systemStore.businessTimes.find(bt => bt.id === id);
          index = this.systemStore.businessTimes.indexOf(current);
          current.available = true;
          this.systemStore.businessTimes.splice(index, 1, current);
          i++;
          id++;
        }
        // this.systemStore.businessTimes.splice();
        let interval = this.events.find(event => event.id == res.data.id + 1)
        let intervalIndex = this.events.indexOf(interval);
        return {"interval": interval, "index": intervalIndex, "event": res.data}
      })
      .then((intervalInfo)=> {
        // modify interval of event
        intervalInfo.interval.start = intervalInfo.event.end
        intervalInfo.interval.end = moment.utc(intervalInfo.event.end).clone().add(this.systemStore.config.interval, 'minutes').format('YYYY-MM-DD HH:mm')
        this.events.splice(intervalInfo.index, 1, intervalInfo.interval);
      })
      .then(()=> {
        this.eventDetailsModal.hide();
      })
    },
    destroyEvent() {
      const id = this.selectedEvent.id
      axios.delete(`/events/${id}.json`)
      .then((res)=> {
        // delete event from events
        let event = this.events.find(event => event.id === res.data.id);
        let i = this.events.indexOf(event);
        this.events.splice(i, 1);
        // delete interval from events
        let interval = this.events.find(event => event.id === res.data.id + 1);
        let intervalIndex = this.events.indexOf(interval);
        this.events.splice(intervalIndex, 1);
        // modify time slots
        const currentBusinessTime = this.systemStore.businessTimes.filter((timeSlot)=> timeSlot.date === this.selectedEvent.date && moment.utc(timeSlot.time).format('HH:mm') === 
        moment(this.selectedEvent.start).format('HH:mm'))[0];
        const totalDuration = this.selectedEvent.endTimeMinutes - this.selectedEvent.startTimeMinutes;
        const timeSlots = (totalDuration + this.systemStore.config.interval) / 30;
        i = 0;
        let current;
        let id = currentBusinessTime.id;
        let index;
        while (i < timeSlots) {
          current = this.systemStore.businessTimes.find(bt => bt.id === id);
          index = this.systemStore.businessTimes.indexOf(current);
          current.available = true;
          this.systemStore.businessTimes.splice(index, 1, current);
          i++;
          id++;
        }
      })
      .then(()=> {
        this.eventDetailsModal.hide();
      })
      .catch((error)=> {
        this.error = error.response.data.errors;
      })
    }
  },
}
</script>

<style>
  .modal-user-statuses {
    color: rgb(255, 99, 132);
    padding-left: 0px;
  }
  .calendar-container {
    height: 100%;
  }
  .calendar-modal {
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
  .vuecal__cell-date {
    margin-top: 9px;
    margin-bottom: 18px;
    padding-bottom: 18px;
  }
  .vuecal__menu {
    background-color: rgba(75, 192, 192, 0.7);
  }
  .vuecal__title-bar{
    background-color: rgba(75, 192, 192, 0.3);
  }
  .vuecal__event-title {
    font-size: small;
    font-weight: bold;
  }
  .vuecal__event-time {
    font-size: 10px;
    color: rgb(50, 126, 161);
  }
  .vuecal__cell-events-count {
    background-color: rgba(255, 205, 86);
    min-width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    border-radius: 20px;
    padding: 5px, 8px;
  }
  .vuecal__event.danger {
    background-color: rgba(255, 99, 132, 0.2);
    border: 2px solid rgba(255, 99, 132, 0.8);
  }
  .vuecal__event.primary {
    background-color: rgba(140,146,232, 0.2);
    border: 2px solid rgba(140,146,232, 0.8);
  }
  .vuecal__event.warning {
    background-color: rgba(255, 159, 64, 0.2);
    border: 2px solid rgba(255, 159, 64, 0.8);
  }
  .vuecal__event.gray {
    background-color: rgba(201, 203, 207, 0.2);
    border: 2px solid rgba(201, 203, 207, 0.8);
  }
</style>