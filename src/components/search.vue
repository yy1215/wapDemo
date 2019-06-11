<template>
    <div>
       <div class="search">
           <form @submit.prevent action="#">
                <div class="search-input">
                    <span class="iconfont  icon-sousuo"></span>
                    <input type="text" v-model="keyword" placeholder="请输入搜索商品名"  @keypress="searchGoods($event)" >
                    
                </div>
                <button class="cancel-btn" @click="cancel()">取消</button>
           </form>
       </div>
        <div class="content ">
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
            <!--显示加载中状态-->
            <div class="loading-box tc" v-if="loading">
                <mt-spinner type="snake" class="loading-more"></mt-spinner>
                <span class="loading-more-txt">加载中...</span>
            </div>
            <div class="no-more" v-if="noMore">没有更多了~</div>
        </div>
        <div class="history">
            <div class="title">
                <h3><span class="iconfont icon-lishijilu"></span> 历史记录</h3>
                <span class="delete" @click="remove">清除</span>
            </div>
            <ul class="list" >
                <li v-for="(item,index) in historyList"  @click="historyClick(item.name)">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            list:[],//筛选过的数据
            listAll:[],//所有数据
            loadingList:[],//渲染数据
            pageSize: 10,//总页数
            pageNum: 1,
            pageTotal:0,
            loading:false, // 加载中转圈
            isMoreLoading:true, // 加载更多中
            noMore: false, // 是否还有更多
            isSelected:false, //收藏
            curKey:'',
            keyword:'',
            searchList:'',
            historyxs:false,
            historyList:[],
            history:[]
        }
    },
    methods:{
        searchGoods(event){ //搜索
            console.log(event.keyCode);
            if (event.keyCode == 13) {
                event.preventDefault(); //禁止默认事件（默认是换行）
                this.keyword = event.target.value;
                if(this.keyword == ''||this.keyword==null){
                    alert('搜索内容不能为空');
                    this.historyxs=true;
                }else{
                    this.axios.get('/api/v0/lists/$'+this.keyword ).then((response) => {
                        this.list =response.data.textLists; //把请求回来的数据存起来
                        console.log( this.list);

                        this.pageTotal =Math.ceil(this.list.length/this.pageSize);
                        this.loadingList=this.list.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize)//默认10条数据
                      
                        this.loading = false;
                        this.isMoreLoading = false;
                        this.isShow =false;
                        this.historyxs=false;
                     
                        this.history.push({"name":this.keyword})
                        console.log( this.history)
                        
                    },(err)=>{
                        console.log('失败');
                    })
                }
                localStorage.setItem("history",JSON.stringify(this.history));
            }
           
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
        cancel(){
            this.$router.push({
                path:'/index',
            })
        },
        remove(){
            localStorage.removeItem('history');
            this.historyList=[];
        },
        historyClick(name){
            this.keyword = name
            this.axios.get('/api/v0/lists/$'+this.keyword ).then((response) => {
                this.list =response.data.textLists; //把请求回来的数据存起来
                console.log( this.list);

                this.pageTotal =Math.ceil(this.list.length/this.pageSize);
                this.loadingList=this.list.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize)//默认10条数据
                
                this.loading = false;
                this.isMoreLoading = false;
                this.isShow =false;
                this.historyxs=false;
                
                this.history.push({"name":this.keyword})
                console.log( this.history)
                
            },(err)=>{
                console.log('失败');
            })
             localStorage.setItem("history",JSON.stringify(this.history));
        }
    },
    mounted(){ 
        //生命周期函数
   
      this.historyList =JSON.parse(localStorage.getItem("history")); 
        console.log(this.historyList);
    },
    created() {
    }
}
</script>
<style lang="less">
@import '../assets/base.less';
    body{
        .bg(#fff);
    }
    .hide{
        display: none;
    }
    .search{
        .w(100%);
        .h(1rem);
        margin: 0;
        padding: 0;
        overflow: hidden;
        .pt(0.2rem);
        .pl(0.3rem);
        .pr(0.3rem);
        position: relative;
        .bg(#ff753c);
        .color(#666);
        .search-input{
            .w(6rem);
            .bg(#fff);
            overflow: hidden;
            .border(1px,#ddd);
            .radius(0.4rem);
            .fl(left);
        }
        .iconfont{
            .fs(0.35rem);
            .fl(left);
            margin: 0.12rem 0 0 0.15rem;
        }
        input{
            .w(5.35rem);
            .h(0.6rem);
            line-height: 0.6rem;
            .fs(0.28rem);
            .color(#666);
            .fl(left);
            padding: 0;
            margin: 0;
            border: 0;
            background: none;
            text-indent: 0.1rem;
        }
        .cancel-btn{
            .fs(0.28rem);
            line-height: 0.6rem;
            .fl(right);
            .color(#fff);
            background: none;
            border: 0;
            padding: 0;
           
        }
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
    .no-content{
        .fs(0.3rem);
        .color();
        .mt(3rem);
    }
    .history{
        .title{
            .fs(0.28rem);
            .color(#333);
            .pl(0.3rem);
            .pr(0.3rem);
            .mt(0.3rem);
            .mb(0.3rem);
            overflow: hidden;
            h3{
                .fs(0.28rem);  
                font-weight: normal;
                .fl(left);
                margin: 0;
                .iconfont{
                    .fs(18px);
                }
            }
            .delete{
                .fl(right);
            }
        }
        .list{
            .fs(0.3rem);
            .pl(0.3rem);
            .pr(0.3rem);
            li{
                line-height: 0.6rem;
                .fl(left);
                .bg(#f6f6f6);
                .radius(0.4rem);
                .pl(0.3rem);
                .pr(0.3rem);
                .mb(0.2rem);
                .mr(0.2rem);
                a{
                    display: inline-block;
                    .color(#333);
                }
            }
        }
    }

</style>
