import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        // 购物车数据列表
        cart: []
    }

    onLoad() {
        // 读取全局的购物车列表保存到本页面私有数据carts中
        this.cart = this.$parent.globalData.cart
    }

    methods = {
        // 监听商品数量变化事件
        countChange(e) {
            const count = e.detail
            const id = e.target.dataset.id
            this.$parent.updataGoodsCount(id, count)
        },
        // 监听复选框变化的事件
        statusChange(e) {
            // 当前最新的的选定状态
            const status = e.detail
                // 当前点击的商品id
            const id = e.target.dataset.id
            this.$parent.updataGoodsStatus(id, status)
        },
        // 删除商品事件 根据id
        deleteGoods(id) {
            this.$parent.removeGoodsById(id)
        },
        // 监听全选的改变事件
        onFullChange(e) {
            this.$parent.updataAllGoodsStatus(e.detail)
        },
        // 提交订单
        submitOrder() {
            if (this.amount <= 0) {
                return wepy.Toast('订单为空无法提交!')
            }

            wepy.navigateTo({
                url: '/pages/order'
            })
        }
    }

    computed = {
        // 判断购物车是否为空
        isEmpty() {
            if (this.cart.length <= 0) {
                return true
            }
            return false
        },
        // 计算总价格 单位是 分
        amount() {
            // 单位是元
            let total = 0
                // 循环遍历数组
            this.cart.forEach(x => {
                // 如果被勾选
                if (x.isCheck) {
                    // 每一项的价格 * 每一项的数量
                    total += x.price * x.count
                }
            })

            // 单位从元换算成分
            return total * 100
        },
        // 是否全选
        isFullChecked() {
            // 获取所有商品个数
            const allCount = this.cart.length

            let c = 0
            this.cart.forEach(x => {
                if (x.isCheck) {
                    c++
                }
            })

            return allCount === c
        }
    }
}