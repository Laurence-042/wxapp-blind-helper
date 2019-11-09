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
    // }, 10000)
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
    console.log(text)

    wx.cloud.callFunction({
      name: 'image_to_text',
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
        "app_key": "GD9uNRZd3Tl0ccp2"
      }
    }).then(res => {
      res = JSON.parse(res.result.data)
      console.log(res)
    }).catch(err => {
      console.error(err)
    })

    // let innerAudioContext = wx.createInnerAudioContext()
    // innerAudioContext.autoplay = true
    // innerAudioContext.src = url
    // innerAudioContext.onPlay(() => {
    //   console.log('开始播放')
    // })
    // innerAudioContext.onError((res) => {
    //   console.log(res.errMsg)
    //   console.log(res.errCode)
    // })
  }
})