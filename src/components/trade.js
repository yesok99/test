
/*
key 干预diff算法，在同一层级，key值相同的节点会比对，不同不比对
在循环生成的节点中，vue强烈建议给予每个节点唯一且稳定的key值
*/

//<div  style="width:80px;height:30px;background:greenyellow;display: none;">{{message.tokenB.symbol}} =&gt; {{message.tokenA.symbol}}</div>
var template = `<div>

        <div v-show="isShow" id="setting"   >
            
            <div class="settinghead" @click = "isShow = !isShow">
                <h1>设 置</h1>
            </div>

            <div class="other ">
                <span class="inputlabel"> 设置滑点 </span>
                <input type="number" max="99.9" min="0.35"  v-model="slippage"  placeholder="输入不大于1的数值" scale="md" class=" kTbsxI "/>

            </div>

            <div class="other ">
                <span class="inputlabel"> gasRate </span>
                <input type="number"   v-model="gasRate"  placeholder="不要超过1.2" scale="md" class=" kTbsxI "/>

            </div>

            <div style="padding-top: 10px;">
                <div style="line-height:40px">
                    <span v-if="isErrormnemonic && inputMnemonic" v-bind:style="{ color: 'red' }">请输入正确的助记词</span>
                    <span v-else-if="!isErrormnemonic && inputMnemonic" v-bind:style="{ color: 'green' }">导入成功</span>
                </div>
                <textarea placeholder="输入助记词" v-model="inputMnemonic" class="inputMnemonic" @input="creatAcount">></textarea>
            </div>

        </div>



    <div class="other ">

        <input type="number"   v-model="inputAmount"  placeholder="输入交易金额" scale="md" class=" kTbsxI "/>
        <span class="inputlabel"> 交易金额 </span>
        <button class="clearAmount" @click="clear" >清除 </button>

    </div>

    <div class="gGRQZP" style="margin-top: 10px"> 
        <div  v-bind:class="classA" @click = 'setAmount(0)'  style="flex-direction: column">
            <div class="balance">
                <span>{{message.tokenA.symbol}}  </span>
                <span class="reverse">{{message.tokenA.amount}}</span>
            </div>
            <div style="color: #999;font-size: 13px;margin-top:5px" >
                {{message.tokenB.symbol}} \${{message.tokenA.AtoB}}
            </div>
        </div>
        
        <div v-bind:class="classB" @click = 'setAmount(1)'  style="flex-direction: column">
            <div class="balance">
                <span>{{message.tokenB.symbol}} $</span>
                <span id="usdtBalance" class="reverse">{{message.tokenB.amount}}</span>
            </div>
            <div style="color: #999;font-size: 13px;margin-top:5px" id="usdtToSctBlaance">
                {{message.tokenA.symbol}} {{message.tokenB.BtoA}}
            </div>
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
            <div style="margin-top:10px" class="koisfk swap" @click = "sell"> 
                卖出
            </div>

            <div style="margin-top:10px" class="koisfk swap" @click = "buy"> 
                买入
            </div>

        </div>
    </div>

</div>` ;

import { EventBus } from './event-bus.js';
export default {
    template,
    props: ['message'],
    data(){
        return {
            inputAmount: "", 
            inputMnemonic:"",
            isErrormnemonic:true,
            tokenBalances:{
                'tokenA': {
                    'symbol': 0,
                    'amount': 0,
                    'AtoB': 0
                },
                'tokenB': {
                    'symbol':0,
                    'amount': 0,
                    'BtoA': 0
                },
                'tokenBalances': [0, 0],
                'price':1
            },
            classA:{
                'gvGfTO': true,
                 'yellow': false,

            },
            classB:{
                'gvGfTO': true,
                 'yellow': true,
            },
            isShow:false,
            slippage: 1,
            gasRate: 1,

        }
    },   
    mounted() {
        
      },
    methods:{
        clear(){
            this.inputAmount = '';

        },

        setAmount(i){
            // sell
            if(i == 0){

                this.classA.yellow = true;
                this.classB.yellow = false;
                this.inputAmount = this.tokenBalances.tokenBalances[0];
                this.inputAmount = BigNumber(this.inputAmount).div(BigNumber(10).pow(tokens[tokenA].decimals)).toFixed(18);
            }
            //buy
            else{
                
                this.classA.yellow = false;
                this.classB.yellow = true;

                this.inputAmount = this.tokenBalances.tokenBalances[1];
                this.inputAmount = BigNumber(this.inputAmount).div(BigNumber(10).pow(tokens[tokenB].decimals)).toFixed(18);


            }
                
        },
        buy(){

            //swap(token0, token1, amountIn, Slippage = 0.97, user )
            if(this.slippage >100 || this.slippage < 0)
                return;
            let slippage = (100 - this.slippage) / 100;
            let amountIn = BigNumber(this.inputAmount).multipliedBy(BigNumber(10).pow(tokens[tokenB].decimals))
            swap(tokenB, tokenA, amountIn, slippage, this.gasRate);
        },
        sell(){
            if(this.slippage >100 || this.slippage < 0)
                return;
            let slippage = (100 - this.slippage) / 100;
            let amountIn = BigNumber(this.inputAmount).multipliedBy(BigNumber(10).pow(tokens[tokenA].decimals));
            swap(tokenA, tokenB, amountIn, slippage, this.gasRate);
        },

        setting(){

            this.isShow = true;


        },

        // 创建账号
        async creatAcount(){

            if(keys.bip39.validateMnemonic(this.inputMnemonic.trim())) {
                this.isErrormnemonic = false;
                // console.log(123333444)
                // initWallet(255, this.inputMnemonic, "hello");
                // console.log(123)

                new Promise(r=>{
                        setTimeout(()=>{
                            initWallet(10, this.inputMnemonic, "hello");
                        },0)
                })

                
            } else {

                this.isErrormnemonic = true
            }
                

        }

        
    },
    //使用bus总线接收信息
    created() {
        EventBus.$on('Setting', (data)=>{
            
            this.setting();
        
        });
      },
      beforeDestroy() {
        EventBus.$off('Setting', this.setting);
      },
    
   
}