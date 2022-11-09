<template :key="reloadKey">
  <div
    v-if="error"
    class="alert alert-danger"
    role="alert"
  >
    {{ error }}
  </div>

  <div class="modal fade calendar-modal" id="event-details">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form>
          <div class="modal-header d-flex justify-content-between">
            <h6 class="modal-title">{{ eventStartEndDateTime }}</h6>
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
          </div>
          <div class="modal-body event-detail-modal-body">
            <div
              v-if="error"
              class="alert alert-danger"
              role="alert"
            >
              {{ error }}
            </div>
            <div class="row">
              <div class="col-sm-9">
                <small class="event-details-tag">お名前</small>
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
                <small class="event-details-tag">注意事項</small>
                <p class="event-detail-item">{{ selectedEvent.user.note }}</p>
                <small class="event-details-tag">メニュー</small>
                <div>
                  <ul class="event-detail-item">
                    <li v-for="menu in selectedEvent.menus" :key="menu.id">{{ menu.title }}</li>
                  </ul>
                </div>
              </div>
              <div class="col-12 d-flex justify-content-end">
                <div class="btn-container">
                  <button
                    v-if="!rescheduleBtn"
                    class="btn btn-success"
                    data-bs-toggle="collapse" data-bs-target="#collapseEventShow"
                    aria-expanded="false"
                    aria-controls="collapseEventShow"
                    @click.prevent="rescheduleBtn = true"
                  >
                    予約時間変更
                  </button>
                  <button
                    v-if="rescheduleBtn"
                    class="btn btn-outline-success"
                    data-bs-toggle="collapse" data-bs-target="#collapseEventShow"
                    aria-expanded="false"
                    aria-controls="collapseEventShow"
                    @click.prevent="rescheduleBtn = false"
                  >
                    隠す
                  </button>
                  <button
                    class="btn btn-danger"
                    @click.prevent="destroyEvent()"
                  >
                    予約キャンセル
                  </button>
                  <button
                    class="btn btn-secondary"
                    @click.prevent="this.eventDetailsModal.hide()"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="collapse modal-footer" id="collapseEventShow">
            <div class="row time-slots-row">
              <div class="col-12 mb-5">
                <Datepicker
                  v-model="picked"
                  class="datepicker-item"
                  inline
                  autoApply
                  utc="true"
                />
              </div>
              <div
                class="col-sm-3 col-6"
                v-for="timeSlot in availableTimeSlots"
                :key="timeSlot.id"
              >
                <div class="card card-body mb-3">
                  <label class="form-check-label">
                    <ul>
                      <div class="form-check">
                        <input
                          class="form-check-input booking-checkbox"
                          type="radio"
                          :value="timeSlot"
                          v-model="selectedTime"
                        >
                        <li>{{ timeSlot.time.slice(11, -8) }}</li>
                      </div>
                    </ul>
                  </label>
                </div>
              </div>
              <div class="btn-container d-flex justify-content-end">
                <button
                  class="btn btn-primary"
                  @click.prevent="updateEvent()"
                >
                  更新する
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade calendar-modal" id="new-event">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form>
          <div class="modal-header d-flex justify-content-between">
            <h6 class="modal-title">予約作成</h6>
          </div>
          <div class="modal-body event-detail-modal-body">
            <div
              v-if="newEventError"
              class="alert alert-danger"
              role="alert"
            >
              {{ newEventError }}
            </div>
            <div class="row">
              <div class="col-sm-9">
                <div v-if="finalBookingUser" class="mb-3">
                  <h6>
                    {{ finalBookingUser.full_name }}
                    <a
                      style="color: rgb(255, 99, 132)"
                      @click.prevent="removeUser()"
                    >
                      <font-awesome-icon icon="fa-solid fa-circle-xmark" />
                    </a>
                  </h6>
                </div>
                <div class="control-navbar-item" v-if="!finalBookingUser">
                  <input
                    v-model="userSearch"
                    type="text"
                    class="form-control mb-3"
                    placeholder="顧客検索"
                  >
                </div>
                <div class="col-12 d-flex justify-content-start">
                  <div
                    class="list-group"
                    id="list-tab"
                    role="tablist"
                  >
                    <a
                      class="list-group-item list-group-item-action"
                      id="list-home-list"
                      data-bs-toggle="list"
                      role="tab"
                      aria-controls="list-home"
                      v-for="user in filteredUsers"
                      :key="user.id"
                      @click.prevent="bookingUser = user;"
                    >
                      <small>{{ user.full_name }}</small>
                    </a>
                  </div>
                  <div class="card card-body" v-if="bookingUser">
                    <ul class="card-base">
                      <li
                        v-for="status in bookingUser.statuses"
                        :key="status.id"
                      >
                        <small style="color: red">{{ status.title }}</small>
                      </li>
                      <li><small>{{ bookingUser.email }}</small></li>
                      <li><small>{{ bookingUser.phone }}</small></li>
                      <li><small>{{ bookingUser.line_id }}</small></li>
                      <li><small>{{ bookingUser.gender }}</small></li>
                      <li><small>{{ bookingUser.state }} {{ bookingUser.city }}</small></li>
                      <li><small>{{ bookingUser.address }}</small></li>
                      <li><small>{{ bookingUser.birthday }}</small></li>
                    </ul>
                    <button
                      class="btn btn-sm btn-info"
                      @click.prevent="setBookingUser()"
                    >
                      決定
                    </button>
                  </div>
                </div>
                <div>
                  <input
                    v-model="menuSearch"
                    type="text"
                    class="form-control mb-3"
                    placeholder="メニュー検索"
                  >
                </div>
                <div class="row" v-if="filteredMenus">
                  <div class="col-12 d-flex justify-content-start">
                    <div
                      class="list-group"
                      id="list-tab"
                      role="tablist"
                    >
                      <a
                        class="list-group-item list-group-item-action"
                        id="list-home-list"
                        data-bs-toggle="list"
                        role="tab"
                        aria-controls="list-home"
                        v-for="menu in filteredMenus"
                        :key="menu.id"
                        @click.prevent="setBookingMenus(menu);"
                      >
                        <small>{{ menu.title }}</small>
                      </a>
                    </div>
                  </div>
                </div>
                <div v-if="bookingMenus">
                  <ol>
                    <li v-for="menu in bookingMenus" :key="menu.id">
                      {{ menu.title }}
                      <a
                        style="color: rgb(255, 99, 132)"
                        @click.prevent="removeMenu(menu)"
                      >
                        <font-awesome-icon icon="fa-solid fa-circle-xmark" />
                      </a>
                    </li>
                  </ol>
                </div>
                <div>
                  <p class="mb-0"><small>施術時間: {{ newBookingMenuDurationTotal }}</small></p>
                  <p class="mb-0"><small>料金: {{ newBookingMenuPriceTotal }}</small></p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-start">
            <div class="row time-slots-row">
              <div class="col-12 mb-5">
                <Datepicker
                  v-model="newEventDate"
                  class="datepicker-item"
                  inline
                  autoApply
                  utc="true"
                />
              </div>
              <div
                class="col-sm-3 col-6"
                v-for="timeSlot in availableTimeSlotsForNewEventModal"
                :key="timeSlot.id"
              >
                <div class="card card-body mb-3">
                  <label class="form-check-label">
                    <ul>
                      <div class="form-check">
                        <input
                          class="form-check-input booking-checkbox"
                          type="radio"
                          :value="timeSlot"
                          v-model="newEventSelectedTime"
                        >
                        <li>{{ timeSlot.time.slice(11, -8) }}</li>
                      </div>
                    </ul>
                  </label>
                </div>
              </div>
              <div class="col-12 d-flex justify-content-end">
                <div class="btn-container">
                  <button
                    class="btn btn-primary"
                    @click.prevent="createEvent()"
                  >
                    予約する
                  </button>
                  <button
                    class="btn btn-secondary"
                    @click.prevent="this.newEventModal.hide()"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="card card-base">
      <div class="card-header">
        <div class="col-12 d-flex justify-content-between">
          <button
            class="btn btn-success btn-sm"
            @click.prevent="newEventModal.show()"
          >
            新規予約
          </button>
          <button
            @click.prevent="reloadData()"
            class="btn btn-info btn-sm"
          >
            {{ $t('Btn.reloadData') }}
            <font-awesome-icon icon="fa-solid fa-arrow-rotate-right" />
          </button>
        </div>
      </div>
      <div class="card-body card-base-body">
        <div class="row">
          <div class="col-12">
            <div class="calendar-container">
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
import { mapWritableState } from 'pinia'
import { useSystemStore } from '@/store/systemStore';
import { useUserStore } from '@/store/userStore';
import { useEventStore } from '@/store/eventStore';
import Datepicker from 'vue3-datepicker';
import { ref } from 'vue'

