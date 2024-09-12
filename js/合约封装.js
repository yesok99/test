function Contract(abi, address, options) {

	let tokenConstract = new web3.eth.Contract(abi, address);
	
	this._parent = tokenConstract;

	Object.defineProperties(this,{
	
		address:{
		
			get:function(){
				return this._address;
			},
			
			set:function(val) {
		
				this._address = val;
				this._parent._address = val;
			},
			enumerable: true,
		    configurable: true
	    }	
	});

	this.address = address;

    tokenConstract["options"].jsonInterface.forEach(item =>{
	    
	    	    // 如果是函数
	    	if(item.type == 'function') {
		    	
			    	this[item.name] = function(...args) {
    					return funcHandle(tokenConstract, item, ...args);
					}
			}
	});
	
}

Contract.prototype.clone = function() {
	
    return new this.constructor(this._parent.options.jsonInterface,this._parent.options.address,this._parent.options)
    
}


function funcHandle(tokenConstract,item, ...args) {
    
      if(item.stateMutability != 'nonpayable' ) {

        return tokenConstract.methods[item.name](...args)
        
        
      } else {

        // handle send

        return sendHandle(tokenConstract,item, ...args);
        
      }
	    	
}

function sendHandle(tokenConstract,item, ...args) {


  const obj =  tokenConstract.methods[item.name](...args);

  obj.send = async function(from, gasRate=1, _nonce, value=0) {

    //获取 abi
      const FuncCode = tokenConstract.methods[item.name](...args).encodeABI();
	  
	  const to = this._parent._address;

	  return await send(FuncCode ,from,to, gasRate, _nonce, value);
  
  }

  return obj;
  
}

// 部署合约 send(code,a(0))
async function send(FuncCode ,from,to, gasRate = 1, nonce, value=0) {


	let _payload = await getPayload(FuncCode ,from,to, gasRate, nonce, value);

	return await web3.eth.sendTransaction(_payload);

}

async function getPayload(FuncCode ,from,to, gasRate =1, nonce, value = 0) {

		 const payload = {
        
				from : from,
				to:to,
				data:FuncCode,
				value: value,
		        // chainId : 56 ,
		        // gasLimit : 1000000,
		        // gasPrice : gasPrice * gasRate,
		        // nonce : nonce,
        
	      }
	
		// 设置 gasLimit
		let gas = await web3.eth.estimateGas(payload);
	
		payload.gas = web3.utils.numberToHex(parseInt(gas * gasRate));
	
		// 获取 gas 价格
		const gasPrice = await web3.eth.getGasPrice();
		payload.gasPrice = gasPrice * gasRate;
	
		 // 设置nonce 
	    if(nonce == undefined)
		  nonce = await web3.eth.getTransactionCount(from);
		payload.nonce = nonce;
	
		// 设置 chainId
		payload.chainId = 56;

		return payload;
	
}

async function batchRequest(){

	// 批量请求

	var batch = new web3.BatchRequest();

	// batch.add(web3.eth.getBalance.request(a(0),'latest',function(e,r){console.log(r)}))
	// batch.add(usdtContract.methods.balanceOf(a(6)).call.request({from:a(6)},(e,r)=>{console.log(r)}))
	// batch.add(usdtContract.methods.balanceOf(a(6)).call.request((e,r)=>{console.log(r)}))
	// batch.execute()

	
	let from = a(0);

	let nonce = await web3.eth.getTransactionCount(from);

	let FuncCode = usdtContract.methods.transfer(a(0),toWei('1')).encodeABI();
	
	let payload = await getPayload(FuncCode ,from,usdtContract._address ,1, nonce)

	let sign = await web3.eth.accounts.signTransaction(payload, w(0).privateKey);

	batch.add(web3.eth.sendSignedTransaction.request(sign.rawTransaction,(e,r)=>{console.log(r)}));

	
	FuncCode = usdtContract.methods.transfer(a(0),toWei('2')).encodeABI();
	
	payload = await getPayload(FuncCode ,from,usdtContract._address ,1, nonce+1);

	sign = await web3.eth.accounts.signTransaction(payload,w(0).privateKey);
	
	batch.add(web3.eth.sendSignedTransaction.request(sign.rawTransaction,(e,r)=>{console.log(r)}));

	batch.execute();
}

const uu = new Contract(USDT.ABI, usdt)