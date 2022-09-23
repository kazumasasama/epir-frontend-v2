<template>
  <div class="container">
    <div class="card shadow text-start">
      <div class="card-body">
        <div class="row">
          <div class="container">
            <div class="row">
              <div class="col-12 thanks-message">
                <h4>{{ $t('Complete.thankYou') }}</h4>
                <p></p>
                <p>{{ $t('Complete.bookedNotice') }}</p>
                <p>{{ $t('Complete.rescheduleNotice') }}</p>
                <p>
                  {{ $t('Complete.cancelationNotice') }}
                </p>
                <strong>{{ $t('Complete.linkNotice') }}</strong>
                <p></p>
                <p @click="this.$router.push('/admin/calendar')">
                  <a class="link-primary" href="#">https://biznesu.netlify.app/admin/calendar</a>
                </p>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-12">
                <ul class="store-info-complete">
                  <h5>{{ business.name }}</h5>
                  <li>{{ business.address }}</li>
                  <li>{{ business.city }}, {{ business.state }} {{ business.zip }}</li>
                  <p></p>
                  <li><font-awesome-icon icon="fa-solid fa-phone" /> {{ business.phone }}</li>
                  <li v-if="business.facebook"><font-awesome-icon icon="fa-brands fa-facebook" /> {{ business.facebook }}</li>
                  <li v-if="business.twitter"><font-awesome-icon icon="fa-brands fa-twitter" /> {{ business.twitter }}</li>
                  <li v-if="business.insta"><font-awesome-icon icon="fa-brands fa-instagram" /> {{ business.insta }}</li>
                </ul>
              </div>
              <div class="col-lg-8 col-md-8 col-sm-12">
                <div id="map" style='width: 100%; height: 400px;'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import { useSystemStore } from '@/store/systemStore';
import mapboxgl from 'mapbox-gl';

export default {
  setup() {
    const systemStore = useSystemStore();
    return {
      systemStore,
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.initMap();
  },
  updated() {
    this.initMap();
  },
  computed: {
    ...mapWritableState(useSystemStore, ['business']),
  },
  methods: {
    initMap() {
      mapboxgl.accessToken = process.env.VUE_APP_MAPBOX;
      const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: this.systemStore.mapboxURL, // style URL
        center: [-73.99873361830024, 40.735854328717224], // starting position [lng, lat]
        zoom: 14 // starting zoom
      });
      new mapboxgl.Marker()
      .setLngLat([-73.99873361830024, 40.735854328717224])
      .addTo(map);
    },
  }
}
</script>

<style scoped>
  .map-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .store-info-complete {
    padding-left: 0px;
  }
  .thanks-message {
    margin-bottom: 30px;
  }
</style>