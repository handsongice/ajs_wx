// pages/user/mygroup.js
var app = getApp()
Page({
  data: {
    
  },
  onLoad: function (options) {

  },
  //删除事件
  del: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认要删除此条圈子吗？',
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
  }
})