// pages/person/person_b_show.js
//获取应用实例  
var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    imgheights: 0,
    page: 0,
    refundpage: 0,
    info: {},
    carNum: 0,
    details: [],
    movies: []
  },
  onLoad: function (options) {
    var that = this
    if (!options.id) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '商品不存在',
        success: function () {
          wx.navigateBack({})
        }
      })
    }
    this.initSystemInfo();
    this.loadInfo(options.id)
    let shop_cart = wx.getStorageSync('shop_cart')
    this.setData({
      carNum: shop_cart.length
    })
  },
  onShow: function () {
    let shop_cart = wx.getStorageSync('shop_cart')
    this.setData({
      carNum: shop_cart.length
    })
  },
  getOrderStatus: function () {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
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
  doPay: function (e) {
    //立即购买
    //购物车
    let pid = e.target.dataset.pid;
    let shop_cart = wx.getStorageSync('shop_cart')
    if (!pid) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '商品信息异常',
        success: function () { }
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
      let boo = true;
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
        _sc.selected = true;
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
        _sc.selected = true;
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
      _sc.selected = true;
      _shop_cart.push(_sc)
    }
    wx.setStorageSync('shop_cart', _shop_cart)
    this.setData({
      carNum: _shop_cart.length
    })
    wx.navigateTo({
      url: '../user/orderlist',
    })
  },
  loadInfo: function (goods_id) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.href + '/api/index/get_goods_info',
      data: {
        app: 'customer_app',
        id: goods_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          that.setData({
            info: result.data.info,
            movies: result.data.pics,
            details: result.data.introduction,
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '商品不存在',
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
  },
  imageLoad: function (e) { //获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight, this.data.winHeight)
    //计算的高度值  
    var viewHeight = (this.data.winHeight * 0.65) / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights += parseInt(imgheight);
    this.setData({
      imgheights: imgheights
    })
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

})
