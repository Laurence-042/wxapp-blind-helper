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
    text: "",
    interval: null
  },

  onLoad: function() {

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
    console.log(app.globalData.server_url + 'i2t')
    wx.uploadFile({
      url: app.globalData.server_url+'i2t',
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
    
    let url = app.globalData.server_url +'t2a?'
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
  },

  clickStart() {
    console.log('strat')
   
    let that = this;
    that.take_photo(that.get_text)
    let interval = setInterval(function() {
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