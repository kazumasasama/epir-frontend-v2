<template>
  <div class="container">
    <div v-if="errors">
      <div v-for="error in errors" :key="error" class="alert alert-warning" role="alert">
        {{ error }}
      </div>
    </div>

    <nav aria-label="breadcrumb" class="pg-bar">
      <div class="progress">
        <div
          id="progress-1"
          class="progress-bar bg-success"
          role="progressbar"
          style="width: 25%;"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="25"
        >
          {{ $t('Appointments.steps.menu') }}
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
          {{ $t('Appointments.steps.dateTime') }}
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
          {{ $t('Appointments.steps.customerInfo') }}
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
          {{ $t('Appointments.steps.confirmation') }}
        </div>
      </div>
    </nav>

    <div class="pick-menus" v-if="currentStep === 1">
      <div class="row">
        <div class="text-start">
          <h5>{{ $t('Appointments.title.pickMenu') }}</h5>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <div
            class="list-group"
            role="tablist"
            v-for="menu in menus" :key="menu.id"
          >
            <label class="list-group-item">
              <ul>
                <input
                  class="form-check-input me-1 booking-checkbox"
                  type="checkbox"
                  :value="menu"
                  v-model="selectedMenus"  
                >
                <li>{{ menu.title }}</li>
                <li class="text-end"><small>{{ menu.duration }} {{ $t('DateTime.min') }}</small></li>
                <li class="text-end"><small>{{ $t('Currency') }}{{ menu.price }}~</small></li>
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
            <p>{{ $t('Appointments.totalDuration') }}</p>
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
              {{ $t('Btn.dateTime') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="pick-date" v-if="currentStep === 2">
      <div class="text-start">
        <h5>{{ $t('Appointments.title.pickTime') }}</h5>
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
              v-for="timeSlot in filteredBusinessTimes"
              :key="timeSlot.id"
            >
              <label
                class="list-group-item"
              >
                <ul>
                  <input
                    class="form-check-input me-1 booking-checkbox"
                    type="radio"
                    :value="timeSlot.time"
                    v-model="selectedTime"
                  >
                  <li>
                    {{ timeSlot.time.slice(11, -13) }}
                  </li>
                </ul>
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
                {{ $t('Btn.goBack') }}
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                @click="nextStep()"
              >
                {{ $t('Btn.customerInfo') }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="user-info" v-if="currentStep === 3">
      <div class="text-start">
        <h5>{{ $t('Appointments.title.customerInfo') }}</h5>
      </div>
      <form>
        <div class="row">
          <div class="col-sm-4">
            <small>{{ $t('Forms.firstName') }}</small>
            <input type="text" v-model="user.first_name" class="booking-checkbox form-control">
            <small>{{ $t('Forms.lastName') }}</small>
            <input type="text" v-model="user.last_name" class="form-control">
            <small>{{ $t('Forms.email') }}</small>
            <input type="email" v-model="user.email" class="form-control">
            <small>{{ $t('Forms.phone') }}</small>
            <input type="tel" v-model="user.phone" class="form-control">
            <small>{{ $t('Forms.gender') }}</small>
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
            <small>{{ $t('Forms.zip') }}</small>
            <input type="text" v-model="user.zip" class="form-control">
            <small>{{ $t('Forms.state') }}</small>
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
            <small>{{ $t('Forms.city') }}</small>
            <input type="text" v-model="user.city" class="form-control">
            <small>{{ $t('Forms.address') }}</small>
            <input type="text" v-model="user.address" class="form-control">
          </div>
          <div class="col-sm-4">
            <small>{{ $t('Forms.requestsAndNote') }}</small>
            <textarea v-model="user.note" col-sm-6s="30" rows="3" class="user-note form-control"></textarea>
          </div>
          <div class="col-12">
            <div class="btn-container">
              <button
                type="button"
                class="btn btn-secondary"
                @click="prevStep()"
              >
                {{ $t('Btn.goBack') }}
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                @click="nextStep()"
              >
                {{ $t('Btn.confirm') }}
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
            <h5>{{ $t('Appointments.title.confirmation') }}</h5>
          </div>
          <div class="col-sm-4">
            <div class="card confirmation-detail-card">
              <div class="card-body">
                <h6 class="body-title text-center">Personal Info</h6>
                <small class="confirm-item-tag">{{ $t('Forms.name') }}:</small>
                <p>{{ fullName }}</p>
                <small class="confirm-item-tag">{{ $t('Forms.email') }}:</small>
                <p>{{ user.email }}</p>
                <small class="confirm-item-tag">{{ $t('Forms.phone') }}:</small>
                <p>{{ user.phone }}</p>
                <small class="confirm-item-tag">{{ $t('Forms.address') }}:</small>
                <p>{{ user.address }}</p>
                <p>{{ user.city }}, {{ user.state }} {{ user.zip }}</p>
                <small class="confirm-item-tag">{{ $t('Forms.gender') }}:</small>
                <p>{{ user.gender }}</p>
                <small class="confirm-item-tag">{{ $t('Forms.requestsAndNote') }}:</small>
                <p>{{ user.note }}</p>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="card confirmation-detail-card">
              <div class="card-body">
                <h6 class="card-title text-center">Date/Time</h6>
                <small class="confirm-item-tag">{{ $t('Forms.appointmentDate') }}:</small>
                <p>{{ USformattedPicked }}</p>
                <small class="confirm-item-tag">{{ $t('Forms.time') }}:</small>
                <p>{{ USformattedTime }} - {{ endTime }}</p>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <section>
              <div class="card confirmation-detail-card">
                <div class="card-body">
                  <h6 class="card-title text-center">{{ $t('Forms.price') }}</h6>
                  <ul class="payment-item">
                    <small class="confirm-item-tag">{{ $t('Menus.menu') }}:</small>
                    <div v-for="menu in selectedMenus" :key="menu.id" class="d-flex justify-content-between">
                      <li>
                        {{ menu.title }}
                      </li>
                      <span>{{ $t('Currency') }}{{ menu.price }}</span>
                    </div>
                  </ul>
                  <hr>
                  <div class="payment-item d-flex justify-content-between">
                    <h6 class="text-end">{{ $t('Forms.subtotal') }}</h6>
                    <span>{{ $t('Currency') }}{{ subTotal }}</span>
                  </div>
                  <div class="payment-item d-flex justify-content-between">
                    <span class="text-end">{{ $t('Forms.tax') }} {{ $t('Locale.tax') }}</span>
                    <span>{{ $t('Currency') }}{{ serviceTax }}</span>
                  </div>
                    <hr>
                  <div class="payment-item d-flex justify-content-between">
                    <h6 class="text-end">{{ $t('Forms.total') }}</h6>
                    <span>{{ $t('Currency') }}{{ subTotal + serviceTax }}</span>
                  </div>
                  <hr>
                  <p>
                    <small>{{ $t('Messages.couponNotice') }}</small>
                  </p>
                  <p>
                    <small>{{ $t('Messages.priceNotice') }}</small>
                  </p>
                  <div>
                    <label class="form-check-label" for="flexCheckDefault">
                      <input
                        class="form-check-input booking-checkbox"
                        type="checkbox"
                        v-model="confirmCheckbox"
                        id="flexCheckDefault"
                      >
                      <small class="terms-and-conditions">
                        Agree to our 
                        <span @click="this.$router.push('/termsandconditions')">
                          <a
                            class="link-primary"
                            href="#"
                            rel="noopener noreferrer"
                          >
                            Terms and Condition
                          </a>
                        </span>
                        and
                        <span @click="this.$router.push('/privacyandpolicy')">
                          <a 
                            class="link-primary"
                            href="#"
                            rel="noopener noreferrer"
                          >
                            Privacy Policy
                          </a>
                        </span>
                      </small>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div class="btn-container">
          <button
            type="button"
            class="btn btn-secondary"
            @click="prevStep()"
          >
            {{ $t('Btn.goBack') }}
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="clearAppointment()"
          >
            {{ $t('Btn.startOver') }}
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!confirmCheckbox"
          >
            {{ $t('Btn.bookAppointment') }}
          </button>
          <button
            v-if="currentStep === 4"
            type="button"
            class="btn btn-primary"
            @click="checkout()"
          >
            Checkout
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script>
import Datepicker from 'vue3-datepicker';
import { ref } from 'vue'
import axios from "axios";
import * as moment from 'moment-timezone';
import { useSystemStore } from '@/store/systemStore'
import { useUserStore } from '@/store/userStore'

export default {
  setup() {
    const systemStore = useSystemStore();
    const userStore = useUserStore();
    return {
      systemStore,
      userStore,
    }
  },
  components: {
    Datepicker,
  },
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
        this.$t('Gender.male'),
        this.$t('Gender.female'),
        this.$t('Gender.nonBinary'),
        this.$t('Gender.ratherNot'),
        this.$t('Gender.NA')
      ],
      states: [
        'AL', 'AK', 'AZ', 'AR', 'CA',
        'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA',
        'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO',
        'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH',
        'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT',
        'VA', 'WA', 'WV', 'WI', 'WY'
      ],
      // NYC service tax rate
      taxRate: 0.045,
      confirmCheckbox: false,
      picked: ref(new Date),
    }
  },
  created() {
    this.systemStore.modifyLoadingMessage("Loading");
    this.systemStore.startLoading();
    this.user = this.userStore.user;
    this.indexMenus();
    this.indexBusinessTimes();
  },
  mounted() {
    this.$nextTick(function() {
      this.systemStore.endLoading();
    })
  },
  watch: {
    selectedMenus() {
      if (this.selectedMenus.length !== 0) {
        this.errors = null;
      }
    },
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
    nextStep() {
      if (this.currentStep === 1 && this.selectedMenus.length === 0) {
        this.errors = ["Please pick at least one menu."];
      } else if (this.currentStep === 1 && this.selectedMenus.length !== 0) {
        this.currentStep++;
      // } else if (this.currentStep === 2 && !this.selectedTime) {
      //   console.log('in error 2')
      //   this.errors = ["Please pick a time."];
      } else if (this.currentStep === 2 && this.selectedTime) {
        this.currentStep++;
        let targetElement = document.querySelector('#progress-2')
        targetElement.classList.remove('bg-secondary');
        targetElement.classList.add('bg-success');
      } else if (this.currentStep === 3) {
        this.currentStep++;
        let targetElement = document.querySelector('#progress-3')
        targetElement.classList.remove('bg-secondary');
        targetElement.classList.add('bg-success');
      } else if (this.currentStep === 4) {
        this.currentStep++;
        let targetElement = document.querySelector('#progress-4')
        targetElement.classList.remove('bg-secondary');
        targetElement.classList.add('bg-success');
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
      if (this.currentStep === 1) {
        document.querySelector('#progress-2').classList.remove('bg-success');
        document.querySelector('#progress-2').classList.add('bg-secondary');
      } else if (this.currentStep === 2) {
        document.querySelector('#progress-3').classList.remove('bg-success');
        document.querySelector('#progress-3').classList.add('bg-secondary');
      } else if (this.currentStep === 3) {
        document.querySelector('#progress-4').classList.remove('bg-success');
        document.querySelector('#progress-4').classList.add('bg-secondary');
      }
    },
    createAppointment() {
      this.spinnerMessage = "Processing"
      this.systemStore.startLoading();
      let bookingInfo = {
        "date": this.bookingDate,
        "start": this.selectedTime,
        "end": this.endTimeParams,
        "user_id": this.user.id,
        "duration_total": this.totalDuration,
        "menus": this.selectedMenus.map((menu)=> menu.id),
        "price": this.subTotal,
        "tax": this.serviceTax,
      }
      axios.post("/events.json", bookingInfo)
      .then((res)=> {
        this.event = res.data;
        this.isLoading = false;
      })
      .then(()=> {
        this.$router.push("/complete");
        this.systemStore.endLoading();
      })
      .catch((error)=> {
        this.errors = error.response;
      })
    },
    clearAppointment() {
      this.currentStep = 1;
      this.selectedMenus = [];
      this.selectedTime = null;
      document.querySelector('#progress-2').classList.remove('bg-success')
      document.querySelector('#progress-2').classList.add('bg-secondary');
      document.querySelector('#progress-3').classList.remove('bg-success')
      document.querySelector('#progress-3').classList.add('bg-secondary');
      document.querySelector('#progress-4').classList.remove('bg-success')
      document.querySelector('#progress-4').classList.add('bg-secondary');
    },
    checkout() {
      const menuIds = this.selectedMenus.map((menu) => menu.id)
      const line_item = {
        id: menuIds,
        quantity: 1,
      }
      axios.post('/checkout.json', line_item)
      .then((res)=> {
        window.location = res.data.url
      })
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
    padding: 8px;
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
  .confirmation-detail-card {
    border-width: 0px;
    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, .3);
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
  .progress {
    margin-bottom: 23px;
  }
  .booking-checkbox:checked {
    background-color: rgb(54, 162, 235);
  }
  ul {
    margin-bottom: 0px;
  }
  hr {
    border-top: 1px;
  }
</style>