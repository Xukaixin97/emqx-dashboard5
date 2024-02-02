import { BridgeType } from '@/types/enum'
import { computed, ComputedRef, WritableComputedRef } from 'vue'
import { isConnectorSupported } from './useBridgeTypeValue'
import useSyncConfiguration from './useSyncConfiguration'

export const resourceOptFields = [
  'start_timeout',
  'worker_pool_size',
  'request_ttl',
  'health_check_interval',
  'auto_restart_interval',
  'max_buffer_bytes',
  'batch_size',
  'batch_time',
  'query_mode',
  'inflight_window',
].map((item) => `resource_opts.${item}`)

type PropsType = Readonly<{
  modelValue: Record<string, any>
  type?: string
  edit?: boolean
  copy?: boolean
  isLoading?: boolean
  readonly?: boolean
  disabled?: boolean
  hideName?: boolean
  formProps?: Record<string, any>
  hiddenFields?: string[]
  isUsingInFlow?: boolean
}>

/**
 * props order and class name
 */
export default (
  props: PropsType,
  bridgeRecord: WritableComputedRef<Record<string, any>>,
): {
  propsOrderMap: ComputedRef<Record<string, number>>
  customColClass: ComputedRef<Record<string, string>>
  advancedFields: ComputedRef<Array<string>>
} => {
  const createOrderObj = (keyArr: Array<string>, beginning: number) =>
    keyArr.reduce((obj, key, index) => ({ ...obj, [key]: index + beginning }), {})

  const getPathInParameters = (key: string) => `parameters.${key}`
  const getPathArrInParameters = (keyArr: Array<string>): Array<string> =>
    keyArr.map(getPathInParameters)

  const commonAdvancedFields = [
    'pool_type',
    'pool_size',
    'connect_timeout',
    'max_retries',
    'parameters.max_retries',
    ...resourceOptFields,
  ]

  const baseFields = ['name', 'connector', 'description']
  const fieldStartIndex = baseFields.length
  const baseOrderMap = {
    ...createOrderObj(baseFields, 0),
    ...createOrderObj(commonAdvancedFields, 99),
  }

  const httpAdvancedFields = [`parameters.max_retries`]

  const pgSqlOrderMap = createOrderObj(
    ['parameters.sql', 'parameters.prepare_statement'],
    fieldStartIndex,
  )

  const kafkaProducerAdvancedProps = getPathArrInParameters([
    'max_batch_bytes',
    'required_acks',
    'partition_count_refresh_interval',
    'max_inflight',
    'query_mode',
    'sync_query_timeout',
    'buffer',
    'buffer.mode',
    'buffer.per_partition_limit',
    'buffer.segment_bytes',
    'buffer.memory_overload_protection',
  ])

  const kafkaProducerPropsOrderMap = {
    ...createOrderObj(
      getPathArrInParameters([
        'topic',
        'kafka_headers',
        'kafka_header_value_encode_mode',
        'kafka_ext_headers',
        'message',
        'message.key',
        'message.value',
        'message.timestamp',
        'compression',
        'partition_strategy',
        'partitions_limit',
      ]),
      fieldStartIndex,
    ),
    ...createOrderObj(kafkaProducerAdvancedProps, 70),
  }
  const propsOrderTypeMap: Record<string, Record<string, number>> = {
    [BridgeType.Webhook]: {
      ...createOrderObj(
        getPathArrInParameters(['path', 'method', 'headers', 'body']),
        fieldStartIndex,
      ),
      ...createOrderObj(httpAdvancedFields, 70),
    },
    [BridgeType.MQTT]: createOrderObj(
      getPathArrInParameters(['topic', 'qos', 'retain', 'payload']),
      fieldStartIndex,
    ),
    [BridgeType.MySQL]: createOrderObj(['sql'], fieldStartIndex),
    [BridgeType.Redis]: createOrderObj(['command_template'], fieldStartIndex),
    [BridgeType.GCPProducer]: createOrderObj(
      getPathArrInParameters([
        'pubsub_topic',
        'payload_template',
        'attributes_template',
        'ordering_key_template',
      ]),
      fieldStartIndex,
    ),
    [BridgeType.GCPConsumer]: createOrderObj(
      [
        'pubsub_topic',
        'pipelining',
        'service_account_json',
        'payload_template',
        'attributes_template',
        'ordering_key_template',
        'consumer.topic_mapping',
        'consumer.pull_max_messages',
      ],
      fieldStartIndex,
    ),
    [BridgeType.MongoDB]: createOrderObj(['collection', 'payload_template'], fieldStartIndex),
    [BridgeType.PgSQL]: pgSqlOrderMap,
    [BridgeType.TimescaleDB]: pgSqlOrderMap,
    [BridgeType.MatrixDB]: pgSqlOrderMap,
    [BridgeType.ClickHouse]: createOrderObj(
      ['url', 'database', 'username', 'password', 'batch_value_separator', 'sql'],
      fieldStartIndex,
    ),
    [BridgeType.DynamoDB]: createOrderObj(
      ['url', 'aws_access_key_id', 'aws_secret_access_key', 'table', 'template'],
      fieldStartIndex,
    ),
    [BridgeType.RocketMQ]: createOrderObj(
      [
        'servers',
        'access_key',
        'secret_key',
        'security_token',
        'topic',
        'refresh_interval',
        'send_buffer',
        'template',
      ],
      fieldStartIndex,
    ),
    [BridgeType.MicrosoftSQLServer]: createOrderObj(
      ['server', 'database', 'username', 'password', 'driver', 'sql'],
      fieldStartIndex,
    ),
    [BridgeType.IoTDB]: createOrderObj(
      ['device_id', 'is_aligned', 'data'].map((k) => `parameters.${k}`),
      fieldStartIndex,
    ),
    [BridgeType.OpenTSDB]: createOrderObj(['server', 'summary', 'details'], fieldStartIndex),
    [BridgeType.OracleDatabase]: createOrderObj(
      ['server', 'service_name', 'sid', 'username', 'password', 'sql'],
      fieldStartIndex,
    ),
    [BridgeType.RabbitMQ]: createOrderObj(
      getPathArrInParameters([
        'exchange',
        'routing_key',
        'delivery_mode',
        'wait_for_publish_confirmations',
        'publish_confirmation_timeout',
        'payload_template',
      ]),
      fieldStartIndex,
    ),
    [BridgeType.HStream]: createOrderObj(
      ['url', 'stream', 'partition_key', 'grpc_timeout', 'ssl', 'record_template'],
      fieldStartIndex,
    ),
    [BridgeType.KafkaProducer]: kafkaProducerPropsOrderMap,
    [BridgeType.AzureEventHubs]: kafkaProducerPropsOrderMap,
    [BridgeType.Confluent]: kafkaProducerPropsOrderMap,
    [BridgeType.AmazonKinesis]: createOrderObj(
      getPathArrInParameters(['stream_name', 'partition_key', 'payload_template']),
      fieldStartIndex,
    ),
    [BridgeType.GreptimeDB]: createOrderObj(
      getPathArrInParameters(['write_syntax', 'precision']),
      fieldStartIndex,
    ),
    [BridgeType.SysKeeperForwarder]: createOrderObj(
      getPathArrInParameters(['target_topic', 'target_qos', 'template']),
      fieldStartIndex,
    ),
    [BridgeType.Elasticsearch]: createOrderObj(
      ['index', 'id', 'doc_as_upsert', 'doc', 'routing', 'overwrite', 'max_retries'],
      fieldStartIndex,
    ),
    [BridgeType.TDengine]: createOrderObj(
      getPathArrInParameters(['database', 'sql']),
      fieldStartIndex,
    ),
  }

  const propsOrderMap = computed(() => {
    let ret = baseOrderMap
    if (props.type && props.type in propsOrderTypeMap) {
      ret = { ...ret, ...propsOrderTypeMap[props.type] }
    }
    return ret
  })

  const kafkaProducerColClassMap = { 'parameters.topic': 'col-need-row' }
  const typeColClassMap: Record<string, Record<string, string>> = {
    [BridgeType.GCPProducer]: { pubsub_topic: 'col-need-row' },
    [BridgeType.GCPConsumer]: {
      pubsub_topic: 'col-need-row',
      service_account_json: 'custom-col-24',
    },
    [BridgeType.ClickHouse]: {
      username: 'dividing-line-below',
    },
    [BridgeType.DynamoDB]: {
      aws_secret_access_key: 'dividing-line-below',
    },
    [BridgeType.RocketMQ]: {
      topic: 'dividing-line-below',
    },
    [BridgeType.MicrosoftSQLServer]: {
      driver: 'dividing-line-below',
    },
    [BridgeType.KafkaProducer]: kafkaProducerColClassMap,
    [BridgeType.AzureEventHubs]: kafkaProducerColClassMap,
    [BridgeType.Confluent]: kafkaProducerColClassMap,
    [BridgeType.Elasticsearch]: { 'parameters.action': 'col-hidden' },
  }

  const advancedFieldsMap: Record<string, Array<string>> = {
    [BridgeType.Webhook]: [`parameters.max_retries`],
    [BridgeType.RocketMQ]: ['refresh_interval', 'send_buffer', 'sync_timeout'],
    [BridgeType.RabbitMQ]: ['parameters.publish_confirmation_timeout'],
    [BridgeType.ClickHouse]: ['batch_value_separator'],
    [BridgeType.GreptimeDB]: ['precision'],
    [BridgeType.GCPConsumer]: ['pipelining'],
    [BridgeType.KafkaProducer]: kafkaProducerAdvancedProps,
    [BridgeType.AzureEventHubs]: kafkaProducerAdvancedProps,
    [BridgeType.Confluent]: kafkaProducerAdvancedProps,
  }

  const advancedFields = computed(() => {
    const externalFields = props.type ? advancedFieldsMap[props.type] || [] : []
    return [...commonAdvancedFields, ...externalFields]
  })

  const singleFieldWithLineBelow = 'dividing-line-below col-need-row'
  const getFirstRowClass = () => {
    let connectorClass = ''
    let nameClass = ''
    let descClass = ''
    if (isConnectorSupported(props.type as BridgeType)) {
      if (props.hideName) {
        connectorClass = 'dividing-line-below'
        nameClass = 'col-hidden'
      } else {
        descClass = singleFieldWithLineBelow
      }
    } else {
      nameClass = props.hideName ? 'col-hidden' : singleFieldWithLineBelow
      descClass = 'col-hidden'
    }
    return { nameClass, connectorClass, descClass }
  }

  const { syncEtcFieldsClassMap } = useSyncConfiguration(bridgeRecord)
  const customColClass = computed(() => {
    const externalClass = props.type ? typeColClassMap[props.type] || {} : {}
    const { nameClass, connectorClass, descClass } = getFirstRowClass()
    return {
      ...syncEtcFieldsClassMap.value,
      name: nameClass,
      connector: connectorClass,
      description: descClass,
      direction: 'col-hidden',
      type: 'col-hidden',
      enable: 'col-hidden',
      local_topic: 'col-hidden',
      ssl: 'col-ssl col-need-row dividing-line-below',
      ...externalClass,
    }
  })

  return {
    propsOrderMap,
    customColClass,
    advancedFields,
  }
}
