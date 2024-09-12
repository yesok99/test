
/*
key 干预diff算法，在同一层级，key值相同的节点会比对，不同不比对
在循环生成的节点中，vue强烈建议给予每个节点唯一且稳定的key值
*/


var template = `<div>
<h1>{{title}}</h1>
</div>` ;

export default {
    template,
    data(){
        return {
            title:"this is a test components",
                
        }
    },
    methods:{

    },    
   
}