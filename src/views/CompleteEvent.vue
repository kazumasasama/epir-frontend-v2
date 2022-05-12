<template>
  <div class="container">
    <div class="row">
      <div class="container">
        <div class="row">
          <div class="col-sm-6">
            <small>YAY!</small>
            <h4>Your appointment is booked!</h4>
            <p></p>
            <small>We appreciate your business! If you have any questions or need to reschedule, please give us a call.</small>
            <p></p>
            <ul class="store-info-complete">
              <h4>Salon epiR</h4>
              <li>8-3-10 Kinuta</li>
              <li>Setagaya, Tokyo 157-0073</li>
              <li>Phone: 080-3715-9012</li>
            </ul>
          </div>
          <div class="col-sm-6">
            <div id="map" style='width: 100%; height: 400px;'></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
  export default {
    data() {
      return {
      }
    },
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        mapboxgl.accessToken = process.env.VUE_APP_MAPBOX;
        const map = new mapboxgl.Map({
          container: 'map', // container ID
          style: 'mapbox://styles/mapbox/streets-v11', // style URL
          center: [139.60830166136682, 35.64141293315793], // starting position [lng, lat]
          zoom: 15 // starting zoom
        });
        new mapboxgl.Marker()
        .setLngLat([139.60774175922208, 35.63984499572222])
        .addTo(map);
      },
    }
  }
</script>

<style scoped>
  .col-sm-6 {
    text-align: left;
  }
  .col-sm-4 {
    text-align: left;
  }
  .map-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .store-info-complete {
    margin-top: 50px;
    padding-left: 0px;
  }
</style>