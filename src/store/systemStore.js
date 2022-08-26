import { defineStore } from "pinia";

export const useSystemStore = defineStore("systemStore", {
  state() {
    return {
      isLoading: false,
      LoadingMessage: 'Loading',
      i18n: 'en',
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
    changeI18n(lang) {
      this.i18n = lang
    }
  },
});