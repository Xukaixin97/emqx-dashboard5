<template>
  <div class="overview app-wrapper">
    <el-row class="block" :gutter="26">
      <el-col :span="8">
        <el-row :gutter="24">
          <el-col :span="24" class="main-info-item">
            <el-card class="with-multiple-counts">
              <div class="multiple-counts-wrap">
                <DonutChart type="pie" :value="[currentMetrics.connections, currentMetrics.live_connections]" />
                <div class="multiple-counts-legend">
                  <div>
                    <router-link class="no-img" :to="{ name: 'clients', query: { conn_state: 'connected' } }"
                      :style="{ paddingTop: '0' }">
                      <i class="node-status-dot is-running" :style="{
      background: '#f0f1f3',
    }"></i>
                      <p>{{ $t('Dashboard.allConnections') }}</p>
                    </router-link>
                    <div class="num">{{ _formatNumber(currentMetrics.connections) }}</div>
                  </div>
                  <div>
                    <router-link class="no-img" :to="{ name: 'clients', query: { conn_state: 'connected' } }"
                      :style="{ paddingTop: '0' }">
                      <i class="node-status-dot is-running"></i>
                      <p>{{ $t('Dashboard.liveConnections') }}</p>
                    </router-link>
                    <div class="num">
                      {{ _formatNumber(currentMetrics.live_connections) }}
                    </div>
                  </div>

                </div>

                <!-- <div>
                  <router-link :to="{ name: 'clients' }">
                    <div class="img-container">
                      <img src="@/assets/img/connections.png" width="40" height="40" alt="clients" />
                    </div>
                    <p>{{ $t('Dashboard.allConnections') }}</p>
                  </router-link>
                  <div class="num">{{ _formatNumber(currentMetrics.connections) }}</div>
                </div>
                <div>
                  <router-link class="no-img" :to="{ name: 'clients', query: { conn_state: 'connected' } }">
                    <i class="node-status-dot is-running"></i>
                    <p>{{ $t('Dashboard.liveConnections') }}</p>
                  </router-link>
                  <div class="num">
                    {{ _formatNumber(currentMetrics.live_connections) }}
                  </div>
                </div> -->

              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-card class="rate-card">
          <!-- <el-radio-group class="rate-type-radio" v-model="rateType" size="small">
            <el-radio-button label="byte" />
            <el-radio-button label="msg"> {{ $t('Dashboard.messageNumber') }} </el-radio-button>
          </el-radio-group> -->
          <template v-if="rateType === 'msg'">
            <div class="rate-item">
              <div class="rate-item-title">
                <div class="rate-item-legned-pub"></div>
                <div>
                  <label class="rate-label">{{ $t('Dashboard.currentMessageInRate') }}</label>
                  <span class="unit">
                    {{ $t('Dashboard.strip', { n: currentMetrics.received_msg_rate }) }}/{{
      $t('Dashboard.second')
    }}
                  </span>
                </div>
                <div class="rate-item-legned-sub"></div>
                <div>
                  <label class="rate-label">{{ $t('Dashboard.currentMessageOutRate') }}</label>
                  <span class="unit">
                    {{ $t('Dashboard.strip', { n: currentMetrics.sent_msg_rate }) }}/{{
      $t('Dashboard.second')
    }}
                  </span>
                </div>
              </div>

              <div class="line-wrapper">
                <RateChartMult type="line"
                  :value="[currentMetricsLogs.received_msg_rate, currentMetricsLogs.sent_msg_rate]" />
              </div>
            </div>
            <!-- <div class="rate-item">
              <div>
                <label class="rate-label">{{ $t('Dashboard.currentMessageOutRate') }}</label>
                <span class="unit">
                  {{ $t('Dashboard.strip', { n: currentMetrics.sent_msg_rate }) }}/{{
                    $t('Dashboard.second')
                  }}
                </span>
              </div>
              <div class="line-wrapper">
                <rate-chart :value="currentMetricsLogs.sent_msg_rate" type="line" color="#0B9541" />
              </div>
            </div> -->
          </template>
          <template v-else>
            <div class="rate-item">
              <div>
                <label class="rate-label">{{ $t('Dashboard.currentMessageInRate') }}</label>
                <span>{{ _formatNumber(currentMetrics.received_bytes_rate) }}</span>
                <span class="unit">{{ $t('Dashboard.byte') }}/{{ $t('Dashboard.second') }}</span>
              </div>
              <div class="line-wrapper">
                <rate-chart :value="currentMetricsLogs.received_bytes_rate" type="bar" color="#3D7FF9" />
              </div>
            </div>
            <div class="rate-item">
              <div>
                <label class="rate-label">{{ $t('Dashboard.currentMessageOutRate') }}</label>
                <span>{{ _formatNumber(currentMetrics.sent_bytes_rate) }}</span>
                <span class="unit">{{ $t('Dashboard.byte') }}/{{ $t('Dashboard.second') }}</span>
              </div>
              <div class="line-wrapper">
                <rate-chart :value="currentMetricsLogs.sent_bytes_rate" type="bar" color="#0B9541" />
              </div>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col :span="4" class="main-info-item">
        <el-card>
          <div :style="{
      textAlign: 'center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }">
            <router-link :to="{ name: 'topics' }">
              <!-- <div class="img-container">
                    <img src="@/assets/img/topics.png" width="40" height="40" alt="topics" />
                  </div> -->
              <p>{{ $t('Dashboard.topics') }}</p>
            </router-link>
            <div class="num">{{ _formatNumber(currentMetrics.topics) }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" class="main-info-item">
        <el-card>
          <div :style="{
      textAlign: 'center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }">
            <router-link :to="{ name: 'subscription' }">
              <!-- <div class="img-container">
                    <img src="@/assets/img/subs.png" width="40" height="40" alt="subs" />
                  </div> -->
              <p>{{ $t('Dashboard.subscriptionNumber') }}</p>
            </router-link>
            <div class="num">{{ _formatNumber(currentMetrics.subscriptions) }}</div>
          </div>
        </el-card>
      </el-col>

    </el-row>
    <el-card class="cluster-card block allow-overflow">
      <NodesGraphCard />
    </el-card>
    <polyline-cards></polyline-cards>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Overview',
})
</script>

