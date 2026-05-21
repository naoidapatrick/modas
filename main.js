import { createApp } from "vue";
import App from "./App.vue";
import '@styles/global_styles.css'
import '@mdi/font/css/materialdesignicons.css'

// Vuetify imports
import 'vuetify/styles' // Required for styles
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Create the Vuetify instance
const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)

// Use the Vuetify plugin
app.use(vuetify)

app.mount('#app')