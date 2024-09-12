// 转币
//sendUSDTandBNB(start, end, amount)

//授权

//approveBoss(start, end)

//升级

// upgrade(pId, startUid, endUid )

//提现

// claimReward(start, end);

//getBossReward(index, end)

async function getBossReward(index, end){

	if(end == undefined)

		end = index;
	
	//总算力：info[5] 已领奖励 info[6] 团队奖 info[7] 剩余能量 info[9]
	var calldata = [];

	for(i=index; i< end+1; i++) {

		if(wallet[i] == undefined) {

			end = i -1 ;

			break;
		}
			

		var _addr = wallet[i].address.substr(2);

		var	data = '0x008cc262000000000000000000000000' + _addr
		calldata.push(['0xcd7195f3223919d469f61d03a8aa753c09d5f9d8', data]);
		var data = '0xa87430ba000000000000000000000000' + _addr;
		calldata.push(['0xcd7195f3223919d469f61d03a8aa753c09d5f9d8', data]);

		
	}
	
	let tokenConstract = await new web3.eth.Contract(Multicall2.ABI, Multicall2.address);
	
	let ret = await tokenConstract.methods.aggregate(calldata).call();

	let rdata = [];
	params = ['uint256','uint256','uint256','uint256','uint256','uint256','uint256','uint256','uint256','uint256','address','address','uint256','uint256','uint256','uint256']

	var keling = 0;
	var totalPower = 0;
	
	for(let i=index;i<end+1; i++) {

		r0 = await web3.eth.abi.decodeParameters(['uint256','uint256'],ret.returnData[2*(i-index)])[0];
		r = await web3.eth.abi.decodeParameters(params,ret.returnData[2*(i-index)+1]);

		var nowPower = (r[5] - r[6] - r[7]) / 1e18 ;

		nowPower = nowPower <=0 ? 0: nowPower;
			
		var remainPower = r[9] / 1e18;
		
		console.log(`账号${i} 可领金额:${(r0/1e18).toFixed(4)} 剩余算力:${nowPower.toFixed(2)} 剩余能量:${remainPower.toFixed(2)}`)

		keling += r0/1e18;
		totalPower += nowPower;
	
	}
	
	console.log(`可领总金额: ${keling.toFixed(2)} 剩余总算力:${totalPower.toFixed(2)}`)
	let blocknumber = await web3.eth.getBlockNumber();
	console.log(`区块：${blocknumber}`)
	
	console.log(new Date());
	
	
}



async function delay(e) {
  return  new Promise((resole,rejected)=>{

        setTimeout(()=>{
            // console.log('Promise');
            resole()
        },e);   
    
    
    });
};

async function tx(FuncCode ,user){

    const boss = '0xcD7195f3223919D469F61D03A8AA753C09D5F9d8';
    const token = '0x55d398326f99059ff775485246999027b3197955';

    const fromAddress = user.address;
    const toAddress = boss;
    const privateKey = user.privateKey;

	
	const gasPrice = await web3.eth.getGasPrice();
    var estimateGas = {
        from: fromAddress, 
        // value: 0,
        data:FuncCode,
        to: toAddress, 
        // gas: "133000000", 
        // gasPrice:"0x0",
        // gas:"133000000"
    };
	
    let gas = await web3.eth.estimateGas(estimateGas);
	
	var payload =  {
        
		from: fromAddress, 
        to: toAddress, 
        data:FuncCode, 
        value: 0, 
        gas: "350000",
		gasPrice:0,
		chainId:56,
		nonce:0,
		
	};
	
	payload.gasPrice = gasPrice;
    
	payload.chainId = 56;
	payload.nonce = await web3.eth.getTransactionCount(fromAddress);
	
	payload.gas = web3.utils.numberToHex(parseInt(gas * 1.2));
	
	let sign = await web3.eth.accounts.signTransaction(payload, privateKey);
	
	let transferTx = await web3.eth.sendSignedTransaction(sign.rawTransaction)

    return transferTx;
    
}