<script setup lang="ts">
import { ref, reactive, Ref } from 'vue'
import RateChart from './components/RateChart.vue'
import DonutChart from './components/DonutChart.vue'
import RateChartMult from './components/RateChartMult.vue'
import PolylineCards from './components/PolylineCards.vue'
import NodesGraphCard from './components/NodesGraphCard.vue'
import Moment from 'moment'
import { loadCurrentMetrics } from '@/api/common'
import { formatNumber } from '@/common/tools'
import useSyncPolling from '@/hooks/useSyncPolling'

interface MetricData {
  x: Array<string>
  y: Array<number>
}

const POLLING_INTERVAL = 2000

const createEmptyDataItem = (length: number) => ({
  x: new Array(length).fill(undefined),
  y: new Array(length).fill(undefined),
})

const currentMetricsLogs: Record<string, MetricData> = reactive({
  received_msg_rate: createEmptyDataItem(32),
  sent_msg_rate: createEmptyDataItem(32),
  received_bytes_rate: createEmptyDataItem(32),
  sent_bytes_rate: createEmptyDataItem(32),
})
const currentMetrics: Ref<Record<string, number>> = ref({
  node: 0, // Nodes number
  received_msg_rate: 0, // Incoming Rate
  sent_msg_rate: 0, // Outgoing Rate
  received_bytes_rate: 0, // Incoming Bytes Rate
  sent_bytes_rate: 0, // Outgoing Bytes Rate
  subscriptions: 0, // Subs number
  connections: 0, // Connections number
  topics: 0, // Topics
  live_connections: 0, // Live Connections
})

