// pages/result/result.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      // title: '我的主页', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 20,
    shares_isshow: false,
    shares_icon_isshow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'datalist',
      success: function(res) {
        console.log(res.data)
        that.setData({
          result: res.data,
        })
      }
    })
    wx.getStorage({
      key: 'this_img',
      success: function(res) {
        console.log(res.data)
        that.setData({
          this_images: res.data
        })
      }
    })
    var res = wx.getSystemInfoSync();
    that.setData({
      width_phone: res.windowWidth,
      height_phone: res.windowHeight,
    })
    wx.clearStorageSync('datalist')
    wx.clearStorageSync('this_img')
    // 获取分享图片的信息
    wx.getImageInfo({
      src: '../../image/icon/share.jpg',
      success(res) {
        console.log(res)
        that.setData({
          width_images: res.width,
          height_images: res.height,
          image_path: res.path
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

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
  // 生成分享图
  Share_svc: function() {
    var that = this
    that.setData({
      shares_isshow: true,
      shares_icon_isshow: false,
    })
  },
  // 保存分享图到相册
  server_shares: function() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: "image/icon/share.jpg",
      success(res) {
        console.log(res)
        wx.showToast({
          title: '保存相册成功',
          icon: 'success',
          mask: true,
          duration: 2000
        })
        that.setData({
          shares_isshow: false,
          shares_icon_isshow: true,
        })
      },
      fail(e) {
        console.log(e)
        that.server_shares()
      }
    })
  },
  outbtn: function(e) { //这是list-fix的点击事件，给它绑定事件，是为了实现点击其它地方隐藏蒙层的效果
    var that = this;
    this.setData({
      shares_isshow: false, //设置动画效果为slidedown
      shares_icon_isshow: true
    })
    setTimeout(function() { //延时设置蒙层的隐藏，这个定时器的时间，就是slidedown在css动画里设置的时间，这样就能实现slidedown动画完成后，蒙层才消失的效果。不设置定时器会导致动画效果看不见
      that.setData({
        mengShow: false
      })
    }, 500)
  },
})