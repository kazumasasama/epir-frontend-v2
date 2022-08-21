<template>
  <div class="container">
    <div class="row">
      <div class="container">
        <div class="row">
          <div class="col-sm-6">
            <strong>Clink on the link below to see your appointment on the calendar in the admin page.</strong>
            <p>
              <a class="link-primary" href="https://biznesu.netlify.app/admin/calendar">https://biznesu.netlify.app/admin/calendar</a>
            </p>
            <p></p>
            <h4>Thank you!</h4>
            <p></p>
            <p></p>
            <p>We just made your appointment.</p>
            <p>If you wish to reschedule/cancel your appintment, please give us a call.</p>
            <p>
              Please note that we might charge cancelation fee for appointments start within 24 hours.
            </p>
            <ul class="store-info-complete">
              <h5>Business Name</h5>
              <li>111 W 11th Street</li>
              <li>New York, NY 10001</li>
              <p></p>
              <li>Phone: 111-111-1111</li>
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
          center: [-73.99873361830024, 40.735854328717224], // starting position [lng, lat]
          zoom: 14 // starting zoom
        });
        new mapboxgl.Marker()
        .setLngLat([-73.99873361830024, 40.735854328717224])
        .addTo(map);
        // const language = event.target.id.substr('button-'.length);
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