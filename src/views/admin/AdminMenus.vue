<template>
  <div class="container">
    <div
      v-if="error"
      class="alert alert-danger"
      role="alert"
    >
      {{ error }}
    </div>

    <div class="modal" id="menu-modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-body text-start">
            <form>
              <div v-if="modalMode === 'create'">
                <small>Active</small>
                <div class="form-check form-switch">
                  <input
                    v-model="updatingMenu.active"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="activation-switch"
                    checked
                  >
                </div>
              </div>
              <small>{{ $t('Forms.title') }}*</small>
              <input type="text" v-model="updatingMenu.title" class="form-control">
              <small>{{ $t('Forms.price') }}*</small>
              <input type="number" v-model="updatingMenu.price" class="form-control">
              <small>{{ $t('Forms.duration') }}*</small>
              <input type="number" v-model="updatingMenu.duration" class="form-control">
              <small>{{ $t('Forms.description') }}</small>
              <textarea type="text" v-model="updatingMenu.description" class="form-control"></textarea>
              <small>Category*</small>
              <select
                v-model="updatingMenu.category_id"
                class="form-select"
                autocomplete="off"
                placeholder="Select Category"
              >
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.title }}
                </option>
              </select>
            </form>
          </div>
          <div class="modal-footer">
            <div class="btn-container">
              <button
              v-if="modalMode === 'create'"
                @click.prevent="createMenu()"
                class="btn-sm btn-outline-success btn"
              >
                {{ $t('Btn.newMenu') }}
              </button>
              <button
                v-if="modalMode === 'update'"
                @click.prevent="updateMenu(updatingMenu.active)"
                class="btn-sm btn-outline-success btn"
              >
                {{ $t('Btn.update') }}
              </button>
              <button
                type="reset"
                class="btn-sm btn-outline-primary btn"
                @click.prevent="clearForm()"
              >
                {{ $t('Btn.clearForm') }}
              </button>
              <button
                class="btn-sm btn-outline-danger btn"
                v-if="modalMode === 'update' && menuContent === 'active'"
                @click.prevent="updateMenu(false)"
              >
                {{ $t('Btn.deactivate') }}
              </button>
              <button
                class="btn-sm btn-outline-danger btn"
                v-if="modalMode === 'update' && menuContent === 'inactive'"
                @click.prevent="updateMenu(true)"
              >
                {{ $t('Btn.activate') }}
              </button>
              <button
                class="btn-sm btn-outline-secondary btn"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow">
      <div class="card-header text-start">
        <a href="#">New Category</a>
        <a href="#" @click="showModal(menu, 'create')">New Menu</a>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4 col-sm-5">
            <div class="d-flex category-nav">
              <div
                class="nav flex-column nav-pills me-3"
                role="tablist"
              >
                <button
                  v-for="(category, index) in categories"
                  :key="category.id"
                  :id="`category-title-${index}`"
                  @click.prevent="switchCategory(category.id)"
                  class="nav-link text-start btn"
                  data-bs-toggle="pill"
                  type="button"
                  aria-selected="true"
                >
                  {{ category.title }}
                  <!-- <span
                    class="badge bg-success rounded-pill"
                    v-if="groupedMenus[category.id]"
                  >
                    {{ groupedMenus[category.id].length }}
                  </span>
                  <span
                    class="badge bg-success rounded-pill"
                    v-if="!groupedMenus[category.id]"
                  >
                    {{ 0 }}
                  </span> -->
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-8 col-md-8 col-sm-7 menu-nav-tab-container text-start">
            <!-- Tabs -->
            <ul class="nav nav-tabs active-nav-tabs">
              <li
                class="nav-item"
                id="tab-active-menu"
                @click.prevent="selectActiveTab()"
              >
                <a class="nav-link active-nav-link">{{ $t('Btn.active') }}</a>
              </li>
              <li
                class="nav-item"
                id="tab-inactive-menu"
                @click.prevent="selectInactiveTab()"
              >
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
                @click.prevent="showModal(menu, 'update')"
                class="form-check-label"
              >
                <ul>
                  <input
                    class="form-check-input me-1 menu-checkbox no-active-menu-checkbox"
                    type="radio"
                    :value="menu"
                    v-model="selectedMenu"
                    v-if="activeMenus[0].id !== -1"
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
                @click.prevent="showModal(menu, 'update')"
                class="form-check-label"
              >
                <ul>
                  <input
                    class="form-check-input me-1 menu-checkbox no-inactive-menu-checkbox"
                    type="radio"
                    :value="menu"
                    v-model="selectedMenu"
                    v-if="inactiveMenus[0].id !== -1"
                  >
                  {{ menu.title }}
                  <li class="text-end">
                    <small>{{ menu.duration }} {{ $t('DateTime.min') }} | {{ $t('Currency') }}{{ menu.price }}</small>
                  </li>
                </ul>
                <hr class="menu-hr-divider">
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapWritableState, mapActions } from 'pinia'
  import { useSystemStore } from '@/store/systemStore'
  import axios from 'axios'
  import * as bootstrap from 'bootstrap'

  export default {
    setup() {
      const systemStore = useSystemStore;
      return {
        systemStore,
      }
    },
    data() {
      return {
        message: null,
        error: null,
        selectedMenu: {},
        menu: {},
        updatingMenu: {},
        menuContent: "active",
        categoryMenu: null,
        activeMenus: [
          {
            id: -1,
            title: 'Select a category',
            price: '--',
            duration: '--',
          }
        ],
        inactiveMenus: [
          {
            id: -1,
            title: 'Select a category',
            price: '--',
            duration: '--',
          }
        ],
        menuModal: null,
        modalMode: 'create',
      }
    },
    created() {
    },
    mounted() {
      this.switchCategory(1)
      let category = document.getElementById('category-title-0');
      category.classList.add('active');
      this.menuModal = new bootstrap.Modal(document.getElementById('menu-modal'));
    },
    watch: {
      selectedMenu() {
        this.menu = this.selectedMenu;
      }
    },
    computed: {
      ...mapWritableState(useSystemStore, ['categories']),
      ...mapWritableState(useSystemStore, ['groupedMenus']),
    },
    methods: {
      ...mapActions(useSystemStore, ['startLoading']),
      ...mapActions(useSystemStore, ['endLoading']),
      switchCategory(categoryId) {
        if (this.groupedMenus[categoryId]) {
          const active = this.groupedMenus[categoryId].filter(menu => menu.active === true);
          this.activeMenus = active;
          const inactive = this.groupedMenus[categoryId].filter(menu => menu.active === false);
          this.inactiveMenus = inactive;
          if (!active.length) {
            this.activeMenus = [
              {
                id: -1,
                title: 'No menu in this category...',
                price: '--',
                duration: '--',
              }
            ];
            window.onload = function(){document.getElementsByClassName('no-active-menu-checkbox').addAttribute('disabled')}
          }
          if (!inactive.length) {
            this.inactiveMenus = [
              {
                id: -1,
                title: 'No menu in this category...',
                price: '--',
                duration: '--',
              }
            ];
            window.onload = function(){document.getElementsByClassName('no-inactive-menu-checkbox').addAttribute('disabled')}
          }
        } else {
          this.inactiveMenus = [
            {
              id: -1,
              title: 'No menu in this category...',
              price: '--',
              duration: '--',
            }
          ];
          this.activeMenus = [
            {
              id: -1,
              title: 'No menu in this category...',
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
        axios.post('/menus', menu)
        .then((res)=> {
          const categoryId = res.data.category_id;
          this.groupedMenus[categoryId].push(res.data)
          this.updatingMenu = {};
          const modal = this.menuModal;
          modal.hide();
        })
        .catch((error)=> {
          this.error = error;
        })
      },
      updateMenu(active) {
        const newMenu = this.updatingMenu;
        newMenu.active = active;
        const id = this.updatingMenu.id
        axios.patch(`/menus/${id}`, newMenu)
        .then((res)=> {
          let prevMenu = this.menu;
          let i = this.groupedMenus[prevMenu.category_id].indexOf(prevMenu);
          this.groupedMenus[prevMenu.category_id].splice(i, 1);
          if (prevMenu.category_id !== newMenu.category_id) {
            const prevCategoryEl = document.getElementById(`category-title-${prevMenu.category_id - 1}`)
            prevCategoryEl.classList.remove('active')
            const currentCategoryEl = document.getElementById(`category-title-${newMenu.category_id - 1}`)
            currentCategoryEl.classList.add('active')
          }
          
          this.groupedMenus[newMenu.category_id].push(newMenu);
          this.selectedMenu = {};
          this.menuModal.hide();
          const menuTitle = res.data.title;
          this.message = `${menuTitle} was successfully updated`;
          this.switchCategory(newMenu.category_id);
        })
      },
      deactivateMenu() {
        let id = this.menu.id;
        this.menu.active = false;
        axios.patch(`/menus/${id}`, this.menu)
        .then((res)=> {
          this.selectedMenu = {};
          let menu = this.menus.find(menu => menu.id === id);
          let i = this.menus.indexOf(menu);
          this.menus.splice(i, 1);
          this.inactiveMenus.push(res.data);
        })
      },
      activateMenu() {
        let id = this.menu.id;
        this.menu.active = true;
        axios.patch(`/menus/${id}`, this.menu)
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
      showModal(menu, func) {
        if (this.inactiveMenus[0].id === -1) {
          return
        }
        if (func === 'create') {
          this.menu = {};
          this.updatingMenu = {};
        } else {
          this.menu = Object.assign({}, menu);
          this.updatingMenu = Object.assign({}, menu);
        }
        this.modalMode = func;
        const modal = this.menuModal;
        modal.show();
      }
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
  .card-header {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .card-header a {
    font-weight: bold;
    color: rgb(255, 99, 132);
    margin-right: 18px;
  }
  .card-header a:hover {
    font-weight: bold;
    text-decoration: none;
    color: rgb(54, 162, 235);
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
    max-width: 500px;
  }
  .list-group-item+.list-group-item {
    border-top-width: 1px;
  }
</style>