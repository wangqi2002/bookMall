const BooksService = require("../services/BooksService")
const BooksController = {
    addBook: async (req, res) => {
        await BooksService.addBook(req.body, (result) => {
            res.send(result)
        });
    },

    deleteBook: async (req, res) => {
        // console.log(req.params.id)
        await BooksService.deleteBook(req.params.id, (result) => {
            res.send(result)
        });

    },

    getBook: async (req, res) => {
        await BooksService.getBook(null, (results) => {
            // console.log(results)
            res.json({ results })
        })
    },

    getBooknum: async (req, res) => {
        await BooksService.getBooknum(null, (results) => {
            // console.log(results)
            res.json({ results })
        })
    },

    getIsbn: async (req, res) => {
        // console.log(req.params.id)
        await BooksService.getIsbn(req.params.id, (result) => {
            // console.log(result)
            res.send(JSON.stringify(result))
        });
    },

    getbook: async (req, res) => {
        // console.log(req.params.id)
        await BooksService.getbook(req.params.id, (result) => {
            // console.log(result)
            res.send(JSON.stringify(result))
        });
    }
}

module.exports = BooksController
