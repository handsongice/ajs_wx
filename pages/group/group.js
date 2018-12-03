// pages/group/group.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 5,
    page: 1,
    hasMoreData: true,
    list: [],
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
        _type: 1,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          if (result.data) {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      page:1,
      list:[]
    })
    this.loadList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   page: 1,
    //   list: []
    // })
    // this.loadList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.loadList()
    } else {
      // wx.showToast({
      //   title: '没有更多数据',
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})