
/*
key 干预diff算法，在同一层级，key值相同的节点会比对，不同不比对
在循环生成的节点中，vue强烈建议给予每个节点唯一且稳定的key值
*/


var template = `<div>
<ul>
    <!-- key 干预diff算法，在同一层级，key值相同的节点会比对，不同不比对
    在循环生成的节点中，vue强烈建议给予每个节点唯一且稳定的key值
    -->
    <li :key="item.id" v-for="(item,i) in goods">
       名称： {{ item.name }} 数量：
       <span v-if="item.stock >0">{{ item.stock }}</span>
       <span v-else>无货</span> 
       <span v-if="item.stock >0">
       <button @click = "changeStock(item,item.stock - 1)">-</button></span>
       <button @click = "changeStock(item,item.stock + 1)">+</button>
       <button @click = "remove(i)">删除</button>
      </li>

</ul>
<h1>computed属性:{{computedName}}</h1>

<!-- show img -->
<!-- v-bind:src = :src -->
<h1>show切换显示</h1>
<div><button @click = "isShow = !isShow">切换显示</button> </div>
<img v-show="isShow" :src="imgUrl" @click = "isShow = !isShow" style="width:100px" alt="">


<h1>model数据双向绑定：{{text}}</h1>

<input type="text" v-model="text" />
<!-- <input type-"text" :value="text" @input = "text=$event.target.value"/> -->

</div>`


export default {
    template,
    data(){
        return {
            // title:"Hello World",
                goods:[
                    {id:1,name:'huawei',stock:1},
                    {id:2,name:'xiaomi',stock:2},
                    {id:3,name:'apple',stock:3}
                ],
                sites: [
                { name: 'Runoob' },
                { name: 'Google' },
                { name: 'Taobao' }
                ],
                text:'ABC',
                imgUrl:'https://t11.baidu.com/it/u=2219381680,3076976631&fm=173&s=2B402AD96500414D1035176A0300C074&w=400&h=484&img.JPEG',
                isShow:true,
        }
            
    },
    methods:{
        remove(i){
            this.goods.splice(i,1);
        },
        changeStock(product,newStock){
            if(newStock < 0) {
                newStock = 0;
            }
                
            product.stock = newStock;

        }

    },
    computed:{

        computedName(){
           return this.text + ' + Hello';
        }


    }

}