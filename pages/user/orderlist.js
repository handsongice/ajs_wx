// pages/user/orderlist.js
var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    page: 1,
    customer:{},
    total: 0,
    carts: [],
    showView: true,
  },
  onLoad: function (options) {
    this.initSystemInfo();
    let shop_cart = wx.getStorageSync('shop_cart')
    let _cart = []
    for (let i = 0; i < shop_cart.length; i++) {
      if (shop_cart[i].selected) {
        _cart.push(shop_cart[i])
      }
    }
    let sorted = this.groupBy(_cart, function (item) {
      return item.sname;
    });
    this.setData({
      carts: sorted,
      customer: wx.getStorageSync('customer')
    })
    this.sum()
    //底部显示隐藏
    showView: (options.showView == "true" ? true : false);
  },
  groupBy: function (array, f) {
    let groups = {};
    array.forEach(function (o) {
      let group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    console.log(groups)
    return Object.keys(groups).map(function (group) {
      let _d = {}
      _d.name = group.replace(/"/g, '')
      _d.datas = groups[group]
      return _d;
    });
  },
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  getOrderStatus: function () {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
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
  removeShopCard: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你确认取消订单？',
      confirmColor: '#c9693f',
      cancelColor: '#7b7b7b',
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
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
    });
  },
  bindMinus: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var idx = parseInt(e.currentTarget.dataset.idx);
    var pid = parseInt(e.currentTarget.dataset.pid);
    let shop_cart = wx.getStorageSync('shop_cart')

    var num = that.data.carts[index].datas[idx].num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    } else {
      wx.showModal({
        title: '提示',
        content: '你确认移除吗',
        confirmColor: '#c9693f',
        cancelColor: '#7b7b7b',
        success: function (res) {
          if (res.confirm) {
            let _i = 0
            for (var i = 0; i < shop_cart.length; i++) {
              if (pid == shop_cart[i].pid) {
                _i = i
              }
            }
            shop_cart.splice(index, 1);
            let sorted = that.groupBy(shop_cart, function (item) {
              return item.sname;
            });
            that.setData({
              carts: sorted
            })
            wx.setStorageSync('shop_cart', shop_cart)
            that.sum()
          }

        },
        fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        }
      });
      // wx.showToast({
      //   title: '数量不能小于1！',
      //   duration: 2000
      // });
      // return false
    }
    var carts = that.data.carts;
    carts[index].datas[idx].num = num
    that.setData({
      carts: carts
    });
    var _pid = carts[index].datas[idx].pid
    for (let i = 0; i < shop_cart.length; i++) {
      if (_pid == shop_cart[i].pid) {
        shop_cart[i].num = num
      }
    }
    wx.setStorageSync('shop_cart', shop_cart)
    this.sum()
  },

  bindPlus: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var idx = parseInt(e.currentTarget.dataset.idx);
    var num = that.data.carts[index].datas[idx].num;

    // 自增
    num++;
    var carts = that.data.carts;
    carts[index].datas[idx].num = num
    that.setData({
      carts: carts
    });
    var _pid = carts[index].datas[idx].pid
    let shop_cart = wx.getStorageSync('shop_cart')
    for (let i = 0; i < shop_cart.length; i++) {
      if (_pid == shop_cart[i].pid) {
        shop_cart[i].num = num
      }
    }
    wx.setStorageSync('shop_cart', shop_cart)
    this.sum()
  },

  bindToastChange: function () {
    this.setData({
      toastHidden: true
    });
  },

  onShow: function () {

  },
  sum: function () {
    var carts = this.data.carts;
    // 计算总金额
    var total = 0;
    for (var i = 0; i < carts.length; i++) {
      for (var j = 0; j < carts[i].datas.length; j++) {
        if (carts[i].datas[j].selected) {
          total += parseInt(carts[i].datas[j].num) * parseFloat(carts[i].datas[j].price);
        }
      }
    }
    total = parseFloat(total).toFixed(2);
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: total
    });
  },
  doPay: function () {
    // 隐藏遮罩层
    var that = this
    let shop_cart = wx.getStorageSync('shop_cart')
    let _cart = []
    for (let i = 0; i < shop_cart.length; i++) {
      if (shop_cart[i].selected) {
        _cart.push(shop_cart[i])
      }
    }
    let sorted = this.groupBy(_cart, function (item) {
      return item.sid;
    });
    wx.request({
      url: app.globalData.href + '/api/index/doPay',
      method: 'POST',
      data: {
        app: 'customer_app',
        openid: wx.getStorageSync('openid'),
        customer: JSON.stringify(that.data.customer),
        carts: JSON.stringify(sorted),
        shop_cart: JSON.stringify(_cart),
        total: that.data.total
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var result = res.data;
        if (result && result.code == '200') {
          let shop_cart1 = wx.getStorageSync('shop_cart')
          let _carts1 = []
          for (var i = 0; i < shop_cart1.length; i++) {
            if (!shop_cart1[i].selected) {
              _carts1.push(shop_cart1[i])
            }
          }
          wx.setStorageSync('shop_cart', _carts1)
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '提交成功',
            success: function () {
              wx.navigateBack({})
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: result.msg,
            success: function () {
              wx.navigateBack({})
            }
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
