// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/*
{
  "param":{
    "app_id": "2123548236",
    "text": "AF可能缺少淡水",
    "model_type":0,
    "speed"：0
  },
  "app_key": "WdT3TPY44Vh6wegM"
}
*/

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()

  let param = event.param
  console.log(param)
  let time_in_sec = Math.floor(new Date().getTime() / 1000)
  param["time_stamp"] = time_in_sec.toString();
  param["nonce_str"] = Math.random().toString(36).slice(-8)

  let res = await cloud.callFunction({
    name: 'get_request_sign',
    data: {
      param: param,
      app_key: event.app_key,
    }
  })
  param["sign"] = res.result.sign
  console.log(param)

  let request = require('request-promise');
  res = await request.get({
    url: "https://api.ai.qq.com/fcgi-bin/aai/aai_tts",
    qs: param
  })
  console.log(res)

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    data: res
  }
}