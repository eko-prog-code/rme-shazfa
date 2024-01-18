const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'https://rme-shazfa.vercel.app/encounter', // Replace with your actual frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.post('/processAndPost', async (req, res) => {
    console.log('Received request with payload:', req.body);

    try {
        const encounterData = req.body;
        const accessToken = req.headers.authorization.replace('Bearer ', '');

        // Process the form data or perform any necessary actions

        // Use cURL to post data to the external endpoint
        const apiEndpoint = 'https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1/Encounter';
        const curlCommand = `curl -X POST ${apiEndpoint} -H "Authorization: Bearer ${accessToken}" -H "Content-Type: application/json" -d '${JSON.stringify(encounterData)}'`;

        exec(curlCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Error:', error.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            // Assuming the API response is in JSON format
            const responseData = JSON.parse(stdout);

            // Optionally, you can process responseData further

            // Send the processed data or response back to the client
            res.json({ success: true, data: responseData });
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
