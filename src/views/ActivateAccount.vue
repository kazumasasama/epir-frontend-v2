<template>
  <div v-if="error" class="alert alert-warning" role="alert">
    {{ error }}
  </div>
  <div class="container">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-6 col-md-12">
        <div class="card shadow card-base">
          <div class="card-body card-base-body">
            <h4 class="mb-5">アカウントの登録が完了しました</h4>
            <div class="mb-5">
              <p>ご登録のメールアドレスにアカウント有効化のメールを送信しました。<br>
                受信箱をご確認ください。</p>
              <p>メールが届かない場合はお手数ですがもう一度やり直してください。(スパムフォルダもご確認ください)</p>
            </div>
            <button
              class="btn btn-primary"
              @click.prevent="$router.push('/')"
            >
              ホームに戻る
            </button>
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
  padding: 80px;
}
</style>