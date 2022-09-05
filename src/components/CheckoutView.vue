<template>
  <div class="card">
    <div class="card-body">
      <form id="payment-form">
        <div id="payment-element">
          <!-- Elements will create form elements here -->
        </div>
        <div>
          <p></p>
          <label class="form-check-label" for="flexCheckDefault">
            <input
              class="form-check-input booking-checkbox"
              type="checkbox"
              v-model="confirmCheckbox"
              id="flexCheckDefault"
            >
            <small class="terms-and-conditions">
              Agree to our 
              <span @click="this.$router.push('/termsandconditions')">
                <a
                  class="link-primary"
                  href="#"
                  rel="noopener noreferrer"
                >
                  Terms and Condition
                </a>
              </span>
              and
              <span @click="this.$router.push('/privacyandpolicy')">
                <a 
                  class="link-primary"
                  href="#"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </span>
            </small>
          </label>
          <hr>
          <div class="container text-start">
            <p class="test-mode-payment">Test mode payment. You will be NOT charged.</p>
            <p>Use this test card to checkout</p>
            <ul>
              <li>Card No: 4242 4242 4242 4242</li>
              <li>Exp: 01/{{ nextYear }}</li>
              <li>CVC: 111</li>
            </ul>
          </div>
        </div>
        <button
          id="submit"
          class="btn btn-success"
          @click="handleCheckout()"
          :disabled="!confirmCheckbox"
        >
          Checkout
        </button>
        <p v-if="checkBoxError">{{ checkBoxError }}</p>
        <div id="error-message">
          <!-- Display error message to your customers here -->
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    stripe: {
      type: Object
    },
    elements: {
      type: Object
    },
    checkBoxError: {
      type: String
    },
  },
  data() {
    return {
      confirmCheckbox: false,
      nextYear: moment().add(1, 'years').format('YY')
    }
  },
  created() {
  },
  methods: {
    handleCheckout() {
      this.$emit('checkout')
    },
  }
}
</script>

<style scoped>
hr {
  border-top: 1px;
}
.btn {
  margin-top: 12px;
}
.booking-checkbox:checked {
  background-color: rgb(54, 162, 235);
}
.test-mode-payment {
  color: rgb(255, 99, 132);
}
.terms-and-conditions {
  font-weight: bold;
}
</style>