async function sendUSDTandBNB(start, end, amount = 0.0025){

	var token = '0x55d398326f99059ff775485246999027b3197955'
    var recipients = [];
    var values = []
    var BNBAuonut = []
	
    for(let i=start;i<end+1;i++) {
    
        recipients.push(userAccountInfo[i].address);
        values.push(20);
        BNBAuonut.push(amount);
        var sender = userAccountInfo[i].Address;
        var key = userAccountInfo[i].privateKey;
        
    }
    
    await disperseEther(recipients, BNBAuonut)
	return;

	if(amount >=0.001) {

		await disperseTokenSimple(token, recipients, values)
		await approveBoss(start, end);
		
	}
    
    
}

async function approveBoss(start, end){

	return;

    var boss = '0xcD7195f3223919D469F61D03A8AA753C09D5F9d8'
    var token = '0x55d398326f99059ff775485246999027b3197955'
	if(end == undefined)
		end  = start;
    for(let i=start;i<end+1;i++) {
    
        var sender = userAccountInfo[i].address;
        var key = userAccountInfo[i].privateKey;
        
        let r = await autoApprove(token, sender, boss, 20, key) ;
        console.log(i);
    }

}


async function _upgrade(parentId,userId){

	return;
    //0xb88a802f 
    const FuncCode = '0x0900f010000000000000000000000000' + wallet[parentId].address.substr(2,)

   let r = await tx(FuncCode, wallet[userId]);

    return r;
    
      
}


async function upgrade(pId, startUid, endUid ) {

	return;
	var parentId = 56;

	var userId = 140;


    for(let i = startUid; i< endUid + 1; i++) {

		await delay(4000);


		userId = i;
		parentId = pId + parseInt((i - startUid)/2);
		
		await _upgrade(parentId,userId).then((r)=>{
        
            console.log(`第${userId}个升级成功：推荐id ${parentId}`);
		   
        }).catch(error => {
		   
		   console.error('Error:', `第${userId}个升级失败: 推荐id ${parentId} ${error}`)
	   });

		
	}

  console.log('结束。。。')
    
}


async function claimReward(start, end){

    const FuncCode = '0xb88a802f';

    for(let i=start;i < end +1; i++) {

        // var user = [userAccountInfo[i].Address,userAccountInfo[i].PrivateKey];

      tx(FuncCode, wallet[i]).then((r)=>{
    
            console.log(`第${i}个分红领取成功`);
            // console.log(r);
            
        }) //.catch(error => console.log(`第${i}个赎回失败`));
        .catch(error => console.error('Error:', `第${i}个分红领取失败 ${error}`));

	    // await delay(1000 * 1);
    }

	console.log('分红领取结束。。。')
    
}

async function removeBossLiquidity(amount, isWei = true){

	const tokenA = boss;
	const tokenB = usdt;
	// const liquidity = toWei("1384")
	const amountAMin = 1;
	const amountBMin = toWei("170")
	const to  = a(0);
	const deadline = (Math.floor(Date.now() / 1000) + 120).toString();
	const liquidity =  isWei ? toWei(amount) : amount;

	let abi = await routerConstract.methods.removeLiquidity(
		tokenA,
		tokenB,
		liquidity,
		amountAMin,
		amountBMin,
		to,
		deadline
	).encodeABI();

	console.log(abi)

// await sendTransaction(abi, w(0), router)
}

/*
	boss app账号登陆: 拦截metumask授权，谷歌浏览器开发模式 command + shift + c ，搜索 wallet_address，下断点：
	
	          const s = await V()
	                  , e = (await s.eth.getAccounts())[0]
	                  , i = await s.eth.personal.sign(s.utils.utf8ToHex(e), e, "");
	                if (!i || !e)
	                    return Promise.reject(u.t("default.cancelWallet"));
	                const {token: f} = await W({
	                    wallet_address: e,
	                    public_key: "",
	                    signature: i,
	                    message: e,
	                    hash: s.utils.keccak256(e)
	                });
	
	e = userWallet.address ; 
	i = userWallet.sign(web3.utils.utf8ToHex(userWallet.address)).signature


	web3.eth.personal.sign(web3.utils.utf8ToHex(account),account)


*/
