import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state() {
    return {
      userStoreError: null,
      users: [],
      user: null,
      isAdmin: false,
      isLoggedin: false,
    };
  },
  actions: {
    pushUser(user) {
      this.user = user;
    },
    switchLoggedin(boolean) {
      this.isLoggedin = boolean;
    },
    handleAdmin(boolean) {
      this.isAdmin = boolean;
    },
  },
});