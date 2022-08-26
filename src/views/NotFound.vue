<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class=card>
          <h1>404 Page Not Found.</h1>
          <button @click="this.$router.go(-1)" class="btn btn-danger">Go Back</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    },
    created() {
    },
    methods: {
    },
  }
</script>

<style scoped>
</style>