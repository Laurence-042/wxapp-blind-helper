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
    i2t_api_index: 0,
    t2a_api_index: 0,
    i2t_api_conf: [
      "看图说话", "多标签识别"
    ],
    t2a_api_conf: [
      "语音合成"
    ],

    img: "img/default.jpg",
    text: "程序未启动",

    camera_status: 2,
    i2t_system_status: 2,
    t2a_system_status: 2,
    audio_file_code: 0,

    cWidth: 0,
    cHeight: 0
  },

  onLoad: function() {
    // let that = this;
    // that.take_photo(that.get_tags)
    // setInterval(function () {
    //   that.take_photo(that.get_tags)
    // }, 3000)
  },

  proceed: function() {
    let that = this;
    that.setData({
      camera_status: 2,
      i2t_system_status: 2,
      t2a_system_status: 2
    })
    let cam = wx.createCameraContext();
    cam.takePhoto({
      quality: 'low',
      success: (photo) => {
        that.setData({
          camera_status: 1
        })
        let tempImagePath = photo.tempImagePath
        //-----返回选定照片的本地文件路径列表，获取照片信息-----------
        wx.getImageInfo({
          src: tempImagePath,
          success: function(res) {
            //---------利用canvas压缩图片--------------
            var ratio = 2;
            var canvasWidth = res.width //图片原始长宽
            var canvasHeight = res.height
            while (canvasWidth > 100 || canvasHeight > 100) { // 保证宽高在400以内
              canvasWidth = Math.trunc(res.width / ratio)
              canvasHeight = Math.trunc(res.height / ratio)
              ratio++;
            }
            that.setData({
              cWidth: canvasWidth,
              cHeight: canvasHeight
            })

            //----------绘制图形并取出图片路径--------------
            var ctx = wx.createCanvasContext('canvas')
            ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
            ctx.draw(false, setTimeout(function() {
              wx.canvasToTempFilePath({
                canvasId: 'canvas',
                destWidth: canvasWidth,
                destHeight: canvasHeight,
                success: function(res) {
                  that.i2t_method(res.tempFilePath) //最终图片路径
                },
                fail: function(res) {
                  console.log(res.errMsg)
                }
              })
            }, 100)) //留一定的时间绘制canvas
          },
          fail: function(res) {
            console.log(res.errMsg)
          },
        })
      },
      fail: (res) => {
        that.setData({
          camera_status: 0
        })
        return
      }
    });
  },

  i2t_method: function (img_path){
    switch (this.data.i2t_api_index) {
      case 0:
        this.i2t_api_text(img_path)
        break;
      case 1:
        this.i2t_api_tags(img_path)
        break;
      default:
        console.log(this.data.i2t_api_index)
    }
  },

  i2t_api_tags: function(img_path) {
    let that = this;
    this.setData({
      img: img_path
    })

    wx.getFileSystemManager().readFile({
      filePath: img_path,
      encoding: "base64",
      success: (img_b64) => {
        img_b64 = img_b64.data
        console.log("image_size:" + img_b64.length)
        wx.cloud.callFunction({
          name: 'image_to_tags',
          data: {
            "param": {
              "app_id": "2123531402",
              "image": img_b64
            },
            "app_key": "GD9uNRZd3Tl0ccp2"
          }
        }).then(res => {
          res = JSON.parse(res.result.data)
          if (res.ret != 0) {
            console.log("image-to-text system busy")
            that.setData({
              i2t_system_status: 0
            })
            console.log(res)
            return
          }
          console.log("image-to-text system ok")
          that.setData({
            i2t_system_status: 1
          })
          let tag_list = res.data.tag_list
          // 根据可靠度从高到低排列标签
          tag_list.sort(function(a, b) {
            return b.tag_confidence - a.tag_confidence;
          })
          // 将标签单独拿出来
          tag_list = tag_list.map(function(a) {
            return a.tag_name;
          });
          // 选取除最后一个标签外的标签，以逗号为分割拼接成字符串
          let str = tag_list.slice(0, -1).join('，')
          // 如果字符串不为空，在后面加上”和“作为和最后那个没被取出的标签之间的连接
          // 如果字符串为空,说明总共只有一个标签，直接拼上最后那个没被取出的标签
          if (str.length > 0) {
            str = str + "和"
          }
          str = "我想您面前的是" + str + tag_list[tag_list.length - 1]
          that.setData({
            text:str
          })
          that.t2a_method(str)
        }).catch(err => {
          console.error(err)
        })
      }
    })
  },

  i2t_api_text: function(img_path) {
    let that = this;
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
          if (res.ret != 0) {
            console.log("image-to-text system busy")
            that.setData({
              i2t_system_status: 0
            })
            console.log(res)
            return
          }
          console.log("image-to-text system ok")
          that.setData({
            i2t_system_status: 1
          })
          let str = "我想您面前的是" + res.data.text
          that.setData({
            text: str
          })
          that.t2a_method(str)
        }).catch(err => {
          console.error(err)
        })
      }
    })
  },
  t2a_method: function(text) {
    switch (this.data.t2a_api_index) {
      case 0:
        this.t2a_api_default(text)
        break;
      default:
        console.log(this.data.t2a_api_index)
    }
  },
  t2a_api_default: function(text) {
    let that = this;
    let tmp_path = wx.env.USER_DATA_PATH + '/' + that.data.audio_file_code + '.wav'
    that.setData({
      audio_file_code: that.data.audio_file_code + 1
    })
    console.log(text)
    if (text == "") {
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
      res = res.result.data
      if (res.ret != 0) {
        console.log("text-to-audio system busy")
        that.setData({
          t2a_system_status: 0
        })
        console.log(res)
        return
      }
      console.log("text-to-audio system ok")
      that.setData({
        t2a_system_status: 1
      })
      wx.getFileSystemManager().writeFile({
        filePath: tmp_path,
        data: res.data.speech,
        encoding: 'base64',
        success: (e) => {
          that.setData({
            audio_file_status: !that.data.audio_file_status
          })
          that.play_audio(tmp_path)
        },
        fail: (errMsg) => {
          console.log(errMsg)
        }
      })
    }).catch(err => {
      console.error(err)
    })
  },

  play_audio: function(path) {
    if (this.data.interval == null) {
      return
    }
    let innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = path
    innerAudioContext.autoplay = true
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((errMsg) => {
      console.log(errMsg)
    })
  },

  clickStart() {
    console.log('strat')

    let that = this;
    that.proceed();
    let interval = setInterval(function() {
      that.proceed()
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
  },

  bindI2tPickerChange: function(e) {
    this.setData({
      i2t_api_index: parseInt(e.detail.value),
    })
    console.log('set i2t api to ', this.data.i2t_api_conf[e.detail.value])
  },
  bindT2aPickerChange: function(e) {

    this.setData({
      t2a_api_index: parseInt(e.detail.value),
    })
    console.log('set t2a api to ', this.data.t2a_api_conf[e.detail.value])
  }
})