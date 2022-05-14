let mode = __dirname.includes('magic1')
const {Env} = mode ? require('./function/magic1') : require('./function/magic1')
const $ = new Env('M关注有礼2-落幕');
$.followShopArgv = process.env.M_FAV_SHOP_ARGV
    ? process.env.M_FAV_SHOP_ARGV
    : '';
if (mode) {
    $.followShopArgv = '1000104168_1000104168'
}

var newVar1 = {fn:"", body:{}}
var newVar2 = {fn:"", body:{}}
$.logic = async function () {
    let argv = $?.followShopArgv?.split('_');
    $.shopId = argv?.[0];
    $.venderId = argv?.[1];
    if (!$.shopId || !$.venderId) {
        $.log(`无效的参数${$.followShopArgv}`)
        $.expire = true;
        return
    }
    let actInfo = await getShopHomeActivityInfo();
    if (actInfo?.code !== '0') {
        $.log(JSON.stringify(actInfo))
        if (actInfo?.message.includes('不匹配')) {
            $.expire = true;
        }
        return
    }
    let actInfoData = actInfo?.result;

    if (actInfoData?.shopGifts?.filter(o => o.rearWord.includes('京豆')).length
        > 0) {
        $.activityId = actInfoData?.activityId?.toString();
        let gift = await drawShopGift();
        if (gift?.code !== '0') {
            $.log(JSON.stringify(gift))
            return
        }
        let giftData = gift?.result;
        $.log(giftData)
        for (let ele of
        giftData?.alreadyReceivedGifts?.filter(o => o.prizeType === 4) || []) {
            $.putMsg(`${ele.redWord}${ele.rearWord}`);
        }
    } else {
        $.putMsg(`没有豆子`);
    }
};
let kv = {'jd': '京豆', 'jf': '积分', 'dq': 'q券'}
$.after = async function () {
    $.msg.push(`\n${(await $.getShopInfo()).shopName}`);
    if ($?.content) {
        let message = `\n`;
        for (let ele of $.content || []) {
            message += `    ${ele.takeNum || ele.discount} ${kv[ele?.type]}\n`
        }
        $.msg.push(message)
        $.msg.push($.activityUrl);
    }
}
$.run({whitelist: ['1-21'], wait: [1000, 3000]}).catch(reason => $.log(reason))

async function drawShopGift() {
    $.log('店铺信息', $.shopId, $.venderId, $.activityId)
    let sb = {
        "follow": 0,
        "shopId": $.shopId,
        "activityId": $.activityId,
        "sourceRpc": "shop_app_home_window",
        "venderId": $.venderId
    };
    if (newVar2.fn == undefined || newVar2.fn == null || newVar2.fn == '') {
        console.log("----进入了----")
        newVar2 = await $.sign('drawShopGift', sb);
    }
    let headers = {
        'J-E-H': '',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'api.m.jd.com',
        'Referer': '',
        'J-E-C': '',
        'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
        'Accept': '*/*',
        'User-Agent': 'JD4iPhone/167841 (iPhone; iOS; Scale/3.00)'
    }
    // noinspection DuplicatedCode
    headers['Cookie'] = $.cookie
    let url = `https://api.m.jd.com/client.action?functionId=` + newVar2.fn
    let {status, data} = await $.request(url, headers, newVar2.sign);
    return data;
}

async function getShopHomeActivityInfo() {
    let sb = {
        "shopId": $.shopId,
        "source": "app-shop",
        "latWs": "0",
        "lngWs": "0",
        "displayWidth": "1098.000000",
        "sourceRpc": "shop_app_home_home",
        "lng": "0",
        "lat": "0",
        "venderId": $.venderId
    }
    if (newVar1.fn == undefined || newVar1.fn == null || newVar1.fn == '') {
        console.log("----进入了----")
        newVar1 = await $.sign('getShopHomeActivityInfo', sb);
		
    }
    let headers = {
        'J-E-H': '',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'api.m.jd.com',
        'Referer': '',
        'J-E-C': '',
        'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
        'Accept': '*/*',
        'User-Agent': 'JD4iPhone/167841 (iPhone; iOS; Scale/3.00)'
    }
    // noinspection DuplicatedCode
    headers['Cookie'] = $.cookie
    let url = `https://api.m.jd.com/client.action?functionId=` + newVar1.fn
    let {status, data} = await $.request(url, headers, newVar1.sign);
    return data;
}
