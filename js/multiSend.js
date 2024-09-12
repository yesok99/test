//转所有币
//SendAllToken(start, end, token, to=4)

//转所有BNB币
//sendAllETH(start, end)


//查找BNB余额
//getEthBalance(start=0, end=0)

// // 目标账户地址
// const targetAddress = wallet[4].address;
// const id = 6;
// const to = wallet[id].address;
// const usdt = USDT.address;


// 转账金额（单位：wei）
async function tx1(FuncCode ,user,to,nonce){


    const fromAddress = user.address;
    const toAddress = to;
    const privateKey = user.privateKey;

    var estimateGas = {
        
		from: fromAddress, 
        data:FuncCode,
        to: toAddress, 

    };
	
	var payload =  {
        from: fromAddress, 
        to: toAddress, 
        data:FuncCode, 
        value: 0, 
		chainId: 56,
        gas: "350000",
		gasPrice: 0,
		nonce:0
	};
    
    try{
        let gas = await web3.eth.estimateGas(estimateGas);
        
        const gasPrice = await web3.eth.getGasPrice();
        if(nonce != undefined)
            payload.nonce = nonce;
        else
            payload.nonce = await web3.eth.getTransactionCount(fromAddress);
        payload.gas = web3.utils.numberToHex(parseInt(gas * 1));
        payload.gasPrice = gasPrice;

        let sign = await web3.eth.accounts.signTransaction(payload, privateKey);
        let transferTx = await web3.eth.sendSignedTransaction(sign.rawTransaction)
        return [true, transferTx];
    } catch(e) {
        return[false, e];
    }  
}

// const amount = web3.utils.toWei('100', 'ether');

async function sendTokenTransaction(token, account, to, amount, nonce) {

  const tokenContract = new web3.eth.Contract(USDT.ABI, token);

  const data = tokenContract.methods.transfer(to, amount).encodeABI();

  let ret = await tx1(data,account,token,nonce);
  
  return ret;

}


async function getEthBalance(start=0, end) {

	if(end == undefined)
		end = start;
    else if(end >= wallet.length - 1){
        end = wallet.length - 1;
    }

    var total = 0
	
    for(i=start;i<end + 1;i++){

       await web3.eth.getBalance(wallet[i].address).then(r => {
    
           total += r/1e18;
           console.log(i, r/1e18)
        })
    
    }

    console.log('total:',total)
    
}


async function sendEthTransaction(senderId, to, val) {

        let account = wallet[senderId];
        let value = await web3.eth.getBalance(account.address);
		// let _data = '0x049878f30000000000000000000000000000000000000000000000000429d069189e0000';

        //let value = val;//web3.utils.toWei(val,'ether')
        // if(val) {
        //     if(BigNumber(value).lt(web3.utils.toWei(val.toString(),'ether')) ) {
        //         console.error(`第 ${senderId} 个账号余额不足`)
        //         return [false, '余额不足'] ;
        //     }

        // }
         
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(account.address);
 
        //保留gas费用 ,全部转出
        let gasVal = gasPrice * 21000;
        if(val == undefined){
            if((value - gasVal) > 0){
                value = value - gasVal;
            } else {
                console.error(`第 ${senderId} 个账号余额不足`)
                return [false, '余额不足'] ;
            }
        } else if((value - gasVal - web3.utils.toWei(val.toString(),'ether')) > 0)
            value = web3.utils.toWei(val.toString(),'ether');
        else {
            console.error(`第 ${senderId} 个账号余额不足`)
            return [false, '余额不足'] ;
        }


        
        value = web3.utils.numberToHex(value)
        const rawTx = {
            from: account.address,
            to: to,
            value: value,
            gasPrice: gasPrice,
            gasLimit: 21000,
            nonce: nonce
        };

		let sign = await account.signTransaction(rawTx);
		await web3.eth.sendSignedTransaction(sign.rawTransaction).then((res)=>{

            console.log(`BNB转账成功: ${web3.utils.fromWei(value)}`)
            
        });
    
}

async function sendETH(senderId, toid, val) {

    let to = wallet[toid].address;
    sendEthTransaction(senderId, to, val);

}

async function sendAllETH(start, end){

    if(end == undefined)

        end  = start;

    for(i=start; i<end+1; i++) {

		sendEthTransaction(i, to);
		
	}
    
}

async function sendToken(token, account, to, val) {


    try{
       
        let amount = 0;
        
        if(val) {
            amount = web3.utils.toWei(BigNumber(val).toString(),'ether');
        
        } else{

            let r = await getTokenBalance([token], account.address);
            amount = r[token];

        }
        
        if(BigNumber(amount).lt(web3.utils.toWei('0.1','ether'))) {

            return [false, '余额不足'];
        } else {
            
            let ret = await sendTokenTransaction(token, account, to, amount);
            if(ret[0])
              return [true, '转账成功'];
            else
              return [false, `转账出错`];
                
        }
            
    } catch(e){
        return [false, `转账出错${e}`];
    }

}

// SendAllToken(bosslp, wallet[7], targetAddress)


async function SendAllToken(token=usdt, start, end, to){

	var totalSuccess = 0;
    for(let i=start; i<end+1;i++){

		// let ret = await sendToken(token, wallet[i], wallet[to].address)
		
        // if(ret[0]){
        //     totalSuccess ++;
        //     console.log(`第 ${i} 个 ： ${ret[1]}`);
        // } else {
        //     console.error(`第 ${i} 个 ： ${ret[1]}`);
        // }
        // try{
        //     let index = i;
        //     sendToken(token, wallet[i], wallet[to].address).then((r)=>{
        //         console.log(`第 ${index} 个 ： ${ret[1]}`);
        //     })

        // }.catch{};
        {
            let index = i;

                sendToken(token, wallet[i], wallet[to].address).then((ret)=>{
                    if(ret[0])
                        console.log(`第 ${index} 个 ： ${ret[1]}`);
                    else
                        console.error(`第 ${index} 个 ： ${ret[1]}`);
                })

        }
        
            
    }
    // console.log(`第${start} ~ 第${end} 交易完成！共：${end - start + 1}个, 成功：${totalSuccess} 个`);
 
}

async function sendAllusdt(start, end, to) {

	if(end == undefined)
		end = start;

	SendAllToken(usdt, start, end, to);
	
}

async function sendAllbossLP(start, end, to) {

	if(end == undefined)
		end = start;
	
	SendAllToken(bosslp, start, end, to);
	
}