export default {
  setup() {
    const systemStore = useSystemStore();
    const userStore = useUserStore();
    const eventStore = useEventStore();
    return {
      systemStore,
      userStore,
      eventStore,
    }
  },
  components: { 
    VueCal,
    Datepicker,
  },
  data() {
    return {
      error: null,
      newEventError: null,
      selectedEvent: {
        user: {},
      },
      selectedDate: moment().format('YYYY-MM-DD'),
      selectedTime: null,
      newEventSelectedTime: null,
      disableDays: [],
      newEvent: {},
      new_menus: [],
      eventDetailsModal: null,
      newEventModal: null,
      picked: ref(new Date),
      newEventDate: ref(new Date),
      rescheduleBtn: false,
      reloadKey: 0,
      bookingData: {
        date: null,
        start: null,
        end: null,
        user_id: null,
        duration_total: null,
        menus: [],
        price: null,
        tax: null,
      },
      bookingUser: null,
      finalBookingUser: null,
      userSearch: '',
      bookingMenus: [],
      menuSearch: '',
    }
  },
  created() {
    this.systemStore.modifyLoadingMessage(this.$t('Spinner.loading'))
    this.systemStore.startLoading();
    this.userStore.initUsers();
    this.eventStore.initEvents();
  },
  mounted() {
    this.eventDetailsModal = new bootstrap.Modal(document.getElementById('event-details'));
    this.newEventModal = new bootstrap.Modal(document.getElementById('new-event'));
    this.$nextTick(function() {
      this.systemStore.endLoading();
    })
  },
  computed: {
    ...mapWritableState(useSystemStore, ['calendarLocale']),
    ...mapWritableState(useSystemStore, ['business']),
    ...mapWritableState(useSystemStore, ['config']),
    ...mapWritableState(useSystemStore, ['closingDays']),
    ...mapWritableState(useSystemStore, ['activeMenus']),
    ...mapWritableState(useEventStore, ['events']),
    ...mapWritableState(useEventStore, ['canceledEvents']),
    ...mapWritableState(useUserStore, ['users']),
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
      let start = moment(this.selectedEvent.start).format('YYYY-MM-DD / HH:mm')
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
    availableTimeSlotsForNewEventModal() {
      // 指定日の時間の呼び出し
      const picked = moment(this.newEventDate).format('YYYY-MM-DD');
      var openTimes = this.systemStore.businessTimes.filter(timeSlots => timeSlots.date === picked).sort((a, b)=> {
        return a.id - b.id;
      }).filter((time)=> time.available === true);
      let initial = 0;
      const totalDuration = this.bookingMenus.map(menu => menu.duration).reduce((pre, current)=> pre + current, initial) + this.systemStore.config.interval
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
    filteredUsers() {
      if (!this.userSearch) {
        return []
      }
      let keyword = this.userSearch.toLowerCase()
      let users = [];
      for (let i in this.users) {
        let user = this.users[i];
        if (user.phone) {
          if (
            user.first_name.toLowerCase().indexOf(keyword) !== -1
            || user.last_name.toLowerCase().indexOf(keyword) !== -1
            || user.email.indexOf(keyword) !== -1
            || user.phone.indexOf(keyword) !== -1
          )
          {
            users.push(user)
          }
        } else {
          if (
            user.first_name.toLowerCase().indexOf(keyword) !== -1
            || user.last_name.toLowerCase().indexOf(keyword) !== -1
            || user.email.indexOf(keyword) !== -1
          )
          {
            users.push(user)
          }
        }
      }
      return users;
    },
    filteredMenus() {
      if (!this.menuSearch) {
        return []
      }
      let keyword = this.menuSearch.toLowerCase()
      let menus = [];
      for (let i in this.activeMenus) {
        let menu = this.activeMenus[i];
        if (menu.title) {
          if (menu.title.toLowerCase().indexOf(keyword) !== -1) {
            menus.push(menu)
          }
        } else {
          if (menu.first_name.toLowerCase().indexOf(keyword) !== -1 || menu.email.indexOf(keyword) !== -1) {
            menus.push(menu)
          }
        }
      }
      return menus;
    },
    newBookingMenuDurationTotal() {
      const totalInMinutes = this.bookingMenus.map(menu => menu.duration).reduce((sum, element) => sum + element, 0);
      const hour = Math.floor(totalInMinutes / 60);
      const minute = totalInMinutes % 60;
      return `${hour}時間${minute}分`;
    },
    newBookingMenuPriceTotal() {
      return `¥${this.bookingMenus.map(menu => parseFloat(menu.price)).reduce((sum, element) => sum + element, 0).toLocaleString()}`
    },
  },
  methods: {
    reloadData() {
      this.eventStore.initEvents();
      this.systemStore.initBusinessTimes();
      this.reloadKey++;
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
      this.error = null;
      // prepare update data
      let currentEvent = this.events.filter((event)=> event.id === this.selectedEvent.id)[0];
      const date = this.bookingDate;
      let start = moment.utc(this.selectedTime.time).format();
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
      const currentBusinessTime = this.systemStore.businessTimes.filter((timeSlot)=> timeSlot.date === this.bookingDate && timeSlot.time === this.selectedTime.time)[0];
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
      .catch((error)=> {
        this.error = error;
      })
    },
    destroyEvent() {
      this.error = null;
      const id = this.selectedEvent.id
      axios.delete(`/events/${id}.json`)
      .then((res)=> {
        // delete event from events
        let event = this.events.find(event => event.id === res.data.id);
        let i = this.events.indexOf(event);
        this.events.splice(i, 1);
        event.status = "canceled"
        this.canceledEvents.push(event);
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
        this.error = error;
      })
    },
    setBookingUser() {
      this.finalBookingUser = this.bookingUser;
      this.bookingData.user_id = this.bookingUser.id;
      this.bookingUser = null;
      this.userSearch = null;
    },
    setBookingMenus(menu) {
      if (this.bookingMenus.includes(menu) === false) {
        this.bookingMenus.push(menu);
      }
      this.bookingData.menus = this.bookingMenus.concat();
      this.menuSearch = null;
    },
    removeUser() {
      this.finalBookingUser = null;
      this.bookingData.user_id = null;
    },
    removeMenu(menu) {
      const i = this.bookingMenus.indexOf(menu)
      this.bookingMenus.splice(i, 1)
      if (this.bookingMenus.length) {
        this.bookingData.menus = this.bookingMenus.concat();
      }
    },
    createEvent() {
      if (!this.bookingData.user_id) {
        this.newEventError = "顧客を選択してください";
        return
      }
      if (!this.bookingMenus.length) {
        this.newEventError = "メニューを選択してください";
        return
      }
      this.error = null;
      this.newEventError = null;
      const date = this.newEventSelectedTime.date;
      let initial = 0;
      const totalDuration = this.bookingData.menus.map(menu => menu.duration).reduce((pre, current)=> pre + current, initial);
      const startTime = this.newEventSelectedTime.time;
      const endTime = moment(this.newEventSelectedTime.time).add(totalDuration, 'minutes');
      let ini = 0;
      const price = this.bookingData.menus.map(menu => menu.price).reduce((pre, current)=> pre + current, ini);
      const tax = price * Number(this.config.tax) / 100;
      const bookingData = this.bookingData;
      bookingData.date = date;
      bookingData.start = startTime;
      bookingData.end = endTime;
      bookingData.duration_total = totalDuration;
      bookingData.menus = this.bookingMenus.map(menu => menu.id)
      bookingData.price = price;
      bookingData.tax = tax;
      axios.post('/events.json', bookingData)
      .then((res)=> {
        // modify time slots for current event and interval
        const currentBusinessTime = this.systemStore.businessTimes.filter((timeSlot)=> timeSlot.date === date && timeSlot.time === this.newEventSelectedTime.time)[0];
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
        const interval = {
          date: date,
          start: `${date} ${moment.utc(endTime).format('HH:mm')}`,
          end: `${date} ${moment.utc(endTime).add(this.config.interval, 'minutes').format('HH:mm')}`,
          duration_total: this.config.interval,
          status: "booked",
          class: "gray",
          title: "準備時間 30分",
          user: {
            id: 2,
            first_name: "準備時間",
            full_name: "準備時間 30分",
            last_name: "30分",
            status: "System"
          }
        }
        this.events.push(res.data);
        this.bookingData = {};
        return interval
      })
      .then((interval)=> {
        this.events.push(interval);
        this.newEventModal.hide();
      })
      .catch((error)=> {
        this.newEventError = error;
      })
    },
    closeNewEventModal() {
      this.newEventModal.hide();
    },
  },
}
</script>

<style scoped>
  .modal-user-statuses {
    color: rgb(255, 99, 132);
    padding-left: 0px;
  }
  .modal-header {
    padding-left: 30px !important;
    padding-right: 30px !important;
  }
  .modal-footer {
    padding: 30px !important;
  }
  .booking-checkbox {
    position: relative;
    left: 0px;
  }
  .time-slots-row .card-body {
    padding: 0px;
    padding-top: 16px;
    min-width: 112px;
  }
  .time-slots-row .card-body:hover {
    background-color: rgba(54, 162, 235, 0.2);
  }
  .form-check-label {
    padding: 0px !important;
  }
  .form-check li {
    padding-right: 8px;
  }
  .datepicker-item {
    margin-bottom: 30px;
  }
  .calendar-container {
    height: 100%;
  }
  .calendar-modal {
    position: fixed;
  }
  .event-detail-modal-body {
    text-align: left;
    padding: 30px !important;
  }
  .event-details-tag {
    font-weight: bold;
  }
  .event-detail-item {
    padding-left: 8px;
  }

  
</style>