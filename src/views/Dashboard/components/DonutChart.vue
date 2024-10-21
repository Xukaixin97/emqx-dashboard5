<template>
  <div ref="chartEl" class="donut-chart"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DonutChart',
})
</script>

<script lang="ts" setup>
import { defineProps, ref, watch, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import useI18nTl from '@/hooks/useI18nTl'
import * as echarts from 'echarts/lib/echarts'
import { ECharts, EChartsOption, LineSeriesOption } from 'echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/legend'
import useEchartResize from '@/hooks/useEchartResize'

const store = useStore()
const { tl } = useI18nTl('Dashboard')


const props = defineProps({
  value: {
    type: Array,
    default: () => [],
    required: false,
  },
})

const chartEl = ref()
let chartInstance: ECharts | null = null

const option: EChartsOption = reactive({
  color: ['#f0f1f3', '#0B9541',],
  tooltip: {
    trigger: 'item'
  },
  legend: {
    show: false,
  },
  series: [

  ]
})

watch(
  () => JSON.stringify(props.value),
  () => {
    setSeriesConfig()
  },
)

watch(
  () => store.state.leftBarCollapse,
  () => {
    setTimeout(setSeriesConfig, 500)
  },
)

const { addListener, removeListener } = useEchartResize()
const setSeriesConfig = async () => {

  // const total = String(Number(props.value[0].value) - Number(props.value[1].value))
  console.log('___________________g', props.value[1], props.value[0] - props.value[1])

  option.series = [
    {
      name: '',
      type: 'pie',
      // radius: ['40%', '70%'],
      radius: ['40%', '90%'], // 内半径为 0%，外半径为 100%
      center: ['50%', '50%'], // 饼图居中
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        disable: true
        // label: {
        //   show: false,
        //   fontSize: 12,
        //   fontWeight: 'bold'
        // }
      },
      labelLine: {
        show: false
      },
      selectedMode: false, // 禁用选中功能
      data: [
        { value: props.value[0] - props.value[1], name: tl('allConnections') },

        { value: props.value[1], name: tl('liveConnections') },
      ],
    },
  ] as Array<LineSeriesOption>
  chartInstance?.setOption({ ...option })
}

const initChart = async () => {
  if (chartInstance) {
    removeListener()
    chartInstance.dispose()
  }
  let Dom = chartEl.value
  if (!Dom) return
  chartInstance = echarts.init(Dom)
  addListener(chartInstance as ECharts)
}

onMounted(() => {
  initChart()
  setSeriesConfig()
})
</script>

<style lang="scss"></style>
