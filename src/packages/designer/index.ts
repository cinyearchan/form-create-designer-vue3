import FcDesigner from './components/FcDesigner.vue'
import DragTool from './components/DragTool.vue'
import Fetch from './components/Fetch.vue'
import Required from './components/Required.vue'
import Struct from './components/Struct.vue'
import Validate from './components/Validate.vue'
import DragBox from './components/DragBox.vue'
import TableOptions from './components/TableOptions.vue'
import formCreate from '@form-create/element-ui'

import './style/index.css'
import unique from '@form-create/utils/lib/unique.js'

import { App } from 'vue'

formCreate.component(DragTool.name, DragTool)
formCreate.component(Required.name, Required)
formCreate.component(DragBox.name, DragBox)
formCreate.component(Validate.name, Validate)
formCreate.component(Fetch.name, Fetch)
formCreate.component(Struct.name, Struct)
formCreate.component(TableOptions.name, TableOptions)

formCreate.register('_fc', {
  init(fc, rule) {
    rule.id = unique()
    if (!fc.value && rule.field) rule.field = unique()
    if (fc.value) {
      if (typeof rule.effect === 'object') {
        rule.effect._fc = false
      }
    }
  }
})

formCreate.register('_fc_tool', {
  init(_, rule) {
    if (typeof rule.props === 'object') {
      rule.props.unique = unique()
    }
  }
})

FcDesigner.install = function (Vue: App) {
  Vue.component(FcDesigner.name, FcDesigner)
}

export default FcDesigner
