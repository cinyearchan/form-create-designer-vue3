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
  computed,
  inject
} from 'vue'
import form from '../config/base/form'
import configForm from '../config/base/form'
import field from '../config/base/field'
import validate from '../config/base/validate'
import { deepCopy } from '@form-create/utils/lib/deepextend.js'
import is, { hasProperty } from '@form-create/utils/lib/type.js'
import { lower } from '@form-create/utils/lib/tocase.js'
import ruleList from '../config/rule'
import createMenu from '../config/menu'
import { upper } from '../utils/index'
import formCreate from '@form-create/element-ui'
import draggable from 'vuedraggable/src/vuedraggable'
import uniqueId from '@form-create/utils/lib/unique.js'
import * as CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'

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
      children = ref([]),
      menuList = ref(menu.value || createMenu()),
      showBaseRule = ref(false),
      dragForm = ref({
        rule: [],
        api: {}
      }),
      form = ref({
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
      baseForm = ref({
        rule: [],
        api: {},
        value: null,
        options: {
          form: {
            labelPosition: 'top'
          },
          submitBtn: false,
          mounted: fapi => {
            fapi.activeRule = activeRule.value
          }
        }
      }),
      validateForm = ref({
        rule: [],
        api: {},
        value: null,
        options: {
          form: {
            labelPosition: 'top'
          },
          submitBtn: false,
          mounted: fapi => {
            fapi.activeRule = activeRule.value
          }
        }
      }),
      propsFormMap = ref({}),
      propsForm = ref({
        rule: [],
        api: {},
        value: {},
        options: {
          form: {
            labelPosition: 'top'
          },
          row: { type: undefined },
          submitBtn: false,
          mounted: fapi => {
            fapi.activeRule = activeRule.value
          }
        }
      })

    const modal = ref({
        show: false,
        addShow: false,
        data: null
      }),
      cMirror = ref(),
      editorRef = ref(),
      previewDialogForm = ref({
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

    const getParent = rule => {
        let parent = rule.__fc__.parent.rule
        const config = parent.config
        if (config && config.config.inside) {
          rule = parent
          parent = parent.__fc__.parent.rule
        }
        return { root: parent, parent: rule }
      },
      makeDrag = (group, tag, children, on) => {
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
      },
      makeDragRule = children => {
        return [
          makeDrag(true, 'draggable', children, {
            add: (inject, evt) => dragAdd(children, evt),
            end: (inject, evt) => dragEnd(children, evt),
            start: (inject, evt) => dragStart(children, evt),
            unchoose: (inject, evt) => dragUnchoose(children, evt)
          })
        ]
      },
      dragAdd = (children, evt) => {
        const newIndex = evt.newIndex
        const menu = evt.item._underlying_vm_
        if (menu && menu.name) {
          const rule = makeRule(ruleList[menu.name])
          children.splice(newIndex, 0, rule)
        } else {
          if (addRule.value) {
            const rule = addRule.value.children.splice(
              addRule.value.oldIndex,
              1
            )
            children.splice(newIndex, 0, rule[0])
          }
        }
        added.value = true
      },
      dragEnd = (children, { newIndex, oldIndex }) => {
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
      },
      dragStart = (children, evt) => {
        moveRule.value = children
        added.value = false
      },
      dragUnchoose = (children, evt) => {
        addRule.value = {
          children,
          oldIndex: evt.oldIndex
        }
      },
      toolActive = rule => {
        nextTick(() => {
          activeTab.value = 'props'
        })

        activeRule.value = rule
        if (propsFormMap.value[rule.field]) {
          propsForm.value.rule = propsFormMap.value[rule.field]
        } else {
          propsForm.value.rule = rule.config.config.props()
          propsFormMap.value[rule.field] = propsForm.value.rule
        }

        const formData = { ...rule.props, formCreateChild: rule.children[0] }
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
            field: rule.field,
            title: rule.title,
            info: rule.info,
            _control: rule._control
          }

          validateForm.value.value = {
            validate: rule.validate ? [...rule.validate] : []
          }
        }
      },
      makeRule = (config, _rule?) => {
        const rule = _rule || config.rule()
        rule.config = { config }
        if (!rule.effect) rule.effect = {}
        rule.effect._fc = true
        rule._fc_drag_tag = config.name

        let drag

        if (config.drag) {
          const children = []
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
                delete: ({ self }) => {
                  getParent(self).parent.__fc__.rm()
                  clearActiveRule()
                },
                addComponent: ({ self }) => {
                  const top = getParent(self)
                  top.root.children.splice(
                    top.root.children.indexOf(top.parent) + 1,
                    0,
                    makeRule(top.parent.config.config)
                  )
                },
                addChild: ({ self }) => {
                  const top = getParent(self)
                  const config = top.parent.config.config
                  const item = ruleList[config.children]
                  if (!item) return
                  ;(!config.drag
                    ? top.parent
                    : top.parent.children[0]
                  ).children[0].children.push(makeRule(item))
                },
                copy: ({ self }) => {
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
                active: ({ self }) => {
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
              delete: ({ self }) => {
                self.__fc__.rm()
                clearActiveRule()
              },
              addComponent: ({ self }) => {
                const top = getParent(self)
                top.root.children.splice(
                  top.root.children.indexOf(top.parent) + 1,
                  0,
                  makeRule(self.children[0].config.config)
                )
              },
              addChild: ({ self }) => {
                const config = self.children[0].config.config
                const item = ruleList[config.children]
                if (!item) return
                ;(!config.drag
                  ? self
                  : self.children[0]
                ).children[0].children.push(makeRule(item))
              },
              copy: ({ self }) => {
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
              active: ({ self }) => {
                toolActive(self.children[0])
              }
            },
            children: [rule]
          }
        }
      },
      loadRule = rules => {
        const loadRuleValue = []
        rules.forEach(rule => {
          if (is.String(rule)) {
            return loadRuleValue.push(rule)
          }
          const config = ruleList[rule._fc_drag_tag] || ruleList[rule.type]
          const _children = rule.children
          rule.children = []
          if (rule.control) {
            rule._control = rule.control
            delete rule.control
          }
          if (config) {
            rule = makeRule(config, rule)
            if (_children) {
              let children = rule.children[0].children

              if (config.drag) {
                children = children[0].children
              }
              children.push(...loadRule(_children))
            }
          } else if (_children) {
            rule.children = loadRule(_children)
          }
          loadRuleValue.push(rule)
        })
        return loadRuleValue
      },
      parseRule = children => {
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
      },
      baseChange = (field, value, _, fapi, flag) => {
        if (!flag && activeRule.value && fapi.activeRule === activeRule.value) {
          activeRule.value[field] = value
        }
      },
      propRemoveField = (field, _, fapi) => {
        if (activeRule.value && fapi.activeRule === activeRule.value) {
          dragForm.value.api.sync(activeRule.value)
          if (field.indexOf('formCreate') === 0) {
            field = field.replace('formCreate', '')
            if (!field) return
            field = lower(field)
            if (field.indexOf('effect') === 0 && field.indexOf('>') > -1) {
              delete activeRule.value.effect[field.split('>')[1]]
            } else if (
              field.indexOf('props') === 0 &&
              field.indexOf('>') > -1
            ) {
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
      },
      propChange = (field, value, _, fapi, flag) => {
        if (!flag && activeRule.value && fapi.activeRule === activeRule.value) {
          if (field.indexOf('formCreate') === 0) {
            field = field.replace('formCreate', '')
            if (!field) return
            field = lower(field)
            if (field.indexOf('effect') === 0 && field.indexOf('>') > -1) {
              activeRule.value.effect[field.split('>')[1]] = value
            } else if (
              field.indexOf('props') === 0 &&
              field.indexOf('>') > -1
            ) {
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
      },
      validateChange = (field, value, _, fapi, flag) => {
        if (activeRule.value && fapi.activeRule === activeRule.value) {
          activeRule.value.validate = value
        }
      },
      addMenu = config => {
        if (!config.name || !config.list) return
        let flag = true
        menuList.value.forEach((v, i) => {
          if (v.name === config.name) {
            v.list = [].concat(v.list, config.list)
            flag = false
          }
        })
        if (flag) {
          menuList.value.push(config)
        }
      },
      removeMenu = name => {
        ;[...menuList.value].forEach((v, i) => {
          if (v.name === name) {
            menuList.value.splice(i, 1)
          }
        })
      },
      setMenuItem = (name, list) => {
        menuList.value.forEach(v => {
          if (v.name === name) {
            v.list = list
          }
        })
      },
      appendMenuItem = (name, item) => {
        menuList.value.forEach(v => {
          if (v.name === name) {
            v.list.push(item)
          }
        })
      },
      removeMenuItem = item => {
        menuList.value.forEach(v => {
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
      },
      addComponent = data => {
        if (Array.isArray(data)) {
          data.forEach(v => {
            ruleList[v.name] = v
          })
        } else {
          ruleList[data.name] = data
        }
      },
      getRule = () => {
        return parseRule(deepCopy(dragForm.value.api.rule[0].children))
      },
      getJson = () => {
        return formCreate.toJson(getRule())
      },
      getOption = () => {
        const option = deepCopy(form.value.value)
        delete option.submitBtn
        return option
      },
      setRule = rules => {
        children.value = loadRule(
          is.String(rules) ? formCreate.parseJson(rules) : rules
        )
        clearActiveRule()
        dragForm.value.rule = makeDragRule(children.value)
      },
      clearActiveRule = () => {
        activeRule.value = null
        activeTab.value = 'form'
      },
      setOption = option => {
        const _ = option
        _.submitBtn = false
        delete _.resetBtn
        form.value.value = _
      },
      viewer = () => {
        // 预览
        modal.value.show = true
        previewDialogForm.value.rule = getRule()
      },
      clear = () => {
        setRule([])
      },
      getResult = formData => {
        // 预览提交
        console.log('result:', formData)
      },
      addRuleRule = () => {
        // 添加规则
        try {
          modal.value.data = getMirrorValue()
          setRule(modal.value.data, true)
          modal.value.addShow = false
        } catch (e) {
          console.error(e)
        }
      },
      onAddValue = () => {
        // 添加默认值 弹出框
        modal.value.addShow = true
        modal.value.data = formCreate.toJson(getRule(), 2)
        nextTick(() => {
          loadCMirror()
        })
      }

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

    dragForm.value.rule = makeDragRule(children.value)
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
