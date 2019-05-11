<template>
  <q-layout> <!-- view="lHh Lpr lFf" -->
  <q-layout-drawer
      v-if="!userData.noSettings"
      side="right"
      v-model="drawerOpen"
      overlay
      :content-class="'bg-grey-2'">
      <q-btn
        round
        flat
        size="xl"
        text-color="black"
        icon="arrow_forward"
        @click="settingsClick" />
      <q-list
        no-border
        link
        inset-delimiter>
        <q-list-header>General</q-list-header>
        <q-item @click.native="updateLocationClick()">
          <q-item-side icon="map" />
          <q-item-main label="Location" :sublabel="userData.location" />
          <q-item-side right icon="edit" />
        </q-item>
        <q-item @click.native="updateWeatherScheduleClick()">
          <q-item-side icon="update" />
          <q-item-main label="Weather updates" :sublabel="userData.weatherUpdateMinutes + ' mins'" />
          <q-item-side right icon="edit" />
        </q-item>
        <q-item-separator />
        <q-list-header>Date / Time panel</q-list-header>
        <q-item @click.native="updateDatechecked(!userData.datechecked)">
          <q-item-side icon="calendar_today" />
          <q-item-main label="Show Date" sublabel="" />
          <q-toggle readonly v-model="userData.datechecked" color="teal-8" />
        </q-item>
        <q-item @click.native="updateTimechecked(!userData.timechecked)">
          <q-item-side icon="access_time" />
          <q-item-main label="Show Time" sublabel="" />
          <q-toggle readonly v-model="userData.timechecked" color="teal-8" />
        </q-item>
        <q-item @click.native="updateShouldCountSeconds(!userData.shouldCountSeconds)">
          <q-item-side icon="av_timer" />
          <q-item-main label="Show Seconds" sublabel="" />
          <q-toggle readonly v-model="userData.shouldCountSeconds" color="teal-8" />
        </q-item>
        <q-item-separator />
        <q-list-header>Description panel</q-list-header>
        <q-item @click.native="updateDescriptionchecked(!userData.descriptionchecked)">
          <q-item-side icon="cloud" />
          <q-item-main label="Show Description" sublabel="" />
          <q-toggle readonly v-model="userData.descriptionchecked" color="teal-8" />
        </q-item>
        <q-item @click.native="updateMincreditchecked(!userData.mincreditchecked)">
          <q-item-side icon="assignment" />
          <q-item-main label="Minimize Credit" sublabel="Make credit as small as allowed" />
          <q-toggle readonly v-model="userData.mincreditchecked" color="teal-8" />
        </q-item>
        <q-item-separator />
        <q-item>
          <p class="q-caption">Settings are saved locally to your browser.</p>
        </q-item>
        <q-item>
          <p class="q-caption"><a target="_blank" href="https://github.com/digithree/garden-of-pixels">Open source on GitHub</a></p>
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-page-sticky position="top-left" :offset="[18, 18]">
      <div v-if="userData.datechecked || userData.timechecked" class="info-container">
        <p v-if="userData.datechecked" class="main-text">{{ readableDate }}</p>
        <p v-if="userData.timechecked" class="main-text">{{ readableTime }}</p>
      </div>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18, 100 * sizeClass]">
      <div v-if="userData.descriptionchecked" class="info-container">
        <p class="main-text"><i>I see</i>&nbsp;<u>{{ userData.weatherName }}</u></p>
        <p class="main-text"><i>at</i>&nbsp;<u>{{ userData.city }}</u></p>
        <p class="main-text"><i>in the</i>&nbsp;<u>{{ userData.solarName }}</u>.</p>
        <p class="main-text"><i>I feel</i>&nbsp;<u>{{ userData.tempName }}</u>.</p>
      </div>
    </q-page-sticky>
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <div v-if="userData.bg !== undefined" class="info-container">
        <p v-if="!userData.mincreditchecked" class="main-text"><a :href="userData.bg.link" target="_blank">{{ userData.bg.credit }}</a></p>
        <q-btn
          style="font-family: 'VT323', monospace; color: #232377;"
          v-if="userData.mincreditchecked"
          flat
          label="Credit"
          @click="creditAlert"
          />
      </div>
    </q-page-sticky>
    <q-page-sticky v-if="!userData.noSettings" position="top-right" :offset="[18, 18]">
      <q-btn
        round
        flat
        size="xl"
        :text-color="userData.bg.tone.localeCompare('light') === 0 ? 'primary' : 'white'"
        icon="settings"
        @click="settingsClick" />
    </q-page-sticky>
  </q-layout>
</template>

<style lang="stylus">
@import '~variables'

@import url('https://fonts.googleapis.com/css?family=VT323')

.info-container {
  background-color: rgba(230, 230, 255, 0.75)
  border: solid
  color: #4545AA
  // box-shadow: 0 0 0 8px rgba(230, 230, 255, 0.3)
  padding-left: 20px
  padding-right: 20px
}

.main-text {
  font-family: 'VT323', monospace
  color: #232377
  padding: 10px
  margin: 0px
  // max-width: 500px
}

</style>

<script>
import { openURL } from 'quasar'
const bgMap = require('src/statics/json/bg-map.json')

export default {
  name: 'MainLayout',
  cssRefInfoText: undefined,
  cssRefInfoTextCredit: undefined,
  cssRefInfoContainer: undefined,
  refreshWeatherCountUpHalfSeconds: 0,
  props: {
    propNoSettings: {
      type: String,
      required: false
    },
    propLocation: {
      type: String,
      required: false
    },
    propWeatherUpdates: {
      type: String,
      required: false
    },
    propShowDate: {
      type: String,
      required: false
    },
    propShowTime: {
      type: String,
      required: false
    },
    propShowSecs: {
      type: String,
      required: false
    },
    propShowDescription: {
      type: String,
      required: false
    },
    propMinCredit: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      drawerOpen: true,
      readableDate: 'Date',
      readableTime: 'Time',
      sizeClass: 0
    }
  },
  methods: {
    openURL,
    updateDatechecked (checked) {
      this.userData.datechecked = checked
      this.userData = this.userData
    },
    updateTimechecked (checked) {
      this.userData.timechecked = checked
      this.userData = this.userData
    },
    updateShouldCountSeconds (checked) {
      this.userData.shouldCountSeconds = checked
      this.userData = this.userData
    },
    updateDescriptionchecked (checked) {
      this.userData.descriptionchecked = checked
      this.userData = this.userData
    },
    updateMincreditchecked (checked) {
      this.userData.mincreditchecked = checked
      this.userData = this.userData
    },
    creditAlert () {
      this.$q.dialog({
        title: 'Artwork Credit',
        message: this.userData.bg.credit,
        ok: 'Open link',
        cancel: 'Close'
      }).then(() => {
        if (this.userData.bg.link !== undefined &&
            this.userData.bg.link != null &&
            this.userData.bg.link.localeCompare('') !== 0) {
          openURL(this.userData.bg.link)
        } else {
          this.$q.notify('No link for this credit!')
        }
      }).catch(() => {
        // do nothing
      })
    },
    updateReadableDate () {
      this.readableDate = (new Date()).toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    updateReadableTime () {
      let tempTime = (new Date()).toLocaleTimeString()
      let match = this.readableTime.match('[123456789]+')
      if (match == null || match.length === 0) {
        // first second of day, update date
        this.updateReadableDate()
      }
      if (this.userData.shouldCountSeconds) {
        this.readableTime = tempTime
      } else {
        let parts = tempTime.split(':')
        this.readableTime = parts[0] + ':' + parts[1]
      }
    },
    refreshWeather () {
      this.$axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + this.userData.location + '&APPID=bdf422599b33c23fdd4d3aa8988d2108').then((response) => {
        if (response.data) {
          console.log(JSON.stringify(response.data))
          this.processWeatherData(response.data)
        } else {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Could not get weather data',
            icon: 'report_problem'
          })
        }
        if (!this.userData.weatherUpdateMinutes) {
          this.userData.weatherUpdateMinutes = 2
          this.userData = this.userData
        }
        this.refreshWeatherCountUpHalfSeconds = 0
      }).catch(err => {
        console.error(err)
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Error contacting weather data server',
          icon: 'report_problem'
        })
      })
    },
    processWeatherData (weatherData) {
      this.userData.city = weatherData.name
      // get values for three metrics: weather code, solar day value (norm), temp (norm)
      let code = weatherData.weather[0].id
      // correct codes
      if (code >= 300 && code < 400) {
        code += 200
      }
      if (code >= 500 && code < 600) {
        code += 10
      }
      this.userData.code = code
      this.userData.weatherName = weatherData.weather[0].main
      const HOUR_MS = 60 * 60
      let solar = ((Date.now() / 1000) - (weatherData.sys.sunrise - HOUR_MS)) / (((weatherData.sys.sunset + HOUR_MS) - (weatherData.sys.sunrise - HOUR_MS)) / 2)
      let solarAfterNoon = false
      if (solar > 1) {
        solar = 1 - (solar - 1)
        solarAfterNoon = true
      }
      if (solar < 0) {
        solar = 0
      }
      this.userData.solar = solar
      if (solar < 0.1) {
        this.userData.solarName = 'Night'
      } else if (solar < 0.4) {
        this.userData.solarName = solarAfterNoon ? 'Evening' : 'Morning'
      } else {
        this.userData.solarName = 'Day'
      }
      let temp = (weatherData.main.temp - 273.15) / 40
      if (temp < 0) {
        temp = 0
      } else if (temp > 1) {
        temp = 1
      }
      this.userData.temp = temp
      if (temp < 0.1) {
        this.userData.tempName = 'Very Cold'
      } else if (temp < 0.3) {
        this.userData.tempName = 'Cold'
      } else if (temp < 0.5) {
        this.userData.tempName = 'Fine'
      } else if (temp < 0.8) {
        this.userData.tempName = 'Warm'
      } else {
        this.userData.tempName = 'Hot'
      }
      console.log('weather code: ' + code)
      console.log('weather solar: ' + solar)
      console.log('weather temp: ' + temp + ' (' + (weatherData.main.temp - 273.15) + ')')
      // calculate (weighted?) Euclidean dist to each bg images metrics
      // note, overwrites this value and caches in memory only
      for (let imgFile in bgMap) {
        let correctedCode = bgMap[imgFile].code
        if (correctedCode >= 300 && correctedCode < 400) {
          correctedCode += 200
        }
        if (correctedCode >= 500 && correctedCode < 600) {
          correctedCode += 10
        }
        bgMap[imgFile].dist =
          Math.sqrt(
            Math.pow(code - correctedCode, 2) +
            Math.pow((solar * 30) - (bgMap[imgFile].solar * 30), 2) +
            Math.pow((temp * 5) - (bgMap[imgFile].temp * 5), 2)
          )
        // console.log('dist for ' + imgFile + ' { ' + correctedCode + ', ' + bgMap[imgFile].solar + ', ' + bgMap[imgFile].temp + ' } = ' + bgMap[imgFile].dist)
      }
      // get closest match
      let selectedImgFile = ''
      let smallestDist = 100000
      for (let imgFile in bgMap) {
        if (bgMap[imgFile].dist < smallestDist) {
          smallestDist = bgMap[imgFile].dist
          selectedImgFile = imgFile
        }
      }
      // set bg in userData
      this.userData.bgSrc = '/statics/art/' + selectedImgFile
      this.userData.bg = bgMap[selectedImgFile]
      console.log('selectedImgFile: ' + selectedImgFile)
      this.userData = this.userData
    },
    settingsClick () {
      this.drawerOpen = !this.drawerOpen
    },
    updateLocationClick () {
      this.$q.dialog({
        title: 'Change location',
        message: 'Enter your city or area in the form `City,CountryCode`, e.g. `Berlin,DE`',
        ok: true,
        prompt: {
          model: '',
          type: 'text'
        }
      }).then(location => {
        this.userData.location = location
        this.userData = this.userData
        this.refreshWeather()
      }).catch(() => {
        // do nothing
      })
    },
    updateWeatherScheduleClick () {
      this.$q.dialog({
        title: 'Change weather update schedule',
        message: 'Enter number of minutes between weather polling updates',
        ok: true,
        prompt: {
          model: '',
          type: 'number'
        }
      }).then(minutes => {
        this.userData.weatherUpdateMinutes = minutes
        this.userData = this.userData
      }).catch(() => {
        // do nothing
      })
    },
    countSeconds () {
      setInterval(() => {
        this.updateReadableTime()
        if (++this.refreshWeatherCountUpHalfSeconds >= (this.userData.weatherUpdateMinutes * 60 * 2)) {
          this.refreshWeather()
        }
      }, 500)
    },
    setUpProps () {
      if (this.propNoSettings !== undefined &&
          this.propNoSettings != null) {
        this.userData.noSettings = this.propNoSettings.localeCompare('false') !== 0
      }
      if (this.propLocation !== undefined &&
          this.propLocation != null) {
        this.userData.location = this.propLocation
      }
      if (this.propWeatherUpdates !== undefined &&
          this.propWeatherUpdates != null) {
        this.userData.weatherUpdateMinutes = Number(this.propWeatherUpdates)
      }
      if (this.propShowDate !== undefined &&
          this.propShowDate != null) {
        this.userData.datechecked = this.propShowDate.localeCompare('false') !== 0
      }
      if (this.propShowTime !== undefined &&
          this.propShowTime != null) {
        this.userData.timechecked = this.propShowTime.localeCompare('false') !== 0
      }
      if (this.propShowSecs !== undefined &&
          this.propShowSecs != null) {
        this.userData.shouldCountSeconds = this.propShowSecs.localeCompare('false') !== 0
      }
      if (this.propShowDescription !== undefined &&
          this.propShowDescription != null) {
        this.userData.descriptionchecked = this.propShowDescription.localeCompare('false') !== 0
      }
      if (this.propMinCredit !== undefined &&
          this.propMinCredit != null) {
        this.userData.mincreditchecked = this.propMinCredit.localeCompare('false') !== 0
      }
      this.userData = this.userData
    },
    resizeElements () {
      // get window width and height
      let windowWidth = 'innerWidth' in window
        ? window.innerWidth
        : document.documentElement.offsetWidth
      let windowHeight = 'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight
      // determine size class
      let shortestSide = windowWidth < windowHeight ? windowWidth / 2 : windowHeight
      this.sizeClass = 0
      if (shortestSide < 300) {
        this.sizeClass = 1
      } else if (shortestSide < 600) {
        this.sizeClass = 2
      } else if (shortestSide < 1000) {
        this.sizeClass = 3
      } else if (shortestSide < 1400) {
        this.sizeClass = 4
      } else {
        this.sizeClass = 5
      }
      console.log('resizing, shortestSide: ' + shortestSide + ', sizeClass: ' + this.sizeClass)
      // update .main-text rule
      if (this.cssRefInfoText === undefined) {
        this.cssRefInfoText = this.getCssRule('.main-text')
      }
      if (this.cssRefInfoText !== undefined) {
        this.cssRefInfoText.style.fontSize = '' + (20 * this.sizeClass) + 'px'
        this.cssRefInfoText.style.padding = '' + (5 * this.sizeClass) + 'px'
        // this.cssRefInfoTextCredit.style.maxWidth = '' + (50 * this.sizeClass) + 'px'
      } else {
        console.log('couldnt get .main-text')
      }
      // update .info-container rule
      if (this.cssRefInfoContainer === undefined) {
        this.cssRefInfoContainer = this.getCssRule('.info-container')
      }
      if (this.cssRefInfoContainer !== undefined) {
        this.cssRefInfoContainer.style.paddingLeft = '' + (5 * this.sizeClass) + 'px'
        this.cssRefInfoContainer.style.paddingRight = '' + (5 * this.sizeClass) + 'px'
      } else {
        console.log('coudlnt to get .info-container')
      }
    },
    getCssRule (selectorText) {
      for (let sheet in document.styleSheets) {
        let rules
        if (document.styleSheets[sheet].cssRules) {
          rules = document.styleSheets[sheet].cssRules
        } else if (document.styleSheets[sheet].rules) {
          rules = document.styleSheets[sheet].rules
        }
        for (let n in rules) {
          if (rules[n].selectorText === selectorText) {
            return rules[n]
          }
        }
      }
      console.log('couldnt find css rule for ' + selectorText)
    }
  },
  computed: {
    userData: {
      get () {
        return this.$store.getters.userData
      },
      set (val) {
        console.log('set user data')
        this.$store.commit('updateUserData', val)
      }
    }
  },
  mounted () {
    this.setUpProps()
    this.refreshWeather()
    this.updateReadableDate()
    this.updateReadableTime()
    this.countSeconds()
    // add text resize listener
    window.addEventListener('resize', this.resizeElements)
    window.addEventListener('load', this.resizeElements)
  }
}
</script>
