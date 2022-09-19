<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="card shadow">
          <div class="card-body">
              <div class="row">
                <div class="col-lg-4 col-md-4 col-sm-5">
                  <div class="d-flex category-nav">
                    <div
                      class="nav flex-column nav-pills me-3"
                      role="tablist"
                    >
                      <button
                        v-for="category in categories"
                        :key="category.id"
                        @click.prevent="switchCategory(category.id)"
                        class="nav-link text-start btn"
                        data-bs-toggle="pill"
                        type="button"
                        aria-selected="true"
                      >
                        {{ category.title }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-7 menu-nav-tab-container text-start">
                  <!-- Tabs -->
                  <ul class="nav nav-tabs active-nav-tabs">
                    <li class="nav-item" id="tab-active-menu" @click.prevent="selectActiveTab()">
                      <a class="nav-link active-nav-link">{{ $t('Btn.active') }}</a>
                    </li>
                    <li class="nav-item" id="tab-inactive-menu" @click.prevent="selectInactiveTab()">
                      <a class="nav-link">{{ $t('Btn.inactive') }}</a>
                    </li>
                  </ul>
                  <!-- Active Menus -->
                  <div
                    v-if="menuContent === 'active'"
                    class="list-group active-menu-container-card card"
                    id="list-tab"
                    role="tablist"
                  >
                      <label
                        v-for="menu in activeMenus"
                        :key="menu.id"
                        class="form-check-label"
                      >
                        <ul>
                          <input
                            class="form-check-input me-1 menu-checkbox no-active-menu-checkbox"
                            type="radio"
                            :value="menu"
                            v-model="selectedMenu"
                          >
                          {{ menu.title }}
                          <li class="text-end"><small>{{ menu.duration }} {{ $t('DateTime.min') }} | {{ $t('Currency') }}{{ menu.price }}</small></li>
                        </ul>
                        <hr class="menu-hr-divider">
                      </label>
                  </div>
                  <!-- Inactive Menus -->
                  <div
                    v-if="menuContent === 'inactive'"
                    class="list-group inactive-menu-container-card card"
                    id="list-tab"
                    role="tablist"
                  >
                    <label
                      v-for="menu in inactiveMenus"
                      :key="menu.id"
                      class="form-check-label"
                    >
                      <ul>
                        <input
                          class="form-check-input me-1 menu-checkbox no-inactive-menu-checkbox"
                          type="radio"
                          :value="menu"
                          v-model="selectedMenu"
                        >
                        {{ menu.title }}
                        <li class="text-end"><small>{{ menu.duration }} {{ $t('DateTime.min') }} | {{ $t('Currency') }}{{ menu.price }}</small></li>
                      </ul>
                      <hr class="menu-hr-divider">
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- menu controller -->
          <div class="col-lg-4 col-md-12 text-start">
            <div class="card shadow">
              <div class="card-body">
                <form>
                  <small>{{ $t('Forms.title') }}</small>
                  <input type="text" v-model="updatingMenu.title" class="form-control">
                  <small>{{ $t('Forms.price') }}</small>
                  <input type="number" v-model="updatingMenu.price" class="form-control">
                  <small>{{ $t('Forms.duration') }}</small>
                  <input type="number" v-model="updatingMenu.duration" class="form-control">
                  <small>{{ $t('Forms.description') }}</small>
                  <textarea type="text" v-model="updatingMenu.description" class="form-control"></textarea>
                  <small>Category</small>
                  <select
                    v-model="updatingMenu.category_id"
                    class="form-select"
                    autocomplete="off"
                  >
                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.title }}
                    </option>
                  </select>
                  <div class="btn-container">
                    <button @click.prevent="createMenu()" class="btn-sm btn-outline-success btn">{{ $t('Btn.newMenu') }}</button>
                    <button @click.prevent="updateMenu()" class="btn-sm btn-outline-primary btn">{{ $t('Btn.update') }}</button>
                    <button
                      type="reset"
                      class="btn-sm btn-outline-secondary btn"
                      @click.prevent="clearForm()"
                    >
                      {{ $t('Btn.clearForm') }}
                    </button>
                    <button
                      class="btn-sm btn-outline-danger btn"
                      v-if="menuContent === 'active'"
                      @click.prevent="deactivateMenu()"
                    >
                      {{ $t('Btn.deactivate') }}
                    </button>
                    <button
                      class="btn-sm btn-outline-danger btn"
                      v-if="menuContent === 'inactive'"
                      @click.prevent="activateMenu()"
                    >
                      {{ $t('Btn.activate') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { mapWritableState } from 'pinia'
  import { useSystemStore } from '@/store/systemStore'
  import axios from 'axios'
  export default {
    setup() {
      const systemStore = useSystemStore;
      return {
        systemStore,
      }
    },
    data() {
      return {
        selectedMenu: {},
        updatingMenu: {},
        menuContent: "active",
        categoryMenu: null,
        activeMenus: null,
        inactiveMenus: null,
      }
    },
    created() {
      const id = this.categories[0].id;
      this.switchCategory(id);
    },
    watch: {
      selectedMenu() {
        this.updatingMenu = this.selectedMenu;
      }
    },
    computed: {
      ...mapWritableState(useSystemStore, ['categories']),
      ...mapWritableState(useSystemStore, ['groupedMenus']),
    },
    methods: {
      switchCategory(categoryId) {
        if (this.groupedMenus[categoryId]) {
          const active = this.groupedMenus[categoryId].filter(menu => menu.active === true);
          this.activeMenus = active;
          const inactive = this.groupedMenus[categoryId].filter(menu => menu.active === false);
          this.inactiveMenus = inactive;
          if (!active.length) {
            this.activeMenus = [
              {
                title: 'No menu here...',
                price: '--',
                duration: '--',
              }
            ];
            window.onload = function(){document.getElementsByClassName('no-active-menu-checkbox').addAttribute('disabled')}
          }
          if (!inactive.length) {
            this.inactiveMenus = [
              {
                title: 'No menu here...',
                price: '--',
                duration: '--',
              }
            ];
            window.onload = function(){document.getElementsByClassName('no-inactive-menu-checkbox').addAttribute('disabled')}
          }
        } else {
          this.inactiveMenus = [
            {
              title: 'No menu here...',
              price: '--',
              duration: '--',
            }
          ];
          this.activeMenus = [
            {
              title: 'No menu here...',
              price: '--',
              duration: '--',
            }
          ];
          window.onload = function(){document.getElementsByClassName('no-inactive-menu-checkbox').addAttribute('disabled')}
          window.onload = function(){document.getElementsByClassName('no-active-menu-checkbox').addAttribute('disabled')}
        }
      },
      createMenu() {
        let menu = this.updatingMenu;
        if (menu.id) {
          delete menu['id'];
        }
        axios.post('/menus', this.updatingMenu)
        .then((res)=> {
          this.systemStore.activeMenus.push(res.data);
          this.updatingMenu = {};
        })
      },
      updateMenu() {
        let id = this.updatingMenu.id;
        axios.patch(`/menus/${id}`, this.updatingMenu)
        .then((res)=> {
          this.selectedMenu = {};
          if (res.data.active) {
            let menu = this.systemStore.inactiveMenus.find(menu => menu.id === id);
            let i = this.systemStore.inactiveMenus.indexOf(menu);
            this.systemStore.inactiveMenus.splice(i, 1)
            this.systemStore.activeMenus.push(res.data);
          } else {
            let menu = this.systemStore.activeMenus.find(menu => menu.id === id);
            let i = this.systemStore.activeMenus.indexOf(menu);
            this.systemStore.activeMenus.splice(i, 1)
            this.systemStore.inactiveMenus.push(res.data);
          }
        })
      },
      deactivateMenu() {
        let id = this.updatingMenu.id;
        this.updatingMenu.active = false;
        axios.patch(`/menus/${id}`, this.updatingMenu)
        .then((res)=> {
          this.selectedMenu = {};
          let menu = this.menus.find(menu => menu.id === id);
          let i = this.menus.indexOf(menu);
          this.menus.splice(i, 1);
          this.inactiveMenus.push(res.data);
        })
      },
      activateMenu() {
        let id = this.updatingMenu.id;
        this.updatingMenu.active = true;
        axios.patch(`/menus/${id}`, this.updatingMenu)
        .then((res)=> {
          this.selectedMenu = {};
          let menu = this.menus.find(menu => menu.id === id);
          let i = this.menus.indexOf(menu);
          this.inactiveMenus.splice(i, 1);
          this.menus.push(res.data);
        })
      },
      clearForm() {
        this.selectedMenu = {};
      },
      selectActiveTab() {
        let active = document.getElementById('tab-active-menu')
        let activeTab = active.getElementsByClassName('nav-link')[0]
        activeTab.style.backgroundColor = 'rgb(75, 192, 192)'
        activeTab.style.bottom = '3px'

        let inactive = document.getElementById('tab-inactive-menu')
        let inactiveTab = inactive.getElementsByClassName('nav-link')[0]
        inactiveTab.style.backgroundColor = 'rgb(115, 120, 191)'
        inactiveTab.style.bottom = '0px'

        this.menuContent = 'active';
      },
      selectInactiveTab() {
        let active = document.getElementById('tab-active-menu')
        let activeTab = active.getElementsByClassName('nav-link')[0]
        activeTab.style.backgroundColor = 'rgb(61, 156, 156)'
        activeTab.style.bottom = '0px'

        let inactive = document.getElementById('tab-inactive-menu')
        let inactiveTab = inactive.getElementsByClassName('nav-link')[0]
        inactiveTab.style.backgroundColor = 'rgb(140, 146, 232)'
        inactiveTab.style.bottom = '3px'

        this.menuContent = 'inactive';
      },
    },
  }
</script>

<style scoped>
  .btn-container {
    margin-top: 10px;
    margin-left: -8px;
  }
  .menu-checkbox:checked {
    background-color: rgb(54, 162, 235);
  }
  .nav-tabs {
    margin-bottom: -4px;
    margin-left: 10px;
  }
  .nav-tabs .nav-link {
    background-color: rgb(115, 120, 191);
    border-color: rgb(227, 229, 253);
    color: #fff;
    position: relative;
    bottom: 0px;
    cursor: pointer;
  }
  .category-nav {
    border-right: 1px;
  }
  .active-nav-tabs .active-nav-link {
    background-color: rgb(75, 192, 192);
    border-color: rgb(227, 229, 253);
    color: #fff;
    position: relative;
    bottom: 3px;
  }
  .active-menu-container-card {
    background-color: rgba(75, 192, 192, 0.1);
    border-color: rgb(75, 192, 192);
    border-width: 4px;
  }
  .inactive-menu-container-card {
    background-color: rgba(140, 146, 232, 0.1);
    border-color: rgb(140, 146, 232);
    border-width: 4px;
  }
  ul {
    margin-top: 3px;
    margin-bottom: 3px;
  }
  .form-check-label {
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 20px;
  }
  .menu-hr-divider {
    border-top: 0.3px;
    margin-top: 3px;
    margin-bottom: 3px;
  }
  .menu-nav-tab-container {
    margin-bottom: 12px;
  }
  .list-group-item+.list-group-item {
    border-top-width: 1px;
  }
</style>