// pages/user/orderlist_1.js
var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    orderId: 0,
    info: {},
    showView: true,
  },
  onLoad: function (options) {
    this.initSystemInfo();
    if (!options || !options.id) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '订单不存在！',
        success: function () {
          wx.navigateBack({})
        }
      })
    }
    this.setData({
      orderId: options.id
    });
    this.loadData();
    //底部显示隐藏
    showView: (options.showView == "true" ? true : false);
  },

  initSystemInfo: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  onShow: function () {

  },

  // 数据案例
  loadData: function () {
    var that = this;
    wx.request({
      url: app.globalData.href + '/api/index/get_order_info',
      data: {
        app: 'customer_app',
        id: that.data.orderId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          if (result.data) {
            that.setData({
              info: result.data,
            })
          }
        } else {
          wx.showToast({
            title: '加载失败！',
            duration: 2000
          });
        }
      },
      complete: function () {
        wx.hideLoading()
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

})
