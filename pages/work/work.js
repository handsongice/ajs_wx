// pages/group/add.js
var app = getApp();
Page({
  data: {

    imgs: [],//本地图片地址数组
    message: '',
    submitTime: 1,
    tempFilePaths: {},//本地图片地址对象
    canChoose: true,//是否可选图片
    imgString: '',//图片拼接后的字符串
    showView: true,
    animationData: "",
    showModalStatus: false,
    imageHeight: 0,
    imageWidth: 0,
    txtRealContent: '',
    txtContent: '',
    showMask: false,
    txtHeight: 0,

  },

  textAreaLineChange(e) {
    this.setData({ txtHeight: e.detail.height })
  },
  txtInput(e) {
    this.setData({ txtContent: e.detail.value })
  },
  changeMaskVisible(e) {
    if (!this.data.showMask) {
      // 将换行符转换为wxml可识别的换行元素 <br/>
      const txtRealContent = this.data.txtContent.replace(/\n/g, '<br/>')
      this.setData({ txtRealContent })
    }
    this.setData({ showMask: !this.data.showMask })
  },


  //添加上传图片
  chooseImageTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  noChoose: function () {
    var that = this;
    that.alert("最多只能上传9张哦~")
  },
  // 选取图片
  chooseWxImage: function (type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        var imgsLimit = [];
        var tempFilePaths = that.data.tempFilePaths;
        var imgs = that.data.imgs;
        console.log(res.tempFilePaths);
        tempFilePaths[res.tempFilePaths[i]] = '';
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.href + '/api/index/img_upload',
            filePath: res.tempFilePaths[i],
            name: 'file',
            formData: {
              'app': 'customer_app',
            },
            complete: function () {
            },
            success(ret) {
              if (ret && ret.statusCode == '200') {
                var _data = JSON.parse(ret.data)
                imgs.push(_data.data);
                if (imgs.length > 9) {
                  for (var i = 0; i < 9; i++) {
                    imgsLimit.push(imgs[i]);
                  }
                  that.setData({
                    imgs: imgsLimit,
                    tempFilePaths: tempFilePaths,
                  });
                } else {
                  that.setData({
                    imgs: imgs,
                    tempFilePaths: tempFilePaths,
                  });
                }
                if (imgsPaths.length >= 9) {
                  that.setData({
                    canChoose: false,
                  });
                } else {
                  that.setData({
                    canChoose: true,
                  });
                };
              } else {
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: ret.msg,
                  success: function () {
                  }
                })
              }
            }
          })
        };

      },
    })
  },
  //删除上传图片
  reom(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let imgs = that.data.imgs
    for (var i = 0; i < imgs.length; i++) {
      if (index == i) {
        imgs.splice(i, 1);
        i--;
      }
    }

    that.setData({
      imgs: imgs,
      canChoose: true,
    });

  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      backindex: e.detail.value
    })
  },
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      hopeindex: e.detail.value
    })
  },

  //日期选择器：
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  //时间选择器：
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
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
    let imgs = this.data.imgs
    var customer = wx.getStorageSync('customer')
    if (!customer) {
      wx.navigateTo({
        url: '../login/login_d'
      })
    }
    if (!that.data.txtContent) {
      this.changeMaskVisible()
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.href + '/api/index/create_post',
      method: 'POST',
      data: {
        app: 'customer_app',
        customer_id: customer.id,
        title: that.data.txtContent,
        _type: 2,
        imgs: imgs
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          if (!result.data) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '发布失败',
            })
            return false
          }
          that.setData({
            showView: (!that.data.showView)
          })
          setTimeout(function () {
            wx.navigateBack({})
          }, 1000)
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: result.msg,
            success: function () {
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

})