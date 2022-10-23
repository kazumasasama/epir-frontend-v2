<template>
  <div class="container">
    <div class="row">
      <div class="col-12 d-flex justify-content-center">
        <div v-if="activated" class="card shadow card-base max-width-600">
          <div class="card-body card-base-body">
            <div class="row">
              <div class="col-12 d-flex justify-content-center">
                <div class="card-title mb-5 text-center">
                  <h4>アカウントが有効になりました</h4>
                  <small>パスワードを入力してログインしてください</small>
                </div>
              </div>
              <div class="col-12 d-flex justify-content-center">
                <form v-on:submit.prevent="login()" class="needs-validation" novalidate>
                  <div class="mb-5">
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
                  </div>
                  <div class="btn-container">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click.prevent="this.$router.push('/')"
                    >
                      {{ $t('Btn.backHome') }}
                    </button>
                    <button type="submit" class="btn btn-info">{{ $t('Btn.login') }}</button>
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
                @click.prevent="$router.push('/')"
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
        user: {
          email: null,
          password: null,
        }
      }
    },
    computed: {
      ...mapWritableState(useSystemStore, ['error'])
    },
    created() {
      this.user.email = this.$route.params['email'];
      const url = `/account_activations/${this.$route.params['activation_token']}/edit?email=${this.$route.params['email']}`
      let activated;
      axios.get(url)
      .then((res)=> {
        if (res.data.activated === true) {
          activated = true;
        } else {
          activated = false;
        }
        return activated
      })
      .catch((error)=> {
        this.error = error;
      })
    },
    methods: {
      login() {
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
            this.$router.push('/appointments');
            return
          })
          .catch((error)=> {
            this.systemStore.endLoading();
            this.error = `${error.response}: メールアドレスに誤りがあります。`;
          })
        })
        .catch((error)=> {
          this.systemStore.endLoading();
          console.log(error)
          this.error = `${error}: パスワードに誤りがあります。`;
        })
      },
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