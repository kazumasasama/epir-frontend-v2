import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state() {
    return {
      userStoreError: null,
      users: [],
      user: null,
      isAdmin: false,
      isLoggedin: false,
      statuses: null,
    };
  },
  actions: {
    pushUser(user) {
      this.user = user;
    },
    initStatuses(statuses) {
      this.statuses = statuses;
    },
    switchLoggedin(boolean) {
      this.isLoggedin = boolean;
    },
    handleAdmin(boolean) {
      this.isAdmin = boolean;
    },
  },
});