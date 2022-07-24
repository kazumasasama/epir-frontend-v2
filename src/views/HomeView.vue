<template>
  <div class="container home-container">
     <div class="row">
       <div class="col-sm-12">
        <h5 class="card-title top-card-title">脱毛サロン エピア祖師谷 epiR</h5>
        <h6 class="card-title top-card-title">予約サイト</h6>
        <div class="card-body home" id="card-home">
          <img src="@/assets/home-illustration.png" class="card-img-home">
          <p class="card-text" id="text-home">ご利用には登録・ログインが必要です</p>
          <a class="btn btn-primary" href="/login">ログイン</a>
          <a href="/signup" class="btn btn-primary">登録して予約</a>
          <!-- <p>or</p>
          <a href="/appointments" class="btn btn-primary">Continue as guest</a> -->
        </div>
        <div class="col-sm-12 login-hint">
          <p class="login-hint-title">Login as Admin</p>
          <p class="login-hint-item"><small>Email: test@test.com</small></p>
          <p class="login-hint-item"><small>Password: password</small></p>
        </div>
        <div class="col-sm-12 login-hint">
          <p class="login-hint-title">Login as User</p>
          <p class="login-hint-item"><small>Email: user@user.com</small></p>
          <p class="login-hint-item"><small>Password: password</small></p>
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

<style>
.card-img-home {
  max-width: 400px;
}
.top-card-title {
  margin-top: 8px;
}
.btn {
  margin: 5px 8px;
}
#text-home {
  max-width: 400px;
}
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-hint {
  margin-top: 20px;
  text-align: center;
}
.login-hint-title {
  font-weight: bold;
}
</style>
