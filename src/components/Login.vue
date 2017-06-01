<template>
  <div class="container">
    <h2>Log In</h2>
    <div class="alert alert-danger" v-if="error">
      {{ error }}
    </div>
    <form class="login">
        <div class="form-group">
          <label for="inputEmail">Email address</label>
          <b-form-input v-model="credentials.email" type="text" placeholder="Enter your email"></b-form-input>
        </div>
        <div class="form-group">
          <label for="inputPassword">Password</label>
          <b-form-input v-model="credentials.password" type="password" placeholder="Enter your password"></b-form-input>
        </div>
        <button class="btn btn-primary" @click.prevent="submit()">Login</button>
    </form>
  </div>
</template>
<script>
  import auth from '../auth'
  const DEFAULT_ROUTE = '/'
  export default {
    data () {
      return {
        credentials: {
          email: '',
          password: ''
        },
        error: ''
      }
    },
    created () {
      if (auth.checkAuth()) {
        this.$router.push(DEFAULT_ROUTE)
      }
    },
    methods: {
      submit () {
        const credentials = {
          email: this.credentials.email,
          password: this.credentials.password
        }
        auth.login(this, credentials, DEFAULT_ROUTE)
      }
    }
  }
</script>
