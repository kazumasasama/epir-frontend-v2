<template>
  <nav class="navbar navbar-light text-start navbar-white">
    <div class="col-12 btn-container">
      <button
        @click.prevent="this.currentPage = 'profile'"
        class="btn btn-outline-success btn-sm"
        id="profile-btn"
      >
        店舗情報
      </button>
      <button
        @click.prevent="this.currentPage = 'account'"
        class="btn btn-outline-success btn-sm"
        id="profile-btn"
      >
        管理人
      </button>
      <button
        @click.prevent="this.currentPage = 'config'"
        class="btn btn-outline-success btn-sm"
      >
        サイト設定
      </button>
      <button
        @click.prevent="this.currentPage = 'userStatus'"
        class="btn btn-outline-success btn-sm"
      >
        顧客ステータス
      </button>
      <button
        @click.prevent="this.currentPage = 'menuCategory'"
        class="btn btn-outline-success btn-sm"
      >
        メニューカテゴリー
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
                <h4 class="card-title text-start">店舗情報</h4>
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
                    @click="handleCancel()"
                  >
                  {{ $t('Btn.cancel') }}
                  </button>
                  <button type="submit" class="btn btn-primary">{{ $t('Btn.updateProfile') }}</button>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentPage === 'account'" class="col-12">
        <div class="card shadow">
          <div class="card-body">
            <div class="row">
              <h4 class="card-title text-start">管理人情報</h4>
              <div class="col-12">
                <UserForm/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentPage === 'config'" class="col-12">
        <div class="card shadow">
          <div class="card-body">
            <h4 class="card-title text-start">{{ $t('Settings') }}</h4>
            <form
            v-on:submit.prevent="updateConfig()"
            class="col-12 needs-validation text-start"
            novalidate
            >
              <div class="row">
                <div class="col-sm-6">
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
                  <small>{{ $t('Forms.calendarStartTime') }} (9:30AM = 9.5)</small>
                  <input
                    autocomplete="off"
                    type="text"
                    v-model="config.start"
                    class="form-control"
                    required
                  >
                  <small>{{ $t('Forms.calendarEndTime') }} (08:00PM = 20.0)</small>
                  <input
                    autocomplete="off"
                    type="text"
                    v-model="config.end"
                    class="form-control"
                    required
                  >
                  <small>{{ $t('Forms.intervalTime') }}</small>
                  <small class="release-notice">変更する場合は開発者に連絡</small>
                  <input
                    autocomplete="off"
                    type="number"
                    v-model="config.interval"
                    class="form-control"
                    required
                    disabled
                  >
                </div>
                <div class="col-sm-6">
                  <small>定休日</small>
                  <small class="release-notice">Release soon! </small>
                  <input
                    autocomplete="off"
                    type="text"
                    v-model="config.closingDays"
                    class="form-control"
                    required
                    disabled
                  >
                </div>
              </div>
            </form>
            <div class="btn-container col-12 text-end">
              <button
                type="button"
                class="btn btn-secondary"
                @click="handleCancel()"
              >
                {{ $t('Btn.cancel') }}
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                @click="updateConfig()"
              >{{ $t('Btn.updateSettings') }}</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentPage === 'userStatus'" class="col-12">
        <div class="card shadow">
          <div class="card-body">
            <div class="row">
              <h4 class="card-title text-start">顧客ステータス</h4>
              <div class="col-12">
                <form
                  v-on:submit.prevent="createUserStatus()"
                  class="col-12 needs-validation text-start mb-3"
                  novalidate
                >
                  <div class="form-items input-group">
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      v-model="newUserStatus.title"
                      placeholder="新規ステータス"
                    >
                    <button
                      class="btn btn-primary"
                      type="submit"
                    >
                      作成
                    </button>
                  </div>
                </form>
                <div v-for="status in userStore.statuses" :key="status.id">
                  <form
                    v-on:submit.prevent="updateStatus(status)"
                    class="col-12 needs-validation text-start mb-3"
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
                      更新
                    </button>
                    <button
                      class="btn btn-danger"
                      type="button"
                      @click.prevent="destroyStatus(status)"
                    >
                      削除
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
              <h4 class="card-title text-start">メニューカテゴリー</h4>
              <div class="col-12">
                <form
                  v-on:submit.prevent="createCategory()"
                  class="col-12 needs-validation text-start mb-3"
                  novalidate
                >
                  <div class="form-items input-group">
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      v-model="newCategory.title"
                      placeholder="新規ステータス"
                    >
                    <button
                      class="btn btn-primary"
                      type="submit"
                    >
                      作成
                    </button>
                  </div>
                </form>
                <div v-for="category in categories" :key="category.id">
                  <form
                    v-on:submit.prevent="updateCategory(category)"
                    class="col-12 needs-validation text-start mb-3"
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
                      更新
                    </button>
                    <button
                      class="btn btn-danger"
                      type="button"
                      @click.prevent="destroyCategory(category)"
                    >
                      削除
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
import UserForm from '@/components/UserForm.vue'
// import VueCal from 'vue-cal'
// import 'vue-cal/dist/i18n/ja.js'
// import 'vue-cal/dist/vuecal.css'
// import * as moment from 'moment-timezone';

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
    UserForm,
    // VueCal,
  },
  data() {
    return {
      error: null,
      currentPage: 'config',
      languages: {
        English: 'en',
        Japanese: 'ja'
      },
      newUserStatus: {},
      newCategory: {},
      recurrence: true,
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
    ...mapWritableState(useSystemStore, ['states']),
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
    handleCancel() {
      this.$router.push('/admin/dashboard')
    }
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
.datepicker-container {
  height: 350px;
}
</style>