
async function allowance(token, owner, spender) {
	 
    let ret;
    const c = new web3.eth.Contract(USDT.ABI, token);
    if(owner == undefined) {
       ret =  await c.methods.allowance(userWallet.address,router).call();
       
    } else if(spender == undefined){
         ret  = await c.methods.allowance(owner, router).call();
         
    } else {
        ret  = await c.methods.allowance(owner, spender).call();
    }
    console.log(ret/1e18);
    return ret;

}

async function sendTransaction(FuncCode ,user,to, gasRate = 1, nonce, value=0){
    //转eth
    //await sendTransaction('',userWallet,w(0).address,1,0,toWei(0.0001))
    const fromAddress = user.address;
    const toAddress = to;
    const privateKey = user.privateKey;

    // var estimateGas = {
        
	// 	from: fromAddress, 
    //     data:FuncCode,
    //     to: toAddress, 
        
    // };
	
	var payload =  {
        from: fromAddress, 
        to: toAddress, 
        data:FuncCode, 
        value: value, 
		// chainId: 56,
        // gas: "350000",
		// gasPrice: 0,
		// nonce:0
	};
    
    let gas = await web3.eth.estimateGas(payload);
    const gasPrice = await web3.eth.getGasPrice();
    if(nonce)
        payload.nonce = nonce ;
    else
        payload.nonce = await web3.eth.getTransactionCount(fromAddress);
    
    payload.chainId = 56 ;
    payload.gas = web3.utils.numberToHex(parseInt(gas * gasRate));
    payload.gasPrice = gasPrice * gasRate;

    let sign = await web3.eth.accounts.signTransaction(payload, privateKey);
    let transferTx = await web3.eth.sendSignedTransaction(sign.rawTransaction);
    return transferTx;
}


async function approve(token, walletId, spender, amount) {
	 
   var user = userWallet;
   if(walletId != undefined) {
    user = wallet[walletId];

   }
     
   var toAddress = token;
   var FuncCode = '';
   if(amount == undefined)
        amount = new BigNumber(2).exponentiatedBy(255);
    else
        amount = web3.utils.toWei(amount.toString(),'ether');

    const c = tokenContract(token);
    // new web3.eth.Contract(USDT.ABI, token);
    if(spender == undefined) {
       FuncCode =  await c.methods.approve(router, amount).encodeABI();
    } else {
       FuncCode  = await c.methods.approve(spender, amount).encodeABI();;
    }

    sendTransaction(FuncCode ,user,toAddress).then(
        r => {
            if(walletId != undefined)
                console.log(`第${walletId}个授权金额：${amount/1e18}`);
            else
                console.log(`授权金额：${amount/1e18}`,r);
    })
    .catch( e => {
        if(walletId != undefined)
            console.error(`第${walletId}个授权失败`,e);
        else
            console.error(`授权失败: \n`,e)
    });

}

async function transfer(token, account, to, amount, nonce) {
    
    //transfer(tokenB,w(0),w(0).address,toWei(0.1))

    const tokenContract = new web3.eth.Contract(USDT.ABI, token);

    const data = tokenContract.methods.transfer(to, amount).encodeABI();

    let ret = await sendTransaction(data,account,token,nonce);
    console.log('交易成功\n',ret)
    return ret;
}

async function sendmulBNB(start, end, amount = 0.00035){

    var recipients = [];
    var values = []
    var BNBAuonut = []
	
    for(let i=start;i<end+1;i++) {
    
        recipients.push(wallet[i].address);
        BNBAuonut.push(amount);
        
    }
    
    await disperseEther(recipients, BNBAuonut)
}

async function sendmulToken(token, start, end, amount = 1){

    var recipients = [];
    var values = []
	
    for(let i=start;i<end+1;i++) {
    
        recipients.push(wallet[i].address);
        values.push(amount);
        var sender = wallet[i].Address;
        var key = wallet[i].privateKey;
        
    }

    disperseTokenSimple(token, recipients, values).then(r=>{
        console.log('多笔交易成功');
    })
    
}

async function approveMul(token, start, end, spender, amount){

    if(start == undefined) {
        approve(token);
        return;
    }
        

    if(end == undefined)
            end  = start;
    for(let i = start;i <= end; i++) {
        
        approve(token, i, spender, amount);
        // try{
        //     await approve(token, i, spender, amount);
        //     console.log(`第${i}个授权成功`)
        // }catch(e){
        //     console.log(`第${i}个授权失败`)
        // }
        
        
            
        
    }
    
}