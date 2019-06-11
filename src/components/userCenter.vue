<template>
  <div class="">
    <mt-header title="个人中心">
    <span slot="left" @click="goBack">
        <mt-button icon="back"></mt-button>
    </span>
    </mt-header> 
    <div class="info">
      <img class="pic" src="https://ss0.bdstatic.com/7Ls0a8Sm1A5BphGlnYG/sys/portrait/item/b9e1e951.jpg" alt="">
      <p class="name">比地科技</p>
    </div>
    <input class="btn-out" type="button" value="退出登录">
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
     
    }
  },
  methods:{
     goBack(){
        //点击后退
        this.$router.go(-1);
    },
  
  },
  mounted(){
   
  }
 
  
  
}
</script>

<style lang="less" scoped>
@import '../assets/base.less';
.mint-header{
    .bg(#ff753c);
  }
  .info{
    .mt(0.4rem);
    overflow: hidden;
    .pic{
      .w(1rem);
      border-radius: 50%;
    }
  }
  .btn-out{
    .w(3rem);
    .mt(0.3rem);
  }
</style>
