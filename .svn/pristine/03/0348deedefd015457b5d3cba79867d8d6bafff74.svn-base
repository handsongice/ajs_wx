// pages/login/login_d.js
var app = getApp();
var common = require("../../utils/common.js");
let animationShowHeight = 300;
Page({
  data: {
    showView: true,
    animationData: "",
    min: 60,
    phone:'',
    code:'',
    showModalStatus: false,
    msg:''
  },
  onLoad: function (options) {
    phone: ''
  },
  onChangeShowState: function () {
    var that = this;
    if(!this.data.phone) {
      this.setData({
        msg:'请输入正确的手机号！'
      })
      this.showModal()
      return false
    } else {
      wx.request({
        url: app.globalData.href + '/api/index/yzPhoneCode',
        data: {
          app: 'customer_app',
          phone: that.data.phone
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          var result = res.data;
          if (result && result.code == '200') {
            if (result.data) {
              wx.setStorageSync('code_id', result.data)
            }
            that.countDown()
          } else {
            that.setData({
              msg: result.msg
            })
            that.showModal()
          }
        }
      })
    }
  },
  getPhone: function (e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    });
  },
  getCode: function (e) {
    var val = e.detail.value;
    this.setData({
      code: val
    });
  },
  countDown() {
    this.setData({
      showView: false
    })
    let _min = this.data.min;
    if (_min > 0) {
      _min = _min -1;
      this.setData({
        min: _min
      })
      setTimeout(this.countDown, 1000);
    } else {
      this.onChangeShowTxt()
    }
  },
  doLogin() {
    var that = this
    if (!this.data.phone) {
      this.setData({
        msg: '请输入登录人手机号！'
      })
      this.showModal()
      return false
    }
    if (!this.data.code) {
      this.setData({
        msg: '请输入验证码！'
      })
      this.showModal()
      return false
    }
    wx.request({
      url: app.globalData.href + '/api/index/yzm_login',
      data: {
        app: 'customer_app',
        phone: that.data.phone,
        code: that.data.code,
        openid: wx.getStorageSync('openid')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var result = res.data;
        if (result && result.code == '200') {
          if (result.data) {
            wx.setStorageSync('customer', result.data)
            wx.switchTab({
              url: '../user/user',
            })
          }
        } else {
          that.setData({
            msg: result.msg
          })
          that.showModal()
        }
      }
    })
  },
  onChangeShowTxt: function () {
    var that = this;
    that.setData({
      showView: true
    })
  },

  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 0)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 0)
  },
  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })
  },

})
