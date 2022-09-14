<template>
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
            class="vuecal--blue-theme"
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
      const totalDuration = this.selectedEvent.endTimeMinutes - this.selectedEvent.startTimeMinutes;
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
      this.systemStore.businessTimes.splice();
      console.log('yes');
    },
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
    updateEvent() {
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
      
      const currentBusinessTime = this.systemStore.businessTimes.filter((timeSlot)=> timeSlot.date === this.bookingDate && timeSlot.time === this.selectedTime)[0];
      const timeSlots = totalDuration / 30;
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
        console.log(current);
      }
      axios.post('/events.json', bookingInfo)
      .then((res)=> {
        this.events.push(res.data);
        const currentBusinessTime = this.systemStore.businessTimes.filter((timeSlot)=> timeSlot.date === currentEvent.date && moment.utc(timeSlot.time).format('HH:mm') === 
        moment(this.selectedEvent.start).format('HH:mm'))[0];
        const timeSlots = totalDuration / 30;
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
          console.log(current);
        }
        this.destroyEvent();
        this.systemStore.businessTimes.splice();
      })
    },
    destroyEvent() {
      const id = this.selectedEvent.id
      axios.delete(`/events/${id}`)
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
  /* .vuecal__event {
    text-align: left;
    padding: 0px 8px 0px 8px;
    outline: 1px solid rgb(50, 126, 161);
    border-radius: 2%;
  } */
  .vuecal__event-title {
    font-size: small;
    font-weight: bold;
  }
  .vuecal__event-time {
    font-size: 10px;
    color: rgb(50, 126, 161);
  }
  .vuecal__event.danger {
    background-color: rgba(255, 99, 132, 0.2);
    border: 1px solid rgb(255, 99, 132);
  }
  .list-group-item ul {
    margin-bottom: 0px;
  }
</style>