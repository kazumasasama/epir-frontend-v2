<template>
  <div v-if="error" class="alert alert-warning" role="alert">
    {{ error }}
  </div>
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
                  class="form-control"
                  type="text"
                  autocomplete="email"
                  required
                >
                <div v-if="emailInputError" class="invalid-feedback">
                  {{ emailInputError }}
                </div>
              </div>
              <div class="btn-container">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click.prevent="this.$router.push('/')"
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
export default {
  data() {
    return {
      user: {
        email: null,
      }
    }
  },
  created() {
  },
  watch: {
    'user.email'() {
      const inputValidationEmail = document.getElementById('login-input-email');
      const email = this.user.email
      if (email === "") {
        this.AddInvalidCssClass(inputValidationEmail)
        this.emailInputError = "入力してください"
      } else if (email !== "") {
        if (email.split('').includes('@') === false) {
          this.AddInvalidCssClass(inputValidationEmail)
          this.emailInputError = "不正なメールアドレス"
        } else if (email.split('').includes('@')) {
          this.AddValidCssClass(inputValidationEmail)
          this.emailInputError = null;
        } else {
          this.AddValidCssClass(inputValidationEmail)
        }
      }
    },
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
        if (!user.email) {
          this.error = "メールアドレスを入力してください。";
        } else {
          this.error = "エラーが発生しました。入力項目をご確認の上再度ログインしてください。"
        }
        return false;
      }
    },
    sendPasswordResetMail() {
      
    },
  },
}
</script>

<style scoped>
.card-base-body {
  padding: 50px;
}
</style>