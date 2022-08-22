import { IBaseValidate } from '../../types/config'

export default function validate(): IBaseValidate[] {
  return [
    {
      type: 'validate',
      field: 'validate',
      value: []
    }
  ]
}
