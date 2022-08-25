import { Control } from '@form-create/element-ui'
export interface IBaseField {
  type: string
  field: string
  value: string
  title: string
}

export interface IBaseForm {
  type: string
  field: string
  value: string | boolean
  title: string
  options?: Array<IOriginOptions>
}

export interface IBaseValidate {
  type: 'validate'
  field: 'validate'
  value: unknown[]
}

interface IOriginCommonProperties {
  type: string
  field: string
  title: string
}

type IOriginProps = IOriginCommonProperties

interface IOriginOptions {
  label: string
  value: string
}

export interface IAlertRule {
  type: string
  props: {
    title: string
    description: string
    type: string
    effect: string
  }
  children: unknown[]
}

export interface IAlertProps extends IOriginProps {
  value?: boolean
  options?: Array<IOriginOptions>
}

export interface IButtonRule {
  type: string
  props: any
  children: string[]
}

export interface IButtonProps extends IOriginProps {
  options?: Array<IOriginOptions>
}

export interface ICardRule {
  type: string
  props: any
  style: string
  children: unknown[]
}

export interface ICardProps extends IOriginProps {
  props?: {
    valueType?: string
    allowClear?: boolean
  }
  value?: boolean | string
  options?: Array<IOriginOptions>
}

export interface ICascaderRule {
  type: string
  field: string
  title: string
  info: string
  effect: {
    fetch: string
    required: boolean
  }
  value: unknown[]
  props: {
    options: any[]
    clearable: boolean
    props: {
      multiple: boolean
    }
  }
}

export interface ICascaderProps extends IOriginProps {
  value?: boolean | number
  options?: Array<IOriginOptions> | Array<{ label: string; value: number }>
  props?: {
    type?: string
    rule?: Array<{
      type: string
      field: string
      title: string
      options?: Array<IOriginOptions>
      value?: boolean
    }>
    options?: {
      form: {
        labelPosition: string
        labelWidth: string
      }
      submitBtn: boolean
    }
  }
}

export interface ICheckboxRule {
  type: string
  field: string
  title: string
  info: string
  effect: {
    fetch: string
    required: boolean
  }
  props: any
  options: Array<{ label: string; value: string }>
}

export interface ICheckboxProps extends IOriginProps {
  value?: number
  props?: {
    type?: string
    activeValue?: string
    inactiveValue?: string
  }
}

export interface IColRule {
  type: string
  props: {
    span: number
  }
  children: unknown[]
}

export interface IColProps extends IOriginProps {
  value?: number
  props?: {
    min?: number
    max?: number
  }
}

export interface IColorRule {
  type: string
  field: string
  title: string
  info: string
  props: any
}

export interface IColorProps extends IOriginProps {
  options?: Array<IOriginOptions>
}

export interface IDateRule {
  type: string
  field: string
  title: string
  info: string
  props: any
  effect: {
    required: boolean
  }
}

export interface IDateProps extends IOriginProps {
  props?: {
    defaultValue: any
  }
  options?: Array<IOriginOptions>
  value?: boolean
}

export interface IDividerRule {
  type: string
  props: any
  wrap: {
    show: boolean
  }
  native: boolean
  children: unknown[]
}

export interface IDividerProps extends IOriginProps {
  options?: Array<IOriginOptions>
}

export interface IEditorRule {
  type: string
  field: string
  title: string
  info: string
  props: any
}

export type IEditorProps = IOriginProps

export interface IHiddenRule {
  type: string
  field: string
  title: string
  props: any
}

export interface IHiddenProps extends IOriginProps {
  info?: string
  props?: {
    valueType: string
  }
}

export interface IInputRule {
  type: string
  field: string
  title: string
  info: string
  props: any
  effect: {
    required: boolean
  }
}

export interface IInputProps extends IOriginProps {
  options?: Array<IOriginOptions>
  info?: string
}

export interface INumberRule {
  type: string
  field: string
  title: string
  info: string
  props: any
  effect: {
    required: boolean
  }
}

export interface INumberProps extends IOriginProps {
  options?: Array<IOriginOptions>
  value?: boolean
}

export interface IProgressRule {
  type: string
  props: {
    percent: number
  }
  modelField: string
}

export interface IProgressProps extends IOriginProps {
  value?: string | number | boolean | null
  options?: Array<IOriginOptions>
  control?: Control[]
  props?: {
    closable?: boolean
    rule?: Array<{
      type: string
      field: string
      title: string
      value?: null | string
    }>
    options?: {
      form: {
        layout: string
      }
      submitBtn: boolean
    }
  }
}

export interface IRadioRule {
  type: string
  field: string
  title: string
  info: string
  effect: {
    fetch: string
    required: boolean
  }
  props: any
  options: Array<IOriginOptions>
}

export interface IRadioProps extends IOriginProps {
  props?: {
    type?: string
    activeValue?: string
    inactiveValue?: string
  }
}

export interface IRateRule extends IOriginCommonProperties {
  info: string
  props: any
  effect: {
    required: boolean
  }
}

export type IRateProps = IOriginProps

