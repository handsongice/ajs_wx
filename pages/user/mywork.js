// pages/user/my work.js
var app = getApp()
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    pageSize: 5,
    hasMoreData: true,
    page: 1,
    list: [],
    customerId: '',
  },
  onLoad: function (options){
    var customer = wx.getStorageSync('customer')
    if (!customer || !customer.id) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '共建人信息异常！',
        success: function () {
          wx.navigateBack({})
        }
      })
    }
    this.setData({
      customerId: customer.id,
    })
    // this.loadList()
  },
  onShow: function () {
    this.setData({
      hasMoreData: true,
      page: 1,
      list: [],
    })
    this.loadList()
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
  loadList: function () {
    var that = this;
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
        _type: 2,
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
  //删除事件
  del: function (e) {
    let pid = e.currentTarget.dataset.pid;
    let that = this
    if (!pid) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '作品信息异常！',
        success: function () {
        }
      })
    }
    wx.showModal({
      title: '提示',
      content: '确认要删除此条作品吗？',
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#4b4b4b",
      confirmText: "确定",
      confirmColor: "#b28147",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.href + '/api/index/del_post',
            data: {
              app: 'customer_app',
              customer_id: that.data.customerId,
              post_id: pid,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              var result = res.data;
              if (result && result.code == '200') {
                that.setData({
                  page: 1,
                  hasMoreData: true,
                  list: [],
                })
                that.loadList()
              } else {
                wx.showToast({
                  title: result.msg,
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

})