<template>
  <nav class="navbar navbar-light text-start" style="background-color: #f5f6fe;">
    <div class="col-12 users-btn-container">
      <button class="btn btn-outline-success btn-sm" @click.prevent="switchPage()">{{ switchBtn }}</button>
    </div>
  </nav>
  <div
    v-if="error"
    class="alert alert-warning"
    role="alert"
  >
    {{ error }}
  </div>

  <div class="container">
    <div class="row">
      <div v-if="currentPage === 'profile'" class="col-12">
        <form
            v-on:submit.prevent="updateProfile()"
            class="col-12 needs-validation text-start"
            novalidate
          >
          <div class="row">
            <h1 class="card-title">Business Profile</h1>
            <div class="col-sm-6 card-body">
              <small>Business Name*</small>
              <input
                id="input-validation-firstname"
                autocomplete="organization"
                type="text"
                v-model="business.name"
                class="form-control"
                required
              >
              <small>Email*</small>
              <input
                id="input-validation-email"
                autocomplete="email"
                type="email"
                v-model="business.email"
                class="form-control"
                required
              >
              <small>Phone</small>
              <input
                autocomplete="tel-national"
                type="text"
                v-model="business.phone"
                class="form-control"
              >
              <small>State</small>
              <select
                v-model="business.state"
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
              <input
                autocomplete="address-level2"
                type="text"
                v-model="business.city"
                class="form-control"
              >
              <small>Address</small>
              <input
                autocomplete="street-address"
                type="text"
                v-model="business.address"
                class="form-control"
              >
              <small>Zip</small>
              <input
                autocomplete="postal-code"
                type="text"
                v-model="business.zip"
                class="form-control"
              >
            </div>
            <div class="col-sm-6 card-body">
              <small>Website</small>
              <input
                autocomplete="url"
                type="text"
                v-model="business.url"
                class="form-control"
              >
              <small>Instagram</small>
              <input
                autocomplete="off"
                type="text"
                v-model="business.insta"
                class="form-control"
              >
              <small>Twitter</small>
              <input
                autocomplete="off"
                type="text"
                v-model="business.twitter"
                class="form-control"
              >
              <small>Facebook</small>
              <input
                autocomplete="off"
                type="text"
                v-model="business.facebook"
                class="form-control"
              >
            </div>
            <div class="btn-container col-12 text-end">
              <button
                type="button"
                class="btn btn-secondary"
                @click="cancelSignup()"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">Update Profile</button>
            </div>
          </div>
        </form>
      </div>
      <div v-if="currentPage === 'config'" class="col-12">
        <form
            v-on:submit.prevent="updateConfig()"
            class="col-12 needs-validation text-start"
            novalidate
          >
          <div class="row">
            <h1 class="card-title">Settings</h1>
            <div class="col-sm-6 card-body">
              <small>Lanuage</small>
              <select
                v-model="config.lang"
                class="form-select"
                autocomplete="address-level1"
                required
              >
                <option
                  v-for="lang in Object.keys(languages)"
                  :key="lang"
                  :value="languages[lang]"
                >
                  {{ lang }}
                </option>
              </select>
              <small>Tax Rate (%)</small>
              <input
                autocomplete="off"
                type="text"
                v-model="config.tax"
                class="form-control"
                required
              >
              <small class="release-notice">Release soon! </small>
              <small>Business Closing Days</small>
              <input
                autocomplete="off"
                type="text"
                v-model="config.closingDays"
                class="form-control"
                required
                disabled
              >
              <small>Calendar Start Time (Ex: 9:30AM = 9.5)</small>
              <input
                autocomplete="off"
                type="text"
                v-model="config.start"
                class="form-control"
                required
              >
              <small>Calendar End Time (Ex: 08:30PM = 20.5)</small>
              <input
                autocomplete="off"
                type="text"
                v-model="config.end"
                class="form-control"
                required
              >
              <small>Interval Time</small>
              <input
                autocomplete="off"
                type="number"
                v-model="config.interval"
                class="form-control"
                required
              >
            </div>
            <div class="col-sm-6 card-body">
            </div>
            <div class="btn-container col-12 text-end">
              <button
                type="button"
                class="btn btn-secondary"
                @click="cancelSignup()"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">Update Settings</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      error: null,
      business: {},
      config: {
        lang: 'en'
      },
      currentPage: 'profile',
      switchBtn: 'Settings',
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
      languages: {
        English: 'en',
        Japanese: 'ja'
      }
    }
  },
  mounted() {
    this.getBusiness();
    this.getConfig();
  },
  methods: {
    getBusiness() {
      axios.get(`/businesses/1.json`)
      .then((res)=> {
        this.business = res.data;
      })
      .catch((error)=> {
        this.error = error.data;
      })
    },
    getConfig() {
      axios.get(`/configs/1.json`)
      .then((res)=> {
        this.config = res.data;
      })
      .catch((error)=> {
        this.error = error.data;
      })
    },
    updateProfile() {
      axios.patch(`/businesses/1.json`, this.business)
      .then((res)=> {
        this.business = res.data;
        alert('Updated');
      })
      .catch((error)=> {
        this.error = error.data;
      })
    },
    updateConfig() {
      axios.patch('/configs/1', this.config)
      .then((res)=> {
        this.config = res.data;
        alert('Updated');
      })
      .catch((error)=> {
        this.error = error.data;
      })
    },
    switchPage() {
      if (this.currentPage === 'profile') {
        this.currentPage = 'config'
        this.switchBtn = 'Profile'
      } else if (this.currentPage === 'config') {
        this.currentPage = 'profile'
        this.switchBtn = 'Settings'
      }
    },
  },
}
</script>

<style scoped>
.release-notice {
  color: red;
}
</style>