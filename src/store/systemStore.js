import { defineStore } from "pinia";

export const useSystemStore = defineStore("systemStore", {
  state() {
    return {
      isLoading: false,
      LoadingMessage: 'Loading',
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
  },
});