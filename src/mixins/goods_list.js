import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        // 查询关键词
        query: '',
        // 分类ID
        cid: '',
        // 页数索引  默认第一页
        pagenum: 1,
        // 每页长度  默认20条数据 
        pagesize: 20,
        // 数据列表对象
        goodsList: [],
        // 总数据条数
        total: 0,
        // 数据是否加载完毕的布尔值
        isFinish: false,
        // 当前数据是否正在请求中
        isLoading: false
    }

    onLoad(options) {
        console.log(options);
        // 如果没传参数默认为空字符串
        this.query = options.query || ''
        this.cid = options.cid || ''
        this.getGoodsList()
    }

    methods = {
        // 根据商品的id点击跳转到商品详情页面
        goGoodsDetail(goods_id) {
            wepy.navigateTo({
                url: '/pages/goods_detail/main?goods_id=' + goods_id
            })
        }
    }

    // 获取商品列表数据
    async getGoodsList(callback) {
        // 当前数据开始请求
        this.isLoading = true
            // 发起网络请求获得数据 
        const { data: res } = await wepy.get('/goods/search', {
            query: this.query,
            cid: this.cid,
            pagenum: this.pagenum,
            pagesize: this.pagesize
        })
        console.log(res);
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }

        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
        this.isLoading = false
        this.$apply()
        callback && callback()
    }

    // 上拉加载更多 小程序的触底事件onReachBottom()
    onReachBottom() {
        // 判断是否正在请求数据中
        if (this.isLoading) {
            return
        }
        // 先判断有没有下一页的数据 防止不必要的数据请求 当前的页面值 * 当前页面显示的条数 >= 总数据
        if (this.pagenum * this.pagesize >= this.total) {
            // 页面加载完毕了
            this.isFinish = true
            return
        }
        this.pagenum++
            this.getGoodsList()
    }

    // 下拉刷新的时候 重置当前页码数 总数据条数 商品数据数组  是否发起请求中 是否加载完毕
    onPullDownRefresh() {
        this.pagenum = 1
        this.total = 0
        this.goodsList = []
        this.isFinish = this.isLoading = false

        // 重新发起数据请求
        this.getGoodsList(() => {
            // 传递一个回调函数停止下拉刷新
            wepy.stopPullDownRefresh()
        })
    }
}