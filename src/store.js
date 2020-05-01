import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'
import router from './router'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ],
  state: {
    accessToken: null,
    loggingIn: false,
    loginError: null,
    isActive: [{
      bool: false
    }, {
      bool: false
    }, {
      bool: false
    }, {
      bool: false
    }, {
      bool: false
    },{
      bool: false
    }],
    masterData: '',
    user: {
      userId: null,
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      phoneNumber: '',
      address: '',
      isAdmin: '',
      company: [],
      token: '',
      loginToken: '',
      activeCompany: ''
    }
  },
  mutations: {
    loginStart: state => (state.loggingIn = true),
    loginStop: (state, errorMessage) => {
      state.loggingIn = false
      state.loginError = errorMessage
    },

    updateAccessToken: (state, accessToken) => {
      state.accessToken = accessToken
    },
    updateCompanies: (state, companies) => {
      state.user.company = companies
    },
    updateUserId: (state, userId) => {
      state.user.userId = userId
    },

    updateMasterData: (state, masterData) => {
      state.masterData = masterData
    },

    // updateAxiosBaseUrl: (state, baseUrl) => {
    //   // state.masterData = masterData
    //   axios.defaults.baseURL = 'http://' + baseUrl + '.widgetor.com/quotation'
    // },

    authUser (state, userData) {
      // state.user.token = userData.token
      state.user.userId = userData.userId
      state.user.username = userData.username
      state.user.firstName = userData.firstName
      state.user.lastName = userData.lastName
      state.user.phoneNumber = userData.phoneNumber
      state.user.company = userData.company
      state.user.isAdmin = userData.isAdmin
      state.user.email = userData.email
      state.user.token = userData.token
      state.user.loginToken = userData.token
      state.user.activeCompany = userData.activeCompany
      state.user.masterData = userData.masterData
    },
    addCompany (state, userData) {
      state.user.company = userData.company
    },
    clearAuthData (state) {
      state.user.token = null
      state.user.loginToken = null
    },
    setCompany (state, company) {
      state.user.activeCompany = company
    },
    setToken (state, token) {
      state.user.token = token
      // state.user.loginToken = token
      // console.log('setToken', token)
    },
    selectPage (state, selectedPageId) {
      // console.log('yes in selectPage Mutation')

      state.isActive.forEach(element => {
        element.bool = false
        // console.log('element', element)
        // console.log('selectedPageId in mutation', selectedPageId)
      })
      state.isActive[selectedPageId].bool = true
      // console.log('isActive', this.isActive)
    }

  },
  actions: {
    selectPageAction ({commit}, pageId) {
      commit('selectPage', pageId)
    },

    masterData ({
      commit
    }, token) {
      // console.log('masters data function')
      axios
        .get('users/masters/', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        .then(res => {
          commit('updateMasterData', res.data)
        }).catch(err => (console.log(err)))
    },
    signup ({
      commit,
      dispatch
    }, authData) {
      axios.post('/users/register/', {
        user_name: authData.username,
        password: authData.password,
        company: authData.companyName,
        first_name: authData.firstName,
        last_name: authData.lastName,
        phone: authData.phoneNumber,
        email: authData.email
      })
        .then(res => {
          // console.log(res)
          commit('authUser', {
            username: res.data.user_name,
            userId: res.data.user_Id,
            company: res.data.company,
            firstName: res.data.first_name,
            lastName: res.data.last_name,
            phoneNumber: res.data.phone,
            email: res.data.email
          })
        }).catch(error => {
          console.log(error)
        })
      dispatch('login', {
        username: authData.username,
        password: authData.password
      })
    },

    login ({
      commit, dispatch
    }, authData) {
      commit('loginStart')

      axios.post('/users/login/', {
        username: authData.username,
        password: authData.password
      }).then(res => {
        localStorage.setItem('refreshToken', res.data.refresh_token)
        localStorage.setItem('accessToken', res.data.token)
        localStorage.setItem('loginToken', res.data.token)
        localStorage.setItem('userId', res.data.id)
        localStorage.setItem('firstName', res.data.first_name)
        localStorage.setItem('username', res.data.first_name)
        localStorage.setItem('isAdmin', res.data.is_admin)
        localStorage.setItem('companies', JSON.stringify(res.data.companies))
        commit('loginStop', null)
        commit('updateAccessToken', res.data.token)
        commit('updateUserId', res.data.id)
        // console.log('res.data.companies', res.data.companies)
        // console.log('this.state.user.loginToken', res.data.token)
        // console.log('this.state.user.activeCompany', this.state.user.activeCompany)
        console.log('login res', res)
        commit('authUser', {
          firstName: res.data.first_name,
          username: res.data.first_name,
          lastName: res.data.last_name,
          email: res.data.email,
          phoneNumber: res.data.phone_number,
          token: res.data.token,
          loginToken: res.data.token,
          isAdmin: res.data.is_admin,
          company: res.data.companies,
          userId: res.data.id,
          activeCompany: res.data.companies[0].company_name
        })
        localStorage.setItem('activeCompany', res.data.companies[0].company_name)
        axios.defaults.baseURL = 'http://' + res.data.companies[0].company_name + '.widgetor.com/quotation'
        // console.log('axios.defaults.baseURL', axios.defaults.baseURL)
        dispatch('masterData', res.data.token)
      }).catch(error => {
        console.log('logon faild')
        console.log(error)
      })
    },

    fetchAccessToken ({
      commit, dispatch
    }) {
      if (localStorage.getItem('loginToken') != null) {
        commit('updateAccessToken', localStorage.getItem('loginToken'))
        dispatch('masterData', localStorage.getItem('loginToken'))
        commit('setToken', localStorage.getItem('loginToken'))
      }
      if (localStorage.getItem('activeCompany') != null) {
        commit('setCompany', localStorage.getItem('activeCompany'))
        axios.defaults.baseURL = 'http://' + localStorage.getItem('activeCompany') + '.widgetor.com/quotation'
      }
      // console.log('fetchAccessToken', localStorage.getItem('loginToken'))
    },
    fetchCompanies ({
      commit
    }) {
      commit('updateCompanies', localStorage.getItem('companies'))
      // console.log('fetchAccessToken')
    },
    fetchUserId ({
      commit
    }) {
      commit('updateUserId', localStorage.getItem('userId'))
    },

    switch ({
      commit, dispatch
    }, company) {
      // this.state.user.activeCompany = company
      commit('setCompany', company)
      localStorage.setItem('activeCompany', company)
      axios.defaults.baseURL = 'http://widgetor.com/quotation/'
      axios.post('users/switch_company/', {
        company_to: company
      }, {
        headers: {
          'Authorization': 'Bearer ' + this.state.user.loginToken
        }
      }).then(res => {
        // console.log('res.data.token', res.data.token)
        // console.log('this.state.user.loginToken', this.state.user.loginToken)
        // console.log('this.state.user.activeCompany', this.state.user.activeCompany)
        commit('setToken', res.data.token)
        localStorage.setItem('accessToken', res.data.token)
        commit('updateAccessToken', res.data.token)
        axios.defaults.baseURL = 'http://' + this.state.user.activeCompany + '.widgetor.com/quotation'
        dispatch('masterData', res.data.token)
        this.$router.go()
      }).catch(error => {
        axios.defaults.baseURL = 'http://' + this.state.user.activeCompany + '.widgetor.com/quotation'
        console.log(error)
      })
    },
    // add new company
    addCom ({
      commit
    }, data) {
      axios.post('/users/new_company/', {
        company: data.newcompany
        //  }, { headers: { 'Authorization': 'Bearer ' + this.state.user.token
        // }
      })
        .then(res => {
          // console.log(res)
          commit('addCompany', {
            company: res.data.company
          })
        }).catch(error => (console.log(error)))
    },
    logout ({
      commit
    }) {
      axios.post('/users/logout/', {},

        {
          headers: {
            'Authorization': 'Bearer ' + this.state.user.token
          }
        })
        .then(res => {
          // console.log(res)
          commit('clearAuthData')
          localStorage.clear()
          router.replace('/')
        }).catch(error => (console.log(error)))
    }

  },
  getters: {
    isAuthenticated (state) {
      return state.user.token !== ''
    },
    sendCompanies (state) {
      return state.user.company
    },
    token (state) {
      return state.user.token
    },
    userId (state) {
      return state.user.userId
    },
    username (state) {
      return state.user.username
    }
  }
})
