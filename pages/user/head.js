// pages/user/head.js
Page({
  data: {

    imgs: [],//本地图片地址数组
    message: '',
    submitTime: 1,
    tempFilePaths: {},//本地图片地址对象
    canChoose: true,//是否可选图片
    imgString: '',//图片拼接后的字符串

    //普通选择器：（普通数组）
    array: ['未选择', '商品问题', '物流问题', '包装原因', '其他'],
    index: 0,
    backarray: ['未选择', '司机带回', '无需退货'],
    backindex: 0,
    hopearray: ['未选择', '退货', '换货', '赔付', '截单'],
    hopeindex: 0,
    showView: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //底部显示隐藏
    showView: (options.showView == "true" ? true : false);
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
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          tempFilePaths[res.tempFilePaths[i]] = '';
          console.log(res.tempFilePaths[i])
          imgs.push(res.tempFilePaths[i]);
        };
        if (imgs.length > 1) {
          for (var i = 0; i < 1; i++) {
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
        if (imgsPaths.length >= 1) {
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


  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
    setTimeout(function () {
      wx.redirectTo({
        url: 'user'
      })
    }, 2000)
  },



})