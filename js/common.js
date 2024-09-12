var HttpProvider = ["https://binance.ankr.com", "https://bsc-dataseed1.ninicoin.io", "https://rpc.ankr.com/bsc", 'https://bsc-dataseed1.binance.org'];
var web3 = new Web3(new Web3.providers.HttpProvider(HttpProvider[1]));

var  usdtContract = new web3.eth.Contract(USDT.ABI, USDT.address);

var  factoryConstract = new web3.eth.Contract(Pancake.PancakeFactory.ABI, Pancake.PancakeFactory.address);
var  routerConstract  = new web3.eth.Contract(Pancake.PancakeRouter.ABI, Pancake.PancakeRouter.address);

const usdt = '0x55d398326f99059ff775485246999027b3197955';
const wbnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
const router = '0x10ed43c718714eb63d5aa57b78b54704e256024e';
const boss = '0xae478986c89afa9203acbb753c3dfe139c999999';
const bosslp = "0x90b6496b6a87c14bd0385384346848c8554ea2cc";
const sct = '0x7a27f0419289d703896877594b93a023828585e4';
const sunToken = "0x7b5F13EDd90f0fC9AA87c3E604350dd427a92400";
const sun = "0x2a425aa58305c902b468e895fc206bb7fac77777";
const rhea ="0x846dD2D9E38fD179d7C306F57c012983D4f21A7D";
const tdan = "0xF1A9508210e3471E3730Ca75625109482C95d202";
const star9 = "0x924623dcccB86E0D68144fd062894CC1063492B4";
const peipei = "0x55ddb6319189fab0da5b34147cdd6a1d611b975b";
const cut = "0x7057f3b0f4d0649b428f0d8378a8a0e7d21d36a7";
const web = "0xf7960b1e9d243ae733b42983de4a97bed34a76b8";
const lc = "0xe0906cad1d05d3f959aedbab8c6e78b87ae905ae";
var tokenA = web;
var tokenB = usdt;
var symboltokenA = 'WBNB';
var symboltokenB = 'USDT';
var TokenBalances = [];

//设置循环
var isLoop = true;


var fmt = {
    prefix: '',
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
    suffix: ''
  };

BigNumber.config({ FORMAT: fmt });

function toWei(val) {

   return web3.utils.toWei(BigNumber(val).toString(),'ether');
}

function fromWei(val) {

    return web3.utils.fromWei(BigNumber(val).toString(),'ether');
 }


function tokenContract(token,abi) {
        if(abi == undefined)
            abi = USDT.ABI;
        return new web3.eth.Contract(abi,  token);

}

//字符串处理
function splitStr(str) {

    var result = [];
    if (/,/.test(str)) {
        result = str.split(/\s*,\s*/);
    } else if (/、/.test(str)) {
        result = str.split(/\s*、\s*/);
    } else if (/\uFF0C/.test(str)) {
        result = str.split(/\s*\uFF0C\s*/);
    } else {
        result = str.split(/\s+/);
    }
    result = result.filter(item => item !== '');
    result = result.filter(item => typeof Number(item) === 'number');
    result = result.map(Number);
    result =  Array.from(new Set(result)).sort((a, b) => a - b);
    return result;
  }

function printTime() {

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    // console.log("开始时间：",formattedTime);
    return formattedTime;
}
  