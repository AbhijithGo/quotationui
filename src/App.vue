<template>
  <div id="app">
    <div class='loading_parent' v-if="isLoading">
      <!--  -->
      <b-icon class="customXIcon" @click="closeLoading" icon="x-square"></b-icon>
      <div class='loading_cont'>
        <div>Loading</div>
        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'
export default {
  methods: {
    ...mapActions([
      'fetchAccessToken',
      'fetchUserId',
      'fetchCompanies'
    ]),
    setLoading (isLoading) {
      if (isLoading) {
        this.refCount++
        this.isLoading = true
      } else if (this.refCount > 0) {
        this.refCount--
        this.isLoading = (this.refCount > 0)
      }
    },
    closeLoading () {
      this.setLoading(false)
    }
  },
  data () {
    return {
      refCount: 0,
      isLoading: false,
      forceCloseLoading: true
    }
  },
  created () {
    this.fetchAccessToken()
    this.fetchUserId()

    axios.interceptors.request.use((config) => {
      // if (this.forceCloseLoading) {
      this.setLoading(true)
      // }
      return config
    }, (error) => {
      this.setLoading(false)
      return Promise.reject(error)
    })

    axios.interceptors.response.use((response) => {
      this.setLoading(false)
      return response
    }, (error) => {
      this.setLoading(false)
      return Promise.reject(error)
    })
  }
}
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0;
  /* padding-left: 0; */
  background: #ecf0f5;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
.loading_parent{
  position: absolute;
  z-index: 999999999;
  background-color: black;
  height: 100%;
  width: 100%;
  opacity: 0.8;
  /* margin: -20px; */
}
.loading_cont{
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%;
  color: #fc0;
  font-size: 34px;
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 115px;
  height: 64px;
  left: 0;
}
.lds-ellipsis div {
  position: absolute;
  top: 27px;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background: #fc0;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 16px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 26px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 55px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 85px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(19px, 0);
  }
}
.customXIcon {
  color: #ffc000;
  font-size: 43px;
  position: absolute;
  right: 2%;
  cursor: pointer;
}
.customXIcon:hover {
  color: #333;
}
@media only screen and (max-width: 600px) {
  #app {
    padding:0;
  }
}
</style>
