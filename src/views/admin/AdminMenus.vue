<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="btn-container text-start">
          <button
            @click="menuContent = 'active'"
            class="btn btn-outline-primary btn-sm"
          >
            Active Menus
          </button>
          <button
            @click="menuContent = 'inactive'"
            class="btn btn-outline-primary btn-sm"
          >
            Inactive Menus
          </button>
        </div>
      </div>

      <div class="col-sm-6" v-if="menuContent === 'active'">
        <div
          class="list-group"
          id="list-tab"
          role="tablist"
          v-for="menu in menus"
          :key="menu.id"
        >
          <label
            class="list-group-item form-check-label"
          >
            <input
              class="form-check-input me-1"
              type="radio"
              :value="menu"
              v-model="selectedMenu"
            >
            {{ menu.title }}
            <div class="text-end">
              <small>{{ menu.duration }} min</small>
              <small> | </small>
              <small>${{ menu.price }}~</small>
            </div>
          </label>
        </div>
      </div>
      
      <div class="col-sm-6" v-if="menuContent === 'inactive'">
        <div
          class="list-group"
          id="list-tab"
          role="tablist"
        >
          <label
            class="list-group-item"
            v-for="menu in inactiveMenus"
            :key="menu.id"
          >
            <input
              class="form-check-input me-1"
              type="radio"
              :value="menu"
              v-model="selectedMenu"
            >
            {{ menu.title }}
            <div>
              <div class="text-end">
                <small>{{ menu.duration }} min</small>
                <small> | </small>
                <small>${{ menu.price }}~</small>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div class="col-sm-6">
        <div class="card">
          <div class="container">
            <form>
              <div class="row">
                <div class="col-12">
                  <small>Title</small>
                  <input type="text" v-model="updatingMenu.title" class="form-control">
                  <small>Price</small>
                  <input type="number" v-model="updatingMenu.price" class="form-control">
                  <small>Duration (min)</small>
                  <input type="number" v-model="updatingMenu.duration" class="form-control">
                  <small>Description</small>
                  <textarea type="text" v-model="updatingMenu.description" class="form-control"></textarea>
                  <div class="btn-container col-12">
                    <div class="col">
                      <button @click="createMenu()" class="btn-sm btn-success btn">New Menu</button>
                      <button @click="updateMenu()" class="btn-sm btn-primary btn">Update</button>
                      <button type="reset" class="btn-sm btn-secondary btn" @click="clearForm()">Clear</button>
                      <button class="btn-sm btn-danger btn" v-if="menuContent === 'active'" @click="deactivateMenu()">Deactivate</button>
                      <button class="btn-sm btn-danger btn" v-if="menuContent === 'inactive'" @click="activateMenu()">Activate</button>
                    </div>
                  </div>
                </div>
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
  }
</style>