<template>
  <div class="modal" id="password-modal" tabindex="-1">
    <div class="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-body text-start">
          <form>
            <small>Current Password*</small>
            <input
              type="password"
              v-model="password.currentPassword"
              class="form-control"
              autocomplete="current-password"
            >
            <small>New Password*</small>
            <input
              type="password"
              v-model="password.newPassword"
              class="form-control"
              autocomplete="new-password"
            >
            <small>Confirm New Password*</small>
            <div class="input-group mb-3">
              <input
                type="password"
                v-model="password.password_confirmation"
                class="form-control"
                autocomplete="new-password"
              >
              <button class="btn btn-outline-secondary">
                <font-awesome-icon icon="fa-regular fa-eye" />
              </button>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <div>
            <button
              class="btn-sm btn-outline-success btn"
              data-bs-dismiss="modal"
              @click.prevent="updatePassword()"
            >
              Submit
            </button>
            <button
              class="btn-sm btn-outline-secondary btn"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="alert alert-danger"
    role="alert"
    v-if="error"
  >
    {{ error }}
  </div>
  <div
    class="alert alert-info"
    role="alert"
    v-if="message"
  >
    {{ message }}
  </div>

  <div class="row">
    <!-- <div class="col-12 text-end">
      <button disabled @click="showPasswordModal()" class="btn btn-sm btn-outline-danger">Change Password</button>
    </div> -->
    <div class="col-sm-6">
      <form>
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
      </form>
    </div>
  
    <div class="col-sm-6">
      <form>
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
      </form>
    </div>
    <div class="btn-container text-end">
      <button class="btn btn-primary" @click.prevent="updateUser()">{{ $t('Btn.update') }}</button>
    </div>
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect'
import { mapWritableState } from 'pinia'
import { useUserStore } from '@/store/userStore'
import axios from 'axios'
import * as bootstrap from 'bootstrap'

export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      error: null,
      genders: [
        "Male",
        "Female",
        "Non Binary",
        "Rather not to descrive",
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
      passwordModal: null,
      password: {
        currentPassword: '',
        newPassword: '',
        passwordConfirmation: '',
      }
    }
  },
  created() {
  },
  mounted() {
    this.passwordModal = new bootstrap.Modal(document.getElementById('password-modal'));
  },
  computed: {
    ...mapWritableState(useUserStore, ['statuses']),
    ...mapWritableState(useUserStore, ['user']),
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
  },
  methods: {
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
    updatePassword() {
      const id = this.user.id;
      const updateData = this.password;
      axios.patch(`/users/${id}.json`, updateData)
      .then((res)=> {
        this.user = res.data;
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    showPasswordModal() {
      this.passwordModal.show();
    }
  },
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

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
  .history-event-container {
    text-align: left;
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