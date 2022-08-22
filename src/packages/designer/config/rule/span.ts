import { ISpanProps, ISpanRule } from '../../types/config/index'
const label = '文字'
const name = 'span'

export default {
  icon: 'icon-span',
  label,
  name,
  rule(): ISpanRule {
    return {
      type: name,
      title: '文字',
      native: false,
      children: ['这是一段文字']
    }
  },
  props(): ISpanProps[] {
    return [
      {
        type: 'input',
        field: 'formCreateTitle',
        title: 'title'
      },
      {
        type: 'input',
        field: 'formCreateChild',
        title: '内容',
        props: {
          type: 'textarea'
        }
      }
    ]
  }
}
