<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
    :type="type"
  />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartData: {
      type: Object,
    },
    chartOptions: {
      type: Object,
    },
    chartId: {
      type: String,
    },
    datasetIdKey: {
      type: String,
    },
    type: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number
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
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  }
}
</script>
