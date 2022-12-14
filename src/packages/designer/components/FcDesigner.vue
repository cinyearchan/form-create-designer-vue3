<template>
  <ElContainer class="_fc-designer" :style="'height:' + containerHeight">
    <ElMain>
      <ElContainer style="height: 100%">
        <el-aside class="_fc-l" width="266px">
          <div
            v-for="(item, index) in menuList"
            :key="index"
            class="_fc-l-group"
          >
            <h4 class="_fc-l-title">{{ item.title }}</h4>
            <draggable
              :group="{ name: 'default', pull: 'clone', put: false }"
              :sort="false"
              item-key="name"
              :list="item.list"
            >
              <template #item="{ element, index }">
                <div :key="index" class="_fc-l-item">
                  <div class="_fc-l-icon">
                    <i
                      class="fc-icon"
                      :class="element.icon || 'icon-input'"
                    ></i>
                  </div>
                  <span class="_fc-l-name">{{ element.label }}</span>
                </div>
              </template>
            </draggable>
          </div>
        </el-aside>
        <ElContainer class="_fc-m">
          <el-header class="_fc-m-tools" height="45">
            <el-button type="primary" plain @click="viewer()">预览</el-button>
            <el-button type="primary" plain @click="onAddValue()"
              >添加默认值</el-button
            >
            <el-button type="danger" plain @click="clear()">清空</el-button>
            <slot name="btns"></slot>
          </el-header>
          <div style="background: #f5f5f5; padding: 20px" class="_fc-dragBox">
            <div class="_fc-m-drag">
              <form-create
                v-model:api="dragForm.api"
                :rule="dragForm.rule"
                :option="form.value"
              />
            </div>
          </div>
        </ElContainer>
        <ElAside class="_fc-r" width="330px" style="background: #ffffff">
          <ElContainer style="height: 100%">
            <el-header height="40px" class="_fc-r-tabs">
              <div
                v-if="!!activeRule"
                class="_fc-r-tab"
                :class="{ active: activeTab === 'props' }"
                @click="activeTab = 'props'"
              >
                组件配置
              </div>
              <div
                class="_fc-r-tab"
                :class="{ active: activeTab === 'form' && !!activeRule }"
                @click="activeTab = 'form'"
              >
                表单配置
              </div>
            </el-header>
            <ElMain v-show="activeTab === 'form'">
              <form-create
                v-model="form.value.form"
                :rule="form.rule"
                :option="form.option"
              />
            </ElMain>
            <ElMain
              v-show="activeTab === 'props'"
              :key="activeRule ? activeRule.id : ''"
              style="padding: 0 20px"
            >
              <div>
                <ElDivider v-if="showBaseRule">基础配置</ElDivider>
                <form-create
                  v-if="showBaseRule"
                  v-model:api="baseForm.api"
                  v-model="baseForm.value"
                  :rule="baseForm.rule"
                  :option="baseForm.options"
                  @change="baseChange"
                />
                <ElDivider>属性配置</ElDivider>
                <form-create
                  v-model:api="propsForm.api"
                  v-model="propsForm.value"
                  :rule="propsForm.rule"
                  :option="propsForm.options"
                  @change="propChange"
                />
                <ElDivider v-if="showBaseRule">验证规则</ElDivider>
                <form-create
                  v-if="showBaseRule"
                  v-model:api="validateForm.api"
                  v-model="validateForm.value"
                  :rule="validateForm.rule"
                  :option="validateForm.options"
                  @change="validateChange"
                />
              </div>
            </ElMain>
          </ElContainer>
        </ElAside>
        <!--预览-->
        <ElDialog
          v-model="modal.show"
          title="预览"
          width="40%"
          destroy-on-close
          center
        >
          <form-create
            v-if="modal.show"
            v-model:api="previewDialogForm.api"
            v-model="previewDialogForm.value"
            :rule="previewDialogForm.rule"
            :option="previewDialogForm.options"
            @submit="getResult"
          />
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="() => (modal.show = false)">关闭</el-button>
            </div>
          </template>
        </ElDialog>
        <!--添加rule-->
        <ElDialog
          v-model="modal.addShow"
          width="40%"
          title="添加rule"
          destroy-on-close
          center
        >
          <div v-if="modal.addShow" ref="editorRef"></div>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="addRuleRule()">添加</el-button>
              <el-button @click="() => (modal.addShow = false)">取消</el-button>
            </div>
          </template>
        </ElDialog>
      </ElContainer>
    </ElMain>
  </ElContainer>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  provide,
  nextTick,
  onMounted,
  computed
  // inject
} from 'vue'
import form from '../config/base/form'
import configForm from '../config/base/form'
import field from '../config/base/field'
import validate from '../config/base/validate'
import { deepCopy } from '@form-create/utils/lib/deepextend.js'
import is from '@form-create/utils/lib/type.js' // hasProperty
import { lower } from '@form-create/utils/lib/tocase.js'
import ruleList from '../config/rule'
import createMenu from '../config/menu'
import { upper } from '../utils/index'
import formCreate, { FormRule } from '@form-create/element-ui'
import draggable from 'vuedraggable/src/vuedraggable'
import uniqueId from '@form-create/utils/lib/unique.js'
import * as CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'

import { IOn } from '../types/index'
import { Api, Rule, Options, maker } from '@form-create/element-ui'
import { ICreatedMenu } from '../types/config/index'
import col from '../config/rule/col'

type ChildrenType = Rule | string | typeof maker

export default defineComponent({
  name: 'FcDesigner',
  components: {
    draggable,
    FormCreate: formCreate.$form()
  },
  props: ['menu', 'height', 'config', 'mask'],
  setup(props) {
    provide(
      'fcx',
      ref({
        active: null
      })
    )
    const containerHeight = computed(() => {
      const h = props.height
      if (!h) return '100%'
      return is.Number(h) ? `${h}px` : h
    })
    const { menu } = toRefs(props),
      moveRule = ref(),
      addRule = ref(),
      added = ref(),
      activeTab = ref('form'),
      activeRule = ref(),
      children = ref<Array<ChildrenType>>([]),
      menuList = ref(menu.value || createMenu()),
      showBaseRule = ref(false),
      dragForm = ref<{
        rule: any
        api: any
      }>({
        rule: [],
        api: {}
      }),
      form = ref<{
        rule: Rule[]
        option: {
          form: {
            labelPosition: string
          }
          submitBtn: boolean
        }
        value: {
          form: {
            layout: string
          }
          submitBtn: boolean
        }
      }>({
        rule: [],
        option: {
          form: {
            labelPosition: 'top'
          },
          submitBtn: false
        },
        value: {
          form: {
            layout: 'vertical'
          },
          submitBtn: false
        }
      }),
      baseForm = ref<{
        rule: Rule[]
        api: object
        value:
          | null
          | string
          | number
          | boolean
          | ({
              field: string
              type?: string
              title: string
              _control: string
            } & { info?: any })
        options: {
          form: {
            labelPosition: string
          }
          submitBtn: boolean
          mounted: (fapi: Api) => void
        }
      }>({
        rule: [],
        api: {},
        value: null,
        options: {
          form: {
            labelPosition: 'top'
          },
          submitBtn: false,
          mounted: (fapi: Api) => {
            fapi.activeRule = activeRule.value
          }
        }
      }),
      validateForm = ref<{
        rule: unknown[]
        api: object
        value: unknown
        options: {
          form: {
            labelPosition: string
          }
          submitBtn: boolean
          mounted: (fapi: Api) => void
        }
      }>({
        rule: [],
        api: {},
        value: null,
        options: {
          form: {
            labelPosition: 'top'
          },
          submitBtn: false,
          mounted: (fapi: Api) => {
            fapi.activeRule = activeRule.value
          }
        }
      }),
      propsFormMap = ref<{ [key: string]: Rule }>({}),
      propsForm = ref<{
        rule: any
        api: object
        value: unknown
        options: {
          form: {
            labelPosition: string
          }
          row: {
            type: any
          }
          submitBtn: boolean
          mounted: (fapi: Api) => void
        }
      }>({
        rule: [],
        api: {},
        value: {},
        options: {
          form: {
            labelPosition: 'top'
          },
          row: { type: undefined },
          submitBtn: false,
          mounted: (fapi: Api) => {
            fapi.activeRule = activeRule.value
          }
        }
      })

    const modal = ref<{
        show: boolean
        addShow: boolean
        data: any
      }>({
        show: false,
        addShow: false,
        data: null
      }),
      cMirror = ref(),
      editorRef = ref(),
      previewDialogForm = ref<{
        api: object
        value: string | number | boolean | null
        rule: Rule[]
        options: {
          form: {
            layout: string
          }
          submitBtn: boolean
        }
      }>({
        api: {},
        value: null,
        rule: [],
        options: {
          form: {
            layout: 'vertical'
          },
          submitBtn: false
        }
      })

    const getParent = (rule: Rule) => {
      let parent = rule.__fc__.parent.rule
      const config = parent.config
      if (config && config.config.inside) {
        rule = parent
        parent = parent.__fc__.parent.rule
      }
      return { root: parent, parent: rule }
    }
    // 创建拖拽的盒子
    const makeDrag = (
      group: boolean,
      tag: string,
      children: Array<ChildrenType>,
      on: IOn
    ) => {
      return {
        type: 'DragBox',
        wrap: {
          show: false
        },
        col: {
          show: false
        },
        inject: true,
        props: {
          rule: {
            props: {
              group: group === true ? 'default' : group,
              ghostClass: 'ghost',
              animation: 150,
              handle: '._fc-drag-btn',
              emptyInsertThreshold: 0,
              direction: 'vertical',
              itemKey: 'type',
              modelValue: children
            }
          },
          tag
        },
        children,
        on
      }
    }
    // 创建拖拽组件的生成规则
    const makeDragRule = (children: Array<ChildrenType>) => {
      return [
        makeDrag(true, 'draggable', children, {
          add: (inject, evt) => dragAdd(children, evt),
          end: (inject, evt) => dragEnd(children, evt),
          start: (inject, evt) => dragStart(children, evt),
          unchoose: (inject, evt) => dragUnchoose(children, evt)
        })
      ]
    }
    // 拖拽增加的事件处理函数
    const dragAdd = (children: Array<ChildrenType>, evt: any) => {
      const newIndex = evt.newIndex
      const menu = evt.item._underlying_vm_
      if (menu && menu.name) {
        const rule = makeRule(ruleList[menu.name])
        children.splice(newIndex, 0, rule)
      } else {
        if (addRule.value) {
          const rule = addRule.value.children.splice(addRule.value.oldIndex, 1)
          children.splice(newIndex, 0, rule[0])
        }
      }
      added.value = true
    }
    // 拖拽结束的事件处理函数
    const dragEnd = (
      children: Array<ChildrenType>,
      { newIndex, oldIndex }: { newIndex: number; oldIndex: number }
    ) => {
      // console.log('end', newIndex, oldIndex)
      if (
        !added.value &&
        !(moveRule.value === children && newIndex === oldIndex)
      ) {
        const rule = moveRule.value.splice(oldIndex, 1)
        children.splice(newIndex, 0, rule[0])
      }
      moveRule.value = null
      addRule.value = null
      added.value = false
    }
    // 拖拽开始的事件处理函数，会记录当前拖拽组件的生成规则
    const dragStart = (children: Array<ChildrenType>, evt: any) => {
      moveRule.value = children
      added.value = false
    }
    // 拖拽取消的事件处理函数
    const dragUnchoose = (children: Array<ChildrenType>, evt: any) => {
      addRule.value = {
        children,
        oldIndex: evt.oldIndex
      }
    }
    // 响应组件的聚焦，dragTool 高亮
    const toolActive = (rule: Rule) => {
      nextTick(() => {
        activeTab.value = 'props'
      })

      activeRule.value = rule
      if (rule.field !== null || rule.field !== undefined) {
        if (rule.field && propsFormMap.value[rule.field]) {
          propsForm.value.rule = propsFormMap.value[rule.field]
        } else {
          propsForm.value.rule = rule.config.config.props()
          propsFormMap.value[rule.field as string] = propsForm.value.rule
        }
      }

      const formData: { [key: string]: any; formCreateChild: any } = {
        ...rule.props,
        formCreateChild:
          rule.children && rule.children.length > 0 ? rule.children[0] : []
      }
      Object.keys(rule).forEach(k => {
        if (['effect', 'config', 'payload', 'id', 'type'].indexOf(k) < 0)
          formData['formCreate' + upper(k)] = rule[k]
      })
      ;['props', 'effect'].forEach(name => {
        rule[name] &&
          Object.keys(rule[name]).forEach(k => {
            formData['formCreate' + upper(name) + '>' + k] = rule[name][k]
          })
      })

      propsForm.value.value = deepCopy(formData)
      showBaseRule.value = !!rule.field

      if (showBaseRule.value) {
        baseForm.value.value = {
          field: rule.field as string,
          title: rule.title as string,
          info: rule.info as any,
          _control: rule._control
        }

        validateForm.value.value = {
          validate: rule.validate ? [...rule.validate] : []
        }
      }
    }
    const makeRule = (config: any, _rule?: Rule | null) => {
      // 如果有第二个参数——组件生成规则，则直接获取规则
      // 如果没有第二个参数，则从 config.rule() 组件配置中，获取生成规则
      const rule = _rule || config.rule()
      rule.config = { config }
      if (!rule.effect) rule.effect = {}
      rule.effect._fc = true
      rule._fc_drag_tag = config.name

      let drag

      if (config.drag) {
        const children: Array<ChildrenType> = []
        drag = makeDrag(config.drag, rule.type, children, {
          end: (inject, evt) => dragEnd(inject.self.children, evt),
          add: (inject, evt) => dragAdd(inject.self.children, evt),
          start: (inject, evt) => dragStart(inject.self.children, evt),
          unchoose: (inject, evt) => dragUnchoose(inject.self.children, evt)
        })
        rule.children.push(drag)
      }

      if (config.children && !_rule) {
        const child = makeRule(ruleList[config.children], null)
        ;(drag || rule).children.push(child)
      }

      if (config.inside) {
        rule.children = [
          {
            type: 'DragTool',
            props: {
              dragBtn: config.dragBtn !== false,
              children: config.children
            },
            effect: {
              _fc_tool: true
            },
            inject: true,
            on: {
              delete: ({ self }: any) => {
                getParent(self).parent.__fc__.rm()
                clearActiveRule()
              },
              addComponent: ({ self }: any) => {
                const top = getParent(self)
                top.root.children.splice(
                  top.root.children.indexOf(top.parent) + 1,
                  0,
                  makeRule(top.parent.config.config)
                )
              },
              addChild: ({ self }: any) => {
                const top = getParent(self)
                const config = top.parent.config.config
                const item = ruleList[config.children]
                if (!item) return
                ;(
                  (!config.drag ? top.parent : top.parent!.children![0]) as any
                ).children[0].children.push(makeRule(item))
              },
              copy: ({ self }: any) => {
                const top = getParent(self),
                  copyRule = formCreate.copyRule(top.parent)
                if (copyRule.slot) {
                  copyRule.slot = `slot-${uniqueId()}`
                }
                top.root.children.splice(
                  top.root.children.indexOf(top.parent) + 1,
                  0,
                  copyRule
                )
              },
              active: ({ self }: any) => {
                console.log('self1', self)
                toolActive(getParent(self).parent)
              }
            },
            children: rule.children
          }
        ]
        return rule
      } else {
        return {
          type: 'DragTool',
          props: {
            dragBtn: config.dragBtn !== false,
            children: config.children
          },
          effect: {
            _fc_tool: true
          },
          inject: true,
          slot: `slot-${rule.field ? rule.field : uniqueId()}`,
          on: {
            delete: ({ self }: any) => {
              self.__fc__.rm()
              clearActiveRule()
            },
            addComponent: ({ self }: any) => {
              const top = getParent(self)
              top.root.children.splice(
                top.root.children.indexOf(top.parent) + 1,
                0,
                makeRule(self.children[0].config.config)
              )
            },
            addChild: ({ self }: any) => {
              const config = self.children[0].config.config
              const item = ruleList[config.children]
              if (!item) return
              ;(!config.drag
                ? self
                : self.children[0]
              ).children[0].children.push(makeRule(item))
            },
            copy: ({ self }: any) => {
              const top = getParent(self),
                copyRule = formCreate.copyRule(top.parent)
              if (copyRule.slot) {
                copyRule.slot = `slot-${uniqueId()}`
              }
              top.root.children.splice(
                top.root.children.indexOf(top.parent) + 1,
                0,
                copyRule
              )
            },
            active: ({ self }: any) => {
              console.log('self', self)
              toolActive(self.children[0])
            }
          },
          children: [rule]
        }
      }
    }
    // 加载生成规则
    const loadRule = (rules: Array<Rule | string | FormRule>) => {
      const loadRuleValue: Array<Rule | string | FormRule> = []
      rules.forEach((rule: any) => {
        if (is.String(rule as string) || typeof rule === 'string') {
          return loadRuleValue.push(rule)
        } else {
          const config =
            ruleList[(rule as any)._fc_drag_tag] ||
            ruleList[rule.type as string]
          const _children = rule.children
          rule.children = []
          if (rule.control) {
            rule._control = rule.control
            delete rule.control
          }
          if (config) {
            console.log('config', config)
            rule = makeRule(config, rule)
            if (_children) {
              let children = _children[0].children

              if ((config as typeof col).drag) {
                children = children[0].children
              }
              children.push(...loadRule(_children as Rule[]))
            }
          } else if (_children) {
            rule.children = loadRule(_children as Rule[])
          }
          loadRuleValue.push(rule)
        }
      })
      return loadRuleValue
    }
    const parseRule = (children: any) => {
      return [...children].reduce((initial, rule) => {
        if (is.String(rule)) {
          initial.push(rule)
          return initial
        } else if (rule.type === 'DragBox') {
          initial.push(...parseRule(rule.children))
          return initial
        } else if (rule.type === 'DragTool') {
          rule = rule.children[0]
          if (rule.type === 'DragBox') {
            initial.push(...parseRule(rule.children))
            return initial
          }
        }
        if (!rule) return initial
        rule = { ...rule }
        if (rule.children.length) {
          rule.children = parseRule(rule.children)
        }

        delete rule.id
        if (rule.config) {
          delete rule.config.config
        }
        if (rule.effect) {
          delete rule.effect._fc
          delete rule.effect._fc_tool
        }
        if (rule._control) {
          rule.control = rule._control
          delete rule._control
        }
        Object.keys(rule)
          .filter(
            k =>
              (Array.isArray(rule[k]) && rule[k].length === 0) ||
              (is.Object(rule[k]) && Object.keys(rule[k]).length === 0)
          )
          .forEach(k => {
            delete rule[k]
          })
        initial.push(rule)
        return initial
      }, [])
    }
    const baseChange = (
      field: string,
      value: string | number | boolean,
      _: any,
      fapi: Api,
      flag: boolean
    ) => {
      if (!flag && activeRule.value && fapi.activeRule === activeRule.value) {
        activeRule.value[field] = value
      }
    }
    const propRemoveField = (field: string, _: any, fapi: Api) => {
      if (activeRule.value && fapi.activeRule === activeRule.value) {
        dragForm.value.api.sync(activeRule.value)
        if (field.indexOf('formCreate') === 0) {
          field = field.replace('formCreate', '')
          if (!field) return
          field = lower(field)
          if (field.indexOf('effect') === 0 && field.indexOf('>') > -1) {
            delete activeRule.value.effect[field.split('>')[1]]
          } else if (field.indexOf('props') === 0 && field.indexOf('>') > -1) {
            delete activeRule.value.props[field.split('>')[1]]
          } else if (field === 'child') {
            activeRule.value.children.splice(0, 1)
          } else if (field) {
            activeRule.value[field] = undefined
          }
        } else {
          delete activeRule.value.props[field]
        }
      }
    }
    const propChange = (
      field: string,
      value: string | number | boolean,
      _: any,
      fapi: Api,
      flag: boolean
    ) => {
      if (!flag && activeRule.value && fapi.activeRule === activeRule.value) {
        if (field.indexOf('formCreate') === 0) {
          field = field.replace('formCreate', '')
          if (!field) return
          field = lower(field)
          if (field.indexOf('effect') === 0 && field.indexOf('>') > -1) {
            activeRule.value.effect[field.split('>')[1]] = value
          } else if (field.indexOf('props') === 0 && field.indexOf('>') > -1) {
            activeRule.value.props[field.split('>')[1]] = value
          } else if (field === 'child') {
            activeRule.value.children[0] = value
          } else {
            activeRule.value[field] = value
          }
        } else {
          activeRule.value.props[field] = value
          if (field === 'multiple') {
            activeRule.value.value = activeRule.value.value || []
            // 多选时，不为数组则转换为数组
            if (!Array.isArray(activeRule.value.value)) {
              activeRule.value.value = [activeRule.value.value]
            }
          }
        }
      }
    }
    const validateChange = (
      field: string,
      value: string | number | boolean,
      _: any,
      fapi: Api,
      flag: boolean
    ) => {
      if (activeRule.value && fapi.activeRule === activeRule.value) {
        activeRule.value.validate = value
      }
    }
    const addMenu = (config: { name: string; list: any }) => {
      if (!config.name || !config.list) return
      let flag = true
      menuList.value.forEach((v: any, i: number) => {
        if (v.name === config.name) {
          v.list = [].concat(v.list, config.list)
          flag = false
        }
      })
      if (flag) {
        menuList.value.push(config)
      }
    }
    const removeMenu = (name: string) => {
      ;[...menuList.value].forEach((v, i) => {
        if (v.name === name) {
          menuList.value.splice(i, 1)
        }
      })
    }
    const setMenuItem = (name: string, list: any) => {
      menuList.value.forEach((v: any) => {
        if (v.name === name) {
          v.list = list
        }
      })
    }
    const appendMenuItem = (name: string, item: any) => {
      menuList.value.forEach((v: any) => {
        if (v.name === name) {
          v.list.push(item)
        }
      })
    }
    const removeMenuItem = (item: any) => {
      menuList.value.forEach((v: any) => {
        let idx
        if (is.String(item)) {
          ;[...v.list].forEach((menu, idx) => {
            if (menu.name === item) {
              v.list.splice(idx, 1)
            }
          })
        } else {
          if ((idx = v.list.indexOf(item)) > -1) {
            v.list.splice(idx, 1)
          }
        }
      })
    }

    // 响应 DragTool 中的 加号——添加组件
    const addComponent = (data: any) => {
      if (Array.isArray(data)) {
        data.forEach(v => {
          ruleList[v.name] = v
        })
      } else {
        ruleList[data.name] = data
      }
    }

    // 获取当前操作区中 form 表单的 rule 生成规则
    const getRule = () => {
      return parseRule(deepCopy(dragForm.value.api.rule[0].children))
    }

    // 将当前操作区中 form 表单的 rule 生成规则格式化成 json
    const getJson = () => {
      return formCreate.toJson(getRule())
    }
    const getOption = () => {
      const option = deepCopy(form.value.value)
      delete option.submitBtn
      return option
    }
    const setRule = (rules: Array<Rule | string>, flag?: boolean) => {
      console.log('rules', rules, typeof rules)
      children.value = loadRule(
        is.String(rules) ? formCreate.parseJson(rules as any as string) : rules
      ) as any
      clearActiveRule()
      dragForm.value.rule = makeDragRule(children.value as any)
    }

    // 移除当前激活的规则
    const clearActiveRule = () => {
      activeRule.value = null
      activeTab.value = 'form'
    }
    const setOption = (option: any) => {
      const _ = option
      _.submitBtn = false
      delete _.resetBtn
      form.value.value = _
    }
    // 预览按钮
    const viewer = () => {
      // 预览
      modal.value.show = true
      previewDialogForm.value.rule = getRule()
    }
    // 清空按钮
    const clear = () => {
      setRule([])
    }
    // 预览弹窗里表单组件的提交事件的处理函数
    const getResult = (formData: any) => {
      // 预览提交
      console.log('result:', formData)
    }
    // 添加默认值规则弹窗的确认添加按钮被点击
    const addRuleRule = () => {
      // 添加规则
      try {
        modal.value.data = getMirrorValue()
        setRule(modal.value.data, true)
        modal.value.addShow = false
      } catch (e) {
        console.error(e)
      }
    }
    // 添加默认值按钮被点击
    const onAddValue = () => {
      // 添加默认值 弹出框
      modal.value.addShow = true
      modal.value.data = formCreate.toJson(getRule(), 2)
      nextTick(() => {
        loadCMirror()
      })
    }

    // 加载 codeMirror
    const loadCMirror = () => {
      // 加载编辑器
      cMirror.value = CodeMirror(editorRef.value, {
        lineNumbers: true,
        mode: 'javascript',
        gutters: ['CodeMirror-lint-markers'],
        lint: true,
        line: true,
        tabSize: 2,
        lineWrapping: true,
        value: modal.value.data || ''
      })
    }

    // 获取 codeMirror 的内容
    const getMirrorValue = () => {
      // 编辑器结果 结合formCreate处理规则json
      let data = null
      try {
        data = eval(`(function (){return ${cMirror.value.getValue()} }())`)
        data = formCreate.parseJson(formCreate.toJson(data))
      } catch (e) {
        alert(e)
        return
      }
      return data
    }

    // 初始化数据
    // 中央操作区的表单变量
    dragForm.value.rule = makeDragRule(children.value as any)
    form.value.rule = configForm()
    baseForm.value.rule = field()
    validateForm.value.rule = validate()

    onMounted(() => {
      document.body.ondrop = e => {
        e.preventDefault()
        e.stopPropagation()
      }
    })

    return {
      menuList,
      activeTab,
      activeRule,
      showBaseRule,
      dragForm,
      form,
      baseForm,
      validateForm,
      propsForm,
      baseChange,
      propChange,
      // 具体没有使用到
      // propRemoveField,
      validateChange,
      // 开放的api
      addMenu,
      removeMenu,
      setMenuItem,
      appendMenuItem,
      removeMenuItem,
      addComponent,
      getRule,
      getJson,
      getOption,
      setRule,
      setOption,
      containerHeight,
      viewer,
      onAddValue,
      clear,
      modal,
      previewDialogForm,
      addRuleRule,
      getResult,
      editorRef
    }
  }
})
</script>

<style scoped>
:deep(.el-row) {
  width: 100%;
}
</style>

<style>
._fc-designer {
  overflow: hidden;
  cursor: default;
  position: relative;
}

._fc-designer .el-col-24 {
  width: 100%;
}

._fc-designer > .el-main {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0;
}

._fc-m .form-create ._fc-l-item {
  background: #2e73ff;
  width: 100%;
  height: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

._fc-l,
._fc-m,
._fc-r {
  border-top: 1px solid #ececec;
  box-sizing: border-box;
  position: relative;
}

._fc-l-group {
  padding: 0 12px;
}

._fc-l-title {
  font-weight: 600;
  font-size: 14px;
  margin: 18px 0px 5px;
}

._fc-l-item {
  display: inline-block;
  background: #fff;
  color: #000;
  min-width: 70px;
  width: 33.33%;
  height: 70px;
  line-height: 1;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

._fc-l-item i {
  font-size: 21px;
  display: inline-block;
}

._fc-l-item ._fc-l-name {
  font-size: 12px;
}

._fc-l-item ._fc-l-icon {
  padding: 10px 5px 12px;
}

._fc-l-item:hover {
  background: #2e73ff;
  color: #fff;
}

._fc-m-tools {
  height: 40px;
  align-items: center;
  display: flex;
  justify-content: flex-end;
  border: 1px solid #ececec;
  border-top: 0 none;
}

._fc-m-tools button.el-button {
  padding: 5px 14px;
  display: flex;
  align-items: center;
}

._fc-m-tools .fc-icon {
  font-size: 14px;
  margin-right: 2px;
}

._fc-r .el-tabs__nav-wrap::after {
  height: 1px;
  background-color: #ececec;
}

._fc-r ._fc-r-tabs {
  display: flex;
  padding: 0;
  border-bottom: 1px solid #ececec;
}

._fc-r ._fc-r-tab {
  height: 40px;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  position: relative;
  flex: 1;
  text-align: center;
}

._fc-r ._fc-r-tab.active {
  color: #409eff;
  border-bottom: 2px solid #409eff;
}

.drag-box,
.ivu-col.drag-box {
  min-height: 60px;
}

._fc-m-drag {
  overflow: auto;
  padding: 2px;
  box-sizing: border-box;
}

._fc-m-drag,
.draggable-drag {
  background: #fff;
  width: 100%;
  height: 100%;
  position: relative;
}

._fc-m-drag > form,
._fc-m-drag > form > .el-row {
  height: 100%;
  width: 100%;
}

._fc-dragBox {
  background: #f5f5f5;
  padding: 20px;
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
}

.div-tools + .div-tools {
  margin-top: 5px;
}
</style>
