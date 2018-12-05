// pages/person/person_b.js
var app = getApp()
Page({
  data: {
    info: {},
    windowHeight: 0,
    windowWidth: 0,
    customerId: '',
    pixelRatio: 0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navData: [],
    list: [],
    types: [],
    currentTab: 0,
    navScrollLeft: 0,
    carNum: 0,
    key: '',
    showView: true
  },
  //事件处理函数
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
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
    this.goodsType()
    showView: (options.showView == "true" ? true : false)
  },
  onShow: function () {
    let shop_cart = wx.getStorageSync('shop_cart')
    this.setData({
      carNum: shop_cart.length
    })
  },
  doSearch: function (e) {
    var that = this;
    var val = e.detail.value;
    this.setData({
      key: val
    });
    that.loadList()
  },
  goodsType: function () {
    var that = this
    wx.request({
      url: app.globalData.href + '/api/index/show_goods_type',
      data: {
        app: 'customer_app',
        type: 2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var result = res.data;
        if (result && result.code == '200') {
          if (result.data) {
            that.setData({
              types: result.data,
            })
            var _data = []
            for (var i = 0; i < result.data.length; i++) {
              _data.push(i)
            }
            that.setData({
              navData: _data
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
  loadList: function () {
    var that = this;
    let _types = that.data.types
    if (_types && _types.length > 0) {
      let goodsType = _types[that.data.currentTab]
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.href + '/api/index/show_goods_list',
        data: {
          app: 'customer_app',
          type_id: goodsType.id,
          key: that.data.key,
          customer_id: that.data.customerId,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          var result = res.data;
          if (result && result.code == '200') {
            if (result.data) {
              that.setData({
                list: result.data,
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
    }

  },
  customerInfo: function () {
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
  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })

    }
  },
  addCart: function (e) {
    //购物车
    let pid = e.target.dataset.pid;
    let shop_cart = wx.getStorageSync('shop_cart')
    if (!pid) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '商品信息异常',
        success: function () {
        }
      })
      return false
    }

    let name = e.target.dataset.name;
    let pic = e.target.dataset.pic;
    let price = e.target.dataset.price;
    let sid = e.target.dataset.sid;
    let sname = e.target.dataset.sname;
    let _shop_cart = [];
    if (shop_cart) {
      var boo = true;
      for (let index in shop_cart) {
        let _sc = {};
        _sc.pid = shop_cart[index].pid;
        _sc.name = shop_cart[index].name;
        _sc.pic = shop_cart[index].pic;
        _sc.price = shop_cart[index].price;
        if (shop_cart[index].pid == pid) {
          _sc.num = parseInt(shop_cart[index].num) + 1
          boo = false
        } else {
          _sc.num = shop_cart[index].num
        }
        _sc.sid = shop_cart[index].sid;
        _sc.sname = shop_cart[index].sname;
        _shop_cart.push(_sc)
      }
      if (boo) {
        let _sc = {};
        _sc.pid = pid;
        _sc.num = 1;
        _sc.name = name;
        _sc.pic = pic;
        _sc.price = price;
        _sc.sid = sid;
        _sc.sname = sname;
        _shop_cart.push(_sc)
      }
    } else {
      let _sc = {};
      _sc.pid = pid;
      _sc.num = 1;
      _sc.name = name;
      _sc.pic = pic;
      _sc.price = price;
      _sc.sid = sid;
      _sc.sname = sname;
      _shop_cart.push(_sc)
    }
    wx.setStorageSync('shop_cart', _shop_cart)
    this.setData({
      carNum: _shop_cart.length
    })
    wx.showToast({
      title: '已添加！',
      duration: 1000
    });
  },
  switchTab(event) {
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
    this.loadList()
  }
})