const rateType = ref<'msg' | 'byte'>('msg')

const _formatNumber = (num: number) => (num === undefined ? 0 : formatNumber(num))
const { syncPolling } = useSyncPolling()

const loadData = async () => {
  const state = await loadCurrentMetrics()
  if (!state) {
    return
  }
  currentMetrics.value = state
  setCurrentMetricsLogsRealtime(state)
}

const getNow = () => {
  return Moment().format('HH:mm:ss')
}
const setCurrentMetricsLogsRealtime = (state: Record<string, number> = {}) => {
  ;['received_msg_rate', 'sent_msg_rate', 'received_bytes_rate', 'sent_bytes_rate'].forEach(
    (key) => {
      currentMetricsLogs[key] = currentMetricsLogs[key] || {
        x: [],
        y: [],
      }
      const currentValue = state[key] || 0
      currentMetricsLogs[key].x.push(getNow())

      currentMetricsLogs[key].y.push(currentValue)
      if (currentMetricsLogs[key].x.length >= 16) {
        currentMetricsLogs[key].x.shift()
        currentMetricsLogs[key].y.shift()
      }
    },
  )
}

syncPolling(loadData, POLLING_INTERVAL)
</script>

<style lang="scss">
.overview {
  .block {
    margin-top: 14px;
    margin-bottom: 28px;
  }

  .main-info-item {
    height: 195px;

    .el-card {
      height: 100%;

      &.with-multiple-counts {
        .el-card__body {
          // padding-left: 28px;
          padding-left: 0;
          padding-top: 0;
          padding: 0;
        }

      }
    }

    .el-card__body {
      padding-top: 36px;
      padding-left: 32px;
    }

    .multiple-counts-wrap {
      display: flex;
      width: 100%;

      // justify-content: space-around;
      div:not(:last-child) {
        margin-right: 48px;
      }

      .donut-chart {
        box-sizing: border-box;
        height: 180px;
        width: 180px;
        margin-top: 8px;
        margin-left: 60px;
      }

      .multiple-counts-legend {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }

    a {
      display: block;
      font-size: 16px;
      color: var(--color-text-secondary);
      transition: none;

      &:hover {
        color: var(--color-primary);

        img {
          filter: saturate(65%) contrast(135%);
        }
      }

      .img-container {
        line-height: 0;
      }

      &.no-img {
        // img size
        padding-top: 40px;
        // by the way
        display: flex;
        align-items: center;
      }
    }

    .node-status-dot {
      margin-right: 4px;
    }

    .num {
      color: var(--color-title-primary);
      font-size: 24px;
    }
  }

  .rate-card {
    height: 195px;

    .el-card__body {
      height: 100%;

      .rate-item {
        height: 100%;
        margin-bottom: 8px;

        .rate-item-title {
          display: flex;
          // justify-content: space-between;
          // gap: 32px;
          align-items: center;
          margin-bottom: 16px;

          .rate-item-legned-pub {
            width: 10px;
            height: 10px;
            border-radius: 2px;
            background-color: #3D7FF9;
            margin-right: 8px
          }

          .rate-item-legned-sub {
            width: 10px;
            height: 10px;
            border-radius: 2px;
            background-color: #88a56c;
            margin-right: 8px;
            margin-left: 32px
          }
        }
      }
    }

    .rate-label {
      color: var(--color-text-secondary);
      padding-right: 0px;
    }

    span {
      color: var(--color-text-primary);
    }

    .line-wrapper {
      width: 100%;
      box-sizing: border-box;
      margin: 16px 0;

      .rate-chart {
        box-sizing: border-box;
        height: 120px;
      }
    }

    .rate-type-radio {
      position: absolute;
      right: 10px;
      top: 16px;
    }
  }

  .cluster-card {
    border: none;
    border-radius: 8px;

    .el-card__body {
      padding: 0px;
    }
  }
}
</style>
