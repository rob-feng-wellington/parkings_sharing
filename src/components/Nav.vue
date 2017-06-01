<template>
  <nav class="navbar navbar-toggleable-md navbar-light navbar-inverse bg-primary bg-faded">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="/">Online P2P Parking Sharing</a>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav mr-auto">
        </ul>
        <span class="navbar-text navbar-right">
          <div v-if="isLogedIn()">
            <span> Welcome {{ getUserEmail() }}</span>
            <span><button class="btn btn-primary" @click="handleLogout()">Log out</button></span>
          </div>
          <div v-else>
            <span><button class="btn btn-primary" @click="handleLogin()">Log in</button></span>
            |
            <span><button class="btn btn-primary" @click="handleSignup()">Sign up</button></span>
          </div>
        </span>
      </div>
    </nav>
</template>
<script>
import auth from '../auth'

export default {
  methods: {
    isLogedIn () {
      return auth.checkAuth()
    },
    getUserEmail () {
      return auth.getMetaData()['email']
    },
    handleLogin () {
      this.$router.push('login')
    },
    handleSignup () {
      this.$router.push('signup')
    },
    handleLogout () {
      auth.logout()
    }
  }
}

</script>
