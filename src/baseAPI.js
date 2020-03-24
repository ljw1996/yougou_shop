// 公共的api函数封装
import wepy from 'wepy'
// 所有数据的基准路径
const baseURL = 'https://www.zhengzhicheng.cn/api/public/v1'

// 封装的一个弹框提示  一个无图标的toast @msg表示数据获取失败的内容
wepy.baseToast = function(msg = '获取数据失败！') {
    wepy.showToast({
        title: msg, //提示的内容,
        icon: 'none', //图标,
        duration: 1500 //延迟时间,
    })
}

// 封装一个get请求 @url请求的地址为相对路径 必须以/开头 @data请求的参数对象 没有就不填
wepy.get = function(url, data = {}) {
    return wepy.request({
        url: baseURL + url,
        method: 'GET',
        data
    })
}

// 封装一个post请求 @url请求的地址为相对路径 必须以/开头 @data请求的参数对象 没有就不填
wepy.post = function(url, data = {}) {
    return wepy.request({
        url: baseURL + url,
        method: 'POST',
        data
    })
}