var app = getApp()
Page({
  data: {
    info: {},//本地图片地址数组
    message: '',
    showView: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var customer = wx.getStorageSync('customer');
    if (!customer || !customer.id) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未登录！',
        success: function () {
          wx.navigateBack({})
        }
      })
    }
    this.setData({
      info: customer,
      message: customer.sign
    })
  },
  getMessage: function (e) {
    var val = e.detail.value;
    this.setData({
      message: val
    });
  },
  doUpdate: function (e) {
    var that = this;
    if (!this.data.info.id) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未登录！',
        success: function (res) {
          wx.navigateBack({})
        }
      })
      return false;
    }
    wx.request({
      url: app.globalData.href + '/api/index/update_customer',
      data: {
        app: 'customer_app',
        sign: this.data.message,
        id: this.data.info.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var result = res.data;
        var msg = result.msg;
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 2000
        })
        if (result && result.code == '200') {
          if (result.data && result.data.appid) {
            wx.setStorageSync('customer', result.data)
            that.setData({
              info: result.data,
            })
            if (getCurrentPages().length != 0) {
              getCurrentPages()[getCurrentPages().length - 1].onLoad()
            }
          }
        }
      }
    })
  },
})