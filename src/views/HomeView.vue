<template>
  <div class="container home-container">
    <div class="row">
      <div class="col-sm-12">
        <h4 class="card-title top-card-title">Welcome to Booking App Biznesu</h4>
        <div class="card-body home" id="card-home">
          <img src="@/assets/people-top-image.jpg" class="card-img-home">
          <p class="illust-credit">
            <a href="https://www.freepik.com/vectors/people-set">People set vector created by pikisuperstar - www.freepik.com</a>
          </p>
          <p class="card-text" id="text-home">Please login/signup to book an appontment</p>
          <!-- <p>or</p>
          <a href="/appointments" class="btn btn-primary">Continue as guest</a> -->
        </div>
      </div>
      <div class="col-sm-6 login-hint">
        <p class="login-hint-title">Login as Admin</p>
        <p class="login-hint-item"><small>Email: test@test.com</small></p>
        <p class="login-hint-item"><small>Password: password</small></p>
      </div>
      <div class="col-sm-6 login-hint">
        <p class="login-hint-title">Login as User</p>
        <p class="login-hint-item"><small>Email: test@user.com</small></p>
        <p class="login-hint-item"><small>Password: password</small></p>
      </div>
      <div class="col-12">
        <a class="btn btn-primary" href="/login">Login</a>
        <a href="/signup" class="btn btn-primary">Signup</a>
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
  max-width: 430px;
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
  text-align: center;
}
.login-hint-title {
  font-weight: bold;
}
.illust-credit {
  font-size: 7pt;
}
</style>
