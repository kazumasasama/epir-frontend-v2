<template>
  <div class="container">
    <vue-cal :time="false" hide-weekends />
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
  export default {
    components: { VueCal },
    data() {
      return {
        
      }
    }
  }
</script>

<style lang="scss">
  
</style>