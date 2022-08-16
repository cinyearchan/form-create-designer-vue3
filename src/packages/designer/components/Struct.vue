<template>
  <div class="_fc_struct">
    <el-button block @click="onShowClick">{{ title }}</el-button>
    <el-dialog
      v-model="visible"
      :title="title"
      :close-on-click-modal="false"
      append-to-body
    >
      <div v-if="visible" ref="editorRef"></div>
      <template #footer>
        <span class="dialog-footer">
          <span v-if="err" class="_fc_err">
            输入内容格式有误{{ err !== true ? err : '' }}
          </span>
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onOk">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, onMounted, nextTick } from 'vue'
import * as CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'

const componentName = 'Struct'

export default defineComponent({
  name: componentName,
  props: {
    modelValue: {
      type: [Object, Array, Function],
      default() {
        return {}
      }
    },
    title: {
      type: String,
      default: '编辑数据'
    },
    defaultValue: {
      type: [Object, Array, Function],
      default() {
        return {}
      },
      required: false
    },
    validate: Function
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue, defaultValue, validate } = toRefs(props),
      editorRef = ref({}),
      cMirror = ref(),
      visible = ref(false),
      err = ref(),
      oldVal = ref()

    const onShowClick = () => {
      visible.value = true
      nextTick(() => {
        load()
      })
    }

    onMounted(() => {})

    const load = () => {
      const val = toJson(
        modelValue.value ? modelValue.value : defaultValue.value
      )
      oldVal.value = val

      cMirror.value = CodeMirror(editorRef.value, {
        lineNumbers: true,
        mode: 'javascript',
        gutters: ['CodeMirror-lint-markers'],
        lint: true,
        line: true,
        tabSize: 2,
        lineWrapping: true,
        value: val || ''
      })
    }

    const toJson = (v: any) => {
      if (typeof v === 'function') {
        return `${v}`
      } else if (typeof v === 'object') {
        return JSON.stringify(v, null, 2)
      } else {
        return v
      }
    }

    const onCancel = () => {
      console.log(editorRef.value)
      cMirror.value = null
      oldVal.value = null
      visible.value = false
    }

    const onOk = () => {
      err.value = null
      const str = cMirror.value.getValue()
      let val
      try {
        val = eval('(function(){return ' + str + '}())')
      } catch (e) {
        err.value = ` (${e})`
        return
      }
      if (validate.value && validate.value(val) === false) {
        err.value = true
        return
      }
      onCancel()
      if (toJson(val) !== oldVal.value) {
        emit('update:modelValue', val)
      }
    }

    return {
      editorRef,
      visible,
      err,
      onShowClick,
      onOk,
      onCancel
    }
  }
})
</script>

<style>
._fc_struct .CodeMirror {
  height: 450px;
}

._fc_struct .CodeMirror-line {
  line-height: 16px !important;
  font-size: 13px !important;
}

.CodeMirror-lint-tooltip {
  z-index: 2021 !important;
}

._fc_struct .el-dialog__body {
  padding: 0px 20px;
}

._fc_err {
  color: red;
  float: left;
  text-align: left;
  width: 65%;
}
</style>
