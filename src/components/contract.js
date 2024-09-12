
/*
key 干预diff算法，在同一层级，key值相同的节点会比对，不同不比对
在循环生成的节点中，vue强烈建议给予每个节点唯一且稳定的key值
*/


import Trade from "./trade.js";
import Getpair from "./getpair.js";
import Getaccount from "./getaccount.js";

// import Products from "./products.js";


var template = `

<div class=" fudVta">
    
    <div class="eLoomw" style="position:relative">
        <Getpair ref='getpair' />   
        <Getaccount ref='account' /> 
        <Trade  :message='userBalances' ref='trade'/>
    </div>
    
</div>` ;

export default {

    //注册组件
    components:{

        Getpair,
        Getaccount,
        Trade,
        // Products
    },
    template,
    //获取父组件的message
    //获取父组件里：template = `<div><contract :message="parentMessage" / </div>
    //父调用子组件的函数
    //<Getpair ref='getpair' />
    //this.$refs.getpair.getpair()
    props: ['message'],
    data(){
        return {
            parentMessage:'来自父组件的消息',
            period:3000,
            timerId:0,
            //把token符号传给trade组件
            tokenSymbol:{'tokenA': tokenA, 'tokenB': tokenA},
            userBalances:{
                'tokenA': {
                    'symbol': 0,
                    'amount': 0,
                    'AtoB': 0
                },
                'tokenB': {
                    'symbol': 0,
                    'amount': 0,
                    'BtoA': 0
                }
            },
            pair:[],
        }
    },
    mounted() {
        this.loop();

      },

    methods:{
        async loop(){
            if(isLoop) {

                try{
                    let pair = await this.$refs.getpair.getpair(tokenA,tokenB);
                    //    console.log(pair);
                    if(pair) {
    
                        this.pair = pair;
                        this.tokenSymbol = {'tokenA': pair.token[0], 'tokenB': pair.token[1]}
                        
                        //给用户发送余额数据,把价格传进去
                        this.getusersBalance(pair);
    
                    }
    
               } catch(e) {
                    console.log(e)
               }
            }
           
            
           this.timerId =  setTimeout(async () => {

                // console.log(this.timerId)
                //clearTimeout(timerId);
                this.loop();

            }, this.period)
          },

        async getusersBalance(pair){

            getMutiTokenBalance([tokenA, tokenB], [userWallet.address]).then(r =>{

                let price = pair.price;
                // let userBalance = r[this.$refs.account.userNo];
                let userBalance = r[0];

                // console.log(r[this.$refs.account.userNo]);
                let tokenAamount = userBalance[tokenA];
                let tokenBamount = userBalance[tokenB];
                // let AtoB = BigNumber(tokenAamount).multipliedBy(price).div(1e18).toFixed(2);
                // let BtoA = BigNumber(tokenBamount).div(price).div(1e18).toFixed(2);
                let AtoB = BigNumber(tokenAamount).multipliedBy(price).div(BigNumber(10).pow(tokens[tokenA].decimals)).toFixed(2);
                let BtoA = BigNumber(tokenBamount).div(price).div(BigNumber(10).pow(tokens[tokenB].decimals)).toFixed(2);
                this.userBalances = {
                    'tokenA': {
                        'symbol': pair.token[0],
                        'amount': BigNumber(tokenAamount).div(BigNumber(10).pow(tokens[tokenA].decimals)).toFixed(2),
                        'AtoB': AtoB
                    },
                    'tokenB': {
                        'symbol': pair.token[1],
                        'amount': BigNumber(tokenBamount).div(BigNumber(10).pow(tokens[tokenB].decimals)).toFixed(2),
                        'BtoA': BtoA
                    },
                    'tokenBalances': [tokenAamount, tokenBamount],
                    'price':price

                }

                this.$refs.trade.tokenBalances = this.userBalances;

                // TokenBalances = [tokenAamount, tokenBamount]
                // console.log(this.userBalances.tokenB)
            })

        },
    }
        
}