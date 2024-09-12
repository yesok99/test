Disperse ={}
Disperse.address = '0xD152f549545093347A162Dce210e7293f1452150'
Disperse.abi = [{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"recipients","type":"address[]"},{"name":"values","type":"uint256[]"}],"name":"disperseTokenSimple","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"recipients","type":"address[]"},{"name":"values","type":"uint256[]"}],"name":"disperseToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"recipients","type":"address[]"},{"name":"values","type":"uint256[]"}],"name":"disperseEther","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]

//var recipients = ['0x9A82aa8Cf44DA49de273eE920a90dE59B26F35e5', '0x7C0C039A6771B922143E62363776be3394abBA2B']
//var values = [0.004,0.004]
// 以太币批量转账

 async function autoApprove(token, owner, spender, amount, privateKey) {
	 
	 var fromAddress = userWallet.address;
	 if(owner)
	 	fromAddress = owner;
	var toAddress = token;
	 
	var FuncCode = '';
	if(amount == undefined)
 		amount = new BigNumber(2).exponentiatedBy(255);
 	else
 		amount = web3.utils.toWei(amount.toString(),'ether');
 	//var w3 = await new Web3(ethereum);
	 const c = new web3.eth.Contract(USDT.ABI, token);
	 if(owner == undefined) {
		FuncCode =  await c.methods.approve(Pancake.PancakeRouter.address, amount).encodeABI();
	 } else {
		FuncCode  = await c.methods.approve(spender, amount).encodeABI();;
	 }
	 
	 //交易
	
	var estimateGas = {from: fromAddress, to: toAddress, data:FuncCode, value: 0, gas: "350000", gasPrice:"0x0"};
	let gas = await web3.eth.estimateGas(estimateGas);
	
	var payload =  {from: fromAddress, to: toAddress, data:FuncCode, value: 0, gas: "350000"};
	payload.chainId = 56;
	payload.nonce = await web3.eth.getTransactionCount(fromAddress);
	
	//let gas = await web3.eth.estimateGas({from:fromAddress, to: toAddress, data:FuncCode});
	payload.gas = web3.utils.numberToHex(parseInt(gas * 1));
	
	let sign= '';
	if(privateKey == undefined)
		sign = await userWallet.signTransaction(payload);
	else
	    sign = await web3.eth.accounts.signTransaction(payload, privateKey);
	
	let transferTx = await web3.eth.sendSignedTransaction(sign.rawTransaction).then((receipt) => {
		console.log('授权成功！')
		//return(receipt);
	});

 }
async function disperseEther(recipients, _values) {
	
	var totalValues = new BigNumber(0);
	var values = [];
	for(i=0;i<_values.length;i++) {
		

			values[i] = web3.utils.toWei(_values[i].toString(),'ether');
			totalValues = totalValues.plus(BigNumber(values[i]));
	}

// 	totalValues = web3.utils.toWei(totalValues.toString(),'ether');
	
	var fromAddress = userWallet.address;
	var toAddress = Disperse.address;
	
	const DisperseContract = new web3.eth.Contract(Disperse.abi, Disperse.address);
	const FuncCode = await DisperseContract.methods.disperseEther(recipients, values).encodeABI();
	
	//交易
	//const gasPrice = await web3.eth.getGasPrice();
	var estimateGas = {from: fromAddress, to: toAddress, data:FuncCode, value: totalValues};// gas: "0x7ed6b40", gasPrice:"0x0"};
	let gas = await web3.eth.estimateGas(estimateGas);
	
	var payload =  {from: fromAddress, to: toAddress, data:FuncCode, value: totalValues, gas: "350000"};//, gasPrice:"5000000000"};
	payload.chainId = 56;
	payload.nonce = await web3.eth.getTransactionCount(fromAddress);
	
	//let gas = await web3.eth.estimateGas({from:fromAddress, to: toAddress, data:FuncCode});
	payload.gas = web3.utils.numberToHex(parseInt(gas * 1));
	let sign = await userWallet.signTransaction(payload);
	let transferTx = await web3.eth.sendSignedTransaction(sign.rawTransaction).then((receipt) => {
		
		console.log(receipt)

	});
	
	
}
// 批量转账token
async function disperseTokenSimple(token, recipients, _values) {
	
	var fromAddress = userWallet.address;
	var toAddress = Disperse.address;
	var approveAmount = 0;
	var values = [];
	for( i=0; i<_values.length; i++) {
		values[i] = web3.utils.toWei(_values[i].toString(),'ether');
		approveAmount += _values[i];
	}
	approveAmount = web3.utils.toWei(approveAmount.toString(),'ether');
	
	//交易之前给合约approve
	
	let transferTx = await autoApprove(token,userWallet.address,Disperse.address, approveAmount);

	const DisperseContract = new web3.eth.Contract(Disperse.abi, Disperse.address);
	const FuncCode = await DisperseContract.methods.disperseTokenSimple(token, recipients, values).encodeABI();
	
	//交易
	var estimateGas = {from: fromAddress, to: toAddress, data:FuncCode, value: 0};//, gas: "0x7ed6b40", gasPrice:"0x0"};//0x7ed6b40
	let gas = await web3.eth.estimateGas(estimateGas);

	var payload =  {from: fromAddress, to: toAddress, data:FuncCode, value: 0, gas: "350000"};//, gasPrice:"5000000000"};
	payload.chainId = 56;
	payload.nonce = await web3.eth.getTransactionCount(fromAddress);
	//let gas = await web3.eth.estimateGas({from:fromAddress, to: toAddress, data:FuncCode});
	payload.gas = web3.utils.numberToHex(parseInt(gas * 1));
	let sign = await userWallet.signTransaction(payload);

	await web3.eth.sendSignedTransaction(sign.rawTransaction).then((receipt) => {
		
		console.log(receipt)

	});
}


/*

注意：⚠️转账之前一定要授权
var token = '0x55d398326f99059ff775485246999027b3197955'
var recipients = ['0x9A82aa8Cf44DA49de273eE920a90dE59B26F35e5', '0x7C0C039A6771B922143E62363776be3394abBA2B']
var values = [20,20]

await disperseTokenSimple(token, recipients, values)

var abi = {"name":"disperseTokenSimple","type":"function","inputs":[{"name":"token","type":"address"},{"name":"recipients","type":"address[]"},{"name":"values","type":"uint256[]"}]}

web3.eth.abi.encodeFunctionCall(abi, [token,recipients,values])

web3.eth.abi.encodeFunctionSignature(abi)
*/
