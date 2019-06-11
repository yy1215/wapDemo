<template>
  <div class="shopcar">
    <mt-header title="购物车">
        <span slot="left" @click="goBack">
            <mt-button icon="back"></mt-button>
        </span>
    </mt-header> 
    <div class="cart-list">
      <!-- 商品区 -->
    	<div class="mui-card list" v-for="(item,index) in list" :key="index">
				<div class="mui-card-content">
					<div class="mui-card-content-inner">
						<mt-switch v-model="$store.getters.getGoodsSelected[item.goodsNum]" @change="selectedChange(item.goodsNum,$store.getters.getGoodsSelected[item.goodsNum])"></mt-switch>
            <img class="pic" :src="item.picGoods" alt="">
            <div class="">
              <p class="name">{{item.titGoods}}{{item.id}}</p>
              <p><strong class="price">￥{{item.qhjGoods}}</strong> 
              <numbox class="number" :initcount="$store.getters.getGoodsCount[item.goodsNum]" :goodsid="item.goodsNum"></numbox> 
              <span class="del" @click="remove(item.goodsNum,index)">删除 </span></p>
            </div>
					</div>
				</div>
			</div>
  
      <!-- 结算区 -->
      <div class="mui-card settlement">
				<div class="mui-card-content">
					<div class="mui-card-content-inner">
            <h6>总计(不含运费)</h6>
						<p>已勾选商品<strong>{{$store.getters.getGoodsCountAmount.count}}</strong>件，总价： <strong>￥{{$store.getters.getGoodsCountAmount.amount}}</strong></p>
            <mt-button type="danger" size="small">去结算</mt-button>
					</div>
				</div>
			</div>
    </div>
  </div>
</template>

<script>
import numbox from './goodsinfo_numbox.vue' //导入数字选择框
export default {
  data(){
        return{
          value:true,
          list:[]
        }
    },
  created(){
      this.detailsData();
  },
  methods:{
    goBack(){
        //点击后退
        this.$router.go(-1);
    },
    detailsData(id){
      var idArr =[];
      this.$store.state.car.forEach(item =>{
        idArr.push(item.id)
      })
      this.axios.get('/api/v0/lists',).then((response) => {
        var list = response.data.lists; //把请求回来的数据存起来
        list.forEach((ele,index) => {
          idArr.forEach( id=>{
            if(id == ele.goodsNum){
              this.list.push(ele)
            }
          })
            
        });
      })

    },
    remove(id,index){
      this.list.splice(index,1);
      this.$store.commit('removeFormCar',id)
    },
    selectedChange(id,val){
      //最新的select值 ,同步store中
      console.log(id,val);
      this.$store.commit('updateGoodsSelected',{id , selected:val})
    }
  },
  components:{
      numbox
  }
 
  
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="less" scoped>
@import '../assets/base.less';
.mint-header{
      .bg(#ff753c);
  }
  .mint-button--danger{
    background-color: #ff753c;
  }
.shopcar{
  background: #f6f6f6;
  overflow: hidden;
}

.list{
  .mui-card-content-inner{
    display: flex;
    align-items: center;
  }
  .name{
    color: #333;
    display: -webkit-box !important;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2
  }
  .pic{
    width: 1.4rem;
    .ml(0.1rem);
  }
  .price{
    color: #f00;
    float: left;
  }
  .del{
    color: #037f70;
  }
  .mui-numbox{
    height: 25px !important;
  }
}
.settlement{
  h6{
    text-align: left;
  }
  p{
    float: left;
  }
  strong{
    color: #f00;
  }
}
</style>
