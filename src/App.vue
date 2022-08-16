<template>
  <el-config-provider :locale="zhCn">
    <div class="fc-designer-wrap">
      <form-designer ref="fcDesignerRef">
        <template #btns>
          <el-button plain @click="printLog($refs.fcDesignerRef)">
            打印JSON
          </el-button>
          <el-button plain @click="printOptions($refs.fcDesignerRef)">
            打印Options
          </el-button>
        </template>
      </form-designer>
    </div>
  </el-config-provider>
</template>

<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { defineComponent } from 'vue'
import formDesigner from '@/packages/designer/index'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const componentName = 'index'

export default defineComponent({
  name: componentName,
  components: { formDesigner },
  setup() {
    const printLog = (ref: any) => {
      console.log('rule', ref.getRule())
    }
    const printOptions = (ref: any) => {
      console.log('option', ref.getOption())
    }

    return {
      printLog,
      printOptions,
      zhCn
    }
  }
})
</script>

<style scoped>
.fc-designer-wrap {
  height: 100vh;
}
</style>
