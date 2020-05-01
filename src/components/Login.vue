<template>

    <div class="container">
        <div class="row">
			<div class="col-md-5 mx-auto">
			<div id="first">
				<div class="myform form ">
					 <div class="logo mb-3">
						 <div class="col-md-12 text-center">
							<h1>Login</h1>
						 </div>
					</div>
                   <form action=""  @submit.prevent="onSubmit">
                           <div class="form-group">
                              <input type="text" name="username"  class="form-control" id="username"  placeholder="Enter username" v-model="username">
                           </div>
                           <div class="form-group">

                              <input type="password" name="password" id="password"  class="form-control"  placeholder="Enter Password" v-model="password">
                           </div>

                           <div class="col-md-12 text-center ">
                              <button type="submit" class=" btn btn-block mybtn btn-primary tx-tfm">Login</button>
                           </div>
                            <div class="col-md-12 ">
                              <div class="login-or">
                                 <hr class="hr-or">
                                 <span class="span-or">or</span>
                              </div>
                           </div>
                           <!-- <div class="col-md-12 mb-3">
                              <p class="text-center">
                                 <a href="javascript:void();" class="google btn mybtn"><i class="fa fa-google-plus">
                                 </i> Signup using Google
                                 </a>
                              </p>
                           </div> -->
                           <div class="form-group">
                              <p class="text-center">Don't have account? <router-link to='/signup'>Sign up here</router-link></p>
                           </div>
                        </form>

				</div>
			</div>

			</div>
		</div>
      </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      username: '',
      password: '',
      user: null,
      companyId: ''
    }
  },
  computed: {
    getcompanyid () {
      let companies = this.$store.getters.sendCompanies
      return companies[0].company_id
    },
    auth () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    toggle () {
      this.showSignUp = !this.showSignUp
    },
    onSubmit () {
      const formData = {
        username: this.username,
        password: this.password
      }
      axios.post('/users/login/', {username: formData.username, password: formData.password}).then(res => {
        localStorage.setItem('refreshToken', res.data.refresh_token)
        localStorage.setItem('accessToken', res.data.token)
        localStorage.setItem('loginToken', res.data.token)
        localStorage.setItem('userId', res.data.id)
        localStorage.setItem('firstName', res.data.first_name)
        localStorage.setItem('username', res.data.first_name)
        localStorage.setItem('isAdmin', res.data.is_admin)
        localStorage.setItem('companies', JSON.stringify(res.data.companies))
        this.$store.commit('loginStop', null)
        this.$store.commit('updateAccessToken', res.data.token)
        this.$store.commit('updateUserId', res.data.id)
        // console.log('res.data.companies', res.data.companies)
        // console.log('this.state.user.loginToken', res.data.token)
        // console.log('this.state.user.activeCompany', this.state.user.activeCompany)
        console.log('login res', res)
        this.$store.commit('authUser', {
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
        this.$store.dispatch('masterData', res.data.token)
        // this.$store.dispatch('login', {username: formData.username, password: formData.password})
        this.$router.push('/home')
        this.$store.dispatch('selectPageAction', 0)
      }).catch(error => {
        console.log('logon faild')
        console.log(error)
        this.$alert('Please enter valid username and password', 'Error', 'error')
      })
      // console.log(formData)

      // axios.defaults.baseURL = 'http://' + this.$store.state.user.activeCompany + '.widgetor.com/quotation'
      // this.$store.dispatch('masterData')
    }
  },
  mounted () {
    const data = {
      refresh: localStorage.refreshToken
    }

    this.$store.state.user.token = localStorage.accessToken
    // this.$store.state.user.company = localStorage.companies

    axios
      .get('/products/products/?pagesize=10', {
        headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
      })
      .then(response => {
        // this.$store.dispatch('masterData', localStorage.loginToken)
        this.$store.dispatch('selectPageAction', 1)
        this.$store.state.user.company = JSON.parse(localStorage.companies)
        this.$router.push('/products')
      })
      .catch(response => {
        // console.log("daily token not working")

        axios.post('/users/token_refresh/', data,
          {headers: {'Content-Type': 'application/json'}}
        )
          .then(response => {
            // console.log(response.data.access)
            this.$store.state.user.token = localStorage.accessToken
            localStorage.accessToken = response.data.access
            localStorage.loginToken = response.data.access
            this.$router.push('/products')
          })
          .catch(error => {
            // console.log('response not working')
            console.log(error)
          })
      }
      )
  }
}
</script>
<style >

        a{
         text-decoration:none !important;
         }
         h1,h2,h3{
         font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
         }
          .myform{
		position: relative;
		display: -ms-flexbox;
		display: flex;
		padding: 1rem;
		-ms-flex-direction: column;
		flex-direction: column;
		width: 100%;
		pointer-events: auto;
		background-color: #fff;
		background-clip: padding-box;
		border: 1px solid rgba(0,0,0,.2);
		border-radius: 1.1rem;
		outline: 0;
		max-width: 500px;
		 }
         .tx-tfm{
         text-transform:uppercase;
         }
         .mybtn{
         border-radius:50px;
         }

         .login-or {
         position: relative;
         color: #aaa;
         margin-top: 10px;
         margin-bottom: 10px;
         padding-top: 10px;
         padding-bottom: 10px;
         }
         .span-or {
         display: block;
         position: absolute;
         left: 50%;
         top: -2px;
         margin-left: -25px;
         background-color: #fff;
         width: 50px;
         text-align: center;
         }
         .hr-or {
         height: 1px;
         margin-top: 0px !important;
         margin-bottom: 0px !important;
         }
         .google {
         color:#666;
         width:100%;
         height:40px;
         text-align:center;
         outline:none;
         border: 1px solid lightgrey;
         }
          form .error {
         color: #ff0000;
         }
         /* #second{display:none;} */
</style>
