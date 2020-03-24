import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        // 搜索框中的默认字符串
        value: '',
        // 搜索框的建议数据
        suggestList: [],
        // 搜索历史列表
        keyList: []
    }
    onLoad() {
        const keyList = wepy.getStorageSync('kw') || []
        this.keyList = keyList

    }
    methods = {
        // 当搜索内容发生改变时触发
        onChange(e) {
            console.log(e.detail);
            this.value = e.detail.trim()
            if (e.detail.trim().length <= 0) {
                this.suggestList = []
                return
            }
            this.getSuggestList(e.detail)
        },
        // 搜索事件触发
        onSearch(e) {
            // console.log(e.detail);
            const kw = e.detail.trim()
            if (kw.length <= 0) {
                return
            }
            //  如果有不存在的就追加
            if (this.keyList.indexOf(kw) === -1) {
                this.keyList.unshift(kw)
            }
            // 从下标为0的数据截取，截取10条数据 最多存储10条数据 slice方法会生成一个新数组 需重新赋值
            this.keyList = this.keyList.slice(0, 10)
                // 把用户填写的搜索关键词保存到storge中
            wepy.setStorageSync('kw', this.keyList)

            wepy.navigateTo({
                url: '/pages/goods_list?query=' + kw
            });


        },
        // 取消搜索事件触发
        onCancel() {
            this.suggestList = []
        },

        // 点击搜索建议项 跳转到商品详情页
        goGoodsDetail(goods_id) {
            wepy.navigateTo({
                url: '/pages/goods_detail/main?goods_id=' + goods_id
            });

        },
        // 点击tag标签 跳转到对应的商品列表页面 传递参数query
        goGoodsList(query) {
            wepy.navigateTo({
                url: '/pages/goods_list?query=' + query
            })
        },
        // 清除历史记录
        clearHistory() {
            // 将历史记录数组清空
            this.keyList = []
                // 将存储在storage中的数据重置为空数组
            wepy.setStorageSync('kw', [])
        }
    }

    computed = {
        isShowHistory() {
            if (this.value.length <= 0) {
                // 展示搜索历史区域
                return true
            } else {
                // 展示搜索建议区域
                return false
            }
        }
    }

    // 获取搜索建议列表
    async getSuggestList(searchStr) {
        const { data: res } = await wepy.get('/goods/qsearch', { query: searchStr })

        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.suggestList = res.message
        this.$apply()
        console.log(this.suggestList);
    }
}