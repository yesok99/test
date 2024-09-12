
/*
key 干预diff算法，在同一层级，key值相同的节点会比对，不同不比对
在循环生成的节点中，vue强烈建议给予每个节点唯一且稳定的key值
*/

import List from "./list.js";
import Trade from "./trade.js";
// import Products from "./products.js";

//<List ref="list" /> ref可以引用list中的函数

var template = `

<div class=" fudVta">

    <List ref="list" :message="parentMessage" />
    <Trade ref="list1" />
    <div class="eLoomw" style="position:relative">
    
        
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
        <div class="itemName"> 
            <h1>{{tokenA.symbol}}自动交易机器人</h1>
        </div>
        
        <div class="gGRQZP headinfo">
            <div id="OVGpirce">价格：\${{price}}</div> 
            <div id="coinAmount"></div>
            <div id="blocknumber">区块: {{blocknumber}}</div>
            <div class="sc-c4ec0fdf-0 dGKbaC" @click = "setup">
                <span class="sc-903b7e77-0 GvqcS">
                    <div class="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC fOPopv">
                        <button class="sc-a18ee1b-0 eYEeao sc-a97aa614-0 jMtDSu" scale="sm" id="open-settings-dialog-button">
                            <svg viewBox="0 0 24 24" height="24" width="24" color="textSubtle" xmlns="http://www.w3.org/2000/svg" class="sc-5a69fd5e-0 bvkLBb">
                                <path d="M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12C19.5 11.66 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.97 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H9.99996C9.74996 2 9.53996 2.18 9.50996 2.42L9.12996 5.07C8.51996 5.32 7.95996 5.66 7.43996 6.05L4.94996 5.05C4.71996 4.96 4.45996 5.05 4.33996 5.27L2.33996 8.73C2.20996 8.95 2.26996 9.22 2.45996 9.37L4.56996 11.02C4.52996 11.34 4.49996 11.67 4.49996 12C4.49996 12.33 4.52996 12.66 4.56996 12.98L2.45996 14.63C2.26996 14.78 2.21996 15.05 2.33996 15.27L4.33996 18.73C4.45996 18.95 4.72996 19.03 4.94996 18.95L7.43996 17.95C7.95996 18.35 8.51996 18.68 9.12996 18.93L9.50996 21.58C9.53996 21.82 9.74996 22 9.99996 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.28 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98ZM12 15.5C10.07 15.5 8.49996 13.93 8.49996 12C8.49996 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5Z"></path>
                            </svg>
                        </button>
                    </div>
                    <span color="failure" class="sc-903b7e77-1 fjbFSd"></span>
                </span>
            </div> 
                            
        </div>
      <div style="position: relative">
            <div style="margin-top: 16px; ;width: 100%;padding:0;" class="searchtoken" v-show="isShowsearch" >
                <input type="text" placeholder="输入token 地址" scale="md" v-model="inputToken" @keyup="handleKeyUp" @blur="inputBlur" ref="searchtokenInput" class=" kTbsxI  searchtokenInput" style="width: 100%;padding-left: 20px"  />
            </div>                
            <div class="pool div1" @click = "Showsearch" > 
                <div  class="reverse">{{tokenA.symbol}}: {{tokenA.amount}}</div>
                <div  class="reverse">{{tokenB.symbol}}: {{tokenB.amount}}</div>
            </div>
            
            <div class="div1 account" @click = "showAccount" >
                <span class="">账户地址：<span style="font-size:16px">{{formatAddress(wallet[userNo].address)}}</span> </span>
                <span  class="font1"">账号{{userNo}}</span>       
            </div>
     </div>

     <div style="margin-top: 16px; ;width: 100%;padding:0;" class='other' >
            <span class="inputlabel"> 筛选账号 </span>
            <input type="text" class=" kTbsxI " placeholder="输入账号编号：0～N" scale="md" v-model="newAccounts" @keyup="changeAccounts"  style="width: 100%; "  />
            <button class="showbalance" @click = 'getBalances'>余额</button>
    </div> 

        <div class="other ">

            <input type="number"   v-model="inputAmount"  placeholder="输入交易金额" scale="md" class=" kTbsxI "/>
            <span class="inputlabel"> 交易金额 </span>
            <button class="clearAmount" @click="clear" >清除 </button>

        </div>

        
        
        <div class="gGRQZP" style="margin-top: 10px"> 
            <div class="gvGfTO koisfk" style="flex-direction: column">
                <div class="balance"><span>{{symboltokenA}}  </span>
                <span class="reverse">0</span></div>
                <div style="color: #999;font-size: 13px;margin-top:5px" >{{symboltokenB}} $00000</div>
            </div>
            <div  style="width:80px;height:30px;background:greenyellow;display: none;">{{symboltokenB}} =&gt; {{symboltokenA}}</div>
                <div class="koisfk " style="flex-direction: column">
                    <div class="balance"><span>{{symboltokenB}} $</span><span id="usdtBalance" class="reverse">0</span></div>
                    <div style="color: #999;font-size: 13px;margin-top:5px" id="usdtToSctBlaance">{{symboltokenA}} 00000</div>
                </div>
            </div>


        <div class="gGRQZP" style="margin-top: 10px">
            <div class="dGKbaC " style="width:48%">
                <span class="inputlabel">卖出价格 </span>
                <input type="number" id="SellPrice" value="0.450" placeholder="卖出价格" scale="md" class=" kTbsxI ">
            </div>
            <div class="dGKbaC " style="width:48%">
                <span class="inputlabel">买入价格 </span>
                <input type="number" id="BuyPrice" value="0.001" placeholder="买入价格" scale="md" class=" kTbsxI ">
            </div>
        </div>

        <div class="gGRQZP" tyle="margin-top: 10px">
            <div style="margin-top:10px;display: none;" class="koisfk tradeMode"> 
                <button id="quickSwap" class="jPppJN" scale="md">快速交易</button>
            </div>
            <div style="margin-top:10px" class="koisfk tradeMode"> 
                <button id="autoSwap" class="jPppJN" scale="md">开始交易</button>
            </div>
            
            <div style="margin-top:10px" class="koisfk tradeMode"> 
                <button id="SwapMode" class="jPppJN" scale="md">单次交易</button>
            </div>

        </div>
        

    </div>

</div>` ;
//<div>来自父组件的消息：{{message}}</div>

