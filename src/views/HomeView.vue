<template>
  <div class="container home-container">
      <div class="card home-card">
        <div class="row">
          <h4 class="card-title top-card-title">{{ $t('Home.greeting') }}</h4>
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
}
.btn {
  margin: 5px 8px;
}
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
