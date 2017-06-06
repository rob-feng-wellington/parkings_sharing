import _ from 'lodash'
import auth from '../auth'

const API_URL = 'http://localhost:3001/'
const PARKING_URL = API_URL + 'api/parkings'

export default {
  parking: {
    collections: []
  },

  _getParkings (context) {
    const promise = new Promise((resolve, reject) => {
      context.$http.get(PARKING_URL).then(response => {
        this.parking.collections = response.body.parkings
        resolve(response.body.parkings)
      }, err => {
        context.error = err
        reject()
      })
    })
    return promise
  },

  _filterParkingsByTime (start, finish) {
    const timeAsking = _.range(start, finish)
    const results = this.parking.collections.filter(parking => {
      let allTimes = []
      parking.bookings.forEach(booking => {
        if (booking.status !== 'pending' && booking.status !== 'rejected') {
          allTimes.push(...booking.time)
        }
      })
      return (_.intersection(allTimes, timeAsking)).length === 0
    })
    return results
  },

  getParkingsTotal (context) {
    const p = new Promise((resolve, reject) => {
      this._getParkings(context).then(parkings => {
        resolve(parkings.length)
      })
    })
    return p
  },

  getParkings (context) {
    const p = new Promise((resolve, reject) => {
      this._getParkings(context).then(parkings => {
        resolve(parkings)
      })
    })
    return p
  },

  getFilteredParkings (context, start, finish) {
    this._getParkings(context).then(parkings => {
      context.filteredParkings = this._filterParkingsByTime(start, finish)
    })
  },

  removeParking (context, parkingId) {
    const p = new Promise((resolve, reject) => {
      context.$http.delete(PARKING_URL, {params: {id: parkingId, token: auth.getToken()}}).then(response => {
        resolve(response.message)
      }, err => {
        reject(err.message)
      })
    })
    return p
  }
}