export default {

    //注册组件
    components:{
        List,
        Trade
        // Products
    },
    template,
    //获取父组件的message
    //获取父组件里：template = `<div><contract :message="parentMessage" / </div>
    props: ['message'],
    data(){
        return {
            parentMessage:'来自父组件的消息',
            price:0,
            blocknumber:0,
            tokenA:{'symbol':'','amount':0},
            tokenB:{'symbol':'','amount':0},
            period:1500*2,
            isShow:false,
            accounts: userAccountInfo,
            list : document.getElementById('#list'),
            userNo:0,
            inputAmount:"0.0000000000001",
            isShowsearch:false,
            inputToken:'',
            newAccounts:0,

        }
    },
    mounted() {
        this.userNo = 4;
        this.newAccounts = this.userNo;
        userWallet = Object.assign({}, wallet[this.userNo]);
        this.loop();

      },

    methods:{

       setup(){},
       getBalances(){

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

       },
       showAccount() {
        this.isShow = true;
        
        } ,
        clear(){
            this.inputAmount = '';
            
            
        },
        Showsearch(){
            this.isShowsearch = true;
            this.$nextTick(() => {
                this.$refs.searchtokenInput.focus();
            });
        },
        inputBlur(){

            this.isShowsearch = false;
        },
        handleKeyUp(){
            console.log(this.inputToken);

            let token =  web3.utils.toChecksumAddress(this.inputToken);

            if((token.length != 42) || (token.indexOf('0x') == -1)){

                return;
            }

			if(web3.utils.checkAddressChecksum(token)) {
                
                if(this.inputToken == tokenA) {
                    this.isShowsearch = false;
                    return;
                }
                    
                getMulToken([this.inputToken, tokenB]).then(r =>{
                    tokenA = this.inputToken;
                    this.tokenA.symbol = r[0][1];
                    this.tokenB.symbol = r[1][1];
                    getPairLp(tokenA, tokenB).then(r =>{

                        this.price = r[2].toFixed(6);
                        this.tokenA.amount = BigNumber(r[0]/1e18).toFormat(0);
                        this.tokenB.amount = BigNumber(r[1]/1e18).toFormat(0);
                    });
                })
			}

            this.isShowsearch = false;
        },
        search(){
            
        },

        async getThis(id){
            userWallet = Object.assign({}, wallet[id])
            this.userNo = id
        },

        changeAccounts(){

            try{
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

        async loop(){

          var  Timers = setTimeout(async () => {
                try{
    
                    getMulToken([tokenA, tokenB]).then(r =>{
                        this.tokenA.symbol = r[0][1];
                        this.tokenB.symbol = r[1][1];
                        symboltokenA = this.tokenA.symbol;
                        symboltokenB = this.tokenB.symbol;

                        getPairLp(tokenA, tokenB).then(r =>{
    
                            this.price = r[2].toFixed(6);
                            this.tokenA.amount = BigNumber(r[0]/1e18).toFormat(0);
                            this.tokenB.amount = BigNumber(r[1]/1e18).toFormat(0);
                        });
                    })
    
                    
                        
                    web3.eth.getBlockNumber().then(r =>{
            
                            this.blocknumber = r;
                    });
        
                }catch(e){
                    console.error(e);
                }

                clearTimeout(Timers);

                this.loop();
              
            }, this.period)
        },

    },     
   
}