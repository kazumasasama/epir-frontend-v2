<template>
  <div class="container">
    <h1>dashboard</h1>
    <div class="card row">
      <div class="col-sm-6">
        <form action="">
          <div class="col-sm-4">
            <div class="input-group">
              <span class="input-group-text" id="basic-addon1">Year</span>
              <input type="text" v-model="year" class="form-control">
            </div>
          </div>
        </form>
        <BarChart
          :chart-data="chartData"
          height="400px"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/charts/BarChart.vue'
import moment from 'moment';
import axios from 'axios';

export default {
  components: {
    BarChart,
  },
  data () {
    return {
      year: moment().format('YYYY'),
      chartData: {
        labels: [
          'Jan', 'Feb', 'Mar', 'Apr',
          'May', 'June', 'Jul', 'Aug',
          'Sep', 'Oct', 'Nov', 'Dec',
          ],
        datasets: [{
          label: 'Appointments',
          data: [],
        }]
      },
      chartOptions: {
        responsive: true
      },
    }
  },
  watch: {
    year() {
      this.indexEvents();
    }
  },
  mounted() {
    this.indexEvents();
  },
  methods: {
    indexEvents() {
      axios.post('/events-monthly.json', {"year": this.year})
      .then((res)=> {
        this.chartData.datasets[0].data = res.data;
      })
    },
  },
}
</script>

<style>
</style>