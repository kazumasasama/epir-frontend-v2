<template>
  <div class="container">
    <div class="pick-menus" v-if="currentStep === 1">
      <p>Step1</p>
      <h2>Select Menus</h2>
      <div class="menu-container">
        <ul class="list-group">
          <li class="list-group-item" v-for="menu in menus" :key="menu.id">
            <input class="form-check-input me-1" type="checkbox" v-model="bookingMenus" :value="menu" aria-label="...">
            {{ menu.title }}
          </li>
        </ul>
      </div>
    </div>
    <div class="pick-menus" v-if="currentStep === 2">
      <p>Step2</p>
      <h2>Pick a date and time</h2>
      <div class="menu-container">
        <ul class="list-group">
          <li class="list-group-item" v-for="businessTime in businessTimes" :key="businessTime.id">
            <input class="form-check-input me-1" type="checkbox" v-model="bookingMenus" :value="businessTime" aria-label="...">
            {{ businessTime.time }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
  export default {
    data() {
      return {
        menus: [],
        menu: {},
        bookingMenus: [],
        businessTimes: [],
        currentStep: 2
      }
    },
    created() {
      this.indexMenus();
      this.indexBusinessTimes();
    },
    methods: {
      indexMenus() {
        axios.get("/menus")
        .then((res)=> {
          this.menus = res.data
        })
      },
      indexBusinessTimes() {
        axios.get("/business_times")
        .then((res)=> {
          this.businessTimes = res.data
        })
      }
    }
  }
</script>

<style>
  
</style>