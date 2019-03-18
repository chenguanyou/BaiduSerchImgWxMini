import {
  HOST,
  API,
  Url_Api,
} from '../../api/api.js'

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    logoShow: true,
    imgShow: false,
    values_progress: 0,
    // 组件所需的参数
    nvabarData: {
      // showCapsule: 1, //是否显示左上角图标
      // title: '我的主页', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 50,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // console.log(API)
    // 这里获取手机大小的高度
    try {
      const res = wx.getSystemInfoSync()
      this.setData({ //此时OK
        logoShow: true,
        imgShow: false,
        searchurl: '',
        windowHeight: res.windowHeight,
      })
      // console.log(this.data.windowHeight)

      // console.log(res.model)
      // console.log(res.pixelRatio)
      // console.log(res.windowWidth)
      // console.log(res.windowHeight)
      // console.log(res.language)
      // console.log(res.version)
      // console.log(res.platform)
    } catch (e) {
      // Do something when catch error
    }
    wx.clearStorageSync('datalist')
    wx.clearStorageSync('this_img')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      logoShow: true,
      imgShow: false,
      searchurl: '',
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      logoShow: true,
      imgShow: false,
      searchurl: '',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '即刻，快速，以图搜图',
      path: '/pages/index/index',
      imageUrl: '../../image/icon/bj.jpg',
      success: function(res) {}
    }
  },
  // 获取用户搜索的文字
  Search_str: function(e) {
    var that = this
    that.setData({
      'searchurl': e.detail.value
    })

  },
  // 使用文字搜图
  searchs: function() {
    var that = this
    var searchurl = that.data.searchurl
    if (searchurl == '' || searchurl == null || searchurl == undefined) {
      wx.showToast({
        title: '输入图片链接',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      console.log('输入图片链接')
      return false
    }
    wx.showLoading({
      title: '图片链接识别中',
      mask: true
    })
    // 如果链接没问题就发送到服务器进行图片搜索
    wx.request({
      url: Url_Api,
      method: 'POST',
      data: {
        image_url: searchurl,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        setTimeout(function() {
          wx.hideLoading()
        }, 2000)
        if (res.statusCode == 401) {
          wx.showToast({
            title: res.data.massage,
            icon: 'none',
            mask: true,
            duration: 2000
          })
          return false
        }
        if (res.statusCode == 200) {
          console.log(res)
          var datalist = res.data
          wx.setStorage({
            key: "datalist",
            data: datalist,
          })
          wx.setStorage({
            key: "this_img",
            data: searchurl,
          })
          that.setData({
            searchurl: ''
          })
          wx.navigateTo({
            url: '../../pages/result/result?',
          })
        }
      },
      fail() {
        wx.showToast({
          title: '请求超时',
          icon: 'none',
          mask: true,
          duration: 2000
        })
        that.setData({
          searchurl: ''
        })
      }
    })
  },
  // 使用图片搜图
  upload_images: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', ],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '图片识别中',
          mask: true
        })
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          logoShow: false,
          imgShow: true,
          this_img: tempFilePaths[0]
        })
        // 获取到数据，发送给服务器AI系统，进行数据识别
        wx.uploadFile({
          url: API, // 仅为示例，非真实的接口地址
          header: {
            'Content-Type': 'multipart/form-data'
          },
          filePath: tempFilePaths[0],
          name: 'images',
          success(res) {
            setTimeout(function() {
              wx.hideLoading()
            }, 2000)
            var datalist = JSON.parse(res.data)
            wx.setStorage({
              key: "datalist",
              data: datalist,
            })
            wx.setStorage({
              key: "this_img",
              data: tempFilePaths[0],
            })
            wx.navigateTo({
              url: '../../pages/result/result?',
            })
            that.setData({
              logoShow: true,
              imgShow: false,
            })
            // do something
          },
          fail() {
            wx.showToast({
              title: '请求超时',
              icon: 'none',
              mask: true,
              duration: 2000
            })
            that.setData({
              logoShow: true,
              imgShow: false,
            })
          }
        })
      }
    })
  },
})