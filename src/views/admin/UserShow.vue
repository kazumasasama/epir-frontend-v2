<template>

  <nav class="navbar navbar-light" style="background-color: #f5f6fe;">
    <div class="col-12 user-btn-container">
      <button
        class="btn btn-sm btn-outline-success"
        v-if="showHistory"
        @click="showHistory = false"
      >
        ユーザー詳細
      </button>
      <button
        class="btn btn-sm btn-outline-success"
        v-if="!showHistory"
        @click="showHistory = true"
      >
        予約履歴
      </button>
      <div class="control-navbar-item">
        <button class="btn btn-sm btn-outline-secondary" @click="$router.push('/admin/users')">全ユーザー</button>
      </div>
    </div>
  </nav>

  <div class="container">
    <form v-if="!showHistory">
      <div class="row">
        <div class="col-12">
          <h4>ユーザー詳細</h4>
          <span class="notification">{{ message }}</span>
        </div>

        <div class="col-sm-6">
          <small>姓</small>
          <input type="text" v-model="user.first_name" class="form-control">
          <small>名</small>
          <input type="text" v-model="user.last_name" class="form-control">
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
          <input class="form-control" type="text" v-model="user.status">
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
          <small>ご要望など</small>
          <textarea rows="3" class="form-control" v-model="user.note"></textarea>
          <div class="control-navbar-item">
            <button class="btn btn-sm btn-outline-primary" @click.prevent="updateUser()">更新</button>
            <button class="btn btn-sm btn-outline-danger">退会</button>
          </div>
        </div>

      </div>
    </form>

    <div class="row" v-if="showHistory">
      <div class="col-12">
        <h4>予約履歴</h4>
        <small>予約回数: {{ events.length }} | </small>
        <small>総売上: ${{ totalSpent }} | </small>
        <small>最終予約日: {{ lastVisit }}</small>
      </div>
      <hr>
      <div
        class="col-sm-2 history-event-container card"
        v-for="event in events"
        :key="event.id"
      >
        <div class="card-body">
          <small class="card-subtitle">{{ event.status }}</small>
          <h6 class="card-title">{{ event.date }}</h6>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="menu in event.menus"
              :key="menu.id"
            >
              {{ menu.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import axios from 'axios'
  export default {
    data() {
      return {
        user: {
          events: [],
        },
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
        showHistory: false,
        message: null,
      }
    },
    created() {
      this.showUser();
    },
    computed: {
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
        console.log(booked);
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
          note: this.user.note
        }
        axios.patch(`/users/${id}.json`, user)
        .then((res)=> {
          this.user = res.data
        })
        this.message = "User updated";
        setTimeout(()=> {this.message = null}, 3000);
      },
    },
  }
</script>

<style scoped>
  .row {
    text-align: left;
  }
  .btn-container {
    margin-top: 15px;
  }
  .user-btn-container {
    text-align: left;
    overflow: hidden;
  }
  .control-navbar-item {
    float: right;
  }
  .history-event-container {
    text-align: left;
  }
  .notification {
    color: red;
  }
</style>