import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheckCircle, faRocket, faEnvelope, faPhone, faMapMarkerAlt, faChevronRight, faStar, faCode, faPalette, faKey, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faVuejs, faGithub, faLinkedin, faTwitter, faDiscord, faPython, faJs } from '@fortawesome/free-brands-svg-icons'

// Add icons to library
library.add(faCheckCircle, faRocket, faVuejs, faEnvelope, faPhone, faMapMarkerAlt, faChevronRight, faStar, faCode, faPalette, faGithub, faLinkedin, faTwitter, faDiscord, faPython, faJs, faKey, faChevronDown)

const app = createApp(App)

// Register FontAwesomeIcon component globally
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
