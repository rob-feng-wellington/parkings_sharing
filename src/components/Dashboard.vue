<template>
  <div class="container">
    <section>
      <h1>There are {{ free_slots_count }} parking slots available</h1>
      <h1>Start looking for your parking slot here</h1>
      <button class="btn btn-primary" v-on:click="getParkingLots()">Get a Parking slot</button>
    </section>
    <section>
      <div v-if="isLogedIn() && my_bookings.length > 0">
        <h2>My existing bookings</h2>
        <table class="table">
        <thead>
          <tr>
            <th>Parking #</th>
            <th>Time #</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in my_bookings">
            <th scope="row">{{ booking.parking }}</th>
            <th>{{ booking.time | formatTime }}</th>
            <td>{{ booking.status }}</td>
          </tr>
        </tbody>
        </table>
      </div>
    </section>
    <hr>
    <section>
      <h3>Providers? please log in at here</h3>
      <button class="btn" @click="login()">Manage parking lots</button>
    </section>
  </div>
</template>
<script>
import parkings from '../helpers/parking'
import bookings from '../helpers/booking'
import request from '../helpers/request'
import router from '../router'
import auth from '../auth'

export default {
  data () {
    return {
      free_slots_count: '',
      my_bookings: []
    }
  },
  filters: {
    formatTime: function (value) {
      const min = Math.min(...value)
      const max = Math.max(...value) + 1
      const minStr = min.toString().length === 1 ? '0' + min + ':00' : min + ':00'
      const maxStr = max.toString().length === 1 ? '0' + max + ':00' : max + ':00'
      return minStr + ' -- ' + maxStr
    }
  },
  methods: {
    getParkingLots () {
      router.push('request')
    },
    isLogedIn () {
      return auth.checkAuth()
    },
    getBookings () {
      bookings.getBookings(this, auth.getMetaData()['id']).then(data => {
        this.my_bookings = data
      })
    }
  },
  created () {
    if (this.isLogedIn()) {
      if (request.getParking()) {
        router.push('request')
      } else {
        this.getBookings()
      }
    }
    parkings.getParkingsTotal(this).then(count => {
      this.free_slots_count = count
    })
  }
}
</script>
<style>
section {
  padding: 30px 0;
}
</style>

