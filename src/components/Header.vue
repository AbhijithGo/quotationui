/* eslint-disable eqeqeq */
<template>
    <!-- var notification_count=0;
var tasknotification_count=0;
var generalnotification_count=0;
var approvalnotification_count=0; -->

<div v-if="isValid" class="divHeader>">

 <div class="header-wrapper">
     <!-- <div class="header-left">
         <div class="app-logo">
             <p class="toggle-sidebar"><span class="fa fa-arrow-left left"></span></p>
         </div>
          <div class="app-name">
             Calibre Admin
         </div>
     </div>  -->

     <div class="header-right">

         <nav class="navbar navbar-default navbar-static">
             <div class="container-fluid">
                 <div class="navbar-header">
                     <button data-target=".bs-example-js-navbar-collapse" data-toggle="header-collapse" type="button" class="navbar-toggle">
                         <span class="sr-only">Toggle navigation</span>
                         <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
                     </button>
                 </div>
                 <div class="collapse navbar-collapse bs-example-js-navbar-collapse" style="height: auto; outline: 0px;">
<div class="nav navbar-nav nav-left mob-hide" style="width:90%">
        <div class="row">
            <div class="col-sm-12">
                <ul class="watchrow">

                </ul>
            </div>
        </div>
    </div>

                <ul class="nav navbar-nav navbar-right">

                        <li class="dropdown user-profile open">
                            <a v-on:click='toggle()' data-toggle="dropdown" class="dropdown-toggle profile" role="button" href="#">
                                <img :src="image" class="img-circle top-avatar" height="40" width="40" alt="avatar">
                            </a>

                            <ul v-if="showDropdown" class="dropdown-menu drop-zoom-right profile-info">
                                <li class="text-center">
                                    <div class="header-cover">

                                    </div>
                                    <div class="profile-wrapper">
                                        <img :src="image" class="profile-image img-circle" alt="Profile Image">

                                        <div class="account-info">
                                            <h4>{{ name }}</h4>
                                            <span  v-for="(item, index) in companies" :key="index">

                                                <a href="#" v-if="isActive(item,index)" class="companylink" :id="item.company_name" @click="switchCompany(item.company_name)">
                                                  <h6><i class="fa fa-check" style="font-size:16px;color:green;padding-right:15px"></i>   {{ item.company_name.toUpperCase() }}   </h6>

                                                </a>
                                                <a href="#" v-else class="companylink" :id="item.company_name" @click="switchCompany(item.company_name)">
                                                 <h6 >   {{ item.company_name.toUpperCase() }}</h6>

                                                </a>

                                            </span>
                                           <a v-on:click='addComp()' href=#>Create a new company</a>

                                        </div>
                                        <hr>
                                        <div class="account-actions">
                                            <a id="logout" href="#" @click="onLogout()" class="btn btn-default btn-block btn-flat">Logout</a>

                                        </div>
                                    </div>
                                </li>
                        </ul>
                     </li>

                </ul>
            </div>
        </div>
        </nav>
        </div>
        </div>
        </div>

</template>
<script>
export default {
  data () {
    return {
      image: require('../assets/images/user.png'),
      showDropdown: false,
      companies: [],
      showModal: false,
      activeCompany: '',
      name: '',
      isValid: false
    }
  },
  mounted () {
    this.isTokenAvailable()
    // console.log('this.$store.state.user.company', this.$store.state.user.company)
  },
  props: {
    addCompany: Boolean
  },
  methods: {
    isTokenAvailable () {
      setTimeout(() => {
        if (this.$store.state.user.token != null) { this.isValid = true } else { this.$router.push('/') }
      }, 1000)
    },
    toggle () {
      this.showDropdown = !this.showDropdown
      if (this.$store.state.user.company.length === 0) {
        this.$store.state.user.company = JSON.parse(localStorage.companies)
      }
      this.companies = this.$store.state.user.company
      this.name = this.$store.state.user.firstName
      // this.$emit('toggleOccured',this.showSideNav)
    },
    addComp () {
      this.showDropdown = !this.showDropdown
      this.addCompany = !this.addCompany
      this.$emit('createOccured', this.addCompany)
    },
    onLogout () {
      this.$store.dispatch('logout')
    },
    switchCompany (company) {
      this.$store.dispatch('switch', company)
      this.$router.push('/home')
    },
    isActive (item, index) {
      // eslint-disable-next-line no-mixed-operators
      if (index === 0 && this.$store.state.user.activeCompany === '' || (item.company_name === this.$store.state.user.activeCompany)) {
        // console.log('item.company_name', item.company_name)
        return true
      }
      return false
    }

  }
}
</script>
<style scoped>
.companylink{
    text-align: center;
}

.header-wrapper{
    position: relative;
    color: black;
    width: 105%;
    z-index: 999;
    height: 58px;
    margin-top: -21px;
    margin-bottom: -53px;
    margin-left: -22px;
}

.header-wrapper .header-right{
        margin-left: 0px !important;
}
</style>
