<template>
  <div class="container">
    <div class="modal" id="menu-modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-body text-start card-base-body">
            <form>
              <small>使用中</small>
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
              <small>メニュー名*</small>
              <input type="text" v-model="updatingMenu.title" class="form-control">
              <small>{{ $t('Forms.price') }}*</small>
              <input type="number" v-model="updatingMenu.price" class="form-control">
              <small>{{ $t('Forms.duration') }}*</small>
              <input type="number" v-model="updatingMenu.duration" class="form-control">
              <small>{{ $t('Forms.description') }}</small>
              <textarea type="text" v-model="updatingMenu.description" class="form-control"></textarea>
              <small>カテゴリー*</small>
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
            <div
              v-if="error"
              class="alert alert-danger"
              role="alert"
            >
              {{ error }}
            </div>
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
                class="btn-sm btn-outline-secondary btn"
                data-bs-dismiss="modal"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow card-base">
      <div class="card-header text-end">
        <button class="btn btn-sm btn-outline-danger" @click="showModal(menu, 'create')">新規メニュー</button>
        {{ ' ' }}
        <button class="btn btn-sm btn-outline-danger" @click="$router.push('/admin/config')">新規カテゴリー</button>
      </div>
      <div class="card-body card-base-body">
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
                title: 'まだメニューがありません',
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
                title: 'まだメニューがありません',
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
              title: 'まだメニューがありません',
              price: '--',
              duration: '--',
            }
          ];
          this.activeMenus = [
            {
              id: -1,
              title: 'まだメニューがありません',
              price: '--',
              duration: '--',
            }
          ];
          window.onload = function(){document.getElementsByClassName('no-inactive-menu-checkbox').addAttribute('disabled')}
          window.onload = function(){document.getElementsByClassName('no-active-menu-checkbox').addAttribute('disabled')}
        }
      },
      validateMenuForm() {
        const menu = this.updatingMenu;
        if (!menu.title.split('').length) {
          this.error = "メニュー名は必須です。";
        } else if (!menu.price.split('').length) {
          this.error = "金額は必須です。";
        } else if (!menu.duration.split('').length) {
          this.error = "金額は必須です。";
        }
        return false;
      },
      createMenu() {
        this.validateMenuForm();
        if (!this.validateMenuForm()) {
          return
        }
        this.error = null;
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
        this.validateMenuForm();
        if (!this.validateMenuForm()) {
          return
        }
        this.error = null;
        const updatingMenu = this.updatingMenu;
        updatingMenu.active = active;
        const id = this.updatingMenu.id
        axios.patch(`/menus/${id}`, updatingMenu)
        .then((res)=> {
          let prevMenu = this.menu;
          let i = this.groupedMenus[prevMenu.category_id].indexOf(prevMenu);
          this.groupedMenus[prevMenu.category_id].splice(i, 1);
          if (prevMenu.category_id !== updatingMenu.category_id) {
            const prevCategoryEl = document.getElementById(`category-title-${prevMenu.category_id - 1}`)
            prevCategoryEl.classList.remove('active')
            const currentCategoryEl = document.getElementById(`category-title-${updatingMenu.category_id - 1}`)
            currentCategoryEl.classList.add('active')
          }
          
          this.groupedMenus[updatingMenu.category_id].push(updatingMenu);
          this.selectedMenu = {};
          this.menuModal.hide();
          const menuTitle = res.data.title;
          this.message = `${menuTitle} was successfully updated`;
          this.switchCategory(updatingMenu.category_id);
        })
        .catch((error)=> {
          console.log(error)
          this.error = error;
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
        this.error = null;
        if (this.menuContent ==='inactive' && this.inactiveMenus[0].id === -1) {
          return
        } else {
          if (func === 'create') {
            this.menu = {};
            this.updatingMenu = {};
            this.updatingMenu.active = true;
          } else if (func === 'update') {
            this.menu = Object.assign({}, menu);
            this.updatingMenu = Object.assign({}, menu);
          }
          this.modalMode = func;
          const modal = this.menuModal;
          modal.show();
        }
      }
    },
  }
</script>

<style scoped>
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
  }
  .card-header a:hover {
    font-weight: bold;
    text-decoration: none;
    color: rgb(54, 162, 235);
  }
  .card-base-body {
    padding: 30px;
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