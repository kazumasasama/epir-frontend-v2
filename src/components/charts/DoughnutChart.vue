<template>
  <Doughnut
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  components: {
    Doughnut,
  },
  props: {
    chartData: {
      type: Object,
    },
    chartOptions: {
      type: Object,
    },
    chartId: {
      type: String,
      default: 'doughnut-chart'
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      
    }
  },
  created() {
  },
  methods: {
  },
}
</script>

<style scoped>
</style>