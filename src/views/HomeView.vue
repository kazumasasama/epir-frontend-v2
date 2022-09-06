<template>
  <div class="container">
    <div class="row">
      <div class="card home-card">
        <div class="row">
          <h1 class="card-title top-card-title">{{ $t('Home.greeting') }}</h1>
          <div class="col-md-6">
            <div class="card-body home" id="card-home">
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
          <div class="col-md-6">
            <div class="login-hint row">
              <p class="card-text" id="text-home">{{ $t('Home.message') }}</p>
              <div class="col-md-6">
                <p class="login-hint-title">{{ $t('Home.loginAdmin') }}</p>
                <p class="login-hint-item"><small>{{ $t('Home.email') }}: test@test.com</small></p>
                <p class="login-hint-item"><small>{{ $t('Home.password') }}: password</small></p>
              </div>
              <div class="col-md-6">
                <p class="login-hint-title">{{ $t('Home.loginUser') }}</p>
                <p class="login-hint-item"><small>{{ $t('Home.email') }}: test@user.com</small></p>
                <p class="login-hint-item"><small>{{ $t('Home.password') }}: password</small></p>
              </div>
            </div>
            <div class="btn-container">
              <button @click="this.$router.push('/login')" class="btn btn-primary">{{ $t('Btn.login') }}</button>
              <button @click="this.$router.push('/signup')" class="btn btn-primary">{{ $t('Btn.signup') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="card release-card text-start">
        <h2 class="release-card-title">Releases</h2>
        <ul class="">
          <li><small>09-05-2022: Cashless payment</small></li>
          <li><small>08-26-2022: Multiple language i18n</small></li>
          <li><small>08-26-2022: State</small></li>
          <li><small>08-22-2022: Improve error handling</small></li>
          <li><small>08-20-2022: Admin Dashboard (Statics)</small></li>
          <li><small>05-19-2022: Launch Biznesu</small></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HomeView',
}
</script>

<style scoped>
.card-img-home {
  max-width: 100%;
}
.top-card-title {
  margin-top: 8px;
  font-size: x-large;
}
.release-card-title {
  font-size: large;
}
.btn {
  margin: 5px 8px;
}
.login-hint {
  margin-top: 20px;
  vertical-align: middle;
}
.login-hint-title {
  font-weight: bold;
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
.release-card {
  background-color: rgb(253,239,224);
  padding-top: 20px;
  margin-top: 20px;
  border-color: rgb(255, 200, 140);
  border-width: 3px;
}
</style>
