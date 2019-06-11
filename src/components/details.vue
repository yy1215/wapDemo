<template>
    <div v-if="isRouterAlive">
        <mt-header :title="details.titGoods">
            <span slot="left" @click="goBack">
                <mt-button icon="back"></mt-button>
            </span>
        </mt-header> 
        <transition name="my" 
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
            >
            <div class="ball" v-show="ballFlag" ref="ball"></div>
        </transition>
        <div class="dateils-wrap">
            <img :src="details.picGoods" alt="详情图">
            <h3 class="title">{{details.titGoods}}</h3>
            <div class="price">
                <em>￥{{details.qhjGoods}}</em>
                <a class="ticket" href="#">{{details.CouponNum}}元券</a>
            </div>
            <div class="sales-volume">
                 <del>原价{{details.oriPrice}}</del> <span>月销量<em>{{details.monthNum}}</em>万</span>
            </div>
            <div class="qty">
                <span>购买数量：</span>  
                <numbox @getcount="getSelectedCount" ></numbox>
            </div>
            <p class="btn">
                <mt-button type="primary" size="small">立即购买</mt-button>
                <mt-button type="danger" size="small" @click="addCar()">加入购物车</mt-button>
            </p>
        </div>
        <div class="recommend">
            <div class="title-wrap">
                —  <span class="iconfont icon-shoucang"></span> 猜你喜欢  —  
            </div>
            <ul class="recommend-list">
                <li class="item-wrap" v-for="(item,index) in recommend" :key="index">
                    <div class="title-wrap" @click="detailBtn(item.goodsNum)">
                        <img class="pic" :src="item.picGoods" alt="">
                        <div class="title">{{item.titGoods}}</div>
                        <div class="price">
                            <em>￥{{item.qhjGoods}}</em>&nbsp;&nbsp;<del>原价：{{item.oriPrice}}</del> 
                        </div>
                    </div>
                    <div class="sales-volume">
                        <a class="ticket" href="#">{{item.CouponNum}}元券</a>
                        <span>已售<em>{{item.monthNum}}万</em></span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import numbox from './goodsinfo_numbox.vue' //导入数字选择框
