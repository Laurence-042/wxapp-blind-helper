// miniprogram/pages/main/main.js
/* 
Image2Text
App_ID2123531402
App_KeyGD9uNRZd3Tl0ccp2

Text2Audio
App_ID2123548236
App_KeyWdT3TPY44Vh6wegM
 */

//获取应用实例
const app = getApp()

Page({
  data: {
    img: "img/default.jpg",
    text: ""
  },

  onLoad: function() {
    let that = this;
    that.take_photo(that.get_text)
    // setInterval(function () {
    //   that.take_photo(that.get_text)
    // }, 3000)
  },

  take_photo: function(call_back) {
    let cam = wx.createCameraContext();
    cam.takePhoto({
      quality: 'low',
      success: (res) => {
        call_back(res.tempImagePath)
      }
    });
  },

  get_text: function(img_path) {
    let that = this;
    console.log(img_path)
    this.setData({
      img: img_path
    })

    wx.getFileSystemManager().readFile({
      filePath: img_path,
      encoding: "base64",
      success: (img_b64) => {
        img_b64 = img_b64.data
        wx.cloud.callFunction({
          name: 'image_to_text',
          data: {
            "param": {
              "app_id": "2123531402",
              "image": img_b64
            },
            "app_key": "GD9uNRZd3Tl0ccp2"
          }
        }).then(res => {
          res = JSON.parse(res.result.data)
          console.log(res)
          that.get_audio(res.data.text)
        }).catch(err => {
          console.error(err)
        })
      }
    })


  },
  get_audio: function(text) {
    let that = this;
    let tmp_path = wx.env.USER_DATA_PATH + '/tmp.wav'
    console.log(text)
    if(text==""){
      text = "AF可能缺少淡水"
    }

    wx.cloud.callFunction({
      name: 'text_to_audio',
      data: {
        "param": {
          "app_id": "2123548236",
          "speaker": "1",
          "format": "2",
          "volume": "0",
          "speed": "100",
          "text": text,
          "aht": "0",
          "apc": "58"
        },
        "app_key": "WdT3TPY44Vh6wegM"
      }
    }).then(res => {
      //res = JSON.parse(res.result.data)
      console.log(res)
      console.log(res.result.data)
      res = res.result.data
      wx.getFileSystemManager().writeFile({
        filePath: tmp_path,
        data: res.data.speech,
        encoding: 'base64',
        success:(e)=>{
          console.log(e)
          that.play_audio(tmp_path)
        },
        fail:(errMsg)=>{
          console.log(errMsg)
        }
      })
    }).catch(err => {
      console.error(err)
    })
  },

  play_audio:function(path){
    let innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = path
    innerAudioContext.autoplay = true
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((errMsg) => {
      console.log(errMsg)
      console.log(errCode)
    })
  },

  clickStart() {
    console.log('strat')

    let that = this;
    that.take_photo(that.get_text)
    let interval = setInterval(function () {
      that.take_photo(that.get_text)
    }, 10000)
    this.setData({
      interval: interval
    })

    wx.showToast({
      title: '程序开始！', // 标题
      icon: 'success', // 图标类型，默认success
      duration: 1500 // 提示窗停留时间，默认1500ms
    })
  },

  clickStop() {
    console.log('end')
    clearInterval(this.data.interval)
    this.setData({
      interval: null
    })

    wx.showToast({
      title: '程序结束！', // 标题
      icon: 'success', // 图标类型，默认success
      duration: 1500 // 提示窗停留时间，默认1500ms
    })
  }
})