import uniqueId from '@form-create/utils/lib/unique.js'
import { makeRequiredRule } from '../../utils'
import { INumberProps, INumberRule } from '../../types/config/index'

const label = '计数器'
const name = 'inputNumber'

export default {
  icon: 'icon-number',
  label,
  name,
  rule(): INumberRule {
    return {
      type: name,
      field: uniqueId(),
      title: label,
      info: '',
      props: {},
      effect: {
        required: false
      }
    }
  },
  props(): INumberProps[] {
    return [
      makeRequiredRule(),
      { type: 'inputNumber', field: 'min', title: '设置计数器允许的最小值' },
      {
        type: 'inputNumber',
        field: 'max',
        title: '设置计数器允许的最大值'
      },
      { type: 'inputNumber', field: 'step', title: '计数器步长' },
      {
        type: 'switch',
        field: 'stepStrictly',
        title: '是否只能输入 step 的倍数'
      },
      { type: 'switch', field: 'disabled', title: '是否禁用计数器' },
      {
        type: 'switch',
        field: 'controls',
        title: '是否使用控制按钮',
        value: true
      },
      {
        type: 'select',
        field: 'controlsPosition',
        title: '控制按钮位置',
        options: [
          { label: 'default', value: 'default' },
          { label: 'right', value: 'right' }
        ]
      },
      { type: 'input', field: 'placeholder', title: '输入框默认 placeholder' }
    ]
  }
}
