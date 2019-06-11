<template>
    <div>
        <div class="titel-search">
            <div class="" @click="searchBtn">
                <span class="iconfont  icon-sousuo"></span>
                <span class="q">搜索商品</span>
            </div>
       </div>
        <div class="swipe hide">
            <mt-swipe :auto="4000">
                <mt-swipe-item><img src="//m.360buyimg.com/mobilecms/s750x366_jfs/t1/43836/4/1965/137250/5cc82106E2889bc9d/7fefaca8500c4d07.jpg!cr_1125x549_0_72!q70.jpg.dpg" alt=""></mt-swipe-item>
                <mt-swipe-item><img src="//m.360buyimg.com/mobilecms/s750x366_jfs/t1/42336/24/3795/97938/5ccff2fdE473c5c97/4cb46c800dca4b11.jpg!cr_1125x549_0_72!q70.jpg.dpg" alt=""></mt-swipe-item>
                <mt-swipe-item><img src="//m.360buyimg.com/mobilecms/s750x366_jfs/t1/31162/17/1128/101786/5c46ead8E22ee9740/f66061da227c1965.jpg!cr_1125x549_0_72!q70.jpg.dpg" alt=""></mt-swipe-item>
            </mt-swipe>
        </div>
         <div class="nav-list" v-if="this.isShow">
            <ul>
                <li v-for="(item,index) in navList" :class="[index == navIndex ? 'active' : '']" :key="index" @click="changeNavigation(item,index)">{{item}}</li>
            </ul>
        </div>
        <div class="content">
            <div class="list-box">
                <ul 
                v-infinite-scroll="loadMore" 
                infinite-scroll-disabled="isMoreLoading"
                infinite-scroll-distance="10">
                    <li class="item-wrap" v-for="(item,index) in loadingList" :key="index">
                        <div class="title-wrap" @click="detailBtn(item.goodsNum)" >
                            <img class="pic" :src="item.picGoods" alt="">
                            <div class="title">{{item.titGoods}}</div>
                        </div>
                        <div class="price">
                            <em>￥{{item.qhjGoods}}</em> <del>{{item.oriPrice}}</del> 
                            <a class="ticket" href="#">{{item.CouponNum}}元券</a>
                        </div>
                        <div class="sales-volume">
                            <span>已售<em>{{item.monthNum}}万</em></span>
                            <span class="collect">
                                <span class="iconfont icon-shoucang "  :class='item._id==curKey?"active":""'  @click="toggleCollect(index,item._id)"></span>收藏
                            </span>
                        </div>
                    </li>
                </ul>
            </div> 
            <!-- <button @click="loadMore()">点击加载更多</button> -->

            <!--显示加载中状态-->
            <div class="loading-box tc" v-if="loading">
                <mt-spinner type="snake" class="loading-more"></mt-spinner>
                <span class="loading-more-txt">加载中...</span>
            </div>
            <div class="no-more" v-if="noMore">没有更多了~</div>
        </div>
        
    </div>
