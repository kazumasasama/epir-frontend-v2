import { defineStore } from "pinia";
import axios from 'axios'

export const useSystemStore = defineStore("systemStore", {
  state() {
    return {
      activeMenus: null,
      business: null,
      businessTimes: null,
      calendarLocale: 'en',
      categories: null,
      config: null,
      error: null,
      genders: [
        "男性",
        "女性",
        "ノンバイナリー",
        "回答しない",
        "該当なし"
      ],
      groupedMenus: null,
      inactiveMenus: null,
      isLoading: false,
      LoadingMessage: '',
      mapboxURL: 'mapbox://styles/kaznyc/cl3z0c148000i14qp3onp4x8e',
      states: [
        '北海道','青森県','岩手県','宮城県','秋田県',
        '山形県','福島県','茨城県','栃木県','群馬県',
        '埼玉県','千葉県','東京都','神奈川県','新潟県',
        '富山県','石川県','福井県','山梨県','長野県',
        '岐阜県','静岡県','愛知県','三重県','滋賀県',
        '京都府','大阪府','兵庫県','奈良県','和歌山県',
        '鳥取県','島根県','岡山県','広島県','山口県',
        '徳島県','香川県','愛媛県','高知県','福岡県',
        '佐賀県','長崎県','熊本県','大分県','宮崎県',
        '鹿児島県','沖縄県'
      ],
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