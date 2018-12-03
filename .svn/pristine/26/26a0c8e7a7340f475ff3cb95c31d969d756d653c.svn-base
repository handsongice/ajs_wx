// pages/user/newsshow.js
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
    animationShowHeight:0,
    imageHeight: 0,
    customerId: '',
    imageWidth: 0,
    txtRealContent: '',
    txtContent: '',
    showMask: false,
    txtHeight: 0,
    info:{},
    list:[],
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
    var customer = wx.getStorageSync('customer')
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        var imgsLimit = [];
        var tempFilePaths = that.data.tempFilePaths;
        var imgs = that.data.imgs;
        console.log(res.tempFilePaths);
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          tempFilePaths[res.tempFilePaths[i]] = '';
          console.log(res.tempFilePaths[i])
          imgs.push(res.tempFilePaths[i]);
          wx.uploadFile({
            url: app.globalData.href + '/api/index/chat_img_upload',
            filePath: res.tempFilePaths[i],
            name: 'file',
            formData: {
              'app': 'customer_app',
              fromid: customer.code,
              toid: that.data.info.code,
            },
            complete: function () {
            },
            success(ret) {
              if (ret && ret.statusCode == '200') {
                that.loadList()
                console.log(ret.data)
              }
            }
          })
        };
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
  getMessage: function (e) {
    var val = e.detail.value;
    this.setData({
      message: val
    });
  },
  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
      }
    })
  },
  pustMessage: function () {
    let that = this;
    var customer = wx.getStorageSync('customer')
    wx.request({
      url: app.globalData.href + '/api/index/create_chartlog',
      data: {
        app: 'customer_app',
        fromid: customer.code,
        toid: that.data.info.code,
        message:that.data.message
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var result = res.data;
        if (result && result.code == '200') {
          that.setData({
            message:''
          })
          that.loadList()
        } else {
          wx.showToast({
            title: result.msg,
            duration: 2000
          });
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
  pageScrollToBottom: function (_h) {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: _h
      })
    }).exec()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    //底部显示隐藏
    showView: (options.showView == "true" ? true : false);
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var customer = wx.getStorageSync('customer')
    if (!customer) {
      wx.navigateTo({
        url: '../login/login_d'
      })
    }
  },
  customerInfo: function () {
    var that = this
    wx.request({
      url: app.globalData.href + '/api/index/get_customer_info',
      data: {
        app: 'customer_app',
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
            })
            wx.setNavigationBarTitle({
              title: result.data.name
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
    var customer = wx.getStorageSync('customer')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.href + '/api/index/show_chatlog',
      data: {
        app: 'customer_app',
        my: customer.code,
        friend: that.data.info.code,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '200') {
          if (result.data) {
            that.setData({
              list: result.data
            })
            that.pageScrollToBottom(result.data.length*100)
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
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
    setTimeout(function () {
      wx.redirectTo({
        url: 'group'
      })
    }, 2000)
  },

})