<template>
  <div class="hello">
      <input type="text" v-model="todo">
      <button @click="doAdd()">+增加</button>
      <hr>
      <h2>进行中</h2>
      <ul>
        <li v-for="(item,key) in list" v-if="!item.checked">
          <input type="checkbox" v-model="item.checked" @change="saveList()">  {{item.title}}----- <button @click="removeData(key)">删除</button>
        </li>
      </ul>

      <hr>
      <h2>已完成</h2>
        <ul>
        <li v-for="(item,key) in list"  v-if="item.checked"> 
          <input type="checkbox"  v-model="item.checked" @change="saveList()"> {{item.title}}----- <button @click="removeData(key)">删除</button>
          </li>
      </ul>
  </div>
</template>
-
<script>
    import storage from '../model/storage.js';
export default {
  
  data () {
    return {
     todo:'',
     status:true,
     list:[
       //{title:'任务1',checked:true},
     ]
    }
  },
  methods:{
    doAdd:function(){
      this.list.push( {
        title:this.todo,
        checked:false
      });
      this.todo = '';
        storage.set('list',this.list);
    },
    removeData:function(key){
      console.log(key);
       this.list.splice(key,1);
         storage.set('list',this.list);
    },
    saveList:function(){
        storage.set('list',this.list);
    }
  },
  mounted(){ //生命周期函数
    var list=storage.get('list');
    if(list){
        this.list = list;
    }
      console.log(list);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
