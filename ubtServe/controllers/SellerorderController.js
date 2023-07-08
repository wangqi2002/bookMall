const SellerorderService = require("../services/SellerorderService")
const SellerorderController = {
    addOrder: async (req, res) => {
        // console.log(req.body)

        await SellerorderService.addOrder(req.body, (result) => {
            res.send(result)
        });
    },

    updateOrder: async (req, res) => {
        // console.log(req.body, req.params.id)
        await SellerorderService.updateOrder(req.body, req.params.id, (result) => {
            res.send(result)
        });

    },

    deleteOrder: async (req, res) => {
        // console.log(req.params.id) 
        await SellerorderService.deleteOrder(req.params.id, (result) => {
            res.send(result)
        });

    },

    getOrder_id: async (req, res) => {
        await SellerorderService.getOrder_id(req.params.id, (results) => {
            // console.log(results)
            // 以json的形式返回
            res.json({ results })
        })
    },

    getOrder_status: async (req, res) => {
        // console.log(req.query)
        await SellerorderService.getOrder_status(req.query, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    },

    getOrder_status_page: async (req, res) => {
        console.log(req.query)
        await SellerorderService.getOrder_status_page(req.query, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    },

    getOrder_sAn: async (req, res) => {
        // console.log(req.params.id)
        await SellerorderService.getOrder_sAn(req.params.id, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    },

    getOrder_idstat: async (req, res) => {
        await SellerorderService.getOrder_idstat(req.query, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    }
}

module.exports = SellerorderController