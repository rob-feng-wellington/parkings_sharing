const DEFAULTSTART = 9
const DEFAULTFINISH = 18

export default {
  request: {
    start: null,
    finish: null,
    parking: null
  },

  _getStartTime () {
    return localStorage.getItem('request') && JSON.parse(localStorage.getItem('request')).start ? JSON.parse(localStorage.getItem('request')).start : DEFAULTSTART
  },

  _getFinishTime () {
    return localStorage.getItem('request') && JSON.parse(localStorage.getItem('request')).finish ? JSON.parse(localStorage.getItem('request')).finish : DEFAULTFINISH
  },

  getStartByNumber () {
    return this._getStartTime()
  },

  getFinishByNumber () {
    return this._getFinishTime()
  },

  getStart () {
    return this._getStartTime().toString().length === 1 ? '0' + this._getStartTime() + ':00' : this._getStartTime() + ':00'
  },

  getFinish () {
    return this._getFinishTime().toString().length === 1 ? '0' + this._getFinishTime() + ':00' : this._getFinishTime() + ':00'
  },

  getParking () {
    return localStorage.getItem('request') && JSON.parse(localStorage.getItem('request')).parking ? JSON.parse(localStorage.getItem('request')).parking : null
  },

  setRequestTime (start, finish) {
    const request = {start: parseInt(start.split(':')[0], 10), finish: parseInt(finish.split(':')[0], 10), parking: this.getParking()}
    localStorage.setItem('request', JSON.stringify(request))
  },

  setParking (parkingId) {
    const request = {start: this.getStartByNumber(), finish: this.getFinishByNumber(), parking: parkingId}
    localStorage.setItem('request', JSON.stringify(request))
  }
}