export default {
    //inject:['reload'],
   
    data(){
        return{
            // reload:this.detailsData,
            isRouterAlive:true,
            details:[],
            recommend:[],
            pageNum:1,
            pageSize:10,
            currentId:this.$route.query.id,
            goodsinfo:{},
            ballFlag:false, //控制小球的隐藏和显示
            selectedCount:1 //保存用户选的数量
        }
    },
    mounted(){
        //console.log(this.currentId)
        this.detailsData(this.currentId);
    },
    methods:{
        goBack(){
            //点击后退
            this.$router.go(-1);
        },
        detailsData(id){ //详情
           
            let _this = this;
            this.axios.get('/api/v0/lists/'+id).then((response) => {
                this.details = response.data.data.list
                this.recommend = response.data.data.relativeLists
                this.pageTotal =Math.ceil(this.recommend.length/this.pageSize);
                this.recommend=this.recommend.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize)//默认10条数据
            
            },(err)=>{
                alert('请求失败');
            });
            
        },
        detailBtn(id){
            let ids = id
            this.$router.push({
                path:'/details',
                query:{
                    id:ids
                }
            })
        },
        beforeEnter: function (el) {
            el.style.transform = "translate(0 ,0)";
        },
        //动画开始之后的样式
        enter: function (el,done) {
            el.offsetWidth
            // 获取小球的 在页面中的位置  
            const ballPosition = this.$refs.ball.getBoundingClientRect();
             // 获取 徽标 在页面中的位置
             const badgePosition = document
            .getElementById("badge")
            .getBoundingClientRect();
            const xDist = badgePosition.left - ballPosition.left;
            const yDist = badgePosition.top - ballPosition.top;
            el.style.transform = `translate(${xDist}px, ${yDist}px)`; 
            el.style.transition = "all 1s cubic-bezier(.4,-0.3,1,.68)";

            //done，起始就是beforeEnter这个函数，也就是说：done 是afterEnter函数的引用
            done();
        },
        afterEnter: function (el) {
            this.ballFlag  = !this.ballFlag;
        },
        addCar(){
            //添加购物车
            this.ballFlag = !this.ballFlag

            //调用store中的mutations 来将商品加入购物车
            var goodsinfo={id:this.currentId,count:this.selectedCount,price:this.details.qhjGoods,selected:true}
            console.log(goodsinfo)
            this.$store.commit('addToCar',goodsinfo);
        },
      
        getSelectedCount(count){
            console.log(count);
             // 当子组件把 选中的数量传递给父组件的时候，把选中的值保存到 data 上
            this.selectedCount = count;
            console.log("父组件拿到的数量值为： " + this.selectedCount);
        }
    },
    created() {
        
    },
     watch: {
        '$route' (to, from) {
            // data数据操作
            let ids = to.query.id;
            if(ids != this.currentId){
                window.location.reload();
                this.detailsData(ids);
            }
        }
    },
    components:{
        numbox
    }
    

}
</script>
<style lang="less" scoped>
@import '../assets/base.less';
    .mint-header{
        .bg(#ff753c);
    }
    .ticket{
        display:inline-block;
        .w(1rem);
        .fs(0.24rem);
        .color(#fff);
        .fl(right);
        text-align: center;
        background: linear-gradient(0deg, rgba(255,75,66,1), rgba(255,117,60,1));
        background: -webkit-linear-gradient(0deg, rgba(255,75,66,1), rgba(255,117,60,1));
        background: -o-linear-gradient(0deg, rgba(255,75,66,1), rgba(255,117,60,1));
        background: -moz-linear-gradient(0deg, rgba(255,75,66,1), rgba(255,117,60,1));
    }
    .dateils-wrap{
        img{
            .w(100%);
        }
        .title{
            font-weight: normal;
            line-height: 1.2;
            .fs(0.3rem);
            text-align: left;
            .color(#333);
            .pl(0.3rem);
            .pr(0.3rem);
            .mt(0);
            .mb(0.1rem);
            display: -webkit-box !important;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }
        .price{
            .fs(0.24rem);
            .color(#999);
            .pl(0.3rem);
            .pr(0.3rem);
            text-align: left;
            em{
                font-weight: bold;
                .fs(0.36rem);
                .color(#fd4c42);
            }
           
        }
        .sales-volume{
            .fs(0.24rem);
            .color(#999);
            .pl(0.3rem);
            .pr(0.3rem);
            text-align: left;
            span{
                .fl(right);
            }
        }
        .qty{
            color: #333;
            overflow: hidden;
            .fs(0.3rem);
            .pl(0.3rem);
            .pr(0.3rem);
            span{
                float: left;
            }
        }
        .btn{
            text-align: left;
            .pt(0.2rem);
            .pl(0.3rem);
        }
        .mint-button--primary{
            background-color: #ff753c;
        }
        .mint-button--danger{
            background-color: #ff6002;
        }
    }
    .title-wrap{
        .fs(0.3rem);
        .color(#FF4B42);
        .mt(0.4rem);
    }
    .recommend-list{
        text-align: left;
        .pl(0.3rem);
        .pr(0.3rem);
        li{
            overflow: hidden;
            .mb(0.1rem);
        }
        img{
            .w(2rem);
            .fl(left);
            .mr(0.15rem);
            border-radius: 0.1rem 0.1rem 0 0;
        }
        .title{
            line-height: 1.2;
            .w(4.5rem);
            .fs(0.28rem);
            .color(#333);
            .mt(0.15rem);
            .mb(0.15rem);
            .fl(left);
        }
        .price{
            .fs(0.24rem);
            .color(#999);
            .mb(0.15rem);
            em{
                font-weight: bold;
                .fs(0.3rem);
                .color(#fd4c42);
            }
        }
        .sales-volume{
            .fs(0.24rem);
            .color(#999);
            span{
                .fl(right);
            }
            .ticket{
                .fl(left);
            }
        }
    }
    .ball{
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #f00;
        position: absolute;
        z-index: 99;
        top: 509px;
        left: 142px;
    }
</style>