</template>
<script>
export default {
    data(){
        return{
            navList:['全部','男装','女装','箱包','内衣','美妆','配饰','鞋品','儿童','母婴','居家','美食','数码'],
            navIndex:0,
            navItem:'全部',
            list:[],//筛选过的数据
            listAll:[],//所有数据
            loadingList:[],//渲染数据
            pageSize: 10,//总页数
            pageNum: 1,
            pageTotal:0,
            loading:false, // 加载中转圈
            isMoreLoading:true, // 加载更多中
            noMore: false, // 是否还有更多
            isShow:true, //导航是否显示
            isSelected:false, //收藏
            curKey:'',
        }
    },
    methods:{
        changeNavigation(item,index){//导航切换
            this.loadingList=[],
            this.list=[],  //切换的时候，把上次筛选的清空， 存切换过来的数据
            this.navIndex = index;
            this.navItem  = item;
            this.pageNum = 1; // 初始化
            this.noMore = false;

            this.listAll.forEach(ele=>{
                if(ele.listTypes==item){  //切换时，循环当前存的数据，再根据当前的item 再筛选一次，把筛选的存到this.list
                    this.list.push(ele)
                }
            })
            this.pageTotal =Math.ceil(this.list.length/this.pageSize);
            this.loadingList=this.list.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize)//默认10条数据

        },
        requestData(){ //请求数据
            let _this = this;
            this.loading = true // 加载中
       
            this.axios.get('/api/v0/lists',{ listTypes: _this.navIndex}).then((response) => {
                this.listAll =response.data.lists; //把请求回来的数据存起来
               
                //加载10条
                   //console.log( this.loadingList);
                this.listAll.forEach(ele => {
                    if(ele.listTypes==this.navItem){
                        this.list.push(ele)//这是已经筛选过的数据
                    }
                });
               
                this.pageTotal =Math.ceil(this.list.length/this.pageSize);
                this.loadingList=this.list.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize)//默认10条数据
            
                this.loading = false;
                this.isMoreLoading = false;
                //console.log(this.loadingList)
            },(err)=>{
                console.log('失败');
            });
        },
        loadMore() { //加载更多
            this.pageNum ++ // 增加分页
            this.loading = true // 加载中
            if(this.pageNum >= this.pageTotal){// 超过了分页
                this.noMore = true // 显示没有更多了
                this.loading = false // 关闭加载中
                return false
            }else{ 
                setTimeout(() => {
                    this.list.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize).forEach(ele => {
                        this.loadingList.push(ele)
                    });

                     //用这个也可以
                    //this.loadingList=this.loadingList.concat(this.list.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize))

                }, 100);
               
            }
        },
        detailBtn(id){ //详情
            let ids = id
            this.$router.push({
                path:'/details',
                query:{
                    id:ids
                }
            })
        },
        searchBtn(){
            this.$router.push({
                path:'/search'
            })
        },
        toggleCollect(index,id){ //收藏
            console.log(index,id);
            let _id = id;
            this.curKey = id;
            this.isSelected = !this.isSelected;
        }
    },
    mounted(){ //生命周期函数
       this.requestData('全部');
     
    },
    created() {
       
    }
  
}
</script>
<style scoped lang="less" >
@import '../assets/base.less';
    body{
        .bg(#f6f6f6);
    }
    .hide{
        display: none;
    }
    .titel-search{
        .w(100%);
        .h(1rem);
        .color(#666);
        margin: 0;
        padding: 0;
        overflow: hidden;
        .pt(0.2rem);
        .pl(0.75rem);
        .bg(#ff753c);
        position: relative;
        .iconfont{
            .fs(0.35rem);
            position: absolute;
            left: 0.3rem;
            top: 0.2rem;
        }
        div{
            .w(6rem);
            line-height: 0.6rem;
            .fs(0.28rem);
            .border(1px,#ddd);
            .radius(0.4rem);
            .fl(left);
            padding: 0;
            .bg(#fff);
            text-align: left;
            text-indent: 0.6rem;
        }
    }
   .swipe {
        .w(100%);
        .h(3.5rem);
        overflow: hidden;
        img{
            .w(100%);
        }
    }
    .nav-list{
        .w(100%);
        .h(0.8rem);
        .fs(0.28rem);
        line-height: 0.8rem;
        .bg(#fff);
        white-space: nowrap;
        box-shadow: 0 1px 2px rgba(0,0,0,.1);
        overflow-x: scroll;
        overflow-y: hidden;
        -webkit-backface-visibility: hidden;
        -webkit-perspective: 1000;
        -webkit-overflow-scrolling: touch;
        text-align: justify;
        padding: 0px 5px;
        box-sizing: border-box;
        li{
            display: inline-block;
            .w(20%);
            .fs(0.28rem);
            .color(#666);
            line-height: 0.77rem;
            text-align: center;
            text-decoration: none; 
            &.active{
                color: #fd4c42;
                border-bottom: 1px solid #fd4c42;
            }
        }
        &::-webkit-scrollbar{display: none;}
    }
    .list-box{
        overflow: hidden;
        display: flex;
        padding:0 0.3rem;
        .bg(#f6f6f6); 
        ul{
            .w(100%);
            overflow: hidden;
            .item-wrap{
                .w(47%);
                .border(1px,#eee);
                .radius(0.1rem);
                .bg(#fff);
                .fl(left);
                .mt(0.3rem);
                .pb(0.15rem);
                text-align: left;
                &:nth-child(odd){
                    .mr(0.3rem);
                }
                .title-wrap{
                    .color(#333);
                }
                .pic{
                    .w(100%);
                    border-radius: 0.1rem 0.1rem 0 0;
                    font-size: 0;
                }
                .title{
                    .fs(0.28rem);
                    padding: 0 0.1rem;
                    .mb(0.15rem);
                    display: -webkit-box !important;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    word-break: break-all;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:2
                }
                .price{
                    .fs(0.24rem);
                    .color(#999);
                    padding: 0 0.1rem;
                    .mb(0.15rem);
                    em{
                        font-style: normal;
                        font-weight: bold;
                        .fs(0.3rem);
                        .color(#fd4c42);
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
                }
                .sales-volume{
                    .fs(0.24rem);
                    .color(#999);
                    padding: 0 0.1rem;
                    .collect{
                        .fl(right);
                        .iconfont{
                            .mr(0.1rem);
                            vertical-align: middle;
                            .icon-shoucang1{
                                color: #ff753c;
                            }
                           
                        }
                       
                    }
                }
            
            }
        }
       
    }
    .loading-box{
        .w(100%);
        .fs(0.3rem);
        text-align: center;
    }
    .mint-spinner-snake{
        margin: 0 auto;
    }
    .no-more{
        .w(100%);
        .h(0.5rem);
        .fs(0.3rem);
    }
   
</style>
