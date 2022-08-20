<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="card-group">
          <div class="card text-bg-light mb-3">
            <div class="card-header">Users</div>
            <div class="card-body">
              <p class="card-text">{{ usersTotal }}</p>
            </div>
          </div>
          <div class="card text-bg-light mb-3">
            <div class="card-header">Avarage spent</div>
            <div class="card-body">
              <p class="card-text">{{ usersTotal }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="card col-12">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <DoughnutChart
                :chartData="doughnutChartData"
                :chartOptions="doughnutChartOptions"
              />
            </div>
            <div class="col-md-4">
              <DoughnutChart
                :chartData="genderDoughnutChartData"
                :chartOptions="genderDoughnutChartOptions"
              />
            </div>
            <hr class="hr-space-devider">
            <div class="col-md-6">
              <div>
                  <form action="">
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text">Year</span>
                    <input type="text" v-model="year" class="form-control">
                    <div class="btn-group" role="group">
                      <button @click="decreaseYear()" type="button" class="btn btn-outline-secondary btn-sm">{{"<"}}</button>
                      <button @click="increaseYear()" type="button" class="btn btn-outline-secondary btn-sm">{{">"}}</button>
                    </div>
                  </div>
              </form>
                </div>
              <BarChart
                :chartData="barChartData"
                :chartOptions="barChartOptions"
                :type="type"
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
      usersTotal: 0,
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
      type: "bar",
      barChartData: {
        labels: [
          'Jan', 'Feb', 'Mar', 'Apr',
          'May', 'Jun', 'Jul', 'Aug',
          'Sep', 'Oct', 'Nov', 'Dec',
        ],
        datasets: [
          {
            type: 'bar',
            label: 'This year',
            data: [], //ここにデータを入れる (Array of numbers)
            backgroundColor: 'rgb(255, 99, 132)',
          },
          {
            type: 'line',
            label: 'Last year',
            data: [], //ここにデータを入れる (Array of numbers)
            // backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            fill: false
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
            stacked: true,
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
      },
      genderDoughnutChartData: {
        labels: [],
        datasets: [
          {
            label: 'This year',
            data: [1], //ここにデータを入れる (Array of numbers)
            backgroundColor: Object.values({
              green: 'rgb(75, 192, 192)',
              blue: 'rgb(54, 162, 235)',
              purple: 'rgb(153, 102, 255)',
              grey: 'rgb(201, 203, 207)',
              red: 'rgb(255, 99, 132)',
              orange: 'rgb(255, 159, 64)',
              yellow: 'rgb(255, 205, 86)',
            })
          }
        ]
      },
      genderDoughnutChartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Gender'
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
      },
    }
  },
  watch: {
    year() {
      this.getYearlyStatics();
    }
  },
  mounted() {
    this.getYearlyStatics();
    this.getAllTimeUsersStatics();
  },
  methods: {
    increaseYear() {
      this.year++;
    },
    decreaseYear() {
      this.year--;
    },
    getYearlyStatics() {
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
    getAllTimeUsersStatics() {
      axios.post('/users-statics.json')
      .then((res)=> {
        let usersStatics = res.data;
        this.usersTotal = usersStatics[0];
        this.genderDoughnutChartData.labels = Object.keys(usersStatics[1])
        this.genderDoughnutChartData.datasets[0].data = Object.values(usersStatics[1]);
      })
    },
  },
}
</script>

<style scoped>
  .hr-space-devider {
    margin-top: 16px;
  }
</style>