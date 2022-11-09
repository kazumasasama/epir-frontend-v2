<template>
  <div class="container">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-5 col-md-6 col-sm-8">
        <div class="card shadow card-base">
          <div class="card-body card-base-body">
            <h4 class="mb-5">パスワード再設定</h4>
            <form v-on:submit.prevent="login()" class="needs-validation" novalidate>
              <div class="text-center mb-5">
                <small>{{ $t('Login.form.email') }}</small>
                <input
                  v-model="user.email"
                  id="login-input-email"
                  class="form-control mb-3"
                  type="text"
                  autocomplete="email"
                  required
                >
                <div class="text-danger" v-if="error">
                  {{ error }}
                </div>
                <div class="alert alert-info" role="alert" v-if="message">
                  {{ message }}
                </div>
              </div>
              <div class="btn-container">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click.prevent="redirectToHome()"
                >
                  {{ $t('Btn.backHome') }}
                </button>
                <button type="submit" class="btn btn-info" @click.prevent="sendPasswordResetMail()">再設定メール送信</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        email: "",
      },
      mailSent: false,
      error: null,
      message: null,
    }
  },
  created() {
  },
  computed: {
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
      let user = this.user;
      if (user.email.length <= 0) {
        this.error = "メールアドレスを入力してください。";
      } else if (user.email !== "") {
        const inputValidationEmail = document.getElementById('login-input-email');
        if (user.email.split('').includes('@') === false) {
          this.AddInvalidCssClass(inputValidationEmail)
          this.error = "不正なメールアドレス"
        } else if (user.email.split('').includes('@')) {
          this.AddValidCssClass(inputValidationEmail);
          this.error = null;
          return true
        }
      }
      return false;
    },
    sendPasswordResetMail() {
      this.error = null;
      this.message = null;
      this.user.email = this.user.email.toLowerCase();
      if (this.validateEmptyRequiredForm()) {
        axios.post('/password_resets.json', this.user)
        .then((res)=> {
          this.message = res.data.message;
        })
        .catch((error)=> {
          this.error = error.response.data.error;
        })
      }
    },
    redirectToHome() {
      this.error = null;
      this.$router.push('/');
    },
  },
}
</script>

<style scoped>
.card-base-body {
  padding: 50px;
}
</style>