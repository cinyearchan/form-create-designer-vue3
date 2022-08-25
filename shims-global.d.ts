declare module 'codemirror/lib/codemirror.js'
declare module '@form-create/utils/lib/deepextend.js'
declare module '@form-create/utils/lib/unique.js'
declare module '@form-create/utils/lib/tocase.js'
declare module '@form-create/utils/lib/json.js'
declare module '@form-create/utils/lib/type.js' {
  interface IS {
    type(arg: any, type: string): boolean
    Undef(v: any): boolean
    Element(arg: any): boolean
    trueArray(data: any): boolean
    Function(v: any): boolean
    getType(v: any): string
    empty(value: any): boolean
    Date(arg: any): boolean
    Object(arg: any): boolean
    String(arg: any): boolean
    Boolean(arg: any): boolean
    Array(arg: any): boolean
    Number(arg: any): boolean
  }
  const is: IS

  export function hasProperty(rule: any, k: string): boolean
  export default is
}
