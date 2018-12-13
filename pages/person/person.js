// pages/person/person.js
var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    hasMoreData: true,
    pageSize: 5,
    page: 1,
    list: [],
  },
  onLoad: function (options) {
    this.initSystemInfo();
    this.setData({
      currentTab: parseInt(options.currentTab),
    });
    this.loadList();
  },
  getOrderStatus: function () {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
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
        type: _type,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          if (result.data) {
            var _n = 0;
            for (let i = 0; i < result.data.length; i++) {
              if (result.data[i].pics) {
                _n++
              }
            }
            var _h = that.data.winHeight + 30 * _n
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

  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
      });

    };
  },

})
