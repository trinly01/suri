import { boot } from 'quasar/wrappers'
import axios from 'axios'
// import { Appwrite } from 'appwrite'

// Init your Web SDK
// const appwrite = new Appwrite()

// appwrite
//   .setEndpoint('http://localhost:8081') // Your Appwrite Endpoint
//   .setProject('6163bd008cadd') // Your project ID

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'http://localhost:8081' })

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  app.config.globalProperties.$CompreFaceAPI = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
      post: {
        'x-api-key': 'c6d014fd-bfe4-495e-9f9a-8b1ee5aaa06a'
      }
    }
  })

  app.config.globalProperties.$CompreFaceAPI.interceptors.request.use(function (config) {
    // const token = localStorage.getItem('token')
    config.headers['x-api-key'] = 'c6d014fd-bfe4-495e-9f9a-8b1ee5aaa06a'
    return config
  })
})

export { api }
