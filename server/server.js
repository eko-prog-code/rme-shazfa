const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import paket cors
const app = express();

// Middleware untuk menangani CORS
// Middleware untuk menangani CORS
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware untuk meng-handle JSON body pada request
app.use(express.json());

// Endpoint untuk menerima data dari EncounterForm.js
app.post('/Encounter', async (req, res) => { // Ubah endpoint menjadi '/Encounter'
    console.log('Received request with payload:', req.body);

    try {
        // Ambil data dari body permintaan
        const encounterData = req.body;

        // Token otentikasi dari EncounterForm.js
        const accessToken = req.headers.authorization.replace('Bearer ', '');

        // Kirim ulang data ke endpoint eksternal
        const apiEndpoint = 'https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1/Encounter';
        const response = await axios.post(apiEndpoint, encounterData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Respon dari endpoint eksternal diteruskan kembali ke EncounterForm.js
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Jalankan server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
