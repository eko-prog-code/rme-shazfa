const express = require('express');
const axios = require('axios');
const morgan = require('morgan');

const app = express();

let accessToken = null;

app.use(express.json());
app.use(morgan('combined'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  res.header('Access-Control-Allow-Headers', 'authorization,content-type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/get-access-token', async (req, res) => {
  try {
    // Ganti URL Firebase Realtime Database sesuai kebutuhan
    const response = await axios.get('https://rme-shazfa-mounira-default-rtdb.firebaseio.com/token.json');
    accessToken = response.data.access_token;
    console.log('Access token obtained:', accessToken);
    res.json({ success: true, accessToken });
  } catch (error) {
    console.error('Error handling /get-access-token:', error);
    res.status(500).json({ type: 'error', message: error.message });
  }
});

app.post('/fhir-r4/v1/Encounter', async (req, res) => {
  try {
    const formData = req.body;

    console.log('Sending request with access token:', accessToken);

    const externalApiUrl = 'https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1/Encounter';
    const externalApiResponse = await axios.post(externalApiUrl, formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(201).json({ success: true, externalApiResponse: externalApiResponse.data });
  } catch (error) {
    console.error('Error handling POST request:', error);
    res.status(500).json({ type: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
