<template>
  <div class="modal" id="password-modal" tabindex="-1">
    <div class="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-body text-start password-modal">
          <form>
            <div
              class="alert alert-danger"
              role="alert"
              v-if="modalError"
            >
              {{ modalError }}
            </div>
            <small>現在のパスワード*</small>
            <div class="input-group mb-3">
              <input
              type="password"
              v-model="password.current_password"
              class="form-control"
              autocomplete="current-password"
            >
              <button class="btn btn-outline-secondary">
                <font-awesome-icon icon="fa-regular fa-eye" />
              </button>
            </div>
            <small>新しいパスワード*</small>
            <div class="input-group mb-3">
              <input
                type="password"
                v-model="password.password"
                class="form-control"
                autocomplete="new-password"
              >
              <button class="btn btn-outline-secondary">
                <font-awesome-icon icon="fa-regular fa-eye" />
              </button>
            </div>
            <small>パスワード確認*</small>
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
              @click.prevent="updatePassword()"
            >
              更新
            </button>
            {{ ' ' }}
            <button
              class="btn-sm btn-outline-secondary btn"
              data-bs-dismiss="modal"
            >
              閉じる
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
    <div class="col-12 d-flex justify-content-between">
      <p><strong>必須項目*</strong></p>
      <div class="btn-container">
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
        <button
          @click="showPasswordModal()"
          class="btn btn-sm btn-outline-danger"
        >
          パスワード変更
        </button>
      </div>
    </div>
    <div class="col-sm-6">
      <form>
        <small>姓*</small>
        <input
          type="text"
          v-model="user.last_name"
          class="form-control"
        >
        <small>名*</small>
        <input
          type="text"
          v-model="user.first_name"
          class="form-control"
        >
        <small>メールアドレス*</small>
        <input
          type="text"
          v-model="user.email"
          class="form-control"
        >
        <small>電話番号</small>
        <input
          type="text"
          v-model="user.phone"
          class="form-control"
        >
        <small>LINE</small>
        <input
          type="text"
          v-model="user.line_id"
          class="form-control"
        >
        <small>生年月日</small>
        <input
          class="form-control"
          type="date"
          v-model="user.birthday"
        >
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
        <div v-if="$route.path !== '/mypage'">
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
      <button
        class="btn btn-secondary"
        @click="handleCancel()"
      >
      {{ $t('Btn.cancel') }}
      </button>
      <button class="btn btn-primary" @click.prevent="updateUser()">{{ $t('Btn.update') }}</button>
    </div>
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect'
import { mapWritableState } from 'pinia'
import { useSystemStore } from '@/store/systemStore'
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
      modalError: null,
      showHistory: false,
      message: null,
      passwordModal: null,
      password: {
        password: null,
        password_confirmation: null,
        current_password: null,
      },
    }
  },
  created() {
  },
  mounted() {
    this.passwordModal = new bootstrap.Modal(document.getElementById('password-modal'));
  },
  computed: {
    ...mapWritableState(useSystemStore, ['states']),
    ...mapWritableState(useSystemStore, ['genders']),
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
      if (!this.user.status_ids.length) {
        return '未選択'
      } else {
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
      }
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
        line_id: this.user.line_id,
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
        this.message = "更新しました";
        return
      })
      .then(()=> {
        setTimeout(()=> {this.message = null}, 3000);
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    updatePassword() {
      if (!this.password.current_password) {
        this.modalError = "現在のパスワードを入力してください"
        return
      }
      if (!this.password.password) {
        this.modalError = "新しいパスワードを入力してください。"
        return
      }
      if (!this.password.password_confirmation) {
        this.modalError = "パスワード確認を入力してください。"
        return
      }
      if (this.password.password === this.password.password_confirmation) {
        axios.patch(`/users/${this.user.id}.json`, this.password)
        .then((res)=> {
          if (res.data.errors) {
            this.modalError = res.data.errors;
          } else {
            this.user = res.data;
            this.password = {
              password: null,
              password_confirmation: null,
              current_password: null,
            };
            this.passwordModal.hide();
          }
        })
        .catch((error)=> {
          this.error = error;
        })
      } else {
        this.modalError = "パスワード確認が新しいパスワードと一致していません"
      }
    },
    showPasswordModal() {
      this.passwordModal.show();
    },
    handleCancel() {
      this.$router.push('/admin/dashboard')
    }
  },
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style scoped>
  
  .row {
    text-align: left;
  }
  .multiselect-tag-color {
    --ms-tag-bg: rgb(75, 192, 192);
  }
  .password-modal {
    padding: 30px;
  }
</style>