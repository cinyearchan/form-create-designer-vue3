<template>
  <el-config-provider :locale="zhCn">
    <div class="fc-designer-wrap">
      <form-designer ref="fcDesignerRef">
        <template #btns>
          <el-button plain @click="printLog()"> 打印JSON </el-button>
          <el-button plain @click="printOptions()"> 打印Options </el-button>
        </template>
      </form-designer>
    </div>
  </el-config-provider>
</template>

<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { defineComponent, ref } from 'vue'
import formDesigner from '@/packages/designer/index'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

type IFcDesigner = InstanceType<typeof formDesigner>

const componentName = 'index'

export default defineComponent({
  name: componentName,
  components: { formDesigner },
  setup() {
    const fcDesignerRef = ref<IFcDesigner | null>(null)
    const printLog = () => {
      console.log('rule', fcDesignerRef.value?.getRule())
    }
    const printOptions = () => {
      console.log('option', fcDesignerRef.value?.getOption())
    }

    return {
      printLog,
      printOptions,
      zhCn,
      fcDesignerRef
    }
  }
})
</script>

<style scoped>
.fc-designer-wrap {
  height: 100vh;
}
</style>
