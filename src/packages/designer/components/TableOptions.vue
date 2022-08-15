<template>
  <div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column label="label" align="center" prop="label">
        <template #default="scope">
          <el-input
            v-model="scope.row.label"
            @blur="updateValue(scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="value" align="center" prop="value">
        <template #default="scope">
          <el-input
            v-model="scope.row.value"
            @blur="updateValue(scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        min-width="35"
        align="center"
        fixed="right"
        label="操作"
        width="55"
      >
        <template #default="scope">
          <el-icon @click="del(scope.$index)">
            <el-icon-delete></el-icon-delete>
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="text" icon="el-icon-plus" @click="add">添加</el-button>
  </div>
</template>

<script lang="ts">
import { deepCopy } from '@form-create/utils/lib/deepextend.js'
import { ref, onMounted, defineComponent } from 'vue'

export default defineComponent({
  name: 'TableOptions',
  props: {
    modelValue: [Object, Array, String]
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const list = ref<{ label: string; value: string }[]>([])

    const updateValue = (row?: any) => {
      emit('update:modelValue', list.value)
    }

    const add = () => {
      list.value.push({ label: '', value: '' })
    }

    const del = (idx: number) => {
      list.value.splice(idx, 1)
      updateValue()
    }

    onMounted(() => {
      list.value = deepCopy(props.modelValue || {})
    })

    return {
      add,
      del,
      updateValue,
      list
    }
  }
})
</script>
