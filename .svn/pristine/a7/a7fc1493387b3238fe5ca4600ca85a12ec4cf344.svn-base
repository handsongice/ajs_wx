// pages/user/password.js
var app = getApp();

let animationShowHeight = 300;

Page({
  data: {
    animationData: "",
    showModalStatus: false,
    imageHeight: 0,
    imageWidth: 0,
    //普通选择器：（普通数组）
    array: ['到团长处自提', '团长送货上门'],
    objectArray: [
      { id: 0, name: '到团长处自提' },
      { id: 1, name: '团长送货上门' }
    ],
    index: 0,
    showView: true,
  },
  imageLoad: function (e) {
    this.setData({ imageHeight: e.detail.height, imageWidth: e.detail.width });
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 0)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 0)
  },
  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },


  //日期选择器：
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  //时间选择器：
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //底部显示隐藏
    showView: (options.showView == "true" ? true : false);
  },



  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
    setTimeout(function () {
      wx.redirectTo({
        url: 'user'
      })
    }, 2000)
  },


})