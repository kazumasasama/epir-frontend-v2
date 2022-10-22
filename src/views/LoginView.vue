<template>
  <div v-if="error" class="alert alert-warning" role="alert">
    {{ error }}
  </div>
  <div class="container">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-5 col-md-6 col-sm-8">
        <div class="card shadow card-base">
          <div class="card-header text-center">
            <h4 class="">{{ $t('Login.pageTitle') }}</h4>
          </div>
          <div class="card-body login-form-container card-base-body">
            <form v-on:submit.prevent="login()" class="needs-validation" novalidate>
              <small>{{ $t('Login.form.email') }}</small>
              <input
                v-model="user.email"
                id="login-input-email"
                class="form-control"
                type="text"
                autocomplete="email"
                required
              >
              <div v-if="emailInputError" class="invalid-feedback">
                {{ emailInputError }}
              </div>
              <small>{{ $t('Login.form.password') }}</small>
              <input
                v-model="user.password"
                id="login-input-password"
                class="form-control"
                type="password"
                autocomplete="current-password"
                required
              >
              <small>
                パスワードをお忘れですか? <a href="#" @click.prevent="$router.push('/password-reset')">パスワード再設定</a>
              </small>
              <div class="btn-container">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click.prevent="this.$router.push('/')"
                >
                  {{ $t('Btn.backHome') }}
                </button>
                <button type="submit" class="btn btn-info" @click="login()">{{ $t('Btn.login') }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      emailInputError: null,
      user: {
        email: "test@test.com",
        password: "password",
      },
    }
  },
  watch: {
    'user.email'() {
      const inputValidationEmail = document.getElementById('login-input-email');
      const email = this.user.email
      if (email === "") {
        this.AddInvalidCssClass(inputValidationEmail)
      } else if (email !== "") {
        if (email.split('').includes('@') === false) {
          this.AddInvalidCssClass(inputValidationEmail)
          this.emailInputError = "Invalid email address. Email has to contain '@'"
        } else if (email.split('').includes('@')) {
          this.AddValidCssClass(inputValidationEmail)
          this.emailInputError = null;
        } else {
          this.AddValidCssClass(inputValidationEmail)
        }
      }
    },
    'user.password'() {
      const inputValidationPassword = document.getElementById('login-input-password');
      if (this.user.password === "") {
        this.AddInvalidCssClass(inputValidationPassword)
      } else if (this.user.password !== "") {
        this.AddValidCssClass(inputValidationPassword)
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
      let user = this.user
      const keys = (Object.keys(user));
      for (let i in keys) {
        if (user[keys[i]] === "") {
          invalidKeys.push(keys[i])
        }
      }
      if (!invalidKeys.length) {
        if (user.email.split('').includes('@') === false) {
          return false
        } else {
          this.emailInputError = null
          return true;
        }
      } else {
        if (!user.email && !user.password) {
          this.error = "メールアドレスとパスワードを入力してください。";
        } else if (!user.email) {
          this.error = "メールアドレスを入力してください。";
        } else if (!user.password) {
          this.error = "パスワードを入力してください。";
        } else {
          this.error = "エラーが発生しました。入力項目をご確認の上再度ログインしてください。"
        }
        return false;
      }
    },
    login() {
      if (this.validateEmptyRequiredForm()) {
        this.systemStore.modifyLoadingMessage(this.$t('Spinner.loggingIn'))
        this.systemStore.startLoading()
        axios.post('/sessions', this.user)
        .then((res)=> {
          const user = res.data;
          this.error = null;
          axios.defaults.headers.common["Authorization"] = "Bearer " + user.jwt;
          localStorage.setItem("jwt", user.jwt);
          localStorage.setItem("user_id", user.user_id);
          localStorage.setItem("last_login", user.last_login);
          return user.user_id
        })
        .then((userId)=> {
          axios.get(`/users/${userId}.json`)
          .then((res)=> {
            this.userStore.pushUser(res.data);
            this.userStore.switchLoggedin(true);
            let isAdmin = res.data.admin
            return isAdmin
          })
          .then((isAdmin)=> {
            this.userStore.handleAdmin(isAdmin);
            // if (isAdmin) {
            //   this.$router.push('/admin/dashboard');
            // } else {
              this.$router.push('/appointments');
            // }
            // this.systemStore.endLoading();
            return
          })
          .catch((error)=> {
            this.systemStore.endLoading();
            this.error = `${error.response}: メールアドレスに誤りがあります。`;
          })
        })
        .catch((error)=> {
          this.systemStore.endLoading();
          this.error = `${error.response}: パスワードに誤りがあります。`;
        })
      }
    },
    toHome() {
      this.user = {};
      this.$router.push('/');
    },
    activate() {
      this.systemStore.startLoading();
    },
    deactivate() {
      this.systemStore.endLoading();
    }
  }
}
</script>

<style scoped>
  h4 {
    margin: 10px 0px;
  }
  .row {
    text-align: left;
  }
  .login-form-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-hint {
    margin-top: 20px;
    text-align: center;
  }
  .login-hint-item {
    margin-bottom: 8px;
  }
  .login-hint-title {
    font-weight: bold;
  }
  .btn-container {
    margin-top: 20px;
  }
  .card-base-body {
    padding: 50px;
  }
</style>