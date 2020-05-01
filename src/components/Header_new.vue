<template>
  <div>
    <b-navbar class="header_navbar" toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Widgetor</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-text right>Profile</b-nav-text>
          <b-nav-item-dropdown right >
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content >
            <span v-on:click="toggle">
              <em>
                <a data-toggle="dropdown" class="dropdown" role="button" href="#">
                  <img
                    :src="image"
                    class="img-circle top-avatar"
                    height="40"
                    width="40"
                    alt="avatar"
                  />
                </a>
              </em>
            </span>
            </template>
            <b-dropdown-item href="#" class="dropdown-item">
              <img
                :src="image"
                class="profile-image img-circle"
                alt="Profile Image"
                height="100"
                width="100"
              />
            </b-dropdown-item>
            <b-dropdown-item class="dropdown-item">
              <div class="account-info">
                <h4>{{ name }}</h4>
                <span v-for="(item, index) in companies" :key="index">
                  <a
                    href="#"
                    v-if="isActive(item,index)"
                    class="companylink"
                    :id="item.company_name"
                    @click="switchCompany(item.company_name)"
                  >
                    <h6 style="display: flex;justify-content: center;align-items: center;margin-bottom: 0;color: green;font-weight: bold;">
                      <b-icon icon="check-circle" style="margin-left: -26px;" font-scale="2.5"></b-icon>
                      {{ item.company_name.toUpperCase() }}
                    </h6>
                    <!-- <i class="fas fa-check"></i> -->
                    <!-- <i class="fas fa-check" style="font-size:16px;color:green;padding-right:15px"></i>    -->
                  </a>
                  <a
                    href="#"
                    v-else
                    class="companylink"
                    :id="item.company_name"
                    @click="switchCompany(item.company_name)"
                  >
                    <h6>{{ item.company_name.toUpperCase() }}</h6>
                  </a>
                </span>
                <a v-on:click="addComp()" href="#">Create a new company</a>
              </div>
            </b-dropdown-item>
            <hr />
            <b-dropdown-item href="#">
              <div class="account-actions">
                <a
                  id="logout"
                  href="#"
                  @click="onLogout()"
                  class="btn btn-default btn-block btn-flat"
                >Logout</a>
              </div>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
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
  },
  props: {
    addCompany: Boolean
  },
  methods: {
    isTokenAvailable () {
      setTimeout(() => {
        if (this.$store.state.user.token != null) {
          this.isValid = true
        } else {
          this.$router.push('/')
        }
      }, 1000)
    },
    toggle () {
      console.log('in toggle')
      this.showDropdown = !this.showDropdown
      if (this.$store.state.user.company.length === 0) {
        this.$store.state.user.company = JSON.parse(localStorage.companies)
      }
      this.companies = this.$store.state.user.company
      // console.log(
      //   'this.$store.state.user.company',
      //   this.$store.state.user.company
      // )
      this.name = this.$store.state.user.firstName
      // this.$emit('toggleOccured',this.showSideNav)
    },
    addComp () {
      this.showDropdown = !this.showDropdown
      this.addCompany = !this.addCompany
      this.$emit('createOccured', this.addCompany)
      this.$router.push('/addcompany')
    },
    onLogout () {
      this.$store.dispatch('logout')
    },
    switchCompany (company) {
      this.$store.dispatch('switch', company)
    },
    isActive (item, index) {
      // eslint-disable-next-line no-mixed-operators
      // console.log(
      //   'this.$store.state.user.activeCompany',
      //   this.$store.state.user.activeCompany
      // )

      if (
        (index === 0 && this.$store.state.user.activeCompany === '') ||
        item.company_name === this.$store.state.user.activeCompany
      ) {
        // console.log('item.company_name', item.company_name)
        return true
      }
      return false
    }
  }
}
</script>
<style scoped>
.companylink {
  text-align: center;
}

.header-wrapper {
  position: relative;
  color: black;
  width: 105%;
  z-index: 999;
  height: 58px;
  margin-top: -21px;
  margin-bottom: -53px;
  margin-left: -22px;
}

.header-wrapper .header-right {
  margin-left: 0px !important;
}

.dropdown-item {
  text-align: center;
}
</style>
