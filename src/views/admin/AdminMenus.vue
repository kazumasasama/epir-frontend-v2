<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-6 menu-nav-tab-container">
        <!-- Tabs -->
        <ul class="nav nav-tabs active-nav-tabs">
          <li class="nav-item" id="tab-active-menu" @click="selectActiveTab()">
            <a class="nav-link active-nav-link">Active</a>
          </li>
          <li class="nav-item" id="tab-inactive-menu" @click="selectInactiveTab()">
            <a class="nav-link">Inactive</a>
          </li>
        </ul>
        <!-- Active Menus -->
        <div
          v-if="menuContent === 'active'"
          class="list-group active-menu-container-card card"
          id="list-tab"
          role="tablist"
        >
          <label class="form-check-label">
            <ul v-for="menu in menus" :key="menu.id">
              <div>
                <input
                  class="form-check-input me-1 menu-checkbox"
                  type="radio"
                  :value="menu"
                  v-model="selectedMenu"
                >
                {{ menu.title }}
                <li class="text-end"><small>{{ menu.duration }} min | ${{ menu.price }}~</small></li>
                <hr class="menu-hr-divider">
              </div>
            </ul>
          </label>
        </div>
        <!-- Inactive Menus -->
        <div
          v-if="menuContent === 'inactive'"
          class="list-group inactive-menu-container-card card"
          id="list-tab"
          role="tablist"
        >
          <label class="form-check-label">
            <ul v-for="menu in inactiveMenus" :key="menu.id">
              <input
                class="form-check-input me-1 menu-checkbox"
                type="radio"
                :value="menu"
                v-model="selectedMenu"
              >
              {{ menu.title }}
              <li class="text-end"><small>{{ menu.duration }} min | ${{ menu.price }}~</small></li>
              <hr class="menu-hr-divider">
            </ul>
          </label>
        </div>
      </div>
      <!-- menu controller -->
      <div class="col-sm-6">
        <div class="card">
          <div class="card-body">
            <form>
              <small>Title</small>
              <input type="text" v-model="updatingMenu.title" class="form-control">
              <small>Price</small>
              <input type="number" v-model="updatingMenu.price" class="form-control">
              <small>Duration</small>
              <input type="number" v-model="updatingMenu.duration" class="form-control">
              <small>Description</small>
              <textarea type="text" v-model="updatingMenu.description" class="form-control"></textarea>
              <div class="btn-container">
                <button @click="createMenu()" class="btn-sm btn-outline-success btn">New Menu</button>
                <button @click="updateMenu()" class="btn-sm btn-outline-primary btn">Update</button>
                <button
                  type="reset"
                  class="btn-sm btn-outline-secondary btn"
                  @click="clearForm()"
                >
                  Clear Form
                </button>
                <button
                  class="btn-sm btn-outline-danger btn"
                  v-if="menuContent === 'active'"
                  @click="deactivateMenu()"
                >
                  Deactivate
                </button>
                <button
                  class="btn-sm btn-outline-danger btn"
                  v-if="menuContent === 'inactive'"
                  @click="activateMenu()"
                >
                  Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        menus: [],
        inactiveMenus: [],
        selectedMenu: {},
        updatingMenu: {},
        menuContent: "active",
      }
    },
    created() {
      this.indexMenus();
    },
    watch: {
      selectedMenu() {
        this.updatingMenu = this.selectedMenu;
      }
    },
    methods: {
      indexMenus() {
        axios.get("/menus.json")
        .then((res)=> {
          this.menus = res.data.active;
          this.inactiveMenus = res.data.inactive;
        })
      },
      createMenu() {
        let menu = this.updatingMenu;
        if (menu.id) {
          delete menu['id'];
        }
        axios
        .post('/menus', this.updatingMenu)
        .then((res)=> {
          this.menus.push(res.data);
          this.updatingMenu = {};
        })
      },
      updateMenu() {
        let id = this.updatingMenu.id;
        axios
        .patch(`/menus/${id}`, this.updatingMenu)
        .then((res)=> {
          this.selectedMenu = {};
          let menu = this.menus.find(menu => menu.id === id);
          let i = this.menus.indexOf(menu);
          this.menus[i] = res.data;
        })
      },
      deactivateMenu() {
        let id = this.updatingMenu.id;
        this.updatingMenu.active = false;
        axios
        .patch(`/menus/${id}`, this.updatingMenu)
        .then((res)=> {
          this.selectedMenu = {};
          let menu = this.menus.find(menu => menu.id === id);
          let i = this.menus.indexOf(menu);
          this.menus[i] = res.data;
        })
      },
      activateMenu() {
        let id = this.updatingMenu.id;
        this.updatingMenu.active = true;
        axios
        .patch(`/menus/${id}`, this.updatingMenu)
        .then((res)=> {
          this.selectedMenu = {};
          let menu = this.menus.find(menu => menu.id === id);
          let i = this.menus.indexOf(menu);
          this.menus[i] = res.data;
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
  .col-12 {
    text-align: left;
  }
  .col-sm-6 {
    text-align: left;
  }
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
  .active-nav-tabs .active-nav-link {
    background-color: rgb(75, 192, 192);
    border-color: rgb(227, 229, 253);
    color: #fff;
    position: relative;
    bottom: 3px;
  }
  .active-menu-container-card {
    border-color: rgb(75, 192, 192);
    border-width: 4px;
  }
  .inactive-menu-container-card {
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
</style>