<template>
  <div class="container">
    <h1>Sign up</h1>
    <form @submit.prevent="validateBeforeSubmit" v-if="!signup_submitted">
      <div class="form-group row" :class="{'has-error': errors.has('email') }">
        <label class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
          <input name="email" v-model="email" data-vv-name="email" v-validate="'required|email'" type="email" class="form-control">
          <p class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</p>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Password</label>
        <div class="col-sm-10">
          <input name="password" v-model="password" data-vv-name="password" v-validate="'required|min:8'" type="password" class="form-control">
          <p class="text-danger" v-if="errors.has('password')">{{ errors.first('password') }}</p>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Confirm Password</label>
        <div class="col-sm-10">
          <input name="confirm_password" v-model="confirm_password" data-vv-name="confirm_password" v-validate="'confirmed:password'" type="password" class="form-control">
          <p class="text-danger" v-if="errors.has('confirm_password')">{{ errors.first('confirm_password') }}</p>
        </div>
      </div>
      
      <div class="form-group row">
        <div class="offset-sm-2 col-sm-10">
          <button type="submit" class="btn btn-primary">Sign in</button>
        </div>
      </div>
    </form>
    <div v-else>
      <h1 class="submitted">Form submitted successfully!</h1>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import auth from '../auth'

Vue.use(VeeValidate)

export default {
  data () {
    return {
      email: '',
      password: '',
      confirm_password: '',
      signup_submitted: false
    }
  },
  methods: {
    validateBeforeSubmit (e) {
      this.$validator.validateAll()

      if (!this.errors.any()) {
        this.submitForm()
      }
    },
    submitForm () {
      const user = {
        email: this.email,
        password: this.password
      }

      auth.signup(this, user, '/')
    }
  }
}
</script>
