// pages/group/groupdetail.js
var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    showView: true,
    showFav: false,
    showTxt: false,
    showIcon: false,
    message: '',
    info: {},
    list: []
  },
  onLoad: function (options) {
    if (!options || !options.id) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '作品不存在！',
        success: function () {
          wx.navigateBack({})
        }
      })
    }
    var customer = wx.getStorageSync('customer')
    var customer_id = ''
    if (customer && customer.id) {
      customer_id = customer.id
    }
    var that = this
    wx.request({
      url: app.globalData.href + '/api/index/get_post',
      data: {
        app: 'customer_app',
        id: options.id,
        customer_id: customer_id
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
              showFav: result.data.like,
            })
            that.loadList()
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
    //底部显示隐藏
    showView: (options.showView == "true" ? true : false);
    showFav: (options.showFav == "true" ? true : false);
    showTxt: (options.showTxt == "true" ? true : false);
    showIcon: (options.showTxt == "true" ? true : false);
  },
  getMessage: function (e) {
    var val = e.detail.value;
    this.setData({
      message: val
    });
  },
  loadList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.href + '/api/index/show_post_add',
      data: {
        app: 'customer_app',
        postid: that.data.info.id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          if (result.data) {
            that.setData({
              list: result.data
            })
          }
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
  putMessage: function () {
    let that = this;
    var customer = wx.getStorageSync('customer')
    if (!customer) {
      wx.navigateTo({
        url: '../login/login_d'
      })
    }
    wx.request({
      url: app.globalData.href + '/api/index/create_post_add',
      data: {
        app: 'customer_app',
        customer_id: customer.id,
        post_id: that.data.info.id,
        message: that.data.message
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var result = res.data;
        if (result && result.code == '200') {
          that.setData({
            message: ''
          })
          that.loadList()
        } else {
          wx.showToast({
            title: result.msg,
            duration: 2000
          });
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
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
    that.setData({
      showTxt: false
    })
  },

  onChangeShowTxt: function () {
    var that = this;
    that.setData({
      showView: false
    })
    that.setData({
      showTxt: true
    })
  },
  onChangeShowIcon: function () {
    var that = this;
    that.setData({
      showIcon: (!that.data.showIcon)
    })
  },
  onChangeShowFav: function () {
    var that = this;
    var customer = wx.getStorageSync('customer')
    if (!customer) {
      wx.navigateTo({
        url: '../login/login_d'
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.href + '/api/index/update_post_like',
      data: {
        app: 'customer_app',
        customer_id: customer.id,
        post_id: that.data.info.id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          that.setData({
            showFav: result.data
          })
        } else {
          wx.showToast({
            title: '操作失败！',
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
    // that.setData({
    //   showFav: (!that.data.showFav)
    // })
  },
})
