// pages/group/groupshow.js
var app = getApp()
Page({
  data: {
    currentTab: 0,
    movies: [],
    info: {},
    list: []
  },
  onLoad: function (options) {
    if (!options || !options.id) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '产品不存在！',
        success: function () {
          wx.navigateBack({})
        }
      })
    }
    var that = this
    wx.request({
      url: app.globalData.href + '/api/index/get_post',
      data: {
        app: 'customer_app',
        id: options.id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var result = res.data;
        if (result && result.code == '200') {
          if (result.data) {
            that.setData({
              info: result.data,
              currentTab: options.currentTab
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '帖子不存在！',
            success: function () {
              wx.navigateBack({})
            }
          })
        }
      }
    })
  },
})