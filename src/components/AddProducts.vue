<template>
  <div>
    <b-container fluid class="card estimateContainer" id="titleConatainer">
      <b-row class="my-1">
        <label v-if="this.toggleData == true" id="titleLable" class="label">Add Product</label>
        <label v-else id="titleLable" class="label">Edit Product</label>
      </b-row>
    </b-container>

    <b-container fluid class="card estimateContainer margBot" id="eDetails">
      <b-form inline @submit="onSubmit" @reset="onReset" v-if="show">
        <b-row class="my-1">
          <b-col sm="3">
            <label class="label">
              Item Code:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              class="rowInput"
              v-model="form.item_code"
              size="md"
              type="text"
              required
              placeholder="Item Code"
            ></b-form-input>
          </b-col>

          <b-col sm="3">
            <label class="label">
              Description:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              class="rowInput"
              v-model="form.description"
              size="md"
              type="text"
              required
              placeholder="Description"
            ></b-form-input>
          </b-col>

          <b-col sm="3">
            <label class="label">
              Product Category
              <span class="text-danger">*</span>
            </label>

            <b-form-select
              v-model="form.category"
              :options="ProductCategoryList"
              required
              class="rowInput"
            ></b-form-select>
            <div class="mt-3">
              <strong>{{ selected }}</strong>
            </div>
          </b-col>
          <b-col sm="3">
            <label class="label">
              Unit
              <span class="text-danger">*</span>
            </label>

            <b-form-select v-model="form.unit" :options="UnitList" required class="rowInput"></b-form-select>
            <div class="mt-3">
              <strong>{{ selected2 }}</strong>
            </div>
          </b-col>
        </b-row>

        <b-row class="my-1">
          <b-col sm="3">
            <label class="label">Allow Sell:</label>
            <div>
              <b-form-checkbox v-model="form.allow_sell" name="check-button" switch size="lg">
                <!-- <b>({{ checked }})</b> -->
              </b-form-checkbox>
            </div>
          </b-col>
          <b-col v-if="form.allow_sell" sm="3">
            <label class="label">Selling Price:</label>
            <b-form-input
              class="rowInput"
              v-model="form.selling_price"
              size="md"
              type="text"
              required
              placeholder="Selling Price"
            ></b-form-input>
          </b-col>
        </b-row>

        <b-row class="my-1">
          <b-col sm="3">
            <label class="label">Allow Buy:</label>
            <div>
              <b-form-checkbox v-model="form.allow_buy" name="check-button" switch size="lg"></b-form-checkbox>
            </div>
          </b-col>
          <b-col v-if="form.allow_buy" sm="3">
            <label class="label">Cost Price:</label>
            <b-form-input
              class="rowInput"
              v-model="form.cost_price"
              size="md"
              type="text"
              required
              placeholder="Cost Price"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-button class="btn yellow saveFormBtn" type="submit" ref="formSubmitBtn">Submit</b-button>
          <b-button class="btn saveFormBtn resetFormBtn" type="reset">Reset</b-button>
        </b-row>
      </b-form>
      <!-- <b-row>
        <transition name="fade" mode="out-in">
          <div v-if="isSucess" class="alert" role="alert">Product is successfully added!</div>
        </transition>
      </b-row> -->
    </b-container>

    <!-- new added -->
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['editRowData', 'toggleRequest', 'elasticSearch', 'visible'],

  data () {
    return {
      response: false,
      toggleData: true,

      sellchecked: false, // for sell allowed checkbox
      costchecked: false,
      selected: null, // For product category list
      ProductCategoryList: [],
      selected2: null, // for unit list
      UnitList: [],

      form: {
        item_code: this.editRowData.item_code,
        description: this.editRowData.description,
        allow_buy: this.editRowData.allow_buy,
        allow_sell: this.editRowData.allow_sell,
        selling_price: this.editRowData.selling_price,
        cost_price: this.editRowData.cost_price,
        category: this.editRowData.category,
        unit: this.editRowData.unit
      },
      show: true,
      isSucess: false
    }
  },
  created () {
    this.$store.state.user.token = localStorage.accessToken
    // axios
    //   .get('users/masters/', {
    //     headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
    //   })
    //   .then(res => {
    // console.log(res)
    if (
      this.$store.state.masterData[5].product_categories != null &&
          this.$store.state.masterData[5].product_categories.length > 0
    ) {
      this.$store.state.masterData[5].product_categories.forEach(element => {
        this.ProductCategoryList.push({
          value: element.id,
          text: element.product_category
        })
      })
    }
    if (this.$store.state.masterData[6].units != null && this.$store.state.masterData[6].units.length > 0) {
      this.$store.state.masterData[6].units.forEach(element => {
        this.UnitList.push({
          value: element.id,
          text: element.unit
        })
      })
    }
    // })
  },
  mounted () {
    window.addEventListener('keydown', (e) => {
      // console.log(e.key)
      if (e.key === 'Enter' && this.visible) {
        const elem = this.$refs.formSubmitBtn
        elem.click()
      }
    })
  },
  watch: {
    isSucess (val) {
      if (val === true) {
        setTimeout(() => (this.isSucess = false), 1500)
        this.$router.go(0)
      }
    },

    editRowData: function (newEditRowData) {
      this.form.item_code = newEditRowData.item_code
      this.form.description = newEditRowData.description
      this.form.allow_buy = newEditRowData.allow_buy
      this.form.allow_sell = newEditRowData.allow_sell
      this.form.selling_price = newEditRowData.selling_price
      this.form.cost_price = newEditRowData.cost_price

      if (this.elasticSearch == true) {
        this.form.category = newEditRowData.category._id
        this.form.unit = newEditRowData.unit._id
      } else {
        this.form.category = newEditRowData.category
        this.form.unit = newEditRowData.unit
      }
      // (this.form.category = newEditRowData.category._id),
      // (this.form.unit = newEditRowData.unit._id);
    },
    toggleRequest: function (newToggledata) {
      this.toggleData = newToggledata
      // console.log(this.toggleData)
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      const data = {
        item_code: this.form.item_code,
        description: this.form.description,
        category: this.form.category,
        unit: this.form.unit,
        selling_price: Number(this.form.selling_price),
        cost_price: Number(this.form.cost_price),
        allow_buy: this.form.allow_buy,
        allow_sell: this.form.allow_sell
      }

      // console.log(data)
      if (this.toggleRequest == true) {
        axios
          .get(`/products/products/?search=${data.item_code}`, {
            headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
          })
          .then(response => {
          // console.log(response.data)
          // console.log(data.item_code)
          // console.log(response.data.length)
            if (response.data.length == 1) {
              this.response = true
              // console.log(response.data[0].id)
              axios
                .put(`/products/products/${response.data[0].id}/`, data, {
                  headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
                })
                .then(res => {
                  alert('Product successfuly edited')
                  this.isSucess = true
                  this.show = false
                })
                .catch(error => console.log(error))
            } else {
              this.response = false
              // console.log(this.response)
              axios
                .post(`/products/products/`, data, {
                  headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
                })
                .then(res => {
                  alert('Product successfully added')
                  this.isSucess = true
                  this.show = false
                })
                .catch(error => console.log(error))
            }
          })
      } else {
        axios
          .put(`/products/products/${this.editRowData.id}/`, data, {
            headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
          })
          .then(res => {
            alert('Product successfuly edited')
            this.isSucess = true
            this.show = false
          })
          .catch(error => console.log(error))
      }
    },
    onReset (evt) {
      this.$emit('displayNone', 'none')
      // Reset our form values
      this.form.item_code = ''
      this.form.description = ''
      this.form.allow_buy = false
      this.form.allow_sell = false
      this.form.category = ''
      this.form.unit = ''
      this.selling_price = ''
      this.cost_price = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Noto+Sans:400,700);
@import url(
  https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300
);
@import "http://fonts.googleapis.com/css?family=Open+Sans:300,400,700";
.margBot {
  margin-bottom: 20px;
}
#titleLable {
  margin-bottom: 0;
  font-size: 25px;
  padding: 0px 17px;
}
.saveFormBtn {
  position: relative;
  background-color: #ffc000;
  width: 100px;
  transform: translateX(-50%);
  left: 45%;
  margin-bottom: 20px;
  font-weight: bold;
}
.label {
  text-align: left;
  display: block !important;
  color: #666;
  font: 13px/1.55 "Open Sans", Helvetica, Arial, sans-serif;
  /* font-family: 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; */
  font-weight: 700;
  font-size: 100%;
}
.docIcon {
  position: absolute;
  height: auto;
  width: 33px;
  right: 5px;
  color: #9e9e9e;
}
.docIcon_1 {
  right: 38px;
}
.docIcon_2 {
  right: 71px;
}
.btn-dark,
.btn-warning {
  width: 7% !important;
}
.inputContainer {
  display: block;
  width: 100%;
  position: relative;
}
.text-danger {
  color: #ff6565;
}
.row {
  padding: 10px;
  width: 100%;
}
.rowInput {
  height: 34px;
  border: 1px solid lightgrey !important;
  border-radius: 4px;
  padding-right: 46px;
  font: 15px/23px "Open Sans", Helvetica, Arial, sans-serif;
  color: #404040;
}
.rowInput:focus {
  border-color: #ffc000 !important;
  box-shadow: 0px 0px 3px 1px #ffc000;
}
.estimateContainer {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.customercard {
  height: 40px;
  background-color: white;
  padding: 5px;
  margin-bottom: 10px;
  font-family: Helvetica;
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.5);
}
.alert {
  background-color: lightgreen;
  padding: 15px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.resetFormBtn:hover {
    color: #ffc000;
}
.resetFormBtn{
    background-color: #3a3636;
    margin-left: 15px !important;
}
.margBot {
  margin-bottom: 20px;
}
/* card css */
</style>
