<template>
     <div>

        <Header/>
        <div class="home mainContentContainer">
        <h2 class="welcome">Welcome {{ name }}</h2>
        <!-- <Company v-if="!addComp"/> -->
        <!-- <div class="product"><Product /></div> -->
         <AddCompany v-if="addComp"/>
        </div>
        <Sidebar />
    </div>
</template>

<script>
import Sidebar from './Sidebar_new'
import Header from './Header_new'
import Company from './Company'
import AddCompany from './AddCompany'
import axios from 'axios'
export default {
  name: 'Home',
  created () {
    // console.log('Created Home')
    axios.defaults.baseURL = 'http://' + localStorage.activeCompany + '.widgetor.com/quotation'
    this.$store.dispatch('selectPageAction', 0)
  },
  data () {
    return {
      welcome: 'This is your profile',
      addComp: false,
      name: ''
    }
  },

  components: {
    Sidebar,
    Header,
    Company,
    AddCompany
  },
  mounted () {
    this.$store.state.user.firstName = localStorage.firstName
    this.setName()
  },
  methods: {
    setName () {
      setTimeout(() => { this.name = this.$store.state.user.firstName }, 1500)
    }
  }

}
</script>
<style>
.h1{
    color: black;
}
.welcome{
    width: 100%;
    padding: 20px;
    background: #ECF0F5;
    margin-top: 60px;
    position: absolute;
    margin-left: 59px;
}
</style>
