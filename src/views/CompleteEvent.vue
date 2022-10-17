<template>
  <div class="container">
    <div class="card shadow text-start">
      <div class="card-body">
        <div class="row">
          <div class="container">
            <div class="row">
              <div class="col-12 thanks-message">
                <h3>{{ $t('Complete.thankYou') }}</h3>
                <p></p>
                <p>{{ $t('Complete.bookedNotice') }}</p>
                <p>{{ $t('Complete.rescheduleNotice') }}</p>
                <p>
                  {{ $t('Complete.cancelationNotice') }}
                </p>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-12">
                <ul class="store-info-complete">
                  <h4>{{ business.name }}</h4>
                  <li>〒{{ business.zip }}</li>
                  <li>{{ business.state }}{{ business.city }}</li>
                  <li>{{ business.address }}</li>
                  <p></p>
                  <li><font-awesome-icon icon="fa-solid fa-phone" /> {{ business.phone }}</li>
                  <li v-if="business.facebook"><font-awesome-icon icon="fa-brands fa-facebook" /> {{ business.facebook }}</li>
                  <li v-if="business.twitter"><font-awesome-icon icon="fa-brands fa-twitter" /> {{ business.twitter }}</li>
                  <li v-if="business.insta">
                    <font-awesome-icon icon="fa-brands fa-instagram" />
                    <a
                      :href="business.insta"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                       epir.soshigaya
                    </a>
                  </li>
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