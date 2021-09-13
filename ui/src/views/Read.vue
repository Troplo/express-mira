<template>
  <div id="view">
    <div v-if="loading">
      <div class="main-container">
        Initializing Reader...
      </div>
    </div>
    <div>
      <div class="header main-container" v-if="!loading">
        <div class="header-icons noSelect">
          <span style="cursor: pointer" @click="prevPage" class="material-icons-outlined">arrow_backward</span>
          <span style="cursor: pointer" @click="nextPage" class="material-icons-outlined">arrow_forward</span>
        </div>
      </div>
      <div class="epub-container">
        <div id="book-area" style="background: #ffffff;"></div>
      </div>
      <slot name="progress-bar" :onChange="onChange" :ready="ready" v-if="!loading">
        <center>
          <input type="range" max="100" min="0" step="1"
                 @change="onChange($event.target.value)"
                 :value="progress"
          /><input type="number" :value="progress" @change="onChange($event.target.value)">%
        </center>
      </slot>
    </div>
    <input max="100" min="0" step="1"
           @click="onChange($event.target.value)"
           :value="progress"
           id="epubClick"
           style="visibility: hidden"
    />
  </div>
</template>
<script>
import ePub from 'epubjs'

export default {
  name: 'View',
  data() {
    return {
      ready: false,
      progress: 0,
      fontSize: 100,
      contentBookModify: 0,
      book: null,
      rendition: null,
      section: null,
      toc: [],
      slide: null,
      cfi: null,
      width: 600,
      height: 1000,
      locations: null,
      bookmarks: [],
      loading: true
    }
  },
  methods: {
    nextPage() {
      this.rendition.next()
    },
    prevPage() {
      this.rendition.prev()
    },
    onChange (value) {
      const percentage = value / 100
      const target = percentage > 0 ? this.book.locations.cfiFromPercentage(percentage) : 0
      this.rendition.display(target)
      if (percentage === 1) this.nextPage()
    },
    screenSize() {
      this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - this.contentBookModify
    },
    keyListener (e) {
      if ((e.keyCode || e.which) === 37) {
        this.nextPage()
      }
      if ((e.keyCode || e.which) === 39) {
        this.prevPage()
      }
    },
    initReader() {
      this.rendition = this.book.renderTo("book-area", {
        contained: true,
        height: this.height
      })
      this.screenSize()
      this.rendition.display()
    }
  },
  mounted() {
    window.addEventListener('keyup', this.keyListener)
    this.book = ePub('/api/v1/library/file/' + this.$route.params.book + '.epub')
    this.book.loaded.navigation.then(({ toc }) => {
      this.toc = toc
      console.log(toc)
      this.$emit('toc', this.toc)
      this.initReader()
      this.rendition.on('click', () => {
        this.$emit('click')
      })
    })
    this.book.ready.then(() => {
      return this.book.locations.generate(1000)
    }).then(() => {
      this.axios.get('/api/v1/library/session/' + this.$route.params.book)
          .then((res) => {
            this.progress = res.data.progress
            this.$nextTick(() => {
              document.getElementById('epubClick').click()
              this.loading = false
            })
          })
      this.locations = JSON.parse(this.book.locations.save())
      this.ready = true
      this.$emit('ready')
      this.rendition.on('relocated', (location) => {
        const percent = this.book.locations.percentageFromCfi(location.start.cfi)
        this.progress = Math.floor(percent * 100)
        this.$emit('relocated')
      })
    })
  },
  watch: {
    progress (val) {
      this.$emit('update:progress', val)
      this.axios.put('/api/v1/library/session/' + this.$route.params.book, {
        progress: this.progress,
        bookmarks: this.bookmarks
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.keyListener)
  }
}
</script>