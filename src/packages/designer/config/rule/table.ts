import uniqueId from '@form-create/utils/lib/unique.js'
import { ITableProps, ITableRule } from '../../types/config/index'

const label = '表格'
const name = 'group-table'

export default {
  icon: 'icon-tab',
  label,
  name,
  drag: true,
  rule(): ITableRule {
    return {
      class: 'group-table',
      realType: 'group-table',
      type: 'div',
      field: uniqueId(),
      title: label,
      props: {},
      children: []
    }
  },
  props(): ITableProps[] {
    return [
      {
        type: 'input',
        field: 'rowKey',
        title: '表格行 key 的取值',
        value: 'key'
      },
      { type: 'switch', field: 'bordered', title: '是否展示外边框和列边框' },
      {
        type: 'switch',
        field: 'showHeader',
        title: '是否显示表头',
        value: true
      },
      {
        type: 'switch',
        field: 'formCreateNative',
        title: '是否不显示FormItem',
        value: false
      },
      {
        type: 'select',
        field: 'size',
        title: '尺寸',
        value: 'default',
        options: [
          { label: 'small', value: 'small' },
          { label: 'large', value: 'large' },
          { label: 'default ', value: 'default ' }
        ]
      }
    ]
  }
}
