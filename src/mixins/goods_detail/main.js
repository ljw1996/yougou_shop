import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        // 商品id
        goods_id: '',
        // 商品详情数据对象
        goodsInfo: {},
        // 收货地址信息
        addressInfo: null
    }

    // 页面加载事件
    onLoad(options) {
        console.log(options);
        // 将传递过来id值转存到当前页面的私有数据goods_id上
        this.goods_id = options.goods_id
            // 调用获取商品详情数据的函数
        this.getGoodsInfo()
    }

    methods = {
        // 预览图片
        preview(current) {
            wepy.previewImage({
                // 所有图片的路径
                urls: this.goodsInfo.pics.map(x => x.pics_mid),
                // 当前看到的图片
                current: current
            })
        },

        // 获取收货地址
        async chooseAddress() {
            const res = await wepy.chooseAddress().catch(err => err)

            console.log(res);


            if (res.errMsg !== "chooseAddress:ok") {
                return wepy.baseToast('获取收货地址失败')
            }
            this.addressInfo = res
            wepy.setStorageSync('address', res)
            this.$apply()
        },

        // 加入购物车
        addToCart() {
            // 获取到当前商品的所有信息
            // console.log(this.$parent.globalData);
            this.$parent.addGoodsToCart(this.goodsInfo)

            wepy.showToast({
                title: '已加入购物车',
                icon: 'success'
            })
        }
    }

    computed = {
        addressStr() {
            if (this.addressInfo === null) {
                return '请选择收货地址'
            }
            const addr = this.addressInfo
            const str = addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
            return str
        },
        // 所有已经勾选的商品数量
        total() {
            return this.$parent.globalData.total
        }
    }

    // 获取商品详情
    async getGoodsInfo() {
        const { data: res } = await wepy.get('/goods/detail', {
            goods_id: this.goods_id
        })

        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.goodsInfo = res.message
        this.$apply()
    }
}