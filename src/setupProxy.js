const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');

module.exports = function(app) {
  app.use(
    '/fhir-r4/v1/Encounter',
    createProxyMiddleware({
      target: 'http://localhost:5000',  // Ganti dengan URL server API Anda
      changeOrigin: true,
      onProxyReq: async (proxyReq, req, res) => {
        try {
          // Ambil token dari Firebase Realtime Database
          const response = await axios.get('https://rme-shazfa-mounira-default-rtdb.firebaseio.com/token.json');
          const accessToken = response.data.token;

          // Sertakan token dalam header permintaan
          if (accessToken) {
            proxyReq.setHeader('Authorization', `Bearer ${accessToken}`);
          }
        } catch (error) {
          console.error('Gagal mengambil token dari Firebase:', error.message);
        }
      },
    })
  );
};