export interface IRowRule {
  type: string
  props: any
  children: unknown[]
}

export interface IRowProps extends IOriginProps {
  props?: {
    activeValue: string
    inactiveValue: string
  }
  options?: Array<IOriginOptions>
}

export interface ISelectRule extends IOriginCommonProperties {
  info: string
  effect: {
    fetch: string
    required: boolean
  }
  props: any
  value: unknown[]
  options?: Array<IOriginOptions>
}

export interface ISelectProps extends IOriginProps {
  props?: {
    type: string
  }
}

export interface ISliderRule extends IOriginCommonProperties {
  info: string
  props: any
  effect: {
    required: boolean
  }
}

export interface ISliderProps extends IOriginProps {
  value?: boolean
}

export interface ISpaceRule {
  type: string
  wrap: {
    show: boolean
  }
  native: boolean
  style: {
    width: string
    height: string
  }
  children: unknown[]
}

export interface ISpaceProps {
  type: string
  field: string
  native: boolean
  props: {
    rule: Array<IOriginProps>
  }
}

export interface ISpanRule {
  type: string
  title: string
  native: boolean
  children: string[]
}

export interface ISpanProps extends IOriginProps {
  props?: {
    type: string
  }
}

export interface ISwitchRule {
  type: string
  field: string
  title: string
  info: string
  props: any
  effect: {
    required: boolean
  }
}

export type ISwitchProps = IOriginProps

export interface ITabRule {
  type: string
  children: unknown[]
}

export interface ITabProps extends IOriginProps {
  options?: Array<IOriginOptions>
}

export interface ITableRule extends IOriginCommonProperties {
  class: string
  realType: string
  props: any
  children: unknown[]
}

export interface ITableProps extends IOriginProps {
  value?: string | boolean
  options?: Array<IOriginOptions>
}

export interface ITabPaneRule {
  type: string
  props: {
    label: string
  }
  children: unknown[]
}

export type ITabPaneProps = IOriginProps

export interface ITimeRule extends IOriginCommonProperties {
  info: string
  props: any
  effect: {
    required: boolean
  }
}

export interface ITimeProps extends IOriginProps {
  props?: {
    defaultValue: any
  }
  value?: boolean
  options?: Array<IOriginOptions>
}

export interface ITransferRule extends IOriginCommonProperties {
  info: string
  props: {
    data: Array<{ key: number; label: string; disabled: boolean }>
  }
}

export interface ITransferProps extends IOriginProps {
  props?: {
    defaultValue: unknown[] | object
  }
  info?: string
  options?: Array<IOriginOptions>
}

interface ITreeNode {
  id: number
  label: string
  children?: ITreeNode[]
}

export interface ITreeRule extends IOriginCommonProperties {
  info: string
  effect: {
    fetch: string
    required: boolean
  }
  props: {
    props: {
      label: string
    }
    showCheckbox: boolean
    nodeKey: string
    data: Array<ITreeNode>
  }
}

export interface ITreeProps extends IOriginProps {
  props?: {
    type?: string
    defaultValue?: object
  }
  value?: boolean | number
}

export interface IUploadRule extends IOriginCommonProperties {
  value: unknown[]
  props: {
    type: string
    uploadType: string
    action: string
    name: string
    multiple: boolean
    accept: string
    limit: number
    onSuccess: (res: any, file: any) => void
  }
  effect: {
    required: boolean
  }
}

export interface IUploadProps extends IOriginProps {
  value?: string | boolean
  options?: Array<IOriginOptions>
  props?: {
    defaultValue: object
  }
}

export type IPresetRule =
  | IAlertRule
  | IButtonRule
  | ICardRule
  | ICascaderRule
  | ICheckboxRule
  | IColRule
  | IColorRule
  | IDateRule
  | IDividerRule
  | IEditorRule
  | IHiddenRule
  | IInputRule
  | INumberRule
  | IProgressRule
  | IRadioRule
  | IRateRule
  | IRowRule
  | ISelectRule
  | ISliderRule
  | ISpaceRule
  | ISpanRule
  | ISwitchRule
  | ITabRule
  | ITabPaneRule
  | ITimeRule
  | ITransferRule
  | ITreeRule
  | IUploadRule

export type IPresetProps =
  | IAlertProps
  | IButtonProps
  | ICardProps
  | ICascaderProps
  | ICheckboxProps
  | IColProps
  | IColorProps
  | IDateProps
  | IDividerProps
  | IEditorProps
  | IHiddenProps
  | IInputProps
  | INumberProps
  | IProgressProps
  | IRadioProps
  | IRateProps
  | IRowProps
  | ISelectProps
  | ISliderProps
  | ISpaceProps
  | ISpanProps
  | ISwitchProps
  | ITabProps
  | ITabPaneProps
  | ITimeProps
  | ITransferProps
  | ITreeProps
  | IUploadProps

interface IComponentRule {
  icon: string
  label: string
  name: string
  rule(): IPresetRule
  props(): Array<IPresetProps>
}

export type ICreatedMenu = {
  name: string
  title: string
  list: Array<IComponentRule>
}
