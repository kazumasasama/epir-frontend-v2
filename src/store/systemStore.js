import { defineStore } from "pinia";
import axios from 'axios'

export const useSystemStore = defineStore("systemStore", {
  state() {
    return {
      error: null,
      isLoading: false,
      LoadingMessage: '',
      mapboxURL: 'mapbox://styles/mapbox/streets-v11',
      calendarLocale: 'en',
      business: null,
      config: null,
      categories: null,
      businessTimes: null,
      activeMenus: null,
      inactiveMenus: null,
      groupedMenus: null,
      menusByCategory: null,
    };
  },
  actions: {
    initBusiness() {
      axios.get(`/businesses/1.json`)
      .then((res)=> {
        this.business = res.data;
      })
      .catch((error)=> {
        this.error = error.response.data.errors;
      })
    },
    initBusinessTimes() {
      axios.get("/business_times.json")
      .then((res)=> {
        this.businessTimes = res.data;
      })
      .catch((error)=> {
        this.error = error.response
      })
    },
    initConfig() {
      axios.get(`/configs/1.json`)
      .then((res)=> {
        this.config = res.data;
      })
      .catch((error)=> {
        this.error = error.response.data.errors;
      })
    },
    initCategories() {
      axios.get('/categories.json')
      .then((res)=> {
        this.categories = res.data;
      })
      .catch((error)=> {
        this.error = error.response.data.errors;
      })
    },
    initMenus() {
      axios.get('/menus.json')
      .then((res)=> {
        this.activeMenus = res.data.active;
        this.inactiveMenus = res.data.inactive;
      })
      axios.get('/grouped-menus.json')
      .then((res)=> {
        this.groupedMenus = res.data;
      })
    },
    startLoading() {
      this.isLoading = true;
    },
    endLoading() {
      this.isLoading = false;
    },
    modifyLoadingMessage(message) {
      this.LoadingMessage = message
    },
    changeAppLocale(lang) {
      if (lang === 'en') {
        this.mapboxURL = 'mapbox://styles/mapbox/streets-v11'
      } else if (lang === 'ja') {
        this.mapboxURL = 'mapbox://styles/kaznyc/cl3z0c148000i14qp3onp4x8e'
      }
      this.calendarLocale = lang;
    },
  },
});