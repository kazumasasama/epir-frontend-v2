<template>
  <div class="container">
    <div class="card shadow text-start">
      <div class="card-body">
        <div class="row">
          <div class="col-12 thanks-message">
            <h3>{{ $t('Complete.thankYou') }}</h3>
            <p class="padding-top-30"></p>
            <p class="margin-bottom-0">{{ `${user.last_name}${$t('Complete.bookedNotice')}` }}</p>
            <p class="margin-bottom-0">{{ $t('Complete.rescheduleNotice') }}</p>
            <p class="margin-bottom-0">
              {{ $t('Complete.cancelationNotice') }}
            </p>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 padding-top-60">
            <ul class="store-info-complete">
              <h5>{{ business.name }}</h5>
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
              <img
                src="@/assets/lineQR.jpg"
                alt="LINE ID QR code"
                id="business-line-qrcode"
              >

              <li>LINE: {{ business.line_id }}</li>
            </ul>
          </div>
          <div class="col-lg-8 col-md-8 col-sm-12 padding-top-60">
            <div id="map" style='width: 100%; height: 350px;'></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import { useSystemStore } from '@/store/systemStore';
import { useUserStore } from '@/store/userStore';
import mapboxgl from 'mapbox-gl';

export default {
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
    ...mapWritableState(useUserStore, ['user']),
  },
  methods: {
    initMap() {
      mapboxgl.accessToken = process.env.VUE_APP_MAPBOX;
      const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/kaznyc/cl3z0c148000i14qp3onp4x8e', // style URL
        center: [139.60863023397835, 35.64135382906784], // starting position [lng, lat]
        zoom: 15.5 // starting zoom
      });
      new mapboxgl.Marker()
      .setLngLat([139.607748966944, 35.639853527118035])
      .addTo(map);
      map.addControl(new mapboxgl.NavigationControl());
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
  #business-line-qrcode {
    width: 50%;
    margin-left: -2px;
  }
  .padding-top-30 {
    padding-top: 30px;
  }
  .padding-top-60 {
    padding-top: 60px;
  }
  .margin-bottom-0 {
    margin-bottom: 0px;
  }
</style>