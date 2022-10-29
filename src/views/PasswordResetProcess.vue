<template>
  <div class="container">
    <div class="row">
      <div class="col-12 d-flex justify-content-center">
        <div v-if="activated" class="card shadow card-base max-width-600">
          <div class="card-body card-base-body">
            <div class="row">
              <div class="col-12 d-flex justify-content-center">
                <div class="card-title mb-5 text-center">
                  <h4>パスワード再設定</h4>
                </div>
              </div>
              <div class="col-12 d-flex justify-content-center">
                <form v-on:submit.prevent="resetPassword()" class="needs-validation">
                  <div class="mb-5">
                    <small>新しいパスワード</small>
                    <input
                      v-model="user.password"
                      id="login-input-password"
                      class="form-control mb-3"
                      type="password"
                      autocomplete="current-password"
                      required
                    >
                    <small>パスワード確認</small>
                    <input
                      v-model="user.password_confirmation"
                      id="login-input-password-confirmation"
                      class="form-control"
                      type="password"
                      autocomplete="current-password"
                      required
                    >
                  </div>
                  <div class="alert alert-danger mb-5" role="alert" v-if="error">
                    {{ error }}
                  </div>
                  <div class="alert alert-info mb-5" role="alert" v-if="message">
                    {{ message }}
                  </div>
                  <div class="btn-container">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click.prevent="redirectToHome()"
                    >
                      {{ $t('Btn.backHome') }}
                    </button>
                    <button type="submit" class="btn btn-info">送信</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!activated" class="card max-width-600">
          <div class="card-body card-base-body">
            <div class="card-title">
              <h4 class="mb-5">エラー</h4>
              <p class="mb-5">無効なリンク、もしくは不正な操作が検出されました。</p>
              <button
                class="btn btn-secondary"
                @click.prevent="redirectToHome()"
              >
                ホームに戻る
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import { useSystemStore } from '@/store/systemStore'
import { useUserStore } from '@/store/userStore'
import axios from 'axios';

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
        activated: true,
        count: 5,
        user: {
          password: null,
          password_confirmation: null,
        }
      }
    },
    computed: {
      ...mapWritableState(useSystemStore, ['error']),
      ...mapWritableState(useSystemStore, ['message'])
    },
    created() {
    },
    methods: {
      validatePasswordForm() {
        let password = this.user.password.slice();
        let passwordConfirmation = this.user.password_confirmation.slice();
        console.log(password.split(''));
        if (password.split('').length < 8 || password.split('').length > 20) {
          this.error = "パスワードは8桁以上20桁以下の英数字と記号で設定してください。"
          return false;
        } else if (password !== passwordConfirmation) {
          this.error = "新しいパスワードとパスワード確認が一致していません。"
          return false;
        } else if (password === passwordConfirmation) {
          return true;
        }
      },
      resetPassword() {
        let counter = new Promise(()=> {
          setTimeout(()=> {
            this.count--;
          }, 1000)
        })
        this.message = null;
        this.error = null;
        let validated = this.validatePasswordForm();
        if (validated) {
          const url = `/password_resets/${this.$route.params['activation_token']}.json/?email=${this.$route.params['email']}`
          axios.patch(url, this.user)
          .then((res)=> {
            while (this.count > 0) {
              this.message = `${res.data.message}${this.count}秒後にログイン画面へリダイレクトします。`;
              counter
              .then(()=> {
                if (this.count === 0) {
                  this.error = null;
                  this.message = null;
                  this.user.password = null;
                  this.user.password_confirmation = null;
                  this.$router.push('/login')
                }
              })
            }
          })
          .catch((error)=> {
            this.error = error;
          })
        }
      },
      redirectToHome() {
        this.error = null;
        this.message = null;
        this.user.password = null;
        this.user.password_confirmation = null;
        this.$router.push('/');
      }
    },
  }
</script>

<style scoped>
.max-width-600 {
  max-width: 600px;
}
.card-base-body {
  padding: 60px;
}
</style>