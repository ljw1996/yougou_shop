import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        active: 0,
        // 全部订单列表
        allOrderList: [],
        // 待付款的订单列表
        waitOrderList: [],
        // 已付款的订单列表
        finishOrderList: []
    }

    onLoad() {
        this.getOrderList(this.active)
    }

    methods = {
            // 切换标签页
            tabChanged(e) {
                this.active = e.detail.index
                this.getOrderList(this.active)
            }
        }
        // 获取列表的索引
    async getOrderList(index) {
        console.log(index);
        const { data: res } = await wepy.get('http://ip:8888/api/public/v1/my/orders/all', { type: index + 1 })

        if (res.meta.status !== 200) {
            return wepy.baseToast('查询订单失败!')
        }

        res.message.orders.forEach(x => (x.order_detail = JSON.parse(order_detail)))
        if (index === 0) {
            this.allOrderList = res.message.orders
        } else if (index === 1) {
            this.waitOrderList = res.message.orders
        } else if (index === 2) {
            this.finishOrderList = res.message.orders
        } else {
            wepy.baseToast('订单类型错误')
        }
        this.$apply()
    }
}