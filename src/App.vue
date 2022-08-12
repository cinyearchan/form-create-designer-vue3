<template>
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
</template>

<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import formDesigner from '@/packages/designer'

const printLog = ref => {
  console.log('rule', ref.getRule())
}
const printOptions = ref => {
  console.log('option', ref.getOption())
}
</script>

<style scoped>
.fc-designer-wrap {
  height: 100vh;
}
</style>
