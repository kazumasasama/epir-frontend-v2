<template>
  <div class="container">
    <div class="card shadow text-start">
      <div class="card-body">
          <h2 class="card-title">会員登録</h2>
          <form
            v-on:submit.prevent="createUser()"
            class="col-12 needs-validation"
            novalidate
          >
            <div class="row">
              <p><strong>必須項目*</strong></p>
              <div class="col-sm-6">
                <small>姓*</small>
                <input
                  id="input-validation-lastname"
                  autocomplete="family-name"
                  type="text"
                  v-model="user.last_name"
                  class="form-control"
                  required
                >
                <small>名*</small>
                <input
                  id="input-validation-firstname"
                  autocomplete="given-name"
                  type="text"
                  v-model="user.first_name"
                  class="form-control"
                  required
                >
                <small>メールアドレス*</small>
                <input
                  id="input-validation-email"
                  autocomplete="email"
                  type="email"
                  v-model="user.email"
                  class="form-control"
                  required
                >
                <small>電話番号</small>
                <input
                  id="input-validation-phone"
                  autocomplete="tel-national"
                  type="text"
                  v-model="user.phone"
                  class="form-control"
                >
                <small>LINE</small>
                <input
                  id="input-validation-phone"
                  autocomplete="tel-national"
                  type="text"
                  v-model="user.line_id"
                  class="form-control"
                >
                <small>パスワード*</small>
                <input
                  id="input-validation-password"
                  autocomplete="new-password"
                  type="password"
                  v-model="user.password"
                  class="form-control"
                  required
                >
                <small>パスワード確認*</small>
                <input
                  id="input-validation-passwordconfirm"
                  autocomplete="new-password"
                  type="password"
                  v-model="passwordConfirm"
                  class="form-control"
                  required
                >
                <small v-if="passwordMatch" class="password-match">
                  パスワードが一致していません。
                </small>
              </div>
              <div class="col-sm-6">
                <small>郵便番号</small>
                <input
                  autocomplete="postal-code"
                  type="text"
                  v-model="user.zip"
                  class="form-control"
                >
                <small>都道府県</small>
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
                <small>市区町村</small>
                <input
                  autocomplete="address-level2"
                  type="text"
                  v-model="user.city"
                  class="form-control"
                >
                <small>以降の住所</small>
                <input
                  autocomplete="street-address"
                  type="text"
                  v-model="user.address"
                  class="form-control"
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
                <small>生年月日</small>
                <input
                  autocomplete="bday"
                  type="date"
                  v-model="user.birthday"
                  class="form-control"
                >
              </div>
              
              <div class="btn-container col-12 text-end">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="cancelSignup()"
                >
                  キャンセル
                </button>
                <button type="submit" class="btn btn-primary">登録する</button>
              </div>
            </div>
          </form>
        </div>
      </div>
  </div>
</template>

