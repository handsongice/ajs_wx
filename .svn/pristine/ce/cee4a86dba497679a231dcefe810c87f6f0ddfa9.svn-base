// pages/person/personshow.js
var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    pageSize: 5,
    page: 1,
    hasMoreData: true,
    refundpage: 0,
    list: [],
    customerId: '',
    showView: false,
    info:{}
  },
  onChangeShowState: function () {
    var that = this;
    var customer = wx.getStorageSync('customer')
    if (!customer) {
      wx.navigateTo({
        url: '../login/login_d'
      })
    }
    if (that.data.customerId == customer.id) {
      wx.showToast({
        title: '不能关注自己！',
        duration: 2000
      });
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.href + '/api/index/update_customer_like',
      data: {
        app: 'customer_app',
        fromid: customer.id,
        toid: that.data.customerId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          that.setData({
            showView: result.data
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
    that.setData({
      showView: (!that.data.showView)
    })
  },
  onLoad: function (options) {
    this.initSystemInfo();
    if (!options || !options.id) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '共建人不存在！',
        success: function () {
          wx.navigateBack({})
        }
      })
    }
    this.setData({
      customerId: options.id
    })
    this.customerInfo()
  },
  customerInfo : function () {
    var that = this
    var customer = wx.getStorageSync('customer')
    var customer_id = ''
    if (customer && customer.id) {
      customer_id = customer.id
    }
    wx.request({
      url: app.globalData.href + '/api/index/get_customer_info',
      data: {
        app: 'customer_app',
        fromid: customer_id,
        id: that.data.customerId
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
              showView: result.data.like
            })
            that.loadList()
          }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '共建人不存在！',
            success: function () {
              wx.navigateBack({})
            }
          })
        }
      }
    })
  },
  loadList: function () {
    var that = this;
    let _type = that.data.currentTab + 1
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.href + '/api/index/show_post_list',
      data: {
        app: 'customer_app',
        page: that.data.page,
        pageSize: that.data.pageSize,
        customer_id: that.data.customerId,
        _type: _type,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          if (result.data) {
            var _n = 0;
            for (let i = 0; i < result.data.length;i++) {
              if (result.data[i].pics) {
                _n++
              }
            }
            var _h = that.data.winHeight + 30*_n
            that.setData({
              winHeight: _h
            })
            if (result.data.length < that.data.pageSize) {
              that.setData({
                list: that.data.list.concat(result.data),
                hasMoreData: false
              })
            } else {
              that.setData({
                list: that.data.list.concat(result.data),
                hasMoreData: true,
                page: that.data.page + 1
              })
            }
          } else {
            that.setData({
              hasMoreData: false
            })
          }
        } else {
          wx.showToast({
            title: '加载数据失败！',
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
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.loadList()
    } else {
      // wx.showToast({
      //   title: '没有更多数据',
      // })
    }
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
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      this.initSystemInfo();
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
        page: 1,
        list:[]
      });
      that.loadList()
    };
  },

})
