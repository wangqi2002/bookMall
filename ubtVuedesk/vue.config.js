module.exports = {
    devServer: {
        host: "localhost",
        // https: true,
        proxy: {
            '/api': {
                target: 'http://106.ihuyi.com',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/books': {
                target: 'http://106.ihuyi.com',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': 'https://api.jike.xyz'
                }
            },
            '/node': {
                target: 'https://serve.sirbook.top',
                // target: 'http://localhost:4000',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/node': ''
                }
            },
            '/socket.io': {
                // 目标 API 地址
                target: 'https://serve.sirbook.top',
                // target: 'http://localhost:4000/',
                // 如果要代理 websockets
                ws: true,
                // 将主机标头的原点更改为目标URL
                changeOrigin: true
            }

        }
    }
}