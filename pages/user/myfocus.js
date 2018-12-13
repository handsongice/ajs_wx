// pages/user/myfav.js
var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    customerId: '',
    list1: [],
    list2: [],
    list3: [],
  },
  onLoad: function (options) {
    this.initSystemInfo();
    var customer = wx.getStorageSync('customer');
    this.setData({
      currentTab: parseInt(options.currentTab),
      customerId: customer.id
    });
    if (this.data.currentTab == 0) {
      this.loadPostList(1);
    } else if (this.data.currentTab == 1) {
      this.loadPostList(2);
    } else if (this.data.currentTab == 2) {
      this.loadPostList(3);
    }
  },

  loadPostList: function (t) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.href + '/api/index/like_customer_list',
      data: {
        app: 'customer_app',
        customer_id: that.data.customerId,
        type: t,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          if (result.data) {
            if (t == 1) {
              that.setData({
                list1: result.data,
              })
            } else if (t == 2) {
              that.setData({
                list2: result.data,
              })
            } else if (t == 3) {
              that.setData({
                list3: result.data,
              })
            }
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
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
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

      //没有数据就进行加载
      switch (that.data.currentTab) {
        case 0:
          that.setData({
            list1: [],
            list2: [],
            list3: [],
          })
          that.loadPostList(1);
          break;
        case 1:
          that.setData({
            list1: [],
            list2: [],
            list3: [],
          })
          that.loadPostList(2);
          break;
        case 2:
          that.setData({
            list1: [],
            list2: [],
            list3: [],
          })
          that.loadPostList(3);
          //!that.data.list3.length && that.loadOrderList();
          break;
      }
    };
  },

})
