import is, { hasProperty } from '@form-create/utils/lib/type.js'
import { parseFn } from '@form-create/utils/lib/json.js'
import { Control, Options } from '@form-create/element-ui'

interface IRequiredRule {
  type: 'Required'
  field: 'formCreateEffect>required'
  title: '是否必填'
}

export function makeRequiredRule(): IRequiredRule {
  return {
    type: 'Required',
    field: 'formCreateEffect>required',
    title: '是否必填'
  }
}

export function upper(str: string) {
  return str.replace(str[0], str[0].toLocaleUpperCase())
}

interface IOptionsRule {
  type: string
  title: string
  field: string
  value: number
  options: Array<{ label: string; value: number }>
  props: {
    type: string
  }
  control: Control[]
}

export function makeOptionsRule(to: string, flag?: boolean): IOptionsRule {
  const options = [
    { label: 'JSON数据', value: 0 },
    { label: '接口数据', value: 1 }
  ]

  const control: Control[] = [
    {
      value: 0,
      rule: [
        {
          type: 'Struct',
          value: [],
          field: 'formCreate' + upper(to).replace('.', '>'),
          props: {}
        }
      ]
    },
    {
      value: 1,
      rule: [
        {
          type: 'Fetch',
          field: 'formCreateEffect>fetch',
          props: {
            to
          }
        }
      ]
    }
  ]

  if (flag !== false) {
    options.splice(0, 0, { label: '静态数据', value: 2 })
    control.push({
      value: 2,
      rule: [
        {
          type: 'TableOptions',
          field: 'formCreate' + upper(to).replace('.', '>'),
          value: [],
          props: {},
          style: 'width:100%'
        }
      ]
    })
  }

  return {
    type: 'radio',
    title: '选项数据',
    field: 'optionType',
    value: flag !== false ? 2 : 0,
    options,
    props: {
      type: 'button'
    },
    control
  }
}

type IType = 'object' | 'array' | 'string'

export const toJSON = (val: any) => {
  const type = /object ([a-zA-Z]*)/.exec(Object.prototype.toString.call(val))
  const _type = type && type[1] ? type[1].toLowerCase() : null
  if (type && _type && _toJSON[_type as IType]) {
    return _toJSON[_type as IType](val)
  } else {
    return val
  }
}

const _toJSON = {
  object: function (val: any): string {
    const json = []
    for (const i in val) {
      if (!hasProperty(val, i)) continue
      json.push(toJSON(i) + ': ' + (val[i] != null ? toJSON(val[i]) : 'null'))
    }
    return '{\n ' + json.join(',\n ') + '\n}'
  },
  array: function (val: any[]): string {
    const json = []
    for (let i = 0; i < val.length; i++) {
      json[i] = val[i] != null ? toJSON(val[i]) : 'null'
    }
    return '[' + json.join(', ') + ']'
  },
  string: function (val: string) {
    const tmp = val.split('')
    let cCode: number
    for (let i = 0; i < tmp.length; i++) {
      const c = tmp[i]
      c >= ' '
        ? c === '\\'
          ? (tmp[i] = '\\\\')
          : c === '"'
          ? (tmp[i] = '\\"')
          : 0
        : (tmp[i] =
            c === '\n'
              ? '\\n'
              : c === '\r'
              ? '\\r'
              : c === '\t'
              ? '\\t'
              : c === '\b'
              ? '\\b'
              : c === '\f'
              ? '\\f'
              : ((cCode = c.charCodeAt(0)),
                '\\u00' + (cCode > 15 ? 1 : 0) + (cCode % 16)))
    }
    return '"' + tmp.join('') + '"'
  }
}

export const deepParseFn = (target: any) => {
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      const data = target[key]
      if (Array.isArray(data) || is.Object(data)) {
        deepParseFn(data)
      }
      if (is.String(data)) {
        target[key] = parseFn(data)
      }
    }
  }
  return target
}

// function makeFn(fn: string) {
//   return eval('(' + FUNCTION + '(){return ' + fn + ' })()')
// }

// export function parseFn(fn, mode) {
//   if (fn && is.String(fn) && fn.length > 4) {
//     let v = fn.trim()
//     let flag = false
//     try {
//       if (v.indexOf(SUFFIX) > 0 && v.indexOf(PREFIX) === 0) {

//       }
//     }
//   }
// }
