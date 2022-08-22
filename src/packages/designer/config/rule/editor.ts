import uniqueId from '@form-create/utils/lib/unique.js'
import { makeRequiredRule } from '../../utils'
import { IEditorRule, IEditorProps } from '../../types/config/index'

const label = '富文本框'
const name = 'fc-editor'

export default {
  icon: 'icon-editor',
  label,
  name,
  rule(): IEditorRule {
    return {
      type: name,
      field: uniqueId(),
      title: label,
      info: '',
      props: {}
    }
  },
  props(): IEditorProps[] {
    return [
      makeRequiredRule(),
      { type: 'switch', field: 'disabled', title: '是否禁用' }
    ]
  }
}
