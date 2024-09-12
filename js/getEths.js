async function getMulEth(start, end) {

    var arrAddress = [];

    if(typeof start == 'string' && start.length == 42)
        arrAddress = [start];
    else if(end == undefined)
        end = start;

    for(let i= start; i<= end; i++) {
        arrAddress.push(a(i));        
    }
    
    

    const c = new web3.eth.Contract([
        {
            "inputs": [
                {
                    "internalType": "address[]",
                    "name": "addresses",
                    "type": "address[]"
                }
            ],
            "name": "getBalances",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ],'0x02f26eb55e2114f2482d52821e1c8376927fc2ad');

    let ret  = await c.methods.getBalances(arrAddress).call();
    if(ret.length == 1) {
        console.log('ETH余额：',ret[0]/1e18);
        return ret
    }
    
    let total = 0;
    for(let i=0;i<=end-start;i++){

        console.log(`账号 ${i+start} ETH余额：`, ret[i]/1e18);
        total += ret[i]/1e18;
    }
    console.log('总额：',total);

    return ret;
}