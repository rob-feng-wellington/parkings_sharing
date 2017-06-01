<template>
  <div class="container">
    <ul class="nav nav-pills nav-fill">
      <li class="nav-item">
        <a class="nav-link" v-bind:class="{ active: step === 1 }" @click.prevent="changeStep(1)" href="#">Step 1</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" v-bind:class="{ active: step === 2, disabled: step < 2 }" @click.prevent="changeStep(2)" href="#">Step 2</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" v-bind:class="{ active: step === 3, disabled: step < 3 }" @click.prevent="changeStep(3)" href="#">Step 3</a>
      </li>
    </ul>
    <BR />
    <div v-if="step === 1">
      <h4>What time?</h4>
      <form>
        <div class="form-group">
          <label for="inputStart">Start from</label>
          <b-form-input v-model="request.start" type="time" step="3600"></b-form-input>
        </div>
        <div class="form-group">
          <label for="inputFinish">Finish at</label>
          <b-form-input v-model="request.finish" type="time" step="3600"></b-form-input>
        </div>
        <button class="btn btn-primary" @click="finishStepOne()">Next</button>
      </form>
    </div>
    <div v-else-if="step === 2">
      <h4>Choose one of the following parkings</h4>
      <table class="table">
        <thead>
          <tr>
            <th>Parking #</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="parking in filteredParkings">
            <th scope="row">{{ parking._id }}</th>
            <td><button class="btn btn-primary" @click="finishStepTwo(parking._id)">Book</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else="step === 3">
      <h4>Confirm your booking</h4>
      To book {{request.parkingId}} from {{request.start}} until {{request.finish}}.
      <div v-if="isLogedIn()">
        <button class="btn btn-primary" @click="handleConfirm()">Confirm</button>
      </div>
      <div v-else>
        <button class="btn btn-primary" @click="handleLogin()">Log in</button>
        |
        <button class="btn btn-primary" @click="handleSignup()">Sign up</button>
      </div>
    </div>  
  </div>
</template>
<script>
import request from '../helpers/request'
import parking from '../helpers/parking'
import booking from '../helpers/booking'
import auth from '../auth'

export default {
  data () {
    return {
      step: 1,
      request: {
        start: request.getStart(),
        finish: request.getFinish(),
        parkingId: request.getParking()
      },
      filteredParkings: []
    }
  },
  created () {
    if (this.request.parkingId !== null) {
      this.step = 3
    }
  },
  methods: {
    changeStep (step) {
      this.step = step
    },
    finishStepOne () {
      request.setRequestTime(this.request.start, this.request.finish)
      parking.getFilteredParkings(this, request.getStartByNumber(), request.getFinishByNumber())
      this.changeStep(2)
    },
    finishStepTwo (parkingId) {
      request.setParking(parkingId)
      this.request.parkingId = parkingId
      this.changeStep(3)
    },
    isLogedIn () {
      return auth.checkAuth()
    },
    handleLogin () {
      this.$router.push('login')
    },
    handleSignup () {
      this.$router.push('signup')
    },
    handleConfirm () {
      booking.makeBooking(this, request.getStartByNumber(), request.getFinishByNumber(), request.getParking()).then(data => {
        localStorage.removeItem('request')
        this.$router.push('/')
      })
    }
  }
}
</script>
