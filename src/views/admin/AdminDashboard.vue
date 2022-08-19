<template>
  <div class="container">
    <div class="card row">
      <div class="col-12">
        <div class="card-body">
          <form action="">
            <div class="col-sm-6">
              <div class="input-group input-group-sm mb-3">
                <span class="input-group-text">Year</span>
                <input type="text" v-model="year" class="form-control">
                <div class="btn-group" role="group">
                  <button @click="decreaseYear()" type="button" class="btn btn-outline-secondary btn-sm">{{"<"}}</button>
                  <button @click="increaseYear()" type="button" class="btn btn-outline-secondary btn-sm">{{">"}}</button>
                </div>
              </div>
            </div>
          </form>
          <div class="row">
            <div class="col-md-6">
              <BarChart
                :chartData="barChartData"
                :chartOptions="barChartOptions"
                type="bar"
              />
            </div>
            <div class="col-md-6">
              <DoughnutChart
                :chartData="doughnutChartData"
                :chartOptions="doughnutChartOptions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import moment from 'moment';
import axios from 'axios';

export default {
  components: {
    BarChart,
    DoughnutChart,
},
  data () {
    return {
      CHART_COLORS: {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
      },
      delayed: true,
      year: moment().format('YYYY'),
      barChartData: {
        labels: [
          'Jan', 'Feb', 'Mar', 'Apr',
          'May', 'Jun', 'Jul', 'Aug',
          'Sep', 'Oct', 'Nov', 'Dec',
        ],
        datasets: [
          {
            label: 'This year',
            data: [], //ここにデータを入れる (Array of numbers)
            backgroundColor: 'rgb(255, 99, 132)',
          },
          {
            label: 'Last year',
            data: [], //ここにデータを入れる (Array of numbers)
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
          },
        ]
      },
      barChartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Appointments'
          }
        },
        animation: {
          onComplete: () => {
            this.delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !this.delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        },
      },
      doughnutChartData: {
        labels: [],
        datasets: [
          {
            label: 'This year',
            data: [], //ここにデータを入れる (Array of numbers)
            backgroundColor: Object.values({
              red: 'rgb(255, 99, 132)',
              orange: 'rgb(255, 159, 64)',
              yellow: 'rgb(255, 205, 86)',
              green: 'rgb(75, 192, 192)',
              blue: 'rgb(54, 162, 235)',
              purple: 'rgb(153, 102, 255)',
              grey: 'rgb(201, 203, 207)'
            })
          }
        ]
      },
      doughnutChartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Menus'
          }
        },
        animation: {
          onComplete: () => {
            this.delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !this.delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        },
      },
    }
  },
  watch: {
    year() {
      this.getMonthlyReport();
    }
  },
  mounted() {
    this.getMonthlyReport();
  },
  methods: {
    increaseYear() {
      this.year++;
    },
    decreaseYear() {
      this.year--;
    },
    getMonthlyReport() {
      axios.post('/monthly-report.json', {"year": this.year})
      .then((res)=> {
        let appointments = res.data['events']
        let menus = res.data['menus']
        this.barChartData.datasets[0].data = appointments[0];
        this.barChartData.datasets[1].data = appointments[1];
        let currentMenuKeys = Object.keys(menus)
        let currentMenuValues = Object.values(menus)
        this.doughnutChartData.labels = currentMenuKeys;
        this.doughnutChartData.datasets[0].data = currentMenuValues;
      })
    },
  },
}
</script>

<style>
</style>