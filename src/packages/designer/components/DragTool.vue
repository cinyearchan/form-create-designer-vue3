<template>
  <div
    class="drag-tool"
    :class="{ active: state.active === id }"
    @click.stop="active"
  >
    <div class="drag-l">
      <div
        v-if="state.active === id && dragBtn !== false"
        class="drag-btn _fc-drag-btn"
        style="cursor: move"
      >
        <i class="fc-icon icon-move"></i>
      </div>
    </div>
    <div class="drag-r">
      <div class="drag-btn">
        <i
          class="fc-icon icon-add"
          title="添加"
          @click.stop="$emit('addComponent')"
        ></i>
      </div>
      <div class="drag-btn">
        <i
          class="fc-icon icon-copy"
          title="复制"
          @click.stop="$emit('copy')"
        ></i>
      </div>
      <div v-if="children" class="drag-btn">
        <i
          class="fc-icon icon-add-child"
          title="添加子节点"
          @click.stop="$emit('addChild')"
        ></i>
      </div>
      <div class="drag-btn drag-btn-danger">
        <i
          class="fc-icon icon-delete"
          title="删除"
          @click.stop="$emit('delete')"
        ></i>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, inject, onBeforeUnmount, Ref } from 'vue'

let cid = 1
export default defineComponent({
  name: 'DragTool',
  props: ['dragBtn', 'children', 'unique', 'formCreateInject'],
  emits: ['active', 'addComponent', 'copy', 'addChild', 'delete'],
  setup(props, { emit }) {
    const { unique } = toRefs(props),
      id = ref(unique.value || cid++),
      state = inject<Ref<{ active: string }> | any>('fcx')

    const active = () => {
      if (state.value.active !== id.value) {
        state.value.active = id.value
        emit('active')
      }
    }

    onBeforeUnmount(() => {
      state.value = {}
    })

    return {
      id,
      state,
      active
    }
  }
})
</script>

<style>
.drag-tool {
  position: relative;
  min-height: 20px;
  box-sizing: border-box;
  padding: 2px;
  outline: 1px dashed #2e73ff;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}

.drag-tool .drag-tool {
  margin: 5px;
}

.drag-tool + .drag-tool {
  margin-top: 5px;
}

.drag-tool.active {
  outline: 2px solid #2e73ff;
}

.drag-tool.active > div > .drag-btn {
  display: flex;
}

.drag-tool .drag-btn {
  display: none;
}

.drag-r {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 999;
}

.drag-l {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}

.drag-btn {
  height: 18px;
  width: 18px;
  color: #fff;
  background-color: #2e73ff;
  text-align: center;
  line-height: 20px;
  padding-bottom: 1px;
  float: left;
  cursor: pointer;
  justify-content: center;
}

.drag-btn + .drag-btn {
  margin-left: 2px;
}

.drag-btn-danger {
  background-color: #ff2e2e;
}

.drag-btn i {
  font-size: 13px;
}
</style>
