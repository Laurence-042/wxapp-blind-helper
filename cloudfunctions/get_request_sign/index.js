// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/*
in:
{
	"param": {
		"app_id": "10000",
		"time_stamp": "1493449657",
		"nonce_str": "20e3408a79",
		"key1": "腾讯AI开放平台",
		"key2": "示例仅供参考",
		"sign": ""
	},
	"app_key": "a95eceb1ac8c24ee28b70f7dbba912bf"
}
out:BE918C28827E0783D1E5F8E6D7C37A61
*/

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let param = event.param
  let app_key = event.app_key

  let sorted_key = Object.keys(param).sort()

  let sorted_param_strs = []
  for(var index in sorted_key){
    let key = sorted_key[index]
    let value = param[key]

    if (value){
      let quoted = encodeURIComponent(value)
      sorted_param_strs.push(key + "=" + quoted)
    }
  }

  sorted_param_strs.push("app_key=" + app_key)

  let request_str = sorted_param_strs.join('&')
  console.log(request_str)

  let crypto = require('crypto');
  let sign = crypto.createHash('md5').update(request_str).digest('hex');
  sign = sign.toUpperCase()

  return {
    event,
    sign: sign
  }
}