<template>

  <nav class="navbar navbar-light navbar-white">
    <div class="col-12 user-btn-container btn-container">
      <button class="btn btn-sm btn-outline-secondary" @click="$router.push('/admin/users')">{{ $t('Btn.customerIndex') }}</button>
      <button
        class="btn btn-sm btn-outline-success"
        v-if="showHistory"
        @click="showHistory = false"
      >
        {{ $t('Customers.customerDetail') }}
      </button>
      <button
        class="btn btn-sm btn-outline-success"
        v-if="!showHistory"
        @click="showHistory = true"
      >
        {{ $t('Btn.history') }}
      </button>
    </div>
    
  </nav>

  <div class="container">
    <div class="row">
      <div class="col-12">
        <span class="notification">{{ message }}</span>
      </div>

      <div v-if="!showHistory" class="col-12">
        <form>
          <div class="row">
            <div class="col-sm-6">
              <small>姓</small>
              <input type="text" v-model="user.last_name" class="form-control">
              <small>名</small>
              <input type="text" v-model="user.first_name" class="form-control">
              <small>性別</small>
              <select v-model="user.gender" class="form-select">
                <option
                  v-for="gender in genders"
                  :key="gender"
                  :value="gender"
                >
                  {{ gender }}
                </option>
              </select>
              <small>メールアドレス</small>
              <input type="text" v-model="user.email" class="form-control">
              <small>電話番号</small>
              <input type="text" v-model="user.phone" class="form-control">
              <small>生年月日</small>
              <input class="form-control" type="text" v-model="user.birthday">
              <small>ステータス</small>
              <Multiselect
                v-model="user.status_ids"
                :placeholder="multipleselectPlaceholder"
                :options="multiselectOptions"
                mode="tags"
                class="multiselect-tag-color"
                :close-on-select="false"
                :hideSelected="false"
                :create-option="true"
              />
            </div>
    
            <div class="col-sm-6">
              <small>郵便番号</small>
              <input class="form-control" type="text" v-model="user.zip">
              <small>都道府県</small>
              <select v-model="user.state" class="form-select" autocomplete="address-level1">
                <option
                  v-for="state in states"
                  :key="state"
                  :value="state"
                >
                  {{ state }}
                </option>
              </select>
              <small>市区町村</small>
              <input class="form-control" type="text" v-model="user.city">
              <small>以降の住所</small>
              <input class="form-control" type="text" v-model="user.address">
              <small>ご要望などこちらへご記入ください</small>
              <textarea rows="3" class="form-control" v-model="user.note"></textarea>
            </div>
          </div>
        </form>
        <div class="col-12">
          <div class="btn-container text-end update-btn-container">
            <button class="btn btn btn-primary" @click.prevent="updateUser()">{{ $t('Btn.update') }}</button>
            <button class="btn btn btn-danger">{{ $t('Btn.deactivate') }}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-if="showHistory">
      <div class="col-12">
        <p class="userFullName">{{ `${user.first_name} ${user.last_name}` }}</p>
        <small>{{ $t('Customers.statics.totalAppointments') }}: {{ events.length }} | </small>
        <small>{{ $t('Customers.statics.totalSpent') }}: ¥{{ totalSpent }} | </small>
        <small>{{ $t('Customers.statics.lastVisit') }}: {{ lastVisit }}</small>
      </div>
      <hr class="hr-user-statics">
      <div
        class="col-sm-4 col-md-3 col-lg-2 history-event-container card"
        v-for="event in events"
        :key="event.id"
      >
        <div class="card-body">
          <small class="card-subtitle">{{ event.status }}</small>
          <h6 class="card-title">{{ event.date }}</h6>
          <ul class="list-group list-group-flush">
            <li
              v-for="menu in event.menus"
              :key="menu.id"
            >
              {{ menu.title }}
            </li>
            <hr class="history-hairline">
            <li>Total: ¥{{ event.total_spent }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import Multiselect from '@vueform/multiselect'
import { mapWritableState } from 'pinia'
import { useSystemStore } from '@/store/systemStore'
import { useUserStore } from '@/store/userStore'
import axios from 'axios'
  export default {
    components: {
      Multiselect,
    },
    data() {
      return {
        error: null,
        user: {
          events: [],
          status_ids: [],
        },
        showHistory: false,
        message: null,
      }
    },
    created() {
      this.showUser();
    },
    computed: {
      ...mapWritableState(useSystemStore, ['genders']),
      ...mapWritableState(useSystemStore, ['states']),
      ...mapWritableState(useUserStore, ['statuses']),
      multiselectOptions() {
        const statusIds = this.statuses.map(status => status.id)
        const statusValues = this.statuses.map(status => status.title)
        let options = []
        for (let i in statusIds) {
          options.push({value: Number(statusIds[i]), label: statusValues[i]})
        }
        return options
      },
      multipleselectPlaceholder() {
        if (this.user.status_ids.length === 0) {
          return 'Select Status'
        }
        const statusIds = this.user.status_ids;
        let selectedStatuses = [];
        for (let j in this.multiselectOptions) {
          for (let i in statusIds) {
            if (this.multiselectOptions[j].value === statusIds[i]) {
              selectedStatuses.push(Number(j));
            }
          }
        }
        let result = [];
        for (let k in selectedStatuses) {
          result.push(this.multiselectOptions[selectedStatuses[k]]);
        }
        return result;
      },
      events() {
        let events = this.user.events;
        let sortedEvents = events.sort((a, b)=> {
          let idA = a.date_and_start;
          let idB = b.date_and_start;
          if (idA < idB) {
            return -1;
          }
          if (idA > idB) {
            return 1;
          }
          return 0
        });
        return sortedEvents;
      },
      totalSpent() {
        if (this.events.length === 0) {
          return 0
        }
        let booked = this.events.filter((event)=> event.status === "booked")
        return booked.map((event)=> event.total_spent).reduce((sum, price)=> sum + price, 0)
      },
      lastVisit() {
        if (this.events.length === 0) {
          return "N/A"
        }
        let events = this.user.events;
        let sortedEvents = events.sort((a, b)=> {
          let idA = a.date_and_start;
          let idB = b.date_and_start;
          if (idA < idB) {
            return -1;
          }
          if (idA > idB) {
            return 1;
          }
          return 0
        });
        return sortedEvents[sortedEvents.length -1].date;
      },
    },
    methods: {
      showUser() {
        let id = this.$route.params.id
        axios.get(`/users/${id}.json`)
        .then((res)=> {
          this.user = res.data;
        })
        .catch((error)=> {
        this.error = error;
      })
      },
      updateUser() {
        let id = this.user.id;
        let user = {}
        user = {
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          gender: this.user.gender,
          email: this.user.email,
          phone: this.user.phone,
          birthday: this.user.birthday,
          address: this.user.address,
          state: this.user.state,
          city: this.user.city,
          zip: this.user.zip,
          status: this.user.status,
          status_ids: this.user.status_ids,
          note: this.user.note
        }
        axios.patch(`/users/${id}.json`, user)
        .then((res)=> {
          this.user = res.data;
        })
        .catch((error)=> {
          this.error = error;
        })
        this.message = "User updated";
        setTimeout(()=> {this.message = null}, 3000);
      },
    },
  }
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style scoped>
  
  .row {
    text-align: left;
  }
  .user-btn-container {
    text-align: left;
    overflow: hidden;
  }
  .history-event-container {
    text-align: left;
  }
  .update-btn-container {
    margin-top: 20px;
  }
  .notification {
    color: red;
  }
  .history-hairline {
    color:#FFFFFF;
    margin-top: 8px;
    margin-bottom: 8px;
    border: none;
    border-top: 2px dashed gray;
    height: 1px;
  }
  .hr-user-statics {
    border-top: 1px;
  }
  .userFullName {
    margin-top: 8px;
    font-size: larger;
  }
  .multiselect-tag-color {
    --ms-tag-bg: rgb(75, 192, 192);
  }
</style>