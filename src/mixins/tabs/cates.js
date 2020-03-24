import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        // 分类页面的数据
        categoriesList: [],
        // 默认激活的索引项
        active: 0,
        // 屏幕可用高度
        windowHeight: 0,
        // 二级分类数据
        secondCategories: []
    }

    onLoad() {
        this.getWindowHeight()
            // 获取分类页面数据
        this.getCateGoriesData()
    }

    methods = {
        onChange(e) {
            // console.log(e.detail);
            // 获取一级分类下的children属性里面的二级分类
            this.secondCategories = this.categoriesList[e.detail].children
            console.log(this.secondCategories);
        },
        // 点击跳转商品列表页
        goGoodsList(cid) {
            wepy.navigateTo({
                url: '/pages/goods_list?cid=' + cid
            })
        }
    }

    // 获取屏幕可用高度
    async getWindowHeight() {
        const res = await wepy.getSystemInfo()
        if (res.errMsg === 'getSystemInfo:ok') {
            this.windowHeight = res.windowHeight
            this.$apply()
        }
    }



    // 获取分类页面数据
    async getCateGoriesData() {
        const { data: res } = await wepy.get('/categories')
            // console.log(res);

        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }

        this.categoriesList = res.message
        this.secondCategories = res.message[0].children
        this.$apply()
        console.log(this.categoriesList);

    }

}