import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import axios from "axios";
import "@/css/custom-css-bootstrap-magic-2022-08-21.css"
import { data } from '@/i18n/index'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'ja',
  messages: data,
})

axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://frozen-wave-84233.herokuapp.com";

var jwt = localStorage.getItem("jwt");
if (jwt) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

createApp(App).use(router).use(createPinia()).use(i18n).mount('#app')
