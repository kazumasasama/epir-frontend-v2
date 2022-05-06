<template>
  <div class="container">
     <div class="row">
       <div class="col">
         <img src="@/assets/home-illustration.png" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title top-card-title">Book an Appointment</h5>
          <p class="card-text">Book appointments faster, see your booking history, and change upcoming appointments.</p>
          <!-- Modal本体はApp.vueに記述 -->
          <a class="btn btn-primary" href="/login">Login</a>
          <a href="/signup" class="btn btn-primary">Signup</a>
          <p>or</p>
          <a href="/appointments" class="btn btn-primary">Continue as guest</a>

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
.card-img-top {
  max-width: 500px;
}
.top-card-title {
  margin-top: 8px;
}
.btn {
  margin: 5px 8px;
}
</style>
