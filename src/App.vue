<template>
  <div id="app">
    <router-view/>
    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item id="index">
        <span class="mui-icon mui-icon-home"></span>
				<span class="mui-tab-label">首页</span>
      </mt-tab-item>
      <mt-tab-item id="search">
      	<span class="mui-icon mui-icon mui-icon-search"></span>
				<span class="mui-tab-label">搜索</span>
      </mt-tab-item>
      <mt-tab-item id="shoppingCart">
     		<span class="mui-icon mui-icon-extra mui-icon-extra-cart"><span class="mui-badge" id="badge">{{$store.getters.getAllCount}}</span></span>
				<span class="mui-tab-label">购物车</span>
      </mt-tab-item>
      <mt-tab-item id="userCenter">
       	<span class="mui-icon mui-icon-contact"></span>
				<span class="mui-tab-label">我的</span>
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
export default {
  data(){
    return{
      selected: 'index',
    }
  },
  watch:{
  /*   $route(to,from){
      console.log(to.path);
       switch(val){
            case '/index':
                this.$router.push('/');
            break;
            case '/search':
                this.$router.push('/search');
            break;
            case '/shoppingCart':
                this.$router.push('/shoppingCart');
            break;
            case '/userCenter':
                this.$router.push('/userCenter');
            break;
        }
    }, */
      selected: function (val, oldVal) {
          // 这里就可以通过 val 的值变更来确定去向
          console.log(val);
          switch(val){
              case 'index':
                  this.$router.push('/');
              break;
              case 'search':
                  this.$router.push('/search');
              break;
              case 'shoppingCart':
                  this.$router.push('/shoppingCart');
              break;
              case 'userCenter':
                  this.$router.push('/userCenter');
              break;
          }
      }
  }
}
</script>
<style lang="less">
@import '../src/assets/font-icon/iconfont.css';
body{
  margin: 0;
  padding: 0;
  background: #f6f6f6;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
a{
  text-decoration: none;
}
em,i{
  font-style: normal;
}
div{
  box-sizing: border-box;
}
ul{
  margin: 0;
  padding: 0;
 
}
 li{
    list-style-type: none;
  }
  
button, input[type="button"], input[type="submit"], input[type="reset"] {
  -webkit-appearance: none;
  outline: none;
}

select, input, textarea {
  font-size: 100%;
  color: #34342f;
  font-family: "Microsoft YaHei";
  border: none;
  border-radius: 0;
  -webkit-border-radius: 0;
  outline: none;
  -webkit-appearance: none;
  /*强制去除表单自带的样式*/
}
.mint-tab-item{
  position: relative;
  color: #666;
  span{
    display: block;
    
  }
}
.mui-icon .mui-badge{
  left: 70%;
}
.iconfont{
  font-size: 0.5rem;
}
  .v-enter, .v-leave-to{
      opacity: 0;
      transform: translateX(100%);
      position:absolute;
  }  
    .v-enter-active,.v-leave-active{
      transition: all 0.5s ease;  
  }
</style>
