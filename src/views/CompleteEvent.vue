<template>
  <div class="container">
    <div class="row">
      <div class="container">
        <div class="row">
          <div class="col-sm-6">
            <h4>ご予約を承りました</h4>
            <p></p>
            <p></p>
            <p>ご利用ありがとうございます。</p>
            <p>ご予約の変更、キャンセルをされる場合は下記連絡先のお電話かLINEにてお知らせください。施術中は電話に出られないこともございますのでLINEでのご連絡をお勧めします。</p>
            <p>
              ご予約時間の24時間前以降のキャンセルはキャンセル料が発生することがございます。
              詳しくは下記にお問い合わせください。
            </p>
            <ul class="store-info-complete">
              <h5>脱毛サロン エピア祖師谷 epiR</h5>
              <li>〒157-0073</li>
              <li>東京都世田谷区</li>
              <li>砧8丁目3-10 砧OKマンション202</li>
              <p></p>
              <li>TEL: 080-3715-9012</li>
              <li>LINE ID: epir.ikuta</li>
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
          style: 'mapbox://styles/kaznyc/cl3z0c148000i14qp3onp4x8e', // style URL
          center: [139.60830166136682, 35.64141293315793], // starting position [lng, lat]
          zoom: 15 // starting zoom
        });
        new mapboxgl.Marker()
        .setLngLat([139.60774175922208, 35.63984499572222])
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