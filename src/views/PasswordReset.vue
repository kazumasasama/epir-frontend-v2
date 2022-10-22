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
          <div class="card-body card-base-body">
            <form v-on:submit.prevent="login()" class="needs-validation" novalidate>
              <div class="text-start">
                <small>{{ $t('Login.form.email') }}</small>
                <input
                  v-model="user.email"
                  id="login-input-email"
                  class="form-control mb-5"
                  type="text"
                  autocomplete="email"
                  required
                >
              </div>
              <div v-if="emailInputError" class="invalid-feedback">
                {{ emailInputError }}
              </div>
              <div class="btn-container">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click.prevent="this.$router.push('/')"
                >
                  {{ $t('Btn.backHome') }}
                </button>
                <button type="submit" class="btn btn-info" @click="login()">再設定メール送信</button>
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
  computed: {
  },
  methods: {
  },
}
</script>

<style scoped>
.card-base-body {
  padding: 50px;
}
</style>