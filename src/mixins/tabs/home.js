import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        // 轮播图数据数组
        swiperList: [],
        // 分类数据
        cateList: [],
        // 楼层数据
        floorList: []
    }

    onLoad() {
        // 获取轮播图数据
        this.getSwiperData(),
            // 获取分类数据
            this.getCateData()
            // 获取楼层数据
        this.getFloorData()
    }

    methods = {
        // 点击图片跳转地址
        goGoodsList(url) {
            wepy.navigateTo({
                url
            })
        }
    }

    // 获取轮播图数据
    async getSwiperData() {
        const { data: res } = await wepy.get('/home/swiperdata')

        if (res.meta.status !== 200) {
            // 微信小程序提示文本api
            return wepy.baseToast()
        }
        this.swiperList = res.message
        this.$apply()
    }

    // 获取首页相关的分类数据
    async getCateData() {
        const { data: res } = await wepy.get('/home/catitems')

        console.log(res)
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.cateList = res.message
        this.$apply()
        console.log(this.cateList)
    }

    // 获取楼层区域数据
    async getFloorData() {
        const { data: res } = await wepy.get('/home/floordata')

        console.log(res);
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.floorList = res.message
        this.$apply()
        console.log(this.floorList);

    }
}