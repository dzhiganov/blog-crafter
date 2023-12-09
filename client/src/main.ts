import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, md } from 'vuetify/iconsets/md'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import colors from 'vuetify/util/colors'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md
    }
  },
  theme: {
    themes: {
      light: {
        colors: {
          background: colors.grey.lighten4,
          surface: colors.grey.lighten4
        }
      }
    }
  }
})

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin)
app.use(vuetify)

app.mount('#app')
