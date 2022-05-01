<template>
  <div class="container">

    <nav aria-label="breadcrumb">
      <div class="progress" style="height: 25px;">
        <div
          id="progress-1"
          class="progress-bar"
          role="progressbar"
          style="width: 25%;"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="25"
        >
          Menu
        </div>
        <div
          id="progress-2"
          class="progress-bar bg-secondary"
          role="progressbar"
          style="width: 25%;"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="25"
        >
          Date
        </div>
        <div
          id="progress-3"
          class="progress-bar bg-secondary"
          role="progressbar"
          style="width: 25%;"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="25"
        >
          Customer Info
        </div>
        <div
          id="progress-4"
          class="progress-bar bg-secondary"
          role="progressbar"
          style="width: 25%;"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="25"
        >
          Confirm
        </div>
      </div>
    </nav>
    <div class="pick-menus" v-if="currentStep === 1">
      <p>{{ errors }}</p>
      <h2>Select Menus</h2>
      <div class="row">
        <div class="col-4">
          <div
            class="list-group"
            id="list-tab"
            role="tablist"
          >
            <label
              class="list-group-item"
              v-for="menu in menus"
              :key="menu.id"
            >
              <input
                class="form-check-input me-1"
                type="checkbox"
                :value="menu"
                v-model="selectedMenus"  
              >
              {{ menu.title }}
              <p class="text-end">
                <small>{{ menu.duration }} min</small>
              </p>
            </label>
          </div>
        </div>

        <div class="col-4">
          <div
            class="list-group"
            id="list-tab"
            role="tablist"
          >
            <label
              class="list-group-item"
            >
            <p>Total duration</p>
              <p class="text-end">
                {{ durationSumInString }}
              </p>
            </label>
          </div>
        </div>

      </div>
    </div>

    <div class="pick-date" v-if="currentStep === 2">
      <h2>Pick a date and time</h2>
      <datepicker v-model="picked" />
      <div class="row">
        <div class="col-4">
          <div
            class="list-group"
            id="list-tab"
            role="tablist"
          >
            <label
              class="list-group-item"
              v-for="timeSlot in filteredBusinessTimes"
              :key="timeSlot.id"
            >
              <input
                class="form-check-input me-1"
                type="radio"
                :value="timeSlot.time"
                v-model="selectedTime"
              >
              {{ timeSlot.time.split("-")[2].replace("01T", "").replace(":00.000", "") }} EST
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="user-info" v-if="currentStep === 3">
      <h2>User Info</h2>
      <div class="row">
        <div class="col-4">
          <p>id: <input type="text" v-model="user.id"></p>
          <p>First_name: <input type="text" v-model="user.first_name"></p>
          <p>Last_name: <input type="text" v-model="user.last_name"></p>
          <p>Email: <input type="text" v-model="user.email"></p>
          <p>Phone: <input type="text" v-model="user.phone"></p>
          <p>
            Gender: 
            <select v-model="user.gender">
              <option v-for="gender in genders" :key="gender" :value="gender">{{ gender }}</option>
            </select>
          </p>
          <p>Zip: <input type="text" v-model="user.zip"></p>
          <p>State: <input type="text" v-model="user.state"></p>
          <p>City: <input type="text" v-model="user.city"></p>
          <p>Address: <input type="text" v-model="user.address"></p>
          <p>Note: <textarea v-model="user.note" cols="30" rows="3"></textarea></p>
          <p>Birthday: <input type="text" v-model="user.birthday"></p>
        </div>
      </div>
    </div>

    <div class="confirmation" v-if="currentStep === 4">
      <h2>Confirm your appointment</h2>
      <div class="row">
        <div class="col-4">
          <small>Date:</small>
          <p>{{ USformattedPicked }}</p>
          <small>Time:</small>
          <p>{{ USformattedTime }} - {{ moment(selectedTime).add(totalDuration,'minute').format('hh:mm A') }}</p>
        </div>
        <div class="col-4">
          <small>Menu:</small>
          <p v-for="menu in selectedMenus" :key="menu.id"> {{ menu.title }}</p>
        </div>
        <div class="col-4">
          <small>Name:</small>
          <p>{{ fullName }}</p>
          <small>Email:</small>
          <p>{{ user.email }}</p>
          <small>Phone:</small>
          <p>{{ user.phone }}</p>
          <small>Address:</small>
          <p>{{ user.address }}</p>
          <p>{{ user.city }}, {{ user.state }} {{ user.zip }}</p>
          <small>Gender:</small>
          <p>{{ user.gender }}</p>
          <small>Birthday:</small>
          <p>{{ user.birthday }}</p>
          <small>Note:</small>
          <p>{{ user.note }}</p>
        </div>
      </div>
    </div>

    <div class="btn-container">
      <button
        type="button"
        class="btn btn-primary"
        @click="prevStep()"
      >
        Go Back
      </button>
      <button
        v-if="currentStep !== 4"
        type="button"
        class="btn btn-primary"
        @click="nextStep()"
      >
        Next Step
      </button>
      <button
        v-if="currentStep === 4"
        type="button"
        class="btn btn-primary"
        @click="createAppointment()"
      >
        Book Appointment
      </button>
    </div>
  </div>
</template>

<script setup>
import Datepicker from 'vue3-datepicker'
import { ref } from 'vue'
const picked = ref(new Date)
</script>

<script>
import axios from "axios";
import * as moment from 'moment-timezone';
  export default {
    data() {
      return {
        errors: null,
        event: {},
        currentStep: 1,
        menus: [],
        menu: {},
        businessTimes: [],
        selectedMenus: [],
        selectedDate: moment().format('YYYY-MM-DD'),
        selectedTime: null,
        user: {},
        genders: [
          "Male",
          "Female",
          "N/A",
          "Rather not to say"
        ],
      }
    },
    created() {
      this.getUser();
      this.indexMenus();
      this.indexBusinessTimes();
    },
    computed: {
      fullName() {
        return `${this.user.first_name} ${this.user.last_name}`
      },
      formattedPicked() {
        this.selectedDate = moment(this.picked).format('YYYY-MM-DD')
        return moment(this.picked).format('YYYY-MM-DD')
      },
      totalDuration() {
        let durationSum = 0
        this.selectedMenus.forEach((menu) => {durationSum += menu.duration})
        return durationSum
      },
      endTime() {
        var endTime = moment(this.selectedTime).add(this.totalDuration,'minute')
        return endTime
      },
      durationSum() {
        let durationSumHour = 0
        let durationSumMin = 0
        this.selectedMenus.forEach((menu) => {durationSumHour += menu.duration})
        durationSumMin = durationSumHour % 60
        durationSumHour = (durationSumHour - (durationSumHour % 60)) / 60
        return `${durationSumHour}:${durationSumMin}:00`
      },
      durationSumInString() {
        let durationSumHour = 0
        let durationSumMin = 0
        this.selectedMenus.forEach((menu) => {durationSumHour += menu.duration})
        durationSumMin = durationSumHour % 60
        durationSumHour = (durationSumHour - (durationSumHour % 60)) / 60
        return `${durationSumHour} hour ${durationSumMin} min`
      },
      USformattedPicked() {
        return moment(this.picked).format('MM-DD-YYYY')
      },
      USformattedTime() {
        var newYork = moment.tz(this.selectedTime, 'America/New_York')
        return newYork.format('hh:mm A')
      },
      filteredBusinessTimes() {
        return this.businessTimes.filter(timeSlots => timeSlots.date === this.formattedPicked)
      },
      selectedMenuIds() {
        return this.selectedMenus.map((menu)=> menu.id)
      }
    },
    methods: {
      indexMenus() {
        axios.get("/menus.json")
        .then((res)=> {
          this.menus = res.data
        })
      },
      indexBusinessTimes() {
        axios.get("/business_times")
        .then((res)=> {
          this.businessTimes = res.data
        })
      },
      getUser() {
        var id = localStorage['user_id'];
        axios.get(`/users/${id}`)
        .then((res)=> {
          this.user = res.data
        })
        .chatch((error)=> {
          error.response
        })
      },
      nextStep() {
        if (this.currentStep < 4) {
          this.currentStep++
        }
        if (this.currentStep === 2) {
          document.querySelector('#progress-2').classList.remove('bg-secondary');
        } else if (this.currentStep === 3) {
          document.querySelector('#progress-3').classList.remove('bg-secondary');
        } else if (this.currentStep === 4) {
          document.querySelector('#progress-4').classList.remove('bg-secondary');
        }
      },
      prevStep() {
        if (this.currentStep > 1) {
          this.currentStep--
        }
        if (this.currentStep === 1) {
          document.querySelector('#progress-2').classList.add('bg-secondary');
        } else if (this.currentStep === 2) {
          document.querySelector('#progress-3').classList.add('bg-secondary');
        } else if (this.currentStep === 3) {
          document.querySelector('#progress-4').classList.add('bg-secondary');
        }
      },
      createAppointment() {
        let menuIds = this.selectedMenus.map((menu)=> menu.id)
        let bookingInfo = {
          "date": this.selectedDate,
          "start": this.selectedTime,
          "end": this.endTime,
          "user_id": this.user.id,
          "duration_total": this.totalDuration,
          "menus": menuIds,
        }
        axios.post("/events", bookingInfo)
        .then((res)=> {
          this.event = res.data
          this.$router.push("/complete")
        })
        .catch((error)=> {
          this.errors = error.response
        })
      },
    }
  }
</script>

<style>
  .col-4 {
    text-align: left;
  }
</style>