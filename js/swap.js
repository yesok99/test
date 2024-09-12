
async function getAmountOut(token0, token1, amountIn) {
    
    try{
        // 计算输出金额
        /*
        let Reserves = await getReserves() ;
        var _ReserveA  = _tokenA < _tokenB ? Reserves._reserve0 : Reserves._reserve1;
        var _ReserveB  = _tokenB < _tokenA ? Reserves._reserve0 : Reserves._reserve1;
        var transRate = _ReserveB/ _ReserveA; 

        let amountInWithFee = new BigNumber(_AmountIn).multipliedBy(FeeRate);
        
        let numerator = amountInWithFee.multipliedBy(_ReserveB);
        let denominator = BigNumber(_ReserveA).multipliedBy(10000).plus(amountInWithFee);
        let AmountOut = numerator.dividedBy(denominator).multipliedBy(Slippage)..toFixed(1).split(".")[0];

        console.log(AmountOut);
        */
        
        let amountOut = await routerConstract.methods.getAmountsOut(BigNumber(amountIn), [token0,token1]).call();

        // let AmountOut = BigNumber(AmountInToOut[1]).multipliedBy(Slippage).toFixed(1).split(".")[0];
        
        return amountOut;

    } catch(e) {
        console.log(e);
    }

    
}

async function swap(token0, token1, amountIn, Slippage = 0.99, rate = 1, user ) {

    if(user == undefined)
        user = userWallet;
    try{
        let out = await getAmountOut(token0, token1, amountIn);
        let amountOut = BigNumber(out[1]).multipliedBy(Slippage).toFixed(0);
        const deadline = (Math.floor(Date.now() / 1000) + 120).toString();
        const funcCode = await  routerConstract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                amountIn, amountOut, [token0, token1], user.address, deadline).encodeABI();
        //打印当前时间

       console.log("开始时间：", printTime());
        let tx = await sendTransaction(funcCode ,user, router, rate);
        if(tx) {

            let txhash = `https://bscscan.com/tx/${tx.transactionHash}`
            console.log(`交易成功`, printTime());
            console.log(txhash);
            return tx;
        }
        
    } catch(e) {
        console.log(e);
    }  
    
}

async function swapUsdForETH(amountIn,user){
    if(user == undefined)
        user = userWallet;
    try{
        var to = user.address;
        var _amountIn = web3.utils.toWei(amountIn.toString(),'ether');

        const path = [usdt,wbnb];
        const deadline = (Math.floor(Date.now() / 1000) + 120).toString(); //2 second
        const FuncCode = await routerConstract.methods.swapExactTokensForETH(_amountIn, 1, path, to, deadline).encodeABI();
        let tx = await sendTransaction(FuncCode ,user, router);
        if(tx) {
            console.log(`交易成功`, tx);
            console.log(`交易结果： https://bscscan.com/tx/${tx.transactionHash}`);
            return tx;
        }
    } catch(e) {
        console.log(e);
    } 

}