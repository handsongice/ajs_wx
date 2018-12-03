// pages/user/myorder.js
var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    listHeight: 0,
    // tab切换  
    currentTab: 0,
    page: 1,
    total: 0,
    carts: [],
    list: [],
    showView: true,
    selectedAllStatus:false,
  },
  onLoad: function (options) {
    var that = this
    let shop_cart = wx.getStorageSync('shop_cart')
    let sorted = this.groupBy(shop_cart, function (item) {
      return item.sname;
    });
    if(options.currentTab == 1) {
      this.loadOrderlist().then(function(res){
        console.log(res)
        that.initSystemInfo();
      })
    } else {
      this.sum()
      this.initSystemInfo();
    }
    this.setData({
      carts: sorted,
      currentTab: parseInt(options.currentTab),
    })
    //底部显示隐藏
    showView: (options.showView == "true" ? true : false);
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
        console.log(res.windowHeight)
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
  groupBy: function (array, f) {
    if (!array) {
      return []
    }
    let groups = {};
    array.forEach(function (o) {
      let group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    console.log(groups)
    return Object.keys(groups).map(function (group) {
      let _d = {}
      _d.name = group.replace(/"/g,'')
      _d.datas = groups[group]
      return _d;
    });
  },
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var current = e.target.dataset.current;
      if (current == 1) {
        this.loadOrderlist().then(function (res) {
          that.initSystemInfo();
        })
      }
      that.setData({
        currentTab: parseInt(current),
      });
    };
  },

  bindMinus: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var idx = parseInt(e.currentTarget.dataset.idx);
    
    var num = that.data.carts[index].datas[idx].num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    } else {
      wx.showToast({
        title: '数量不能小于1！',
        duration: 2000
      });
      return false
    }
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
  bindCheckbox: function (e) {
    /*绑定点击事件，将checkbox样式改变为选中与非选中*/
    //拿到下标值，以在carts作遍历指示用
    var index = parseInt(e.currentTarget.dataset.index);
    var idx = parseInt(e.currentTarget.dataset.idx);
    //原始的icon状态
    var selected = this.data.carts[index].datas[idx].selected;
    var carts = this.data.carts;
    // 对勾选状态取反
    carts[index].datas[idx].selected = !selected;
    // 写回经点击修改后的数组
    this.setData({
      carts: carts
    });
    var _pid = carts[index].datas[idx].pid
    let shop_cart = wx.getStorageSync('shop_cart')
    for (let i = 0; i < shop_cart.length; i++) {
      if (_pid == shop_cart[i].pid) {
        shop_cart[i].selected = carts[index].datas[idx].selected
      }
    }
    wx.setStorageSync('shop_cart', shop_cart)
    this.sum()
  },

  bindSelectAll: function () {
    // 环境中目前已选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值
    var carts = this.data.carts;
    // 遍历
    for (let i = 0; i < carts.length; i++) {
      for (let j = 0; j < carts[i].datas.length; j++) {
        carts[i].datas[j].selected = selectedAllStatus;
      }
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts
    });
    let shop_cart = wx.getStorageSync('shop_cart')
    for (let i = 0; i < shop_cart.length; i++) {
      shop_cart[i].selected = selectedAllStatus
    }
    wx.setStorageSync('shop_cart', shop_cart)
    this.sum()
  },
  bindCheckout: function () {
    // 初始化toastStr字符串
    var toastStr = '';
    // 遍历取出已勾选的cid
    let shop_cart = wx.getStorageSync('shop_cart')
    for (var i = 0; i < shop_cart.length; i++) {
      if (shop_cart[i].selected) {
        toastStr += shop_cart[i].pid;
        toastStr += ',';
      }
    }
    if (toastStr == '') {
      wx.showToast({
        title: '请选择结算商品！',
        duration: 2000
      });
      return false;
    }
    //存回data
    wx.navigateTo({
      url: '../user/orderlist',
    })
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
      total: '¥ ' + total
    });
  },

  onShow: function () {
    if(this.data.currentTab == 0) {
      let shop_cart = wx.getStorageSync('shop_cart')
      let sorted = this.groupBy(shop_cart, function (item) {
        return item.sname;
      });
      this.setData({
        carts: sorted
      })
      this.sum()
    }
  },

  removeShopCard: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var idx = parseInt(e.currentTarget.dataset.idx);
    var pid = parseInt(e.currentTarget.dataset.pid);
    let shop_cart = wx.getStorageSync('shop_cart')
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
  },
  // 数据案例
  loadOrderlist: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.href + '/api/index/get_order_list',
        method: 'post',
        data: {
          app: 'customer_app',
          openid: wx.getStorageSync('openid'),
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (result && result.code == '200') {
            that.setData({
              list: result.data.orders
            });
            if (result.data.heights > that.data.winHeight) {
              that.setData({
                winHeight: result.data.heights
              });
            }
            resolve(result.data);
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
    })
  },
})
