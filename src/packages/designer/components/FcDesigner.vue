<template>
  <el-container class="_fc-designer" :style="'height:' + containerHeight">
    <el-main>
      <el-container style="height: 100%">
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
        <el-container class="_fc-m">
          <el-header class="_fc-m-tools" height="45">
            <el-button type="primary" plain @click="viewer()">预览</el-button>
            <el-button type="primary" plain @click="onAddValue()"
              >添加默认值</el-button
            >
            <el-button type="danger" plain @click="clear()">清空</el-button>
            <slot name="btns"></slot>
          </el-header>
          <div class="_fc-dragbox" style="background: #f5f5f5; padding: 20px">
            <div class="_fc-m-drag">
              <form-create
                v-model:api="dragForm.api"
                :rule="dragForm.rule"
                :option="form.value"
              ></form-create>
            </div>
          </div>
        </el-container>
        <el-aside class="_fc-r" width="330px" style="background: #ffffff">
          <el-container style="height: 100%">
            <el-header class="_fc-r-tabs" height="40px">
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
            <el-main v-show="activeTab === 'form'">
              <form-create
                v-model="form.value.form"
                :rule="form.value"
                :option="form.option"
              ></form-create>
            </el-main>
            <el-main
              v-show="activeTab === 'props'"
              :key="activeRule ? activeRule.id : ''"
              style="padding: 0 20px"
            >
              <div>
                <el-divider v-if="showBaseRule">基础配置</el-divider>
                <form-create
                  v-if="showBaseRule"
                  v-model:api="baseForm.api"
                  v-model="baseForm.value"
                  :rule="baseForm.options"
                  @change="baseChange"
                ></form-create>
                <el-divider>属性配置</el-divider>
                <form-create
                  v-model:api="propsForm.api"
                  v-model="propsForm.value"
                  :rule="propsForm.rule"
                  :option="propsForm.options"
                  @change="propChange"
                ></form-create>
                <el-divider v-if="showBaseRule">验证规则</el-divider>
                <form-create
                  v-if="showBaseRule"
                  v-model:api="validateForm.api"
                  v-model="validateForm.value"
                  :rule="validateForm.rule"
                  :option="validateForm.options"
                  @change="validateChange"
                ></form-create>
              </div>
            </el-main>
          </el-container>
        </el-aside>
        <!-- 预览 -->
        <el-dialog
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
          ></form-create>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="() => (modal.show = false)">关闭</el-button>
            </div>
          </template>
        </el-dialog>
        <!-- 添加 rule -->
        <el-dialog
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
        </el-dialog>
      </el-container>
    </el-main>
  </el-container>
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
    FormCreate: formCreate.$form
  }
})
</script>
