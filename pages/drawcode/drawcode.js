//share.js
Page({
  data: {
    imagePath: "",
    imageTx: "",
    imageEwm: "",
    maskHidden: true,
  },
  onLoad: function (options) {
    var that=this;
    var size = this.setCanvasSize();//动态设置画布大小
    setTimeout(function(){
      that.createNewImg();
    }, 3000)
  },
  //适配不同屏幕大小的canvas    生成的分享图宽高分别是 750  和940，老实讲不知道这块到底需不需要，然而。。还是放了，因为不写这块的话，模拟器上的图片大小是不对的。。。
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750;//画布宽度
      var scaleH = 940 / 750;//生成图片的宽高比例
      var width = res.windowWidth;//画布宽度
      var height = res.windowWidth * scaleH;//画布的高度
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  //将1绘制到canvas的固定
  settextFir: function (context) {
    let that = this;
    var size = that.setCanvasSize();
    var textFir = "我正在使用即刻识图";
    console.log(textFir);
    context.setFontSize(24);
    context.setTextAlign("center");
    context.setFillStyle("#eb4901");
    context.fillText(textFir, size.w / 2, size.h * 0.25);
    context.stroke();
  },
  //将2绘制到canvas的固定
  settextSec: function (context) {
    let that = this;
    var size = that.setCanvasSize();
    var textSec = "长按识别以图搜索";
    context.setFontSize(20);
    context.setTextAlign("center");
    context.setFillStyle("#eb4901");
    context.fillText(textSec, size.w / 2, size.h * 0.88);
    context.stroke();
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var size = that.setCanvasSize();
    var context = wx.createCanvasContext('myCanvas');
    var path = '../../image/icon/bj.jpg';
    var imageTx = '../../image/icon/qrcode.jpg';
    var imageEwm = that.data.imageEwm;
    var imageZw = '../../image/icon/qrcode.jpg';
    context.drawImage(path, 0, 0, size.w, size.h);
    context.drawImage(imageZw, size.w / 2 - 60, size.h * 0.37, size.w * 0.33, size.w * 0.33);
    this.settextFir(context);
    this.settextSec(context);

    console.log(size.w, size.h)
    //绘制图片
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    wx.showToast({
      title: '测试分享码生成中...',
      icon: 'loading',
      duration: 2000
    });
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        quality:1,
        fileType:'jpg',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: false,
            maskHidden: true,
          });
          // //将生成的图片放入到《image》标签里
          var img = that.data.imagePath;
          wx.previewImage({
            current: img, // 当前显示图片的http链接
            urls: [img] // 需要预览的图片http链接列表
          })
        },
        fail: function (res) {
          console.log(res);
        }
      },this);
    }, 2000);
  },
})

