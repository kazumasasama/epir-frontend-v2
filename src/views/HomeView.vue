<template>
  <div class="container">
    <div class="row home-card-container">
      <div class="card home-card ">
        <h1
          v-if="business"
          class="card-title top-card-title"
        >
          {{ business.name }} 予約サイト
        </h1>
        <div class="row d-flex justify-content-center">
          <div class="col-md-6">
            <div class="card-body" id="card-home">
              <img src="@/assets/people-top-image.jpg" class="card-img-home">
              <p class="illust-credit">
                <a
                  href="https://www.freepik.com/vectors/people-set"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  People set vector created by pikisuperstar - www.freepik.com
                </a>
              </p>
            </div>
          </div>
          <div class="col-md-5 col-sm-7">
            <div class="card login-card">
              <div class="card-body">
                <p class="card-text mb-5" id="text-home">{{ $t('Home.message') }}</p>
                <div class="btn-container">
                  <button
                    @click="this.$router.push('/login')"
                    class="btn btn-primary"
                  >
                    {{ $t('Btn.login') }}
                  </button>
                  <button
                    @click="this.$router.push('/signup')"
                    class="btn btn-primary"
                  >
                    {{ $t('Btn.signup') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSystemStore } from '@/store/systemStore';
import { mapWritableState } from 'pinia'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapWritableState(useSystemStore, ['business'])
  },
  created() {
  }
}
</script>

<style scoped>
.home-card-container {
  padding-right: 20px;
  padding-left: 20px;
}
.card-img-home {
  max-width: 100%;
}
.top-card-title {
  margin-top: 40px;
  margin-bottom: 40px;
  font-size: 2rem;
}
.login-card {
  margin-top: 20px;
  margin-bottom: 20px;
  vertical-align: middle;
}
.illust-credit {
  font-size: 7pt;
}
.home-card {
  background-color: rgb(253,239,224);
  padding-top: 20px;
  border-color: rgb(255, 200, 140);
  border-width: 3px;
}
</style>
