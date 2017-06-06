import _ from 'lodash'
import auth from '../auth'
const API_URL = 'http://localhost:3001/'
const BOOKING_URL = API_URL + 'bookings'

export default {
  makeBooking (context, start, finish, parking, userId) {
    const p = new Promise((resolve, reject) => {
      context.$http.post(BOOKING_URL, {parking: parking, user: userId, time: _.range(start, finish), status: 'pending', token: auth.getToken()}).then(response => {
        resolve(response)
      })
    })
    return p
  },
  getBookings (context, userId = false) {
    let p = null
    if (!userId) {
      // get all bookings
      p = new Promise((resolve, reject) => {
        context.$http.get(BOOKING_URL).then(response => {
          resolve(response.body.bookings)
        }, err => {
          reject(err.message)
        })
      })
    } else {
      // get bookings for one user
      p = new Promise((resolve, reject) => {
        context.$http.get(BOOKING_URL, {params: {user: userId}}).then(response => {
          resolve(response.body.bookings)
        }, err => {
          reject(err.nessage)
        })
      })
    }
    return p
  },
  updateBooking (context, booking) {
    const p = new Promise((resolve, reject) => {
      context.$http.put(BOOKING_URL, {booking: booking, token: auth.getToken()}).then(response => {
        resolve(response.message)
      }, err => {
        reject(err.message)
      })
    })
    return p
  }
}
