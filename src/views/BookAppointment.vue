<template>
  <div class="container">
    <div
      v-if="error"
      class="alert alert-warning"
      role="alert"
    >
      {{ error }}
    </div>

    
    <div class="card shadow card-base">
      <div class="card-header">
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
      </div>
      
      <div class="card-body card-base-body">
        <div class="pick-menus" v-if="currentStep === 1">
          <div class="row">
            <div class="text-start">
              <h5>{{ $t('Appointments.title.pickMenu') }}</h5>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-3 col-md-4 col-sm-12">
                      <div class="d-flex category-nav">
                        <div
                          class="nav flex-column nav-pills me-3"
                          role="tablist"
                        >
                          <button
                            v-for="(category, index) in categories"
                            :key="category.id"
                            @click.prevent="switchCategory(category.id)"
                            class="nav-link text-start btn"
                            :id="`category-title-${index}`"
                            data-bs-toggle="pill"
                            type="button"
                            aria-selected="true"
                          >
                            {{ category.title }}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-8 col-sm-12 menu-nav-tab-container text-start">
                      <div
                        class="active-menu-container-card text-start"
                        role="tablist"
                      >
                        <ul class="list-group menu-list">
                          <label
                            class="form-check-label"
                            v-for="menu in menus"
                            :key="menu.id"
                          >
                            <li
                              class="list-group-item"
                            >
                              <form class="menu-form">
                                <div class="d-flex justify-content-between menu-card">
                                  <input
                                    class="form-check-input me-1 booking-checkbox"
                                    type="checkbox"
                                    :value="menu"
                                    v-model="selectedMenus"
                                    v-if="menus[0].id !== -1"
                                  >
                                  <span>
                                    {{ menu.title }}
                                  </span>
                                  <small>{{ menu.duration }} {{ $t('DateTime.min') }} | {{ $t('Currency') }}{{ Math.floor(menu.price) }}</small>
                                </div>
                                <small>{{ menu.description }}</small>
                              </form>
                            </li>
                          </label>
                        </ul>
                      </div>
                    </div>
                    <div class="col-lg-3 col-md-12">
                      <div class="row">
                        <div class="col-lg-12 col-sm-6 total-duration-col">
                          <div
                            class="list-group"
                            id="list-tab"
                            role="tablist"
                          >
                            <label class="list-group-item">
                              <small class="step-1-summary">{{ $t('Appointments.totalDuration') }}</small>
                              <p>{{ durationSumInString }}</p>
                              <small class="step-1-summary">選択中のメニュー</small>
                              <ol>
                                <li v-for="menu in selectedMenus" :key="menu.id">{{ menu.title }}</li>
                              </ol>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="btn-container">
                <button
                  type="submit"
                  class="btn btn-primary"
                  @click.prevent="nextStep()"
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
                  <Datepicker
                    v-model="picked"
                    class="datepicker-item"
                    inline
                    autoApply
                    utc="true"
                  />
                </div>
              </div>
              <div class="col-sm-6">
                <div class="row">
                  <div class="time-slot-col col-lg-4 col-sm-6" v-for="timeSlot in availableTimeSlots"
                      :key="timeSlot.id">
                    <div
                      class="list-group"
                      id="list-tab"
                      role="tablist"
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
                            {{ timeSlot.time.slice(11, -8) }}
                          </li>
                        </ul>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="btn-container">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click.prevent="prevStep()"
                  >
                    {{ $t('Btn.goBack') }}
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    @click.prevent="nextStep()"
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
                <small>{{ $t('Forms.lastName') }}</small>
                <input type="text" v-model="user.last_name" class="form-control">
                <small>{{ $t('Forms.firstName') }}</small>
                <input type="text" v-model="user.first_name" class="booking-checkbox form-control">
                <small>{{ $t('Forms.email') }}</small>
                <input type="email" v-model="user.email" class="form-control">
                <small>{{ $t('Forms.phone') }}</small>
                <input type="tel" v-model="user.phone" class="form-control">
                <small>LINE</small>
                <input type="tel" v-model="user.line_id" class="form-control">
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
                    @click.prevent="prevStep()"
                  >
                    {{ $t('Btn.goBack') }}
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    @click.prevent="nextStep()"
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
              <div class="col-md-6">
                <section>
                  <div class="card confirmation-detail-card">
                    <div class="card-body text-start">
                      <ul class="payment-item">
                        <h6 class="card-title" style="font-weight: bold">{{ $t('Appointments.steps.dateTime') }}</h6>
                        <p>{{ formatBookingDate }}</p>
                        <p>{{ formattedBookingTime }} - {{ endTime }}</p>
                        <h6 class="confirm-item-tag" style="font-weight: bold">{{ $t('Menus.menu') }}</h6>
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
                        <h6 class="text-end"  style="font-weight: bold">{{ $t('Forms.total') }}</h6>
                        <span  style="font-weight: bold">{{ $t('Currency') }}{{ subTotal + serviceTax }}</span>
                      </div>
                      <hr>
                      <p>
                        <small>表示金額は<span style="font-weight: bold">都度払いの金額</span>となっております。回数券をお持ちのお客様はお支払いの必要はありません。</small>
                      </p>
                      <p>
                        <small>{{ $t('Messages.couponNotice') }}</small>
                      </p>
                      <label class="form-check-label" for="flexCheckDefault">
                        <input
                          class="form-check-input booking-checkbox"
                          type="checkbox"
                          v-model="confirmCheckbox"
                          id="flexCheckDefault"
                        >
                        <small class="terms-and-conditions">
                          <span @click="this.$router.push('/termsandconditions')">
                            <a
                              class="link-primary"
                              href="#"
                              rel="noopener noreferrer"
                            >
                              利用規約
                            </a>
                          </span>
                          と
                          <span @click="this.$router.push('/privacyandpolicy')">
                            <a 
                              class="link-primary"
                              href="#"
                              rel="noopener noreferrer"
                            >
                              プライバシーポリシー
                            </a>
                          </span>
                          に同意する
                        </small>
                      </label>
                    </div>
                  </div>
                </section>
              </div>
              <!-- <div v-if="subTotal > 0" class="col-md-6">
                <CheckoutView
                  @checkout="checkout()"
                  :stripe="stripe"
                  :elements="elements"
                  :checkBoxError="checkBoxError"
                />
              </div> -->
            </div>
            <div class="btn-container">
              <button
                type="button"
                class="btn btn-secondary"
                @click.prevent="prevStep()"
              >
                {{ $t('Btn.goBack') }}
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click.prevent="clearAppointment()"
              >
                {{ $t('Btn.startOver') }}
              </button>
              <button
                v-if="subTotal === 0"
                type="button"
                class="btn btn-primary"
                @click.prevent="createAppointment()"
              >
                {{ $t('Btn.bookAppointment') }}
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="!confirmCheckbox"
              >
                {{ $t('Btn.bookAppointment') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Datepicker from 'vue3-datepicker';
import { ref } from 'vue'
import axios from "axios";
import * as moment from 'moment-timezone';
import { mapWritableState } from 'pinia'
import { useSystemStore } from '@/store/systemStore'
import { useUserStore } from '@/store/userStore'
// import CheckoutView from '@/components/CheckoutView.vue';

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
    // CheckoutView,
},
  data() {
    return {
      stripe: null,
      elements: null,
      error: null,
      event: {},
      currentStep: 1,
      menu: {},
      menus: [
        {
          id: -1,
          title: 'Select a category',
          price: '--',
          duration: '--',
        }
      ],
      selectedMenus: [],
      selectedTime: null,
      confirmCheckbox: false,
      checkBoxError: null,
      picked: ref(new Date),
    }
  },
  created() {
    this.systemStore.modifyLoadingMessage(this.$t('Spinner.loading'));
    this.systemStore.startLoading();
    // this.stripe = window.Stripe(`${process.env.VUE_APP_STRIPE_PUBLIC_KEY}`);
    this.switchCategory(1)
  },
  mounted() {
    const selectedCategory = document.getElementById('category-title-0')
    selectedCategory.classList.add('active')
    this.$nextTick(function() {
      this.systemStore.endLoading();
    })
  },
  watch: {
    selectedMenus() {
      if (this.selectedMenus.length !== 0) {
        this.error = null;
      }
    },
    selectedTime() {
      if (this.selectedTime) {
        this.error = null;
      }
    },
  },
  computed: {
    ...mapWritableState(useSystemStore, ['config']),
    ...mapWritableState(useSystemStore, ['categories']),
    ...mapWritableState(useSystemStore, ['businessTimes']),
    ...mapWritableState(useSystemStore, ['activeMenus']),
    ...mapWritableState(useSystemStore, ['groupedMenus']),
    ...mapWritableState(useSystemStore, ['states']),
    ...mapWritableState(useSystemStore, ['genders']),
    ...mapWritableState(useUserStore, ['user']),
    fullName() {
      return `${this.user.first_name} ${this.user.last_name}`;
    },
    bookingDate() {
      return moment(this.picked).format('YYYY-MM-DD');
    },
    formatBookingDate() {
      return moment(this.picked).format('MM-DD-YYYY');
    },
    formattedBookingTime() {
      return moment.utc(this.selectedTime).format('hh:mm A');
    },
    endTime() {
      var endTime = moment.utc(this.selectedTime).add(this.totalDuration,'minute').format('hh:mm A');
      return endTime;
    },
    totalDuration() {
      let durationSum = 0;
      this.selectedMenus.forEach((menu) => {durationSum += menu.duration});
      return durationSum;
    },
    endTimeParams() {
      var endTime = moment.utc(this.selectedTime).add(this.totalDuration,'minute').format();
      return endTime;
    },
    durationSumInString() {
      let durationSumHour = 0;
      let durationSumMin = 0;
      this.selectedMenus.forEach((menu) => {durationSumHour += menu.duration});
      durationSumMin = durationSumHour % 60;
      durationSumHour = (durationSumHour - (durationSumHour % 60)) / 60;
      return `${durationSumHour} ${this.$t('DateTime.hour')} ${durationSumMin} ${this.$t('DateTime.min')}`;
    },
    availableTimeSlots() {
      // 指定日の時間の呼び出し
      var openTimes = this.systemStore.businessTimes.filter(timeSlots => timeSlots.date === this.bookingDate).sort((a, b)=> {
        return a.id - b.id;
      }).filter((time)=> time.available === true);
      const keepingTime = (this.totalDuration + this.config.interval) / 30;
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
    selectedMenuIds() {
      return this.selectedMenus.map((menu)=> menu.id);
    },
    subTotal() {
      return this.selectedMenus.map((menu)=> parseFloat(menu.price)).reduce((sum, price)=> { return sum + price}, 0);
    },
    serviceTax() {
      let tax = Number(this.subTotal) * (Number(this.config.tax) / 100);
      return Math.floor(tax);
    },
  },
  methods: {
    switchCategory(categoryId) {
      if (this.groupedMenus[categoryId]) {
        var active = this.groupedMenus[categoryId].filter(menu => menu.active === true);
        if (active) {
          this.menus = active;
        }
      } else {
        this.menus = [
          {
            id: -1,
            title: 'No menu in this category...',
            price: '--',
            duration: '--',
          }
        ];
      }
    },
    // getClientSecret() {
    //   const payment = {
    //     "menuIds": this.selectedMenuIds,
    //     "tax": this.serviceTax 
    //   };
    //   axios.post('/secret.json', payment)
    //   .then((res)=> {
    //     const clientSecret = res.data
    //     const options = {
    //       clientSecret: clientSecret,
    //       appearance: {
    //         theme: 'flat'
    //       },
    //     }
    //     this.elements = this.stripe.elements(options);
    //     const paymentElement = this.elements.create('payment');
    //     paymentElement.mount('#payment-element');
    //   })
    //   .catch((error)=> {
    //     this.error = error;
    //   })
    // },
    nextStep() {
      var targetElement
      if (this.currentStep === 1 && this.selectedMenus.length === 0) {
        this.error = this.$t('Appointments.errors.selectMenus');
      } else if (this.currentStep === 1 && this.selectedMenus.length !== 0) {
        targetElement = document.querySelector('#progress-2')
        targetElement.classList.remove('bg-secondary');
        targetElement.classList.add('bg-success');
        this.currentStep++;
      } else if (this.currentStep === 2 && !this.selectedTime) {
        this.error = this.$t('Appointments.errors.selectDateTime');
      } else if (this.currentStep === 2 && this.selectedTime) {
        this.currentStep++;
        targetElement = document.querySelector('#progress-3')
        targetElement.classList.remove('bg-secondary');
        targetElement.classList.add('bg-success');
      } else if (this.currentStep === 3) {
        // if (this.subTotal > 0) {
        //   this.getClientSecret()
        // }
        this.currentStep++;
        targetElement = document.querySelector('#progress-4')
        targetElement.classList.remove('bg-secondary');
        targetElement.classList.add('bg-success');
      }
    },
    prevStep() {
      var targetElement
      if (this.currentStep === 2) {
        targetElement = document.querySelector('#progress-2')
        targetElement.classList.remove('bg-success');
        targetElement.classList.add('bg-secondary');
      } else if (this.currentStep === 3) {
        targetElement = document.querySelector('#progress-3')
        targetElement.classList.remove('bg-success');
        targetElement.classList.add('bg-secondary');
      } else if (this.currentStep === 4) {
        targetElement = document.querySelector('#progress-4')
        targetElement.classList.remove('bg-success');
        targetElement.classList.add('bg-secondary');
      }
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    createAppointment() {
      this.systemStore.modifyLoadingMessage('ご予約の登録中')
      this.systemStore.startLoading();
      const bookingInfo = {
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
        const event = res.data;
        this.event = event;
        const currentBusinessTime = this.systemStore.businessTimes.filter((timeSlot)=> timeSlot.date === event.date && moment.utc(timeSlot.time).format('HH:mm') === moment.utc(event.start).format('HH:mm'))[0];
        const timeSlots = (event.duration_total + this.systemStore.config.interval) / 30;
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
      })
      .then(()=> {
        this.$router.push("/complete");
        this.systemStore.endLoading();
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    clearAppointment() {
      this.currentStep = 1;
      document.querySelector('#progress-2').classList.remove('bg-success')
      document.querySelector('#progress-2').classList.add('bg-secondary');
      document.querySelector('#progress-3').classList.remove('bg-success')
      document.querySelector('#progress-3').classList.add('bg-secondary');
      document.querySelector('#progress-4').classList.remove('bg-success')
      document.querySelector('#progress-4').classList.add('bg-secondary');
    },
    checkout() {
      const form = document.getElementById('payment-form');

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const confirmRes = await this.stripe.confirmPayment({
          elements: this.elements,
          redirect: 'if_required'
        });
        if (confirmRes.paymentIntent) {
          if (confirmRes.paymentIntent.status === 'succeeded') {
            alert('Payment Accepted')
            this.createAppointment();
          }
        } else if (confirmRes.error) {
          if (confirmRes.error.type === 'card_error') {
            if (confirmRes.error.code === 'card_declined') {
              const errorMessage = confirmRes.error.decline_code.split('_').map( s => s[0].toUpperCase() + s.slice(1)).join(' ')
              alert(errorMessage)
              this.systemStore.endLoading();
            }
          }
        } else {
          alert('Something went wronng. Please try Again.')
        }
      });
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
  .total-duration-col {
    padding-top: 0px;
  }
  .menu-list {
    padding-bottom: 20px;
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
  .progress {
    height: 25px;
    font-size: medium;
  }
  .progress-bar {
    height: 25px;
  }
  .card-header {
    padding: 24px 48px;
  }
  .booking-checkbox:checked {
    background-color: rgb(54, 162, 235);
  }
  .menu-form {
    position: relative;
    left: 20px;
  }
  .time-slot-col {
    padding: 8px;
  }
  .list-group-item span{
    font-size: 18px;
    font-weight: bold;
    color: rgb(110, 110, 110);
  }
  .step-1-summary {
    position: relative;
    font-weight: bold;
  }
  .menu-card {
    padding-right: 20px;
  }
  ul {
    margin-bottom: 0px;
  }
  hr {
    border-top: 1px;
  }
  .card-base-body {
    padding: 30px;
  } 
</style>