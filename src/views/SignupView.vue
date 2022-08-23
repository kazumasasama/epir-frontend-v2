<template>
  <div v-if="error" class="alert alert-warning" role="alert">
    {{ error }}
  </div>
  <div class="container">
    <h2>Signup</h2>
      <div class="col-12">
        <form v-on:submit.prevent="createUser()" class="col-12 needs-validation" novalidate>
          <div class="row">
            <div class="col-sm-6">
              <p><strong>Required</strong></p>
              <small>First name</small>
              <input id="input-validation-firstname" autocomplete="given-name" type="text" v-model="user.first_name" class="form-control" required>
              <small>Last name</small>
              <input id="input-validation-lastname" autocomplete="family-name" type="text" v-model="user.last_name" class="form-control" required>
              <small>Email</small>
              <input id="input-validation-email" autocomplete="email" type="email" v-model="user.email" class="form-control" required>
              <small>Password</small>
              <input id="input-validation-password" autocomplete="new-password" type="password" v-model="user.password" class="form-control" required>
              <small>Confirm password</small>
              <input id="input-validation-passwordconfirm" autocomplete="new-password" type="password" v-model="passwordConfirm" class="form-control" required>
              <small v-if="passwordMatch" class="password-match">
                Not a matching Password.
              </small>
            </div>
            <div class="col-sm-6">
              <p><strong>Optional</strong></p>
              <small>Phone</small>
              <input autocomplete="tel-national" type="text" v-model="user.phone" class="form-control">
              <small>Zip</small>
              <input autocomplete="postal-code" type="text" v-model="user.zip" class="form-control">
              <small>State</small>
              <select v-model="user.state" class="form-select" autocomplete="address-level1">
                <option
                  v-for="state in states"
                  :key="state"
                  :value="state"
                >
                  {{ state }}
                </option>
              </select>
              <small>City</small>
              <input autocomplete="address-level2" type="text" v-model="user.city" class="form-control">
              <small>Address</small>
              <input autocomplete="street-address" type="text" v-model="user.address" class="form-control">
              <small>Gender</small>
              <select v-model="user.gender" class="form-select">
                <option
                  v-for="gender in genders"
                  :key="gender"
                  :value="gender"
                >
                  {{ gender }}
                </option>
              </select>
              <small>Birthday</small>
              <input autocomplete="bday" type="date" v-model="user.birthday" class="form-control">
            </div>
            <div class="btn-container col-sm-6">
              <button
                type="button"
                class="btn btn-secondary"
                @click="cancelSignup()"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </div>
        </form>
      </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      error: null,
      passwordConfirm: null,
      user: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        zip: "",
        state: "",
        city: "",
        address: "",
        gender: "",
        birthday: "",
      },
      genders: [
        "Male",
        "Female",
        "Non Binary",
        "Rather not to descrive",
        "N/A"
      ],
      states: [
        "AL", "AK", "AZ", "AR", "CA",
        "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA",
        "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO",
        "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH",
        "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT",
        "VA", "WA", "WV", "WI", "WY"
      ],
    }
  },
  computed: {
    passwordMatch() {
      if (this.passwordConfirm === null) {
        return false
      } else if (this.user.password !== this.passwordConfirm) {
        return true
      }
      return false
    },
  },
  watch: {
    'user.first_name'() {
      const inputValidationFirstname = document.getElementById('input-validation-firstname');
      if (this.user.first_name === "") {
        this.AddInvalidCssClass(inputValidationFirstname)
      } else if (this.user.first_name !== "") {
        this.AddValidCssClass(inputValidationFirstname)
      }
    },
    'user.last_name'() {
      const inputValidationLastname = document.getElementById('input-validation-lastname');
      if (this.user.last_name === "") {
        this.AddInvalidCssClass(inputValidationLastname)
      } else if (this.user.last_name !== "") {
        this.AddValidCssClass(inputValidationLastname)
      }
    },
    'user.email'() {
      const inputValidationEmail = document.getElementById('input-validation-email');
      if (this.user.email === "") {
        this.AddInvalidCssClass(inputValidationEmail)
      } else if (this.user.email !== "") {
        this.AddValidCssClass(inputValidationEmail)
      }
    },
    'user.password'() {
      const inputValidationPassword = document.getElementById('input-validation-password');
      if (this.user.password === "") {
        this.AddInvalidCssClass(inputValidationPassword)
      } else if (this.user.password !== "") {
        this.AddValidCssClass(inputValidationPassword)
      }
    },
    passwordConfirm() {
      const inputValidationPassword = document.getElementById('input-validation-password');
      const inputValidationPasswordconfirm = document.getElementById('input-validation-passwordconfirm');
      if (this.passwordConfirm === "" || !this.passwordConfirm) {
        this.AddInvalidCssClass(inputValidationPasswordconfirm);
      } else if (this.passwordConfirm) {
        if (this.user.password === this.passwordConfirm) {
          this.AddValidCssClass(inputValidationPassword);
          this.AddValidCssClass(inputValidationPasswordconfirm);
        } else if (this.user.password !== this.passwordConfirm) {
          this.AddInvalidCssClass(inputValidationPasswordconfirm);
        } 
      }
    },
  },
  methods: {
    AddValidCssClass(element) {
      element.classList.remove('is-invalid');
      element.classList.add('is-valid');
    },
    AddInvalidCssClass(element) {
      element.classList.remove('is-valid');
      element.classList.add('is-invalid');
    },
    validateEmptyRequiredForm() {
      let invalidKeys = [];
      const keys = (Object.keys(this.user));
      for (let i in keys) {
        if (this.user[keys[i]] === "") {
          if (keys[i] === "first_name" || keys[i] === "last_name" || keys[i] === "email" || keys[i] === "password")
          invalidKeys.push(keys[i])
        }
      }
      if (!invalidKeys.length) {
        return true;
      } else {
        for (let i in invalidKeys) {
          invalidKeys[i] = (invalidKeys[i].charAt(0).toUpperCase() + invalidKeys[i].slice(1)).replace('_', ' ')
        }
        if (!this.passwordConfirm) {
          invalidKeys.push('and Confirm password')
        } else {
          invalidKeys[invalidKeys.length - 1] = 'and ' + invalidKeys[invalidKeys.length - 1]
        }
        return invalidKeys.join(', ');
      }
    },
    createUser() {
      const valid = this.validateEmptyRequiredForm()
      if (valid !== true) {
        this.error = `Please fill all the required fields: ${valid}`
        return
      }
      if (this.user.password === this.passwordConfirm) {
        axios.post('/users', this.user)
        .then((res)=> {
          localStorage.setItem("user_id", res.data.user_id);
          let user = {
            email: res.data.email,
            password: this.user.password
          }
          axios.post('/sessions', user)
          .then((res)=> {
            axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.jwt;
            localStorage.setItem("jwt", res.data.jwt);
            localStorage.setItem("user_id", res.data.user_id);
          })
          .catch((error)=> {
            const response = error.response;
            this.error = `Something went wrong. Please try again.(Error code: ${response.status}/ ${response.statusText})`
            return
          })
        })
        .catch((error)=> {
          const response = error.response;
          this.error = `Something went wrong. Please try again.(Error code: ${response.status}/ ${response.statusText})`
          return
        })
        this.user = {};
        this.$router.push('/appointments');
      } else if (this.user.password !== this.passwordConfirm) {
        this.error = "Password and Confirm password are not matching."
      }
    },
    cancelSignup() {
      this.user = {};
      this.$router.push('/');
    },
  }
}
</script>

<style scoped>
  .col-sm-6 {
    text-align: left;
  }
  .password-match {
    color: rgb(255, 99, 132);
  }
</style>