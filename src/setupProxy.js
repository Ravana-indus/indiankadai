// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://indiankadai.com',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '/api' // keeps /api in the path
      },
      onProxyReq: function(proxyReq, req, res) {
        // Log proxy requests
        console.log('Proxying:', req.method, req.path);
      },
      onProxyRes: function(proxyRes, req, res) {
        // Log proxy responses
        console.log('Proxy response status:', proxyRes.statusCode);
      }
    })
  );
};