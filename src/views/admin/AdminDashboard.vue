<template>
  <div class="vld-parent">
    <loading v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
      color="rgb(140, 146, 232)"
      loader="dots"
      height="100"
      width="150"
      opacity="0.7"
    >
      <template v-slot:after>
        <p class="spinner-after">Loading</p>
      </template>
    </loading>
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
            <!-- <div class="row">
              <div class="col-md-4">
                <DoughnutChart
                  :chartData="genderDoughnutChartData"
                  :chartOptions="genderDoughnutChartOptions"
                />
              </div>
            </div>
            <hr class="hr-space-devider"> -->
            <div class="col-md-6">
              <form action="">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text">Year</span>
                  <input type="text" v-model="currentYear" class="form-control">
                  <div class="btn-group" role="group">
                    <button @click="decreaseYear()" type="button" class="btn btn-outline-secondary btn-sm">{{"<"}}</button>
                    <button @click="increaseYear()" type="button" class="btn btn-outline-secondary btn-sm">{{">"}}</button>
                  </div>
                </div>
              </form>
            </div>
            <div class="row">
              <div class="col-md-8">
                <BarChart
                  :chartData="barChartData"
                  :chartOptions="barChartOptions"
                  :height="barChartHeight"
                  type="bar"
                />
              </div>
              <div class="col-md-4">
                <div class="card-group">
                  <div class="card text-bg-light mb-3">
                    <div class="card-header">{{ currentYear }}</div>
                    <div class="card-body">
                      <p class="card-text">{{ currentAppointmentTotal }}</p>
                    </div>
                  </div>
                  <div class="card text-bg-light mb-3">
                    <div class="card-header">{{ currentYear - 1 }}</div>
                    <div class="card-body">
                      <p class="card-text">{{ prevAppointmentTotal }}</p>
                    </div>
                  </div>
                </div>
                <DoughnutChart
                  :chartData="doughnutChartData"
                  :chartOptions="doughnutChartOptions"
                />
              </div>
            </div>
            <hr class="hr-space-devider">
            <div class="row">
              <div class="col-md-8">
                <BarChart
                  :chartData="salesBarChartData"
                  :chartOptions="salesBarChartOptions"
                  :height="barChartHeight"
                  type="bar"
                />
              </div>
              <div class="col-md-4">
                <div class="card-group">
                  <div class="card text-bg-light mb-3">
                    <div class="card-header">{{ currentYear }}</div>
                    <div class="card-body">
                      <p class="card-text">${{ currentSalesTotal }}</p>
                    </div>
                  </div>
                  <div class="card text-bg-light mb-3">
                    <div class="card-header">{{ currentYear - 1 }}</div>
                    <div class="card-body">
                      <p class="card-text">${{ prevSalesTotal }}</p>
                    </div>
                  </div>
                </div>
                <DoughnutChart
                  :chartData="salesByMenuDoughnutChartData"
                  :chartOptions="salesByMenuDoughnutChartOptions"
                />
              </div>
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

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  components: {
    BarChart,
    DoughnutChart,
    Loading,
},
  data () {
    return {
      // spinner
      isLoading: false,
      fullPage: true,

      // statics
      usersTotal: 0,
      currentAppointmentTotal: 0,
      prevAppointmentTotal: 0,
      currentSalesTotal: 0,
      prevSalesTotal: 0,

      // charts
      barChartHeight: 200,
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
      currentYear: moment().format('YYYY'),
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
      },
      salesBarChartData: {
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
          },
          // {
          //   type: 'line',
          //   label: 'Last year',
          //   data: [], //ここにデータを入れる (Array of numbers)
          //   backgroundColor: 'rgb(54, 162, 235)',
          //   borderColor: 'rgb(54, 162, 235)',
          //   fill: false
          // },
        ]
      },
      salesBarChartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Sales'
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
            text: 'Appointments by Menu'
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
      salesByMenuDoughnutChartData: {
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
      salesByMenuDoughnutChartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Sales by Menu ($)'
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
    currentYear() {
      this.getYearlyStatics();
    }
  },
  created() {
    this.isLoading = true;
    this.getYearlyStatics();
    this.getAllTimeUsersStatics();
  },
  mounted() {
    this.$nextTick(function() {
      this.isLoading = false;
    })
  },
  methods: {
    increaseYear() {
      this.currentYear++;
    },
    decreaseYear() {
      this.currentYear--;
    },
    getYearlyStatics() {
      this.isLoading = true;
      axios.post('/monthly-report.json', {"year": this.currentYear})
      .then((res)=> {
        // appointments
        let appointments = res.data['events']
        this.barChartData.datasets[0].data = appointments['currentMonthlyEvents'];
        this.barChartData.datasets[1].data = appointments['prevYearEvents'];
        this.currentAppointmentTotal = appointments['currentMonthlyEventsSum']
        this.prevAppointmentTotal = appointments['prevYearEventsSum']

        // menus
        let menus = res.data['menus']
        let currentMenuKeys = Object.keys(menus['currentMenus'])
        let currentMenuValues = Object.values(menus['currentMenus'])
        let menuLabelRatio = []
        let totalMenus = currentMenuValues.reduce((sum, element)=> {
          return sum + element;
        },0);
        for (let i = 0; i < currentMenuValues.length; i++) {
          menuLabelRatio.push(`${currentMenuKeys[i]} ${Math.floor((currentMenuValues[i] / totalMenus) * 100)}%`)
        }
        this.doughnutChartData.labels = menuLabelRatio;
        this.doughnutChartData.datasets[0].data = currentMenuValues;

        let currentTotalPriceByMenu = menus['currentTotalPriceByMenu']
        let currentSalesMenuKeys = Object.keys(currentTotalPriceByMenu)
        let currentSalesMenuValues = Object.values(currentTotalPriceByMenu)
        let salesMenuLabelRatio = []
        let salesTotalMenus = currentSalesMenuValues.map((value) => Math.floor(value)).reduce((sum, element)=> {
          return sum + element;
        },0);
        for (let i = 0; i < currentSalesMenuValues.length; i++) {
          salesMenuLabelRatio.push(`${currentSalesMenuKeys[i]} ${Math.floor((currentSalesMenuValues[i] / salesTotalMenus) * 100)}%`)
        }
        this.salesByMenuDoughnutChartData.labels = salesMenuLabelRatio;
        this.salesByMenuDoughnutChartData.datasets[0].data = currentSalesMenuValues;

        // sales
        let sales = res.data['sales']
        this.salesBarChartData.datasets[0].data = sales['currentMonthlySales'];
        this.salesBarChartData.datasets[1].data = sales['prevSalesMonthly'];
        this.currentSalesTotal = sales['currentMonthlySalesSum'];
        this.prevSalesTotal = sales['prevSalesMonthlySum'];
      })
      .then(()=> {
        this.isLoading = false;
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
  .card-header {
    font-size: small;
  }
</style>