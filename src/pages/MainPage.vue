<template>
  <q-page
    class="colored-background"> <!-- class="flex flex-center" -->
    <img class="center-cropped"
      id="bgimg"
      :src="userData.bgSrc" />
  </q-page>
</template>

<style lang="stylus">
@import '~variables'

.center-cropped
  width: 100%
  height: 100%
  background-position: center center
  background-repeat: no-repeat
  overflow: hidden
  image-rendering: pixelated

.colored-background
  background-color: #FFFFFF

</style>

<script>
export default {
  name: 'MainPage',
  cssColoredBackground: null,
  data () {
    return {
      // nothing
    }
  },
  computed: {
    userData: {
      get () {
        let thisUserData = this.$store.getters.userData
        this.updateBackground(thisUserData)
        return thisUserData
      },
      set (val) {
        this.$store.commit('updateUserData', val)
      }
    }
  },
  methods: {
    resizeImage () {
      // first assert
      let img = document.getElementById('bgimg')
      if (img === undefined) {
        console.log('assert failed on resizeImage')
        return
      }
      // get window width and height
      let windowWidth = 'innerWidth' in window
        ? window.innerWidth
        : document.documentElement.offsetWidth
      let windowHeight = 'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight
      // get image width, using natural if possible
      let imageWidth = 'naturalWidth' in img
        ? img.naturalWidth
        : img.style.width
      let imageHeight = 'naturalHeight' in img
        ? img.naturalHeight
        : img.style.height
      // if (fit_inside)
      // try resize to width with height under fit, and calc offsets to center
      let newImgWidth = windowWidth
      let newImgHeight = (windowWidth / imageWidth) * imageHeight
      let newImgOffsetX = 0
      let newImgOffsetY = (newImgHeight - windowHeight) / 2
      // if no overspill on width, resize to height with width under fit instead
      if (newImgHeight > windowHeight) {
        newImgWidth = (windowHeight / imageHeight) * imageWidth
        newImgHeight = windowHeight
        newImgOffsetX = (newImgWidth - windowWidth) / 2
        newImgOffsetY = 0
      }

      // else
      /*
      // try resize to width with height overspill, and calc offsets to center
      let newImgWidth = windowWidth
      let newImgHeight = (windowWidth / imageWidth) * imageHeight
      let newImgOffsetX = 0
      let newImgOffsetY = (newImgHeight - windowHeight) / 2
      // if no overspill on width, resize to height with width overspill instead
      if (newImgHeight < windowHeight) {
        newImgWidth = (windowHeight / imageHeight) * imageWidth
        newImgHeight = windowHeight
        newImgOffsetX = (newImgWidth - windowWidth) / 2
        newImgOffsetY = 0
      }
      */

      img.style.width = '' + newImgWidth + 'px'
      img.style.height = '' + newImgHeight + 'px'
      if (newImgOffsetX < 0) {
        img.style.marginLeft = '' + Math.abs(newImgOffsetX) + 'px'
      } else {
        img.style.marginLeft = '-' + newImgOffsetX + 'px'
      }
      if (newImgOffsetY < 0) {
        img.style.marginTop = '' + Math.abs(newImgOffsetY) + 'px'
      } else {
        img.style.marginTop = '-' + newImgOffsetY + 'px'
      }
    },
    updateBackground (updatingUserData) {
      let thisUserData = updatingUserData !== undefined ? updatingUserData : this.userData
      // get tone as color
      let tone = '#FFFFFF'
      if (thisUserData.bg.tone.localeCompare('light') === 0) {
        tone = '#FFFFFF'
      } else if (thisUserData.bg.tone.localeCompare('mid') === 0) {
        tone = '#888888'
      } else if (thisUserData.bg.tone.localeCompare('dark') === 0) {
        tone = '#222222'
      }
      // update .colored-background rule
      if (this.cssColoredBackground === undefined) {
        this.cssColoredBackground = this.getCssRule('.colored-background')
        console.log('tried to get .colored-background')
      }
      if (this.cssColoredBackground !== undefined) {
        this.cssColoredBackground.style.backgroundColor = tone
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
  mounted () {
    let img = document.getElementById('bgimg')
    if (img === undefined) {
      console.log('couldnt add callback to image container')
      return
    }
    if (img.complete) {
      this.resizeImage()
    } else {
      img.addEventListener('load', this.resizeImage)
    }
    window.addEventListener('resize', this.resizeImage)
  }
}
</script>
