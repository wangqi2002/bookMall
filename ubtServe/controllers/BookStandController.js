const BookStandService = require("../services/BookStandService")
const BookStandController = {
    addStand: async (req, res) => {
        // console.log(req.body)
        await BookStandService.addStand(req.body, (result) => {
            res.send(result)
        });
    },

    updateStand_location: async (req, res) => {
        // console.log(req.body, req.params.id)
        await BookStandService.updateStand_location(req.params.id, req.body, (result) => {
            res.send(result)
        });

    },

    updateStand_add: async (req, res) => {
        // console.log(req.body, req.params.id)
        await BookStandService.updateStand_add(req.params.id, (result) => {
            res.send(result)
        });

    },

    updateStand_reduce: async (req, res) => {
        // console.log(req.body, req.params.id)
        await BookStandService.updateStand_reduce(req.params.id, (result) => {
            res.send(result)
        });

    },

    deleteStand: async (req, res) => {
        // console.log(req.params.id)
        await BookStandService.deleteStand(req.params.id, (result) => {
            res.send(result)
        });

    },

    getStand: async (req, res) => {
        // console.log(req.params.id)
        await BookStandService.getStand(req.params.id, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    }
}

module.exports = BookStandController