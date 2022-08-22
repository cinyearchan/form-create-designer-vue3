import { IBaseField } from '../../types/config'

export default function field(): IBaseField[] {
  return [
    {
      type: 'input',
      field: 'field',
      value: '',
      title: '字段 ID'
    },
    {
      type: 'input',
      field: 'title',
      value: '',
      title: '字段名称'
    },
    {
      type: 'input',
      field: 'info',
      value: '',
      title: '提示信息'
    }
  ]
}
