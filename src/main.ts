import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

library.add(faArrowUp)
library.add(faArrowDown)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
