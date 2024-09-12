
/*
key 干预diff算法，在同一层级，key值相同的节点会比对，不同不比对
在循环生成的节点中，vue强烈建议给予每个节点唯一且稳定的key值
*/


var template = `<div>


    <div class="itemName" @click = "isAutoloop" style=""> 
        <h1>{{tokenA.symbol}}自动交易机器人</h1>
    </div>

    <div class="gGRQZP headinfo">
        <div id="OVGpirce">价格：\${{price}}</div> 
        <div id="coinAmount"></div>
        <div id="blocknumber">区块: {{blocknumber}}</div>
        <div  @click = "setup">
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
        <div style="margin-top: 16px; ;width: 100%;height:300px;padding:10px;z-index:1000;background:white" class="searchtoken" v-show="isShowsearch" >
            <input type="text" placeholder="输入tokenA 地址" scale="md" v-model="inputToken" @keyup="handleKeyUp" @blur="inputBlur" ref="searchtokenInput" class=" kTbsxI  searchtokenInput" style="width: 100%;padding-left: 20px"  />
            <div style="margin-top:10px">
            tokenB
            </div>
        </div>                
        <div class="pool div1" @click = "Showsearch" > 
            <div  class="reverse">{{tokenA.symbol}}: {{tokenA.amount}}</div>
            <div  class="reverse">{{tokenB.symbol}}: {{tokenB.amount}}</div>
        </div>

        
    </div>

</div>` ;

import { EventBus } from './event-bus.js';

export default {

    template,

    data(){
        return {
            price:0,
            blocknumber:0,
            tokenA:{'symbol':'','amount':0},
            tokenB:{'symbol':'','amount':0},
            isShowsearch:false,
            isShowsearch:false,
            inputToken:'',
            period:1000*2,
            busdata:0
                
        }
    },
    mounted() {

        // this.loop();

      },
    methods:{
        setup(){
            //总线事件
            EventBus.$emit('Setting', this.busdata);

        },

        isAutoloop(){

            isLoop = isLoop ? false : true;
            console.log('isLoop:',isLoop);

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

        async handleKeyUp(){
            
            // console.log(this.inputToken);
            if(!web3.utils.isAddress(this.inputToken))
                return;
            

            let token =  web3.utils.toChecksumAddress(this.inputToken);

            if((token.length != 42) || (token.indexOf('0x') == -1)){

                return;
            }

			if(web3.utils.checkAddressChecksum(token)) {
                
                // if(this.inputToken == tokenA) {
                //     this.isShowsearch = false;
                //     return;
                // }
                    
                let ret = await this.getpair(token, tokenB);

                if(ret)
                    tokenA = token;

			}

            this.isShowsearch = false;
        },

        search(){
            
        },
        showAccount() {
            this.isShow = true;
            
        } ,

        async loop(){

            this.getpair(tokenA,tokenB);
            var  Timers = setTimeout(async () => {
                clearTimeout(Timers);
                  this.loop();

              }, this.period)
          },

        async getpair(_tokenA,_tokenB=usdt){

            if(tokenA.toLowerCase() == tokenB.toLowerCase())
                return false;
            try{
      
                let r = await getMulToken([_tokenA, _tokenB]);
                if(!r)
                    return false; //非法合约地址
                else{

                    this.blocknumber = r.blockNumber;
                    this.tokenA.symbol = r.tokenInfo[0][1];
                    this.tokenB.symbol = r.tokenInfo[1][1];
                    symboltokenA = this.tokenA.symbol;
                    symboltokenB = this.tokenB.symbol;

                    let pair = await getPairLp(_tokenA, _tokenB);
                    
                    if(pair){
                        
                        if(pair[2]>1)
                            this.price = pair[2].toFixed(3);
                        else if (pair[2]>0.01)
                            this.price = pair[2].toFixed(5);
                        else if(pair[2]>0.0001)
                            this.price = pair[2].toFixed(6);
                        else 
                            this.price = pair[2].toFixed(8);
                        // this.tokenA.amount = BigNumber(pair[0]/1e18).toFormat(0);
                        // this.tokenB.amount = BigNumber(pair[1]/1e18).toFormat(0);
                        this.tokenA.amount = BigNumber(pair[0]).div(BigNumber(10).pow(tokens[_tokenA].decimals)).toFormat(0);
                        this.tokenB.amount = BigNumber(pair[1]).div(BigNumber(10).pow(tokens[_tokenB].decimals)).toFormat(0);
                        document.title = '$' + this.price.toString();
                    };
                    return {'blocknumber': r.blockNumber, 'reverse': [pair[0],pair[1]], price: pair[2], 'token':[symboltokenA, symboltokenB]};
                }

            }catch(e){
                console.error(e);
                // return [false, '获取pair失败'];
                return false;
            }
        }
    },    
   
}