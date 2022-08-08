<template>
  <div class="container">

    <nav aria-label="breadcrumb" class="pg-bar">
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
          Date/Time
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
          Confirmation
        </div>
      </div>
    </nav>

    <div class="pick-menus" v-if="currentStep === 1">
      <form>
        <div class="row">
          <div class="text-start">
            <h5>Pick menus</h5>
          </div>
          <div class="col-sm-6">
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
                  class="form-check-input me-1 booking-input"
                  type="checkbox"
                  :value="menu"
                  v-model="selectedMenus"  
                >
                {{ menu.title }}
                <ul class="text-end">
                  <li><small>{{ menu.duration }} min</small></li>
                  <li><small>${{ menu.price }}~</small></li>
                </ul>
              </label>
            </div>
          </div>
          <div class="col-sm-6">
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
          <div class="col-12">
            <div class="btn-container">
              <button
                type="submit"
                class="btn btn-primary"
                @click="nextStep()"
              >
                Date/Time >>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="pick-date" v-if="currentStep === 2">
      <div class="text-start">
        <h5>Pick a date and time</h5>
      </div>
      <form>
        <div class="row">
          <div class="col-sm-6">
            <div class="datepicker-container">
              <img
                src="@/assets/icons/calendar.svg"
                width="25"
                height="25"
                class="datepicker-item datepicker-icon"
              >
              <Datepicker v-model="picked" class="datepicker-item" inline  autoApply />
            </div>
          </div>
          <div class="col-sm-6">
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
                  class="form-check-input me-1 booking-input"
                  type="radio"
                  :value="timeSlot.time"
                  v-model="selectedTime"
                >
                {{ timeSlot.time.slice(11, -13) }}
              </label>
            </div>
          </div>
          <div class="col-12">
            <div class="btn-container">
              <button
                type="button"
                class="btn btn-secondary"
                @click="prevStep()"
              >
                Go Back
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                @click="nextStep()"
              >
                Customer Info >>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="user-info" v-if="currentStep === 3">
      <div class="text-start">
        <h5>Customer Info</h5>
      </div>
      <form>
        <div class="row">
          <div class="col-sm-4">
            <small>First name</small>
            <input type="text" v-model="user.first_name" class="booking-input form-control">
            <small>Last name</small>
            <input type="text" v-model="user.last_name" class="form-control">
            <small>Email</small>
            <input type="email" v-model="user.email" class="form-control">
            <small>Phone</small>
            <input type="tel" v-model="user.phone" class="form-control">
            <small>Gender</small>
            <select v-model="user.gender" class="form-select">
              <option
                v-for="gender in genders"
                :key="gender"
                :value="gender"
              >
                {{ gender }}
              </option>
            </select>
          </div>
          <div class="col-sm-4">
            <small>Zip</small>
            <input type="text" v-model="user.zip" class="form-control">
            <small>State</small>
            <select
              v-model="user.state"
              class="form-select"
              autocomplete="address-level1"
            >
              <option
                v-for="state in states"
                :key="state"
                :value="state"
              >
                {{ state }}
              </option>
            </select>
            <small>City</small>
            <input type="text" v-model="user.city" class="form-control">
            <small>Address</small>
            <input type="text" v-model="user.address" class="form-control">
          </div>
          <div class="col-sm-4">
            <small>If you have requeasts</small>
            <textarea v-model="user.note" col-sm-6s="30" rows="3" class="user-note form-control"></textarea>
          </div>
          <div class="col-12">
            <div class="btn-container">
              <button
                type="button"
                class="btn btn-secondary"
                @click="prevStep()"
              >
                Go Back
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                @click="nextStep()"
              >
                Confirm >>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="confirmation" v-if="currentStep === 4">
      <form v-on:submit.prevent="createAppointment()">
        <div class="row">
          <div class="text-start">
            <h5>Confirmation</h5>
          </div>
          <div class="col-sm-4">
            <small class="confirm-item-tag">Name:</small>
            <p>{{ fullName }}</p>
            <small class="confirm-item-tag">Email:</small>z
            <p>{{ user.email }}</p>
            <small class="confirm-item-tag">Phone:</small>
            <p>{{ user.phone }}</p>
            <small class="confirm-item-tag">Address:</small>
            <p>{{ user.address }}</p>
            <p>{{ user.city }}, {{ user.state }} {{ user.zip }}</p>
            <small class="confirm-item-tag">Gender:</small>
            <p>{{ user.gender }}</p>
            <small class="confirm-item-tag">Requests:</small>
            <p>{{ user.note }}</p>
          </div>
          <div class="col-sm-4">
            <small class="confirm-item-tag">Appointment Date:</small>
            <p>{{ USformattedPicked }}</p>
            <small class="confirm-item-tag">Time:</small>
            <p>{{ USformattedTime }} - {{ endTime }}</p>
          </div>
          <div class="col-sm-4">
            <section>
              <div class="product card">
                <div class="description card-body">
                  <h5 class="card-title text-center">Price</h5>
                  <ul class="payment-item">
                    <small class="confirm-item-tag">Menu:</small>
                    <div v-for="menu in selectedMenus" :key="menu.id" class="d-flex justify-content-between">
                      <li>
                        {{ menu.title }}
                      </li>
                      <span>${{ menu.price }}</span>
                    </div>
                  </ul>
                  <hr>
                  <div class="payment-item d-flex justify-content-between">
                    <h6 class="text-end">Subtotal</h6>
                    <span>${{ subTotal }}</span>
                  </div>
                  <div class="payment-item d-flex justify-content-between">
                    <h6 class="text-end">Tax (NY)</h6>
                    <span>${{ serviceTax }}</span>
                  </div>
                    <hr>
                  <div class="payment-item d-flex justify-content-between">
                    <h6 class="text-end">TOTAL</h6>
                    <h5>${{ subTotal + serviceTax }}</h5>
                  </div>
                  <hr>
                  <p>
                    <small>Bring your coupon and plesent at the salon before treatment starts.</small>
                  </p>
                  <p>
                    <small>Price may vary according to body condition.</small>
                  </p>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="confirmCheckbox"
                      id="flexCheckDefault"
                    >
                    <label class="form-check-label" for="flexCheckDefault">
                      <small class="terms-and-conditions">
                        Agree to our 
                        <a
                          href="/termsandconditions"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Teams and Condition
                        </a> and 
                        <a 
                          href="/privacyandpolicy"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy and Policy
                        </a>
                      </small>
                    </label>
                  </div>
                </div>
              </div>
              <!-- <form action="http://localhost:4242/create-checkout-session" method="POST">
                <button type="submit" id="checkout-button">Checkout</button>
              </form> -->
            </section>
          </div>
          <div class="btn-container">
            <button
              type="button"
              class="btn btn-secondary"
              @click="prevStep()"
            >
              Go Back
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="clearAppointment()"
            >
              Start Again
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!confirmCheckbox"
            >
              Book Appointment
            </button>
            <!-- <button
              v-if="currentStep === 4"
              type="button"
              class="btn btn-primary"
              @click="checkout()"
            >
              checkout
            </button> -->
            <p>{{ errors }}</p>
          </div>
        </div>
      </form>
    </div>

  </div>
</template>

<!-- <script setup>
import Datepicker from 'vue3-datepicker'
import { ref } from 'vue'
const picked = ref(new Date)
</script> -->

<script>
import Datepicker from 'vue3-datepicker';
import { ref } from 'vue'
import axios from "axios";
import * as moment from 'moment-timezone';
  export default {
    components: { Datepicker },
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
          "Non Binary",
          "Rather not to say",
          "N/A"
        ],
        states: [
          "AL", "AK", "AZ", "AR", "CA",
          "CO", "CT", "DE", "FL", "GA",
          "HI", "ID", "IL", "IN", "IA",
          "KS", "KY", "LA", "ME", "MD",
          "MA", "MI", "MN", "MS", "MO",
          "MT", "NE", "NV", "NH", "NJ",
          "NM", "NY", "NC", "ND", "OH",
          "OK", "OR", "PA", "RI", "SC",
          "SD", "TN", "TX", "UT", "VT",
          "VA", "WA", "WV", "WI", "WY"
        ],
        // NYC service tax rate
        taxRate: 0.045,
        confirmCheckbox: false,
        picked: ref(new Date),
      }
    },
    mounted() {
      this.getUser();
      this.indexMenus();
      this.indexBusinessTimes();
    },
    computed: {
      fullName() {
        return `${this.user.first_name} ${this.user.last_name}`;
      },
      bookingDate() {
        return moment(this.picked).format('YYYY-MM-DD');
      },
      formattedPicked() {
        return moment(this.picked).format('YYYY-MM-DD');
      },
      totalDuration() {
        let durationSum = 0;
        this.selectedMenus.forEach((menu) => {durationSum += menu.duration});
        return durationSum;
      },
      endTime() {
        var endTime = moment(this.selectedTime).add(this.totalDuration,'minute').format('hh:mm A');
        return endTime;
      },
      endTimeParams() {
        var endTime = moment(this.selectedTime).add(this.totalDuration,'minute').format();
        return endTime;
      },
      durationSum() {
        let durationSumHour = 0;
        let durationSumMin = 0;
        this.selectedMenus.forEach((menu) => {durationSumHour += menu.duration});
        durationSumMin = durationSumHour % 60;
        durationSumHour = (durationSumHour - (durationSumHour % 60)) / 60;
        return `${durationSumHour}:${durationSumMin}:00`;
      },
      durationSumInString() {
        let durationSumHour = 0;
        let durationSumMin = 0;
        this.selectedMenus.forEach((menu) => {durationSumHour += menu.duration});
        durationSumMin = durationSumHour % 60;
        durationSumHour = (durationSumHour - (durationSumHour % 60)) / 60;
        return `${durationSumHour} hour ${durationSumMin} min`;
      },
      USformattedPicked() {
        return moment(this.picked).format('MM-DD-YYYY');
      },
      USformattedTime() {
        var time = moment(this.selectedTime);
        return time.format('hh:mm A');
      },
      filteredBusinessTimes() {
        // 指定日の時間の呼び出し
        var openTimes = this.businessTimes.filter(timeSlots => timeSlots.date === this.formattedPicked).sort((a, b)=> {
          return a.id - b.id;
        }).filter((time)=> time.available === true);
        // 必要時間が最低スロット時間の場合全てのopenTimesを返す
        var keepingTime = this.totalDuration / 30;
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
      selectedMenuIds() {
        return this.selectedMenus.map((menu)=> menu.id);
      },
      subTotal() {
        return this.selectedMenus.map((menu)=> parseFloat(menu.price)).reduce((sum, price)=> { return sum + price}, 0);
      },
      serviceTax() {
        let tax = this.subTotal * this.taxRate;
        return Math.floor(tax * Math.pow(10, 2)) / Math.pow(10, 2);
      },
    },
    methods: {
      indexMenus() {
        axios.get("/menus.json")
        .then((res)=> {
          this.menus = res.data.active;
        })
      },
      indexBusinessTimes() {
        axios.get("/business_times.json")
        .then((res)=> {
          this.businessTimes = res.data;
        })
      },
      getUser() {
        var id = localStorage.user_id;
        axios.get(`/users/${id}.json`)
        .then((res)=> {
          this.user = res.data;
        })
        .catch((error)=> {
          error.response;
        })
      },
      nextStep() {
        if (this.currentStep < 4) {
          this.currentStep++;
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
          this.currentStep--;
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
        let bookingInfo = {
          "date": this.bookingDate,
          "start": this.selectedTime,
          "end": this.endTimeParams,
          "user_id": this.user.id,
          "duration_total": this.totalDuration,
          "menus": this.selectedMenus.map((menu)=> menu.id),
        }
        axios.post("/events.json", bookingInfo)
        .then((res)=> {
          this.event = res.data;
          this.$router.push("/complete");
        })
        .catch((error)=> {
          this.errors = error.response;
        })
      },
      clearAppointment() {
        this.currentStep = 1;
        this.selectedMenus = [];
        this.selectedTime = null;
        document.querySelector('#progress-2').classList.add('bg-secondary');
        document.querySelector('#progress-3').classList.add('bg-secondary');
        document.querySelector('#progress-4').classList.add('bg-secondary');
      },
      checkout() {
        let total = this.subTotal + this.serviceTax;
        let checkoutDetail = {
          line_items: [{
            price: total,
            quantity: 1,
          }]
        };
        axios
        .post('/create-checkout-session', checkoutDetail)
      },
    }
  }
</script>

<style scoped>
  .col-sm-6 {
    text-align: left;
    padding: 15px;
  }
  .col-sm-4 {
    text-align: left;
    padding: 15px;
  }
  .datepicker-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  .datepicker-item {
    box-sizing: border-box;
    margin-left: 10px;
  }
  .datepicker-icon {
    margin-right: 10px;
  }
  .dp__theme_light {
    --dp-background-color: #ffffff;
    --dp-text-color: #212121;
    --dp-hover-color: #f3f3f3;
    --dp-hover-text-color: #212121;
    --dp-hover-icon-color: #959595;
    --dp-primary-color: #1976d2;
    --dp-primary-text-color: #f8f5f5;
    --dp-secondary-color: #c0c4cc;
    --dp-border-color: #ddd;
    --dp-menu-border-color: #ddd;
    --dp-border-color-hover: #aaaeb7;
    --dp-disabled-color: #f6f6f6;
    --dp-scroll-bar-background: #f3f3f3;
    --dp-scroll-bar-color: #959595;
    --dp-success-color: #76d275;
    --dp-success-color-disabled: #a3d9b1;
    --dp-icon-color: #959595;
    --dp-danger-color: #ff6f60;
  }
  .confirm-item-tag {
    font-weight: bold;
  }
  .btn-container {
    margin-top: 20px;
  }
  .payment-item {
    padding-left: 8px;
  }
  .pg-bar {
    padding-left: 0px;
    padding-right: 0px;
  }
  .terms-and-conditions {
    font-weight: bold;
  }
</style>