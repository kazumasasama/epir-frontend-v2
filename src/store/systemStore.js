import { defineStore } from "pinia";

export const useSystemStore = defineStore("systemStore", {
  state() {
    return {
      isLoading: false,
      LoadingMessage: 'Loading',
      mapboxURL: 'mapbox://styles/mapbox/streets-v11',
      calendarLocale: 'en',
    };
  },
  actions: {
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