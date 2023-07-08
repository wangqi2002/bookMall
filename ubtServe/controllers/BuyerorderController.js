const BuyerorderService = require("../services/BuyerorderService")
const BuyerorderController = {
    addOrder: async (req, res) => {
        // console.log(req.body)
        await BuyerorderService.addOrder(req.body, (result) => {
            res.send(result)
        });
    },

    updateOrder: async (req, res) => {
        // console.log(req.body, req.params.id)
        await BuyerorderService.updateOrder(req.body, req.params.id, (result) => {
            res.send(result)
        });
    },

    deleteOrder: async (req, res) => {
        // console.log(req.params.id) 
        await BuyerorderService.deleteOrder(req.params.id, (result) => {
            res.send(result)
        });
    },

    getOrder_bookId: async (req, res) => {
        await BuyerorderService.getOrder_bookId(req.params.id, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    },

    getOrder_buyerId: async (req, res) => {
        await BuyerorderService.getOrder_buyerId(req.params.id, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    },

    getOrder_sellerId: async (req, res) => {
        await BuyerorderService.getOrder_sellerId(req.params.id, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    },

    getOrder_status: async (req, res) => {
        await BuyerorderService.getOrder_status(req.query, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    },

    getOrder_status_page: async (req, res) => {
        console.log(req.query)
        await BuyerorderService.getOrder_status_page(req.query, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    },

    getOrder_sAn: async (req, res) => {
        console.log(req.params.id)
        await BuyerorderService.getOrder_sAn(req.params.id, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    },

    getOrder_buyidStat: async (req, res) => {
        await BuyerorderService.getOrder_buyidStat(req.query, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    }
}

module.exports = BuyerorderController