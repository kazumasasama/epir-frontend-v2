<template>
  <div class="container home-container">
     <div class="row">
       <div class="col-sm-12">
        <h5 class="card-title top-card-title">Book an Appointment</h5>
        <div class="card-body home" id="card-home">
          <img src="@/assets/home-illustration.png" class="card-img-home">
          <p class="card-text" id="text-home">Book appointments faster, see your booking history, and change upcoming appointments.</p>
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
</style>
