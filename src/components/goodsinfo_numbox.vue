<template>
    <div>
       <div class="mui-numbox" data-numbox-min='1' data-numbox-max='9'  style="height:25px">
            <button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
            <input id="test" class="mui-input-numbox" type="number" :value="initcount"  @change="countChanged" ref="numbox" readonly/>
            <button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
        </div>
    </div>
</template>
<script>

export default {
   data(){
       return{
       }
   },
   methods:{
    countChanged(e) {
        //console.log( this.$refs.numbox.value);
        // 每当 文本框的数据被修改的时候，立即把 最新的数据，通过事件调用，传递给父组件
        //this.$emit("getcount", parseInt(this.$refs.numbox.value));
        this.$store.commit("updateGoodsInfo",{
            id:this.goodsid,
            count:this.$refs.numbox.value
        });
    } 
   },
   mounted(){
       this.$mui('.mui-numbox').numbox();
   },
   props:["initcount","goodsid"],
  watch:{

  }
}
</script>
<style>
    .mui-numbox{
        float: left;
    }
</style>
