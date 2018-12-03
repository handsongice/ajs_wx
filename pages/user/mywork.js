// pages/user/my work.js
var app = getApp()
Page({
  data: {
    showView: true,
  },

  //删除事件
  del: function (e) {
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
          console.log('用户点击确定')
          this.data.items.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            items: this.data.items
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    //底部显示隐藏
    showView: (options.showView == "true" ? true : false);
  },



  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },

})