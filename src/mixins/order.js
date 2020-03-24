import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        addressInfo: null,
        cart: [],
        // 是否登录成功
        isLogin: false
    }

    onLoad() {
        // 读取收货地址
        this.addressInfo = wepy.getStorageSync('address') || null
            // 从购物车列表中将被勾选的商品过滤出来形成一个新数组
        const newArr = this.$parent.globalData.cart.filter(x => x.isCheck)
        this.cart = newArr
    }


    methods = {
        // 选择收货地址
        async chooseAddress() {
            const res = await wepy.chooseAddress().catch(err => err)

            if (res.errMsg !== 'chooseAddress:ok') {
                return
            }

            this.addressInfo = res
            wepy.setStorageSync('address', res)
            this.$apply()
        },
        // 获取用户信息
        async getUserMsg(userinfo) {
            // 判断是否获取用户信息失败
            if (userinfo.detail.errMsg !== 'getUserInfo:ok') {
                return wepy.baseToast('获取用户信息失败')
            }
            console.log(userinfo);

            const loginRes = await wepy.login()
            console.log(loginRes);

            if (loginRes.errMsg !== 'login:ok') {
                return wepy.baseToast('微信登录失败')
            }

            // 登录的参数
            const loginParams = {
                code: loginRes.code,
                encryptedData: userinfo.detail.encryptedData,
                iv: userinfo.detail.iv,
                rawData: userinfo.detail.rawData,
                signature: userinfo.detail.signature
            }
            console.log(loginParams);


            // 发起登录请求 换取登录成功之后的token
            const { data: res } = await wepy.post('/users/wxlogin', loginParams)
            console.log(res);
            if (res.meta.status !== 200) {
                return wepy.baseToast('微信登录失败')
            }
            wepy.setStorageSync('token', res.message.token)
            this.isLogin = true
            this.$apply()

        },
        // 支付订单
        async onSubmit() {
            //    判断金额是否大于0 地址不能为空
            if (this.amount <= 0) {
                return wepy.baseToast('订单金额不能为0!')
            }
            if (this.addressStr.length <= 0) {
                return wepy.baseToast('请选择收货地址!')
            }


            // 创建订单
            const { data: createResult } = await wepy.post('http://ip:8888/api/public/v1/my/orders/create', {
                    order_price: '0.01',
                    consignee_addr: this.addressStr,
                    order_detail: JSON.stringify(this.cart),
                    goods: this.cart.map(x => {
                        return {
                            goods_id: x.id,
                            goods_number: x.count,
                            goods_price: x.price
                        }
                    })
                })
                // 创建订单失败
            if (createResult.meta.status !== 200) {
                return wepy.baseToast('创建订单失败!')
            }
            // 创建成功
            const orderInfo = createResult.message
            console.log(orderInfo);

            // 生成预支付订单
            const { data: orderResult } = await wepy.post('http://ip:8888/api/public/v1/my/orders/req_unifiedorder', {
                    order_number: orderInfo.order_number
                })
                //  生成订单失败
            if (orderResult.meta.status !== 200) {
                return wepy.baseToast('生成订单未成功!')
            }
            // 生成订单成功 调用微信支付API requestPayment
            const payResult = wepy.requestPayment(orderResult.message.pay).catch(err => err)
            console.log(payResult);
            // 用户取消了支付
            if (payResult.errMsg === 'requestPayment:failcancel') {
                return wepy.baseToast('您已经取消了支付')
            }
            //    用户完成了支付
            const { data: paycheckResult } = await wepy.post('http://ip:8888/api/public/v1/my/orders/chkOrder', {
                order_number: orderInfo.order_number
            })

            if (paycheckResult.meta.status !== 200) {
                return wepy.baseToast('订单支付失败!')
            }
            // 提示支付成功
            wepy.showToast({
                title: '支付成功!'
            })

            // 跳转到订单列表页面
            wepy.navigateTo({
                url: '/pages/orderlist'
            });

        }
    }

    computed = {
        // 判断是否有收货地址
        isHaveAddress() {
            if (this.addressInfo === null) {
                // 没有收货地址
                return false
            }
            return true
        },
        // 拼接收货地址信息的省市区
        addressStr() {
            if (this.addressInfo === null) {
                return
            }

            return this.addressInfo.provinceName + this.addressInfo.cityName + this.addressInfo.countyName +
                this.addressInfo.detailInfo
        },
        // 当前订单的总价格
        amount() {
            let total = 0
            this.cart.forEach(x => {
                total += x.price * x.count
            })

            return total * 100
        }
    }

}