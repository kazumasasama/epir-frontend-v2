<template>
  <nav class="navbar navbar-light text-start config-nav">
    <div class="col-12 users-btn-container">
      <button
        @click.prevent="this.currentPage = 'profile'"
        class="btn btn-outline-success btn-sm"
        id="profile-btn"
        data-bs-toggle="button"
      >
        Profile
      </button>
      <button
        @click.prevent="this.currentPage = 'config'"
        class="btn btn-outline-success btn-sm"
      >
        Site Settings
      </button>
      <button
        @click.prevent="this.currentPage = 'userStatus'"
        class="btn btn-outline-success btn-sm"
      >
        User Status
      </button>
      <button
        @click.prevent="this.currentPage = 'menuCategory'"
        class="btn btn-outline-success btn-sm"
      >
        Menu Category
      </button>
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
        <div class="card shadow">
          <div class="card-body">
            <div class="row">
                <h1 class="card-title text-start">{{ $t('BusinessProfile') }}</h1>
                <div class="col-sm-6">
                  <form
                      class="needs-validation text-start"
                      novalidate
                    >
                    <small>{{ $t('Forms.businessName') }}*</small>
                    <input
                      id="input-validation-firstname"
                      autocomplete="organization"
                      type="text"
                      v-model="business.name"
                      class="form-control"
                      required
                    >
                    <small>{{ $t('Forms.email') }}*</small>
                    <input
                      id="input-validation-email"
                      autocomplete="email"
                      type="email"
                      v-model="business.email"
                      class="form-control"
                      required
                    >
                    <small>{{ $t('Forms.phone') }}</small>
                    <input
                      autocomplete="tel-national"
                      type="text"
                      v-model="business.phone"
                      class="form-control"
                    >
                    <small>{{ $t('Forms.state') }}</small>
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
                    <small>{{ $t('Forms.city') }}</small>
                    <input
                      autocomplete="address-level2"
                      type="text"
                      v-model="business.city"
                      class="form-control"
                    >
                    <small>{{ $t('Forms.address') }}</small>
                    <input
                      autocomplete="street-address"
                      type="text"
                      v-model="business.address"
                      class="form-control"
                    >
                    <small>{{ $t('Forms.zip') }}</small>
                    <input
                      autocomplete="postal-code"
                      type="text"
                      v-model="business.zip"
                      class="form-control"
                    >
                  </form>
                </div>
                <div class="col-sm-6">
                  <form
                      class="needs-validation text-start"
                      novalidate
                    >
                    <small>{{ $t('Forms.website') }}</small>
                    <input
                      autocomplete="url"
                      type="text"
                      v-model="business.url"
                      class="form-control"
                    >
                    <small>{{ $t('Forms.instagram') }}</small>
                    <input
                      autocomplete="off"
                      type="text"
                      v-model="business.insta"
                      class="form-control"
                    >
                    <small>{{ $t('Forms.twitter') }}</small>
                    <input
                      autocomplete="off"
                      type="text"
                      v-model="business.twitter"
                      class="form-control"
                    >
                    <small>{{ $t('Forms.facebook') }}</small>
                    <input
                      autocomplete="off"
                      type="text"
                      v-model="business.facebook"
                      class="form-control"
                    >
                  </form>
                </div>
                <div class="btn-container col-12 text-end">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="cancelSignup()"
                  >
                  {{ $t('Btn.cancel') }}
                  </button>
                  <button type="submit" class="btn btn-primary">{{ $t('Btn.updateProfile') }}</button>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentPage === 'config'" class="col-12">
        <div class="card shadow">
          <div class="card-body">
            <div class="row">
              <h1 class="card-title text-start">{{ $t('Settings') }}</h1>
              <div class="col-sm-6">
                <form
                  v-on:submit.prevent="updateConfig()"
                  class="col-12 needs-validation text-start"
                  novalidate
                >
                  <small>{{ $t('Forms.language') }}</small>
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
                  <small>{{ $t('Forms.taxRate') }} (%)</small>
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
                  <small>{{ $t('Forms.calendarStartTime') }} (9:30AM = 9.5)</small>
                  <input
                    autocomplete="off"
                    type="text"
                    v-model="config.start"
                    class="form-control"
                    required
                  >
                  <small>{{ $t('Forms.calendarEndTime') }} (08:30PM = 20.5)</small>
                  <input
                    autocomplete="off"
                    type="text"
                    v-model="config.end"
                    class="form-control"
                    required
                  >
                  <small>{{ $t('Forms.intervalTime') }}</small>
                  <input
                    autocomplete="off"
                    type="number"
                    v-model="config.interval"
                    class="form-control"
                    required
                  >
                </form>
              </div>
              <div class="btn-container col-12 text-end">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="cancelSignup()"
                >
                  {{ $t('Btn.cancel') }}
                </button>
                <button type="submit" class="btn btn-primary">{{ $t('Btn.updateSettings') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentPage === 'userStatus'" class="col-12">
        <div class="card shadow">
          <div class="card-body">
            <div class="row">
              <h1 class="card-title text-start">User Status</h1>
              <div class="col-12">
                <form
                  v-on:submit.prevent="createUserStatus()"
                  class="col-12 needs-validation text-start"
                  novalidate
                >
                  <div class="form-items input-group">
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      v-model="newUserStatus.title"
                      placeholder="Create new status"
                    >
                    <button
                      class="btn btn-primary"
                      type="submit"
                    >
                      Create
                    </button>
                  </div>
                </form>
                <div v-for="status in userStore.statuses" :key="status.id">
                  <form
                    v-on:submit.prevent="updateStatus(status)"
                    class="col-12 needs-validation text-start"
                    novalidate
                  >
                  <div class="form-items input-group">
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      v-model="status.title"
                      required
                    >
                    <button
                      class="btn btn-primary update-btn"
                      type="submit"
                    >
                      Update
                    </button>
                    <button
                      class="btn btn-danger"
                      type="button"
                      @click.prevent="destroyStatus(status)"
                    >
                      Delete
                    </button>
                  </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentPage === 'menuCategory'" class="col-12">
        <div class="card shadow">
          <div class="card-body">
            <div class="row">
              <h1 class="card-title text-start">Menu Category</h1>
              <div class="col-12">
                <form
                  v-on:submit.prevent="createCategory()"
                  class="col-12 needs-validation text-start"
                  novalidate
                >
                  <div class="form-items input-group">
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      v-model="newCategory.title"
                      placeholder="Create new status"
                    >
                    <button
                      class="btn btn-primary"
                      type="submit"
                    >
                      Create
                    </button>
                  </div>
                </form>
                <div v-for="category in categories" :key="category.id">
                  <form
                    v-on:submit.prevent="updateCategory(category)"
                    class="col-12 needs-validation text-start"
                    novalidate
                  >
                  <div class="form-items input-group">
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      v-model="category.title"
                      required
                    >
                    <button
                      class="btn btn-primary update-btn"
                      type="submit"
                    >
                      Update
                    </button>
                    <button
                      class="btn btn-danger"
                      type="button"
                      @click.prevent="destroyCategory(category)"
                    >
                      Delete
                    </button>
                  </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import { useSystemStore } from '@/store/systemStore'
import { useUserStore } from '@/store/userStore'
import axios from 'axios'
export default {
  setup() {
    const systemStore = useSystemStore();
    const userStore = useUserStore();
    return {
      systemStore,
      userStore,
    }
  },
  data() {
    return {
      error: null,
      currentPage: 'profile',
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
      },
      newUserStatus: {},
      newCategory: {},
    }
  },
  mounted() {
    // const btn = document.getElementById('profile-btn')
    // btn.classList.add('active', 'aria-pressed="true"')
  },
  computed: {
    ...mapWritableState(useSystemStore, ['statuses']),
    ...mapWritableState(useSystemStore, ['config']),
    ...mapWritableState(useSystemStore, ['categories']),
    ...mapWritableState(useSystemStore, ['business']),
    switchBtn() {
      if (this.currentPage === 'profile') {
        return this.$t('Btn.settings')
      } else if (this.currentPage === 'config') {
        return this.$t('Btn.profile')
      }
      return this.$t('Btn.settings')
    }
  },
  methods: {
    createUserStatus() {
      axios.post('/statuses.json', this.newUserStatus)
      .then((res)=> {
        this.statuses.push(res.data);
        this.newUserStatus = {};
        alert('Updated');
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    updateProfile() {
      axios.patch(`/businesses/1.json`, this.business)
      .then((res)=> {
        this.business = res.data;
        alert('Updated');
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    updateConfig() {
      axios.patch('/configs/1.json', this.config)
      .then((res)=> {
        this.config = res.data;
        alert('Updated');
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    updateStatus(status) {
      const id = status.id
      axios.patch(`/statuses/${id}.json`, status)
      .then(()=> {
        alert('Updated');
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    destroyStatus(status) {
      const i = this.statuses.indexOf(status);
      const id = status.id
      status.status = false;
      axios.patch(`/statuses/${id}.json`, status)
      .then(()=> {
        this.statuses.splice(i, 1);
        alert('Deleted');
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    createCategory() {
      const category = this.newCategory;
      axios.post('/categories.json', category)
      .then((res)=> {
        this.systemStore.categories.push(res.data);
        this.newCategory = {};
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    updateCategory(category) {
      const id = category.id
      axios.patch(`/categories/${id}.json`, category)
      .then(()=> {
        alert('Updated');
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    destroyCategory(category) {
      const i = this.categories.indexOf(category);
      const id = category.id
      category.active = false;
      axios.patch(`/categories/${id}.json`, category)
      .then(()=> {
        this.categories.splice(i, 1);
        alert('Deleted');
      })
      .catch((error)=> {
        this.error = error;
      })
    },
  },
}
</script>

<style scoped>
.release-notice {
  color: red;
}
.form-items {
  display: flex;
  justify-content: center;
  align-items: center;
}
.update-btn {
  margin-right: 0px;
}
.config-nav {
  background-color: white;
}
</style>