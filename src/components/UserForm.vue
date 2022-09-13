<template>
  <div class="card" :key="userFormKey">
    <div class="card-body">
      <form v-if="user">
        <div class="row">
          <div class="col-sm-6">
            <small>First Name</small>
            <input
              type="text"
              v-model="updatingUser.first_name"
              class="form-control mb-2"
            >
            <small>Last Name</small>
            <input
              type="text"
              v-model="updatingUser.last_name"
              class="form-control mb-2"
            >
            <small>Gender</small>
            <select v-model="updatingUser.gender" class="form-select mb-2">
              <option
                v-for="gender in genders"
                :key="gender"
                :value="gender"
              >
                {{ gender }}
              </option>
            </select>
            <small>Email</small>
            <input
              type="text"
              v-model="updatingUser.email"
              class="form-control mb-2"
            >
            <small>Phone</small>
            <input
              type="text"
              v-model="updatingUser.phone"
              class="form-control mb-2"
            >
            <small>Birthday</small>
            <input
              class="form-control mb-2"
              type="text"
              v-model="updatingUser.birthday"
            >
            <small>Status</small>
            <Multiselect
              v-model="updatingUser.status_ids"
              :placeholder="multipleselectPlaceholder"
              :options="multiselectOptions"
              mode="tags"
              class="multiselect-tag-color mb-2"
              :close-on-select="false"
              :hideSelected="false"
              :create-option="true"
            />
          </div>
  
          <div class="col-sm-6">
            <small>State</small>
            <select
              v-model="updatingUser.state"
              class="form-select mb-2"
              autocomplete="address-level1"
            >
              <option
                v-for="state in states"
                :key="state"
                :value="state"
                >
                {{ state }}
              </option>
            </select>
            <small>City</small>
            <input
              class="form-control mb-2"
              type="text"
              v-model="updatingUser.city"
            >
            <small>Address</small>
            <input
              class="form-control mb-2"
              type="text"
              v-model="updatingUser.address"
            >
            <small>Zip</small>
            <input
              class="form-control mb-2"
              type="text"
              v-model="updatingUser.zip"
            >
            <small>Requirements/Note</small>
            <textarea
              rows="3"
              class="form-control mb-2"
              v-model="updatingUser.note"
            >
            </textarea>
            <div class="control-navbar-item">
              <button
                class="btn btn-sm btn-primary"
                @click.prevent="handleUpdateUser()"
              >
                {{ $t('Btn.update') }}
              </button>
              <button class="btn btn-sm btn-danger">{{ $t('Btn.deactivate') }}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// import { mapWritableState } from 'pinia'
// import { useSystemStore } from '@/store/systemStore'
import { useUserStore } from '@/store/userStore'
import Multiselect from '@vueform/multiselect'

export default {
  setup() {
    const userStore = useUserStore();
    // const systemStore = useSystemStore();
    return {
      userStore,
      // systemStore,
    }
  },
  components: {
    Multiselect,
  },
  created() {
    // this.user = this.userStore.user;
    this.statuses = this.userStore.statuses;
    this.updatingUser = this.user;
  },
  mounted() {
    this.userFormKey++;
  },
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      userFormKey: 0,
      updatingUser: {},
      statuses: null,
      // user: null,
      genders: [
        this.$t('Gender.male'),
        this.$t('Gender.female'),
        this.$t('Gender.nonBinary'),
        this.$t('Gender.ratherNot'),
        this.$t('Gender.NA')
      ],
      states: [
        'AL', 'AK', 'AZ', 'AR', 'CA',
        'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA',
        'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO',
        'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH',
        'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT',
        'VA', 'WA', 'WV', 'WI', 'WY'
      ],
    }
  },
  computed: {
    multiselectOptions() {
      const statusIds = this.statuses.map(status => status.id)
      const statusValues = this.statuses.map(status => status.title)
      let options = []
      for (let i in statusIds) {
        options.push({value: Number(statusIds[i]), label: statusValues[i]})
      }
      return options
    },
    multipleselectPlaceholder() {
      if (this.updatingUser.status_ids.length === 0) {
        return 'Select Status'
      }
      const statusIds = this.updatingUser.status_ids;
      let selectedStatuses = [];
      for (let j in this.multiselectOptions) {
        for (let i in statusIds) {
          if (this.multiselectOptions[j].value === statusIds[i]) {
            selectedStatuses.push(Number(j));
          }
        }
      }
      let result = [];
      for (let k in selectedStatuses) {
        result.push(this.multiselectOptions[selectedStatuses[k]]);
      }
      return result;
    },
  },
  methods: {
    handleUpdateUser() {
      this.$emit('updateUser', this.updatingUser);
    },
  },
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
  .row {
    text-align: left;
  }
  .control-navbar-item {
    float: right;
  }
  .multiselect-tag-color {
    --ms-tag-bg: rgb(75, 192, 192);
  }
</style>