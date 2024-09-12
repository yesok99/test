
/*
key 干预diff算法，在同一层级，key值相同的节点会比对，不同不比对
在循环生成的节点中，vue强烈建议给予每个节点唯一且稳定的key值
*/

import List from "./list.js";

var template = `<div>

<List ref='list' />
    <div class="div1 account" @click = "showAccount" >
        <span class="">账户地址：<span style="font-size:16px">{{formatAddress(wallet[userNo].address)}}</span> </span>
        <span  class="font1"">账号{{userNo}}</span>       
    </div>
    <div style="margin-top: 16px; ;width: 100%;padding:0;" class='other' >
        <span class="inputlabel"> 筛选账号 </span>
        <input type="text" class=" kTbsxI " placeholder="输入账号编号：0～N" scale="md" ref="myInput" v-model="newAccounts" @keyup="changeAccounts" @keyup.enter='getBalances' style="width: 100%; "  />
        <button class="showbalance" @click = 'getBalances'>余额</button>
    </div> 

    <div >
    <div v-show="isShow" id="list"  @click = "isShow = !isShow">
        <div class="listHead">
            <div>序号 </div>
            <div>账号编号</div>
            <div>账号地址</div>
            <div>级别</div>
            <div>倍数</div>
        </div>

        <div class="listAccount green" v-for="(account,index) in accounts" :id="account.sn" @click="getThis(account.sn)" >
            <div >    {{index}} </div>    
            <div > 账号{{account.sn}} </div>
            <div style="text-aligin:left">  {{formatAddress(account.address)}} </div>
            <div>  NO  </div>
            <div> 7 </div>
        </div>

    </div>

</div>

</div>` ;

export default {
    components:{
        List,
    },
    template,
    data(){
        return {
            userNo:0,
            newAccounts:0,
            isShow:false,
            accounts: userAccountInfo,
            list : document.getElementById('#list'),

                
        }
    },
    mounted() {
        this.userNo = 4;
        this.newAccounts = this.userNo;
        userWallet = Object.assign({}, wallet[this.userNo]);


      },
    methods:{

            async getThis(id){
                userWallet = Object.assign({}, wallet[id])
                this.userNo = id
            },

            showAccount() {
                this.isShow = true;
                
                } ,

            changeAccounts(){

                try{
                    var arr = [];
                    arr = splitStr(this.newAccounts.toString());
                    if((arr.length > 0) ){
    
                        //对数组做最大值处理
                        for(let i=0; i< arr.length; i++) {
                            if (Number(arr[i]) >= userAccountInfo.length) {
                              if(arr.length == 2)
                                arr = [0, userAccountInfo.length - 1];
                              else 
                              arr = [userAccountInfo.length - 1];
                              break;
                            }
                        };
    
    
                        this.accounts = [];
                        if(arr.length == 1){
                            this.accounts.push(userAccountInfo[arr[0]]);
    
                        }
                            
                        else if(arr.length == 2){
                            
                            for(let i = arr[0];i <= arr[1];i++)
                                this.accounts.push(userAccountInfo[i])
                            
                        } else {
    
                            arr.forEach(i => {
                                this.accounts.push(userAccountInfo[i])
    
                            })
    
                        }
                        
    
                        this.userNo = arr[arr.length - 1];
                        userWallet = wallet[this.userNo];
                        // console.log(p(this.userNo))
                    }
                    
                } catch(e){}
                
            },

            getBalances(){

                this.$refs.myInput.blur();
                // 获取文本框内容
                var arr = [];
                arr = splitStr(this.newAccounts.toString());
                if((arr.length > 0) ){
        
                    //对数组做最大值处理
                    for(let i=0; i< arr.length; i++) {
                        if (Number(arr[i]) > userAccountInfo.length) {
                          if(arr.length == 2)
                            arr = [0, userAccountInfo.length - 1];
                          else 
                          arr = [userAccountInfo.length - 1];
                          break;
                        }
                    };
                }
                if(arr.length >= 2)
                    this.$refs.list.showAccountBalance(arr[0],arr[1]);
                else if(arr.length == 1)
                    this.$refs.list.showAccountBalance(arr[0],arr[0]);
               },

    },    
   
}