import uniqueId from '@form-create/utils/lib/unique.js'
import { makeOptionsRule, makeRequiredRule } from '../../utils/index'

const label = '选择器'
const name = 'select'

export default {
  icon: 'icon-select',
  label,
  name,
  rule() {
    return {
      type: name,
      field: uniqueId(),
      title: label,
      info: '',
      effect: {
        fetch: '',
        required: false
      },
      props: {},
      value: [],
      options: [
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' }
      ]
    }
  },
  props() {
    return [
      makeRequiredRule(),
      makeOptionsRule('options'),
      { type: 'switch', field: 'multiple', title: '是否多选' },
      {
        type: 'switch',
        field: 'disabled',
        title: '是否禁用'
      },
      { type: 'switch', field: 'clearable', title: '是否可以清空选项' },
      {
        type: 'switch',
        field: 'collapseTags',
        title: '多选时是否将选中值按文字的形式展示'
      },
      { type: 'input', field: 'placeholder', title: '占位符' },
      {
        type: 'switch',
        field: 'filterable',
        title: '是否可搜索'
      },
      { type: 'switch', field: 'allowCreate', title: '是否允许用户创建新条目' },
      {
        type: 'input',
        field: 'noMatchText',
        title: '搜索条件无匹配时显示的文字'
      }
    ]
  }
}
