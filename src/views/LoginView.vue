<template>
  <div class="vld-parent">
    <loading v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
      color="rgb(140, 146, 232)"
      loader="dots"
      :height=100
      :width=150
      :opacity=1
    >
      <template v-slot:after>
        <p class="spinner-after">{{ spinnerMessage }}</p>
      </template>
    </loading>
  
    <div v-if="error" class="alert alert-warning" role="alert">
      {{ error }}
    </div>
    <div class="container">
      <div>
        <h4>Login</h4>
      </div>
      <div class="row">
        <div class="col-sm-12 login-form-container">
          <div class="login-form-container">
            <form v-on:submit.prevent="login()" class="needs-validation" novalidate>
              <small>Email:</small>
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
              <small>Password:</small>
              <input
                v-model="user.password"
                id="login-input-password"
                class="form-control"
                type="password"
                autocomplete="current-password"
                required
              >
              <div class="btn-container">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="toHome()"
                >
                  Back to Home
                </button>
                <button type="submit" class="btn btn-primary" @click="login()">Login</button>
              </div>
            </form>
          </div>
        </div>
        <div class="col-sm-6 login-hint">
          <p class="login-hint-title">Login as Admin</p>
          <p class="login-hint-item"><small>Email: test@test.com</small></p>
          <p class="login-hint-item"><small>Password: password</small></p>
        </div>
        <div class="col-sm-6 login-hint">
          <p class="login-hint-title">Login as User</p>
          <p class="login-hint-item"><small>Email: test@user.com</small></p>
          <p class="login-hint-item"><small>Password: password</small></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      error: null,
      emailInputError: null,
      isLoading: false,
      fullPage: true,
      spinnerMessage: "Loading",
      user: {
        email: "",
        password: "",
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
          this.error = "Please enter email and password.";
        } else if (!user.email) {
          this.error = "Please enter the email.";
        } else if (!user.password) {
          this.error = "Please enter the password.";
        } else {
          this.error = "Something went wrong. Tray again."
        }
        return false;
      }
    },
    login() {
      if (this.validateEmptyRequiredForm()) {
        this.isLoading = true;
        axios.post('/sessions', this.user)
        .then((res)=> {
          this.error = null;
          axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.jwt;
          localStorage.setItem("jwt", res.data.jwt);
          localStorage.setItem("user_id", res.data.user_id);
          localStorage.setItem("admin", res.data.admin);
          this.$router.push('/appointments');
        })
        .then(()=> {
          this.isLoading = false
        })
        .catch((error)=> {
          this.error = `${error.response.statusText}: Invalid email or password`;
          this.isLoading = false
        })
      }
    },
    toHome() {
      this.user = {};
      this.$router.push('/');
    },
  }
}
</script>

<style scoped>
  .row {
    text-align: left;
  }
  .login-form-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .container {
    max-width: 400px;
  }
  .btn-container {
    margin-top: 20px;
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
</style>