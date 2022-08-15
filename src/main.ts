import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementIcons from '@element-plus/icons'

const app = createApp(App)

Object.keys(ElementIcons).forEach(key => {
  app.component(`ElIcon${key}`, (ElementIcons as any)[key])
})

app.use(ElementPlus)

app.mount('#app')