<script>
import axios from "axios"
import { mapWritableState } from 'pinia'
import { useSystemStore } from "@/store/systemStore";
import { useUserStore } from "@/store/userStore";

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
      passwordConfirm: null,
      user: {
        state: "東京都",
        city: "世田谷区",
      },
    }
  },
  computed: {
    ...mapWritableState(useSystemStore, ['error']),
    ...mapWritableState(useSystemStore, ['message']),
    ...mapWritableState(useSystemStore, ['genders']),
    ...mapWritableState(useSystemStore, ['states']),
    passwordMatch() {
      if (this.passwordConfirm === null) {
        return false
      } else if (this.user.password !== this.passwordConfirm) {
        return true
      }
      return false
    },
  },
  watch: {
    'user.first_name'() {
      const inputValidationFirstname = document.getElementById('input-validation-firstname');
      if (this.user.first_name === "") {
        this.AddInvalidCssClass(inputValidationFirstname)
      } else if (this.user.first_name !== "") {
        this.AddValidCssClass(inputValidationFirstname)
      }
    },
    'user.last_name'() {
      const inputValidationLastname = document.getElementById('input-validation-lastname');
      if (this.user.last_name === "") {
        this.AddInvalidCssClass(inputValidationLastname)
      } else if (this.user.last_name !== "") {
        this.AddValidCssClass(inputValidationLastname)
      }
    },
    'user.email'() {
      const inputValidationEmail = document.getElementById('input-validation-email');
      if (this.user.email === "") {
        this.AddInvalidCssClass(inputValidationEmail)
      } else if (this.user.email !== "") {
        this.AddValidCssClass(inputValidationEmail)
      }
    },
    'user.password'() {
      const inputValidationPassword = document.getElementById('input-validation-password');
      if (this.user.password === "") {
        this.AddInvalidCssClass(inputValidationPassword)
      } else if (this.user.password !== "") {
        this.AddValidCssClass(inputValidationPassword)
      }
    },
    passwordConfirm() {
      const inputValidationPassword = document.getElementById('input-validation-password');
      const inputValidationPasswordconfirm = document.getElementById('input-validation-passwordconfirm');
      if (this.passwordConfirm === "" || !this.passwordConfirm) {
        this.AddInvalidCssClass(inputValidationPasswordconfirm);
      } else if (this.passwordConfirm) {
        if (this.user.password === this.passwordConfirm) {
          this.AddValidCssClass(inputValidationPassword);
          this.AddValidCssClass(inputValidationPasswordconfirm);
        } else if (this.user.password !== this.passwordConfirm) {
          this.AddInvalidCssClass(inputValidationPasswordconfirm);
        } 
      }
    },
  },
  methods: {
    AddValidCssClass(element) {
      element.classList.remove('is-invalid');
      element.classList.add('is-valid');
    },
    AddInvalidCssClass(element) {
      element.classList.remove('is-valid');
      element.classList.add('is-invalid');
    },
    validateEmptyRequiredForm() {
      let invalidKeys = [];
      const keys = (Object.keys(this.user));
      for (let i in keys) {
        if (this.user[keys[i]] === "") {
          if (keys[i] === "first_name" || keys[i] === "last_name" || keys[i] === "email" || keys[i] === "password")
          invalidKeys.push(keys[i])
        }
      }
      if (!invalidKeys.length) {
        return true;
      } else {
        for (let i in invalidKeys) {
          invalidKeys[i] = (invalidKeys[i].charAt(0).toUpperCase() + invalidKeys[i].slice(1)).replace('_', ' ')
        }
        if (!this.passwordConfirm) {
          invalidKeys.push('and Confirm password')
        } else {
          invalidKeys[invalidKeys.length - 1] = 'and ' + invalidKeys[invalidKeys.length - 1]
        }
        return invalidKeys.join(', ');
      }
    },
    createUser() {
      const valid = this.validateEmptyRequiredForm()
      if (valid === false) {
        this.error = `必須項目をご記入ください: ${valid}`
        return
      } else if (this.user.password !== this.passwordConfirm) {
        this.error = "パスワードと確認用パスワードが一致していません。"
        return
      }
      if (this.user.password === this.passwordConfirm) {
        this.systemStore.modifyLoadingMessage(this.$t('Spinner.createAndLogin'));
        this.systemStore.startLoading();
        axios.post('/users', this.user)
        .then(()=> {
          this.systemStore.endLoading();
          this.$router.push('/activate-account');
          return
        })
        .catch((error)=> {
          const response = error.response;
          this.error = `エラーが発生しました(Error code: ${response.status}/ ${response.statusText})`
          return
        })
      }
    },
    cancelSignup() {
      this.user = {};
      this.$router.go(-1);
    },
  }
}
</script>

<style scoped>
  .col-sm-6 {
    text-align: left;
  }
  .password-match {
    color: rgb(255, 99, 132);
  }
  .btn-container {
    margin-top: 20px;
  }
</style>