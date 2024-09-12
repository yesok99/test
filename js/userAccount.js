function encrypto(message,key="hello") {

    if(!keys.bip39.validateMnemonic(message.trim())){
        console.log("请输入正确的助记词")
        return false;
    }
    message = web3.utils.stringToHex(message)
    const e = keys.encrypto(message,key);
    localStorage.setItem('_message',e)
    localStorage.setItem('_key',key)
    console.log(`enctypt message: ${e}`)
    console.log(`key: ${key}`)
    return e;
}

function decrypto(message,key) {
    
    try {

        if(message == undefined) {

            let key = localStorage.getItem('_key')
            let message = localStorage.getItem('_message')
            let d = keys.decrypto(message,key);
            return web3.utils.hexToString(d);
    
        }else {
            let d = keys.decrypto(message,key);
            return web3.utils.hexToString(d);
    
        }

    }catch{
        console.log("请输入有效的助记词。。。")
        return false;
    };
    
}
function getKeys(count) {

    // 获取之前先对mnemonic 进行加密处理
    let userAccount = [];

    var mnemonic = decrypto();
    if(!mnemonic) {

        mnemonic = keys.bip39.generateMnemonic();
        count = 10;
    }

    const _keys = keys.creatKeys(mnemonic,count);
    _keys.forEach((key,i) => {
        userAccount[i] = key.key;
    })
    return userAccount;
    
    
}



//漏了 43，86
const wallet = web3.eth.accounts.wallet;
var userAccountInfo = [];
var userWallet;
var listAccounts = [];
var usersAddress = [];
var userBalance = [];
var userAccount = [];

function initWallet(count=10, mnemonic, key="hello"){
    
        if(typeof mnemonic == 'string' && typeof key == 'string')
            encrypto(mnemonic,key)
        //重置账号

        userAccount = [];
        userAccountInfo = [];
        wallet.clear();
        web3.setProvider("https://bsc-dataseed1.ninicoin.io");

        userAccount = getKeys(count);
        userAccount.forEach((key, i) => {

            wallet.add(key);
            var newInfo = {address: `${wallet[i].address}`, privateKey:`${wallet[i].privateKey}`, grade:"NO", sn:`${i}`, payload:"", multiples:"7"};
            userAccountInfo.push(newInfo);
            usersAddress.push(wallet[i].address);
        });
            
        userWallet = Object.assign({}, wallet[0])
        

}

function addWallet(priKey) {

    const foundElement = userAccount.find(key => key === priKey);
    if(foundElement !== undefined)
        return;

    userAccount.push(priKey);
    let i = userAccount.length - 1;
    wallet.add(priKey);
    
    var newInfo = {address: `${wallet[i].address}`, privateKey:`${wallet[i].privateKey}`, grade:"NO", sn:`${i}`, payload:"", multiples:"7"};
    userAccountInfo.push(newInfo);
    usersAddress.push(wallet[i].address);
    
}

var test_usdt = "0xE5B5B037FEdBf20d48722162aB5F8A4826b45544";
var test_usdtContract ; 
function test_initWallet(count=255, mnemonic){

    if(count == undefined)
       count = 255;
    web3.setProvider('HTTP://127.0.0.1:7545');
    
    test_usdtContract = usdtContract.clone();
    test_usdtContract.options.address = test_usdt;

    if(mnemonic == undefined)
        mnemonic = "summer evolve leg depth dolphin uniform liquid quarter flock tunnel about burger"
    const _keys = keys.creatKeys(mnemonic,count);
    //重置账号
    userAccount = []
    userAccountInfo = [];
    wallet.clear();
    
    _keys.forEach((key,i) => {
        userAccount[i] = key.key;
    })


    userAccount.forEach((key, i) => {

        wallet.add(key);
        var newInfo = {address: `${wallet[i].address}`, privateKey:`${wallet[i].privateKey}`, grade:"NO", sn:`${i}`, payload:"", multiples:"7"};
        userAccountInfo.push(newInfo);
        usersAddress.push(wallet[i].address);
    });
        
    userWallet = Object.assign({}, wallet[0])

}



initWallet(10)

function formatAddress(address) {

    return address.substring(0,4) + "...." + address.substring(address.length - 4);

}



function w(id) {
    return wallet[id];
}

function a(start, end) {

    if(end == undefined)
        return wallet[start].address;
    else {

        let addr = []
        for(let i = start;i <= end; i++) {
            addr.push(wallet[i].address)
        }
        return addr;
    }
    
}

function p(id=0) {
	
	console.log(`https://bscscan.com/address/${w(id).address}`);
  }

