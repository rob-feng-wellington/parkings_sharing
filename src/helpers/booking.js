import _ from 'lodash'
import auth from '../auth'
const API_URL = 'http://localhost:3001/'
const MAKE_BOOKING_URL = API_URL + 'bookings'

export default {
  makeBooking (context, start, finish, parking, userid) {
    const p = new Promise((resolve, reject) => {
      context.$http.post(MAKE_BOOKING_URL, {parking: parking, user: auth.getMetaData()['id'], time: _.range(start, finish), status: 'pending', token: auth.getToken()}).then(response => {
        resolve(response)
      })
    })
    return p
  },
  getBookings (context, userid) {
    const p = new Promise((resolve, reject) => {
      context.$http.get(MAKE_BOOKING_URL, {params: {user: userid}}).then(response => {
        resolve(response.body.bookings)
      })
    })
    return p
  }
}
