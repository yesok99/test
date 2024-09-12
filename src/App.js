/* ###################
  父组件传给子组件信息
  1、在data里定义属性：parentMessage
  2、在template里 <子组件名称 message:='parentMessage' />
  3、在子组件中添加：props ,export default {
  template,
    props: ['message'],
  #################### */
 /* ################### 
    父组件调用子组件的方法
    1、在父组件中添加 ref ：<Getpair ref='getpair' />
    2、调用：this.$refs.getpair.方法名称


   #################### */

import Products from "./components/products.js";
import test from "./components/test1.js";
import contract from "./components/contract.js";

// 组件 <Products /><test />
//绑定子组件消息
var template = `<div>
    <contract  />
`
    // <Products />
    // <test />
    // </div>` ;

export default {
    //注册组件
    components:{
        
        // Products,
        // test,
        contract
    },
    template,
    data() {
        return {
          parentMessage: 'Hello from parent component'
        };
      }
    
}