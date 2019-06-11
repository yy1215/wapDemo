// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Mint from 'mint-ui'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/global'

//Vue.config.productionTip = false
Vue.use(Mint);
Vue.use(VueAxios, axios);
import 'mint-ui/lib/style.css'; 

//导入mui样式
import '@/lib/mui/css/mui.css'
import '@/lib/mui/css/icons-extra.css'
import mui from '@/lib/mui/js/mui.js';  
Vue.prototype.$mui = mui;  

//状态管理
import Vuex from 'Vuex'
Vue.use(Vuex);

var car = JSON.parse( localStorage.getItem('car') || '[]'); 
var store = new Vuex.Store({
  state:{
    car:car  //将购物中的商品数据，用数组存储
  },
  mutations:{
    addToCar(state,goodsinfo){
      console.log(state,goodsinfo);
      var falg = false;
      state.car.some(item =>{
        if(item.id == goodsinfo.id){
          item.count += parseInt(goodsinfo.count);
          falg=true;
          return true;
        }
      })

      if(!falg){
        state.car.push(goodsinfo);
      }

      //当更新car之后，把car数据存储到本地的localStorage
      localStorage.setItem('car',JSON.stringify(state.car))
    },
    updateGoodsInfo(state,goodsinfo){
      //console.log(state,goodsinfo);
      //修改购物车商品的数量
      state.car.some(item =>{
        if(item.id == goodsinfo.id){
          item.count = parseInt(goodsinfo.count);
          return true;
        }
      })
      //修改完数量，把最新的数据保存到本地
      localStorage.setItem('car',JSON.stringify(state.car))
    },
    removeFormCar(state,id){ 
      //根据id,从store 中的购物车中删除对应的商品
      state.car.some((item,i) =>{
        if(item.id == id){
          state.car.splice(i,1)
          return true;
        }
      })
      //删除后，把最新的数据保存到本地
      localStorage.setItem('car',JSON.stringify(state.car))

    },
    updateGoodsSelected(state,info){
      //同步开关状态
      state.car.some(item =>{
        if(item.id == info.id){
          item.selected =  info.selected
          return true;
        }
      })
      //修改完数量，把最新的数据保存到本地
      localStorage.setItem('car',JSON.stringify(state.car))
    }
  },
  getters:{
    //相当于计算属性
    getAllCount(state){
      var c= 0;
      state.car.forEach(item=>{
      
          c += item.count;
      })
    
      return c;
    },
    getGoodsCount(state){
      var o={};
      state.car.forEach(item => {
        o[item.id] = item.count;
      });
      //console.log(o)
      return o;
    },
    getGoodsSelected(state){
      var o={};
      state.car.forEach(item => {
        o[item.id] = item.selected;
      });
      return o;
    },
    getGoodsCountAmount(state){
      var o={
        count:0, //勾选数量
        amount:0  //勾选总价
      };
      state.car.forEach(item => {
        if(item.selected){
          o.count += item.count;
          o.amount += item.price * o.count
        }
      });
      return o;
    }
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render:c =>c(App),
  store
  //components: { App },
  //template: '<App/>'
})
