// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    msgCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    let customer = wx.getStorageSync('customer')
    if (!customer || !customer['id']) {
      wx.reLaunch({
        url: '../login/login_d',
      })
    }
    this.setData({
      info: customer
    })
  },

  showMsgCount: function (){
    wx.request({
      url: app.globalData.href + '/api/index/show_msg_count',
      data: {
        app: 'customer_app',
        my: that.data.info.code,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          that.setData({
            msgCount: result.data,
          })
        }
      }
    });
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
