<template>
  <div class="container">
    <section v-if="isProvider() === false">
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
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in my_bookings">
                <th scope="row">{{ booking.parking }}</th>
                <th>{{ booking.time | formatTime }}</th>
                <td v-bind:class="{ 'text-warning': booking.status === 'cancelled', 'text-success': booking.status === 'approved', 'text-danger': booking.status === 'rejected' }">{{ booking.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
    <section v-else>
      <div v-if="isLogedIn() && my_bookings.length > 0">  
        <b-tabs>
          <b-tab title="Manage requests" active>
            <h2>Pending requests</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Parking #</th>
                  <th>Time</th>
                  <th>User</th> 
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in my_bookings" v-if="booking.status === 'pending'">
                  <th scope="row">{{ booking.parking }}</th>
                  <th>{{ booking.time | formatTime }}</th>
                  <td>{{ booking.user.email }}</td>
                  <td>
                    <button class="btn btn-success" @click="approveBooking(booking._id)">Approve</button>
                    <button class="btn btn-danger" @click="rejectBooking(booking._id)">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <hr />
            <h2>Confirmed requests</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Parking #</th>
                  <th>Time</th>
                  <th>User</th> 
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in my_bookings" v-if="booking.status !== 'pending'">
                  <th scope="row">{{ booking.parking }}</th>
                  <th>{{ booking.time | formatTime }}</th>
                  <td>{{ booking.user.email }}</td>
                  <td v-bind:class="{ 'text-warning': booking.status === 'cancelled', 'text-success': booking.status === 'approved', 'text-danger': booking.status === 'rejected' }">{{ booking.status}}</td>
                </tr>
              </tbody>
            </table>
          </b-tab>
          <b-tab title="Manage parkings" >
            <h2>All parkings</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Parking #</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="parking in parkings">
                  <th scope="row">{{ parking._id }}</th>
                  <td>
                    <button class="btn btn-danger" @click="removeParking(parking._id)">Remove</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </b-tab>
        </b-tabs>
      </div>
    </section>
    <hr>
    <section v-if="!isLogedIn()">
      <h3>Providers? please log in at here</h3>
      <button class="btn btn-secondary" @click="handleLogin()">Manage parking lots</button>
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
      my_bookings: [],
      parkings: []
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
    isProvider () {
      return auth.getUserIsProvider()
    },
    getBookings () {
      bookings.getBookings(this, auth.getUserId()).then(data => {
        this.my_bookings = data
      })
    },
    getAllBookings () {
      bookings.getBookings(this).then(data => {
        this.my_bookings = data
      })
    },
    handleLogin () {
      this.$router.push('login')
    },
    approveBooking (bookingId) {
      // get booking by Id
      let bookingObj = this.getBookingById(bookingId)
      bookingObj.status = 'approved'
      bookings.updateBooking(this, bookingObj).then(data => {
        this.getAllBookings()
      })
    },
    rejectBooking (bookingId) {
      let bookingObj = this.getBookingById(bookingId)
      bookingObj.status = 'rejected'
      bookings.updateBooking(this, bookingObj).then(data => {
        this.getAllBookings()
      })
    },
    getBookingById (bookingId) {
      return this.my_bookings.filter(booking => {
        return booking._id === bookingId
      })[0]
    },
    removeParking (parkingId) {
      parkings.removeParking(this, parkingId).then(data => {
        this.getAllBookings()
        this.getParkings()
      })
    },
    getParkings () {
      parkings.getParkings(this).then(parkings => {
        this.free_slots_count = parkings.length
        this.parkings = parkings
      })
    }
  },
  created () {
    if (this.isLogedIn()) {
      if (request.getParking()) {
        router.push('request')
      } else {
        if (this.isProvider()) {
          this.getAllBookings()
        } else {
          this.getBookings()
        }
      }
    }
    this.getParkings()
  }
}
</script>
<style>
section {
  padding: 30px 0;
}
.nav-tabs .nav-link {
  font-size: 22px;
}
.tab-content {
  padding: 20px;
}
</style>
