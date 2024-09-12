
var template = `

        <div id="listBalance" v-show="isShowbalance"  @click = "isShowbalance = !isShowbalance">
            <div class="listHead">
                <div>账号编号</div>
                <div>{{symboltokenA}}数额</div>
                <div>{{symboltokenB}}数额</div>
            </div>
        
    </div>`


   export default {

        name: 'list',
        template,
        
            //获取父组件的message
        props: ['message'],
        data(){
            return {
                
                isShowbalance: false,
                tokenA:{'symbol':'','amount':0},
                tokenB:{'symbol':'','amount':0},

            }
        },
        mounted() {
            // this.showAccountBalance(0,10)
        },

        methods:{
            async  showAccountBalance(start=0,  end=userAccountInfo.length-1) {
                let totalTokenA = 0;//BigNumber(0);
                let totalTokenB = 0;//BigNumber(0);
                let userAddress = [];
                    for(let i=start; i<=end; i++){
                    userAddress.push(userAccountInfo[i].address);  
                    }
                // const ret = await getToken(tokenA);
                const ret = await getMulToken([tokenA, tokenB]);
                if(!ret)
                    return false;
                const symbolA = ret.tokenInfo[0][1];
                const symbolB = ret.tokenInfo[1][1];
                
                await getMutiTokenBalance([tokenA, tokenB], userAddress).then((r)=>{
                    console.log( `账户编号   ${symbolA}数量   ${symbolB} 数量`)
                    for(let i = 0; i <=  end - start; i++){
                        let amountA = BigNumber(r[i][tokenA]).dividedBy(1E18).toFixed(2);
                        let amountB = BigNumber(r[i][tokenB]).dividedBy(1E18).toFixed(1);
                        
                        if(amountA >=0.1 || amountB>=0.1)
                        console.log(`${userAccountInfo[i+start].sn}       ${amountA}         ${amountB}`);
                        
                        totalTokenA = BigNumber(totalTokenA).plus(amountA);
                        totalTokenB = BigNumber(totalTokenB).plus(amountB);
                        
                        let sn = userAccountInfo[i+start].sn;                                      
                        let listItem = document.createElement("div");
                        listItem.setAttribute("class","listBalance1");
                        // listItem.setAttribute("id",i);
                        listItem.innerHTML = "<div>"+ sn+"</div><div style='text-aligin:left'>" + amountA+ "</div><div>" +amountB + "</div>";
                        listBalance.appendChild(listItem);
                        };
                    console.log(`${symbolA}总额：${totalTokenA}   ${symbolB}总额： ${ totalTokenB }\n\n`);
                });
            },
        
        }
        
}   
