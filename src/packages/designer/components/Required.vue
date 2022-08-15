<template>
  <div class="_fc-required">
    <ElSwitch v-model="required"></ElSwitch>
    <ElInput
      v-if="required"
      v-model="requiredMsg"
      placeholder="请输入提示语"
    ></ElInput>
  </div>
</template>

<script lang="ts">
import is from '@form-create/utils/lib/type.js'
import { ref, watchEffect, watch, onMounted, defineComponent } from 'vue'

const componentName = 'Required'

export default defineComponent({
  name: componentName,
  props: {
    modelValue: [Boolean, String]
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const required = ref(false)
    const requiredMsg = ref('')

    watchEffect(() => {
      const flag = is.String(props.modelValue)
      required.value =
        props.modelValue == null ? false : flag ? true : !!props.modelValue
      requiredMsg.value = flag ? (props.modelValue as string) : ''
    })

    watchEffect(() => {
      let val
      if (required.value === false) {
        val = false
      } else {
        val = requiredMsg.value
      }
      emit('update:modelValue', val)
    })

    return {
      required,
      requiredMsg
    }
  }
})
</script>

<style>
._fc-required {
  display: flex;
  align-items: center;
}

._fc-required .el-input {
  margin-left: 15px;
}

._fc-required .el-switch {
  height: 28px;
}
</style>
