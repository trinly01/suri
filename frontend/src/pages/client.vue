<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 300px
</style>
<template>
  <div>
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="menu" class="q-mr-sm" />
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
      </q-avatar>

      <q-toolbar-title>Suri.AI</q-toolbar-title>

      <q-btn flat round dense icon="whatshot" />
    </q-toolbar>
    <div class="q-pa-md row items-start q-gutter-md">

      <video ref="videoTag" width="300" height="200" controls muted></video>
      <canvas ref="canvasTag"></canvas>
      <q-card class="my-card">
        <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />

        <q-card-section>
          <q-btn
            loading
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              Place
            </div>
            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
              verifying
            </div>
          </div>
        </q-card-section>

        <!-- <q-separator /> -->

        <!-- <q-card-actions>
          <q-btn flat round icon="event" />
          <q-btn flat color="primary">
            Reserve
          </q-btn>
        </q-card-actions> -->
      </q-card>
    </div>
    <div class="row justify-center q-pa-md">
      <input @change="upload" ref="fileUpload" id="fileUpload" type="file" accept="video/*,image/*" hidden>
      <q-btn size="xl" @click="chooseFiles" round icon="photo_camera_front" color="negative"></q-btn>
    </div>
  </div>
</template>

<script>
// const { CompreFace } = require('compreface-js-sdk')

// let api_key = "c6d014fd-bfe4-495e-9f9a-8b1ee5aaa06a"
// let url = "http://localhost"
// let port = 8000

// let compreFace = new CompreFace(url, port); // set CompreFace url and port
// let recognitionService = compreFace.initFaceRecognitionService(api_key); // initialize service

const videoSource = document.createElement('source')

export default {
  mounted () {
    let ctx = this.$refs.canvasTag.getContext('2d')
    let timer = null
    this.$refs.videoTag.addEventListener('play', async () => {
      // console.log(this.$refs.videoTag)
      const $this = this.$refs.videoTag
      ctx.drawImage($this, 0, 0)
      const loop = async () => {
        // console.log($this.videoWidth, '$this.videoWidth')
        clearTimeout(timer)
        this.$refs.canvasTag.width = $this.videoWidth
        this.$refs.canvasTag.height = $this.videoHeight
        if (!$this.paused && !$this.ended) {
          timer = setTimeout(loop, 1000 / 1) // drawing at 30fps
          ctx.drawImage($this, 0, 0)
          // console.log(recognitionService)
          this.$refs.canvasTag.toBlob(async blob => {
            const file = new File([blob], 'name.jpg', {
              type: 'image/jpeg'
            })
            // file.type = 'image/jpeg'
            // console.log(blob, this.$refs.fileUpload.files[0])
            // console.log($this)

            const formData = new FormData()
            formData.append('file', file)
            const result = await this.$CompreFaceAPI.post('recognition/recognize', formData)
            // console.log(result.data, videoSource)
            ctx = this.$refs.canvasTag.getContext('2d')
            // ctx.beginPath()

            console.log('positive')

            const { box, subjects } = result.data.result[0]

            ctx.strokeStyle = 'red'
            ctx.lineWidth = '3'
            ctx.strokeRect(box.x_min, box.y_min, box.x_max, box.y_max)

            ctx.font = '20px'
            ctx.fillStyle = 'red'
            ctx.fillText(`${subjects[0].subject} [${parseInt(subjects[0].similarity * 100)}%]`, box.x_min, box.y_min - 8)
          })
        }
      }
      await loop()
    }, 0)
  },
  methods: {
    chooseFiles () {
      console.log(this.$refs.fileUpload)
      this.$refs.fileUpload.click()
    },
    async upload (e) {
      console.log(e)
      if (e.target.value) {
        const reader = new FileReader()

        reader.onload = (re) => {
          videoSource.setAttribute('src', re.target.result)
          this.$refs.videoTag.appendChild(videoSource)
          this.$refs.videoTag.load()
          this.$refs.videoTag.play()
        }

        reader.readAsDataURL(e.target.files[0])

        // const formData = new FormData()
        // formData.append('file', e.target.files[0])
        // const result = await this.$CompreFaceAPI.post('recognition/recognize', formData)
        // console.log(result.data, videoSource)

        // const formData = new FormData()
        // const imagefile = e.target
        // formData.append('image', imagefile.files[0])
        // const response = this.$appwrite.storage.createFile(imagefile.files[0])
        // await this.$api.post('v1/storage/files', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // })

        // console.log('finished', response)
      }
    }
  }
}
</script>
