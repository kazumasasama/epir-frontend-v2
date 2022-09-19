import { defineStore } from 'pinia';
import axios from 'axios'

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
    initStatuses() {
      axios.get('/statuses.json')
      .then((res)=> {
        this.statuses = res.data;
      })
      .catch((error)=> {
        this.error = error.response.data.errors;
      })
    },
    switchLoggedin(boolean) {
      this.isLoggedin = boolean;
    },
    handleAdmin(boolean) {
      this.isAdmin = boolean;
    },
  },
});