import router from '../router'

const API_URL = 'http://localhost:3001/'
const LOGIN_URL = API_URL + 'sessions/create/'
const SIGNUP_URL = API_URL + 'api/users/'

export default {
  user: {
    authenticated: false
  },

  login (context, creds, redirect) {
    context.$http.post(LOGIN_URL, creds).then(data => {
      console.log(redirect)
      localStorage.setItem('token', data.body.token)
      localStorage.setItem('user_meta', JSON.stringify(data.body.user))
      this.user.authenticated = true

      if (redirect) {
        context.$router.push('/')
        location.reload()
      }
    }, err => {
      context.error = err
    })
  },

  signup (context, creds, redirect) {
    context.$http.post(SIGNUP_URL, creds).then(data => {
      console.log(data)
      localStorage.setItem('token', data.body.token)
      localStorage.setItem('user_meta', JSON.stringify(data.body.user))
      this.user.authenticated = true

      if (redirect) {
        context.$router.push(redirect)
        location.reload()
      }
    }, err => {
      context.error = err
    })
  },

  logout () {
    localStorage.removeItem('token')
    localStorage.removeItem('user_meta')
    localStorage.removeItem('request')
    this.user.authenticated = false
    router.push('/')
    location.reload()
  },

  checkAuth () {
    const token = localStorage.getItem('token')
    return !!token
  },

  getMetaData () {
    const userMeta = JSON.parse(localStorage.getItem('user_meta'))
    return userMeta || {email: '', id: ''}
  },

  getToken () {
    return localStorage.getItem('token')
  }
}
