//index.js  
//获取应用实例  
var app = getApp()
Page({
  data: {
    movies: [],
    sjs: [],
    sy: [],
    gc: [],
  },
  onShow: function() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
  },
  onLoad: function () {
    var that = this
    //轮播
    wx.request({
      url: app.globalData.href + '/api/index/advert_list',
      data: {
        app: 'customer_app',
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        var result = res.data;
        if (result && result.code == '200') {
          that.setData({
            movies: result.data
          })
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    wx.request({
      url: app.globalData.href + '/api/index/tj_customer_list',
      data: {
        app: 'customer_app'
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        var result = res.data;
        if (result && result.code == '200') {
          that.setData({
            sjs: result.data.sjs,
            sy: result.data.sy,
            gc: result.data.gc,
          })
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
})