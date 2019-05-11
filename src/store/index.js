import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    state: {
      userData: {
        shouldCountSeconds: true,
        location: 'Dallas,US',
        city: 'Dallas',
        weatherUpdateMinutes: 2,
        bgSrc: '/statics/bg/black.jpg',
        code: 800,
        weatherName: 'Clear',
        solar: 1,
        solarName: 'Day',
        temp: 0.7,
        tempName: 'Warm',
        noSettings: false,
        datechecked: true,
        timechecked: true,
        descriptionchecked: true,
        mincreditchecked: false
      }
    },
    getters: {
      userData: state => state.userData
    },
    mutations: {
      initialiseStore (state) {
        // Check if the ID exists
        if (localStorage.getItem('store')) {
          // Replace the state object with the stored item
          this.replaceState(Object.assign(state, JSON.parse(localStorage.getItem('store'))))
          console.log('Replaced state: ' + localStorage.getItem('store'))
        } else {
          console.log('Could not replace state')
        }
      },
      updateUserData (state, val) {
        state.userData = val
        console.log('updated user data')
      }
    }
  })

  // Subscribe to store updates
  Store.subscribe((mutation, state) => {
    // Store the state object as a JSON string
    localStorage.setItem('store', JSON.stringify(state))
    console.log('updated state: ' + JSON.stringify(state))
  })

  return Store
}
