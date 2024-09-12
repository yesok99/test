
/*
{
    "dd62ed3e": "allowance(address,address)",
    "095ea7b3": "approve(address,uint256)",
    "70a08231": "balanceOf(address)",
    "561cd462": "balanceOfETH(address)",
    "313ce567": "decimals()",
    "d0e30db0": "deposit()",
    "a0712d68": "mint(uint256)",
    "06fdde03": "name()",
    "95d89b41": "symbol()",
    "36bdee74": "totalETH()",
    "18160ddd": "totalSupply()",
    "a9059cbb": "transfer(address,uint256)", web3.eth.abi.encodeFunctionSignature("transfer(address,uint256)")
    "23b872dd": "transferFrom(address,address,uint256)",
    "2e1a7d4d": "withdraw(uint256)"
   "252dba42": web3.eth.abi.encodeFunctionSignature("aggregate((address,bytes)[])") 
   
   "252dba42":  web3.eth.abi.encodeFunctionCall({
    name: 'aggregate',
    type: 'function',
    inputs: [{components: [{name: 'target', type: 'address'},{name: 'calldata', type: 'bytes'}],
        type: 'tuple[]',
        name: 'calls'
    }]
}, [[[token0,'0x1234']]]);
}
*/
// wbnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
/*
var encode = web3.eth.abi.encodeParameter('tuple(string,uint256)[]', [["Alice",'25'],["Bob",'30']]);
var decode = web3.eth.abi.decodeParameter('tuple(string,uint256)[]',encode)
web3.eth.abi.encodeParameter('(uint256,uint256[])[]',[[123,[123]],[123,[123]]])

	
*/

// 转成合格地址：web3.utils.checkAddressChecksum(address)
var price = 0;
var wbnbPrice = 0;
const balanceOf = [];
const tokens = [];

// get token information
async function getToken(tokenAddress){
	
	if(tokens[tokenAddress])
		return tokens[tokenAddress] ;
		
	var _tokenAddress = tokenAddress.slice(2, tokenAddress.length);
	var tokenInfo = [];
	var name = [tokenAddress,"0x06fdde03000000000000000000000000" + _tokenAddress];
	var symbol = [tokenAddress,"0x95d89b41000000000000000000000000" + _tokenAddress];
	var decimals = [tokenAddress,"0x313ce567000000000000000000000000" + _tokenAddress];
	tokenInfo.push(name);
	tokenInfo.push(symbol);
	tokenInfo.push(decimals);
	
		let tokenConstract = await new web3.eth.Contract(Multicall2.ABI, Multicall2.address);
		
		try{
				let res = await tokenConstract.methods.aggregate(tokenInfo).call();
				var tokenName = web3.eth.abi.decodeParameter('string', res.returnData[0]);
				var tokenSymbol = web3.eth.abi.decodeParameter('string', res.returnData[1]);
				var tokendecimals = web3.eth.abi.decodeParameter('uint256', res.returnData[2]);

				tokens[tokenAddress] = {address:tokenAddress, name:tokenName, symbol:tokenSymbol, decimals:tokendecimals};
				return tokens[tokenAddress] ;
				
		} catch(e) {
			return false;
		}
}

async function getMulToken(token){
	
	var tokenInfo = [];
	for(let i = 0;i < token.length; i++) {
		
		var _tokenAddress = token[i].slice(2, token[i].length);
		
		var name = [token[i],"0x06fdde03000000000000000000000000" + _tokenAddress];
		var symbol = [token[i],"0x95d89b41000000000000000000000000" + _tokenAddress];
		var decimals = [token[i],"0x313ce567000000000000000000000000" + _tokenAddress];
		tokenInfo.push(name);
		tokenInfo.push(symbol);
		tokenInfo.push(decimals);

	}

		let tokenConstract = await new web3.eth.Contract(Multicall2.ABI, Multicall2.address);
		
		var tokenArr = []
		try{
				let res = await tokenConstract.methods.aggregate(tokenInfo).call();
				for(let i = 0;i < token.length; i++) {

					var tokenName = web3.eth.abi.decodeParameter('string', res.returnData[3*i]);
					var tokenSymbol = web3.eth.abi.decodeParameter('string', res.returnData[3*i+1]);
					var tokendecimals = web3.eth.abi.decodeParameter('uint256', res.returnData[3*i+2]);
					tokenArr.push([tokenName, tokenSymbol, tokendecimals ])
					tokens[token[i]] = {address:token[i], name:tokenName, symbol:tokenSymbol, decimals:tokendecimals};
				}
				
				// return tokens[tokenAddress] ;
				return 	{'blockNumber':res.blockNumber,'tokenInfo':tokenArr};
		} catch(e) {
			return false;
		}
}

// token Array()
async function getBalance(token) {
		 var _walletAddress = userWallet.address;
// 		 _walletAddress = _walletAddress.slice(2, _walletAddress.length);
		 _walletAddress = _walletAddress.substring(2);
		 var abi = "0x70a08231000000000000000000000000" + _walletAddress;
		 var payload = [];
		 for(i=0; i<token.length; i++){
			 payload.push([token[i], abi]);
		 }
		 
		 
		 let tokenConstract = await new web3.eth.Contract(Multicall2.ABI, Multicall2.address);
		 try{
				let res = await tokenConstract.methods.aggregate(payload).call();
				for(i=0; i<res.returnData.length; i++) {
					balanceOf[token[i]] = web3.eth.abi.decodeParameter('uint256', res.returnData[i]);
				}
// 				console.log(balanceOf);
				return balanceOf;
			} catch (e) {
				console.log(e);
				return false;
			}

}

async function getTokenBalance(token, tokenAddress) {
		 var _walletAddress = tokenAddress;
		 let tokenBalanceOf = [];
// 		 _walletAddress = _walletAddress.slice(2, _walletAddress.length);
		 _walletAddress = _walletAddress.substring(2);
		 var abi = "0x70a08231000000000000000000000000" + _walletAddress;
		 var payload = [];
		 for(i=0; i<token.length; i++){
			 payload.push([token[i], abi]);
		 }
		 
		 
		 let tokenConstract = await new web3.eth.Contract(Multicall2.ABI, Multicall2.address);
		 try{
				let res = await tokenConstract.methods.aggregate(payload).call();
				for(i=0; i<res.returnData.length; i++) {
					tokenBalanceOf[token[i]] = web3.eth.abi.decodeParameter('uint256', res.returnData[i]);
				}
// 				console.log(balanceOf);
				return tokenBalanceOf;
			} catch (e) {
				console.log(e);
				return false;
			}

}

//多账户多地址余额查询
async function getMutiTokenBalance(token, _UserWalletAddress) {
	let _walletAddress = [];
	let abi = [];
	for(let i=0; i< _UserWalletAddress.length; i++) {
		_walletAddress[i] = _UserWalletAddress[i].substring(2);
	}
	for(let i=0; i< _UserWalletAddress.length; i++) {
		 abi[i] = "0x70a08231000000000000000000000000" + _walletAddress[i];
	}
	
	var payload = [];
	for(let j=0; j<_UserWalletAddress.length; j++) {
		for(let i=0; i<token.length; i++){
			payload.push([token[i], abi[j]]);
		}
	}
	
	
	let tokenConstract = await new web3.eth.Contract(Multicall2.ABI, Multicall2.address);
	try{
		   let res = await tokenConstract.methods.aggregate(payload).call();
		   let tokenBalanceOf = [];
		   for(let j = 0; j < _UserWalletAddress.length; j++) {

				tokenBalanceOf[j] = [];
				for(let i=0; i<token.length; i++) {
					tokenBalanceOf[j][token[i]] = web3.eth.abi.decodeParameter('uint256', res.returnData[token.length * j+i]);
				}
				
		   }

		   return tokenBalanceOf;
	   } catch (e) {
		   console.log(e);
		   return false;
	   }

}

// 获取pair 地址

async function getPair(_token0, _token1) {
	
	let token0 = _token0;
	let  token1 ;
	if(_token1 == undefined)
		token1 = '0x55d398326f99059fF775485246999027B3197955';
	else
		token1 = _token1;
	var calldata = [];

	let address = Pancake.PancakeFactory.address;
	let abi = web3.eth.abi.encodeFunctionCall({
    name: 'getPair',
    type: 'function',
    inputs: [{
        type: 'address',
        name: 'token0'
    },{
        type: 'address',
        name: 'token1'
    }]
}, [token0, token1]);

	calldata.push([address, abi]);
	
	try{
			let tokenConstract = await new web3.eth.Contract(Multicall2.ABI, Multicall2.address);
			let ret = await tokenConstract.methods.aggregate(calldata).call();
			let Pair = web3.eth.abi.decodeParameter('address', ret.returnData[0]);
			if(Pair != '0x0000000000000000000000000000000000000000')
				return(Pair);
			else
				return false;
	} catch {
		console.log('error: getPair false !');
		return false;
	}

}


async function getPairLp(_token0, _token1) {
	
	if(_token0 == _token1)
		return false;
	let token0 = _token0;
	let  token1 ;
	if(_token1 == undefined)
		token1 = '0x55d398326f99059fF775485246999027B3197955';
	else
		token1 = _token1;
	
	let wbnbPair =	'0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE';// wbnb pair
	let Pair = wbnbPair;
	if(token0 != "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
		Pair = await getPair(token0, token1);
	if(!Pair)
		return false;

	var calldata = [];
	let abi = '0x0902f1ac';
	calldata.push([Pair, abi]);
	calldata.push([wbnbPair, abi]);
	
	try{
			let tokenConstract = await new web3.eth.Contract(Multicall2.ABI, Multicall2.address);
			let res = await tokenConstract.methods.aggregate(calldata).call();
			
			ret = web3.eth.abi.decodeParameters(['uint256','uint256'], res.returnData[0]);
			let amount0,amount1;
			if(BigInt(token0) <BigInt( token1)) {

				amount0 = BigNumber(ret[0]).div(BigNumber(10).pow(tokens[token0].decimals));
				amount1 = BigNumber(ret[1]).div(BigNumber(10).pow(tokens[token1].decimals))

			} else {
				amount0 = BigNumber(ret[1]).div(BigNumber(10).pow(tokens[token0].decimals));
				amount1 = BigNumber(ret[0]).div(BigNumber(10).pow(tokens[token1].decimals))

			}
			// let price = BigInt(token0) <BigInt( token1)? BigNumber(ret[1]).div(ret[0]).mul : ret[0] / ret[1];
			// console.log('代币价格：', price.toFixed(18));
			//
			let _price = amount1.div(amount0);

			let retWbnb = web3.eth.abi.decodeParameters(['uint256','uint256'], res.returnData[1]);

			wbnbPrice = BigNumber(retWbnb[0]).div(retWbnb[1]).toFixed(6);
			if(tokenB == wbnb) {
				price = _price.multipliedBy(wbnbPrice).toFixed(6);
				_price = _price.multipliedBy(wbnbPrice);
			}
			// console.log(wbnbPrice)
			return( BigInt(token0) <BigInt( token1)? [ret[0],  ret[1], _price, wbnbPrice ]: [ret[1] , ret[0], _price, wbnbPrice]);
// 			return(ret);
	} catch {
		console.log('error: getPair false !');
		return false;
	}
	
}


