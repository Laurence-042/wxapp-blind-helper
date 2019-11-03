//index.js

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
    // this.take_photo(this.get_text)

    // let ac = wx.createInnerAudioContext("myAudio")
    // ac.src = 'test/t2a.wav'
    // ac.onPlay(() => {
    //   console.log('开始播放')
    // })
    // ac.onError((res) => {
    //   console.log(res.errMsg)
    //   console.log(res.errCode)
    // })
    // ac.play()

    // this.get_audio("今天真的是暴雨，气候控制系统又出什么幺蛾子了？")
    let that = this;
    setInterval(function() {
      that.take_photo(that.get_text)
    }, 10000)
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

    wx.uploadFile({
      url: 'http://localhost:8080/i2t',
      filePath: img_path,
      name: 'image',
      formData: {
        app_id: "2123531402",
        app_key: "GD9uNRZd3Tl0ccp2"
      },
      success: (res) => {
        console.log(res)
        let data = JSON.parse(res.data).data
        console.log(data)
        that.setData({
          text: data.text
        })
        that.get_audio(data.text)
      }
    })
  },

  get_audio: function(text) {
    let that = this;
    console.log(text)
    let data = {
      app_id: "2123548236",
      app_key: "WdT3TPY44Vh6wegM",
      speaker: 1,
      format: 2,
      volume: 0,
      speed: 100,
      text: text,
      aht: 0,
      apc: 58
    }
    let url = 'http://localhost:8080/t2a?'
    for (var key in data) {
      url = url + key + "=" + data[key] + "&"
    }
    url = url.substring(0, url.length - 1)
    console.log(url)

    let innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = url
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
})