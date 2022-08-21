import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import axios from "axios";
import "@/css/custom-css-bootstrap-magic-2022-08-21.css"

axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://frozen-wave-84233.herokuapp.com";

var jwt = localStorage.getItem("jwt");
if (jwt) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

createApp(App).use(router).mount('#app')
