import React, { useState, useEffect } from 'react';
import './EncounterForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EncounterForm = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    fetchTokenFromFirebase();
  }, []);

  const fetchTokenFromFirebase = async () => {
    try {
      const firebaseTokenUrl = 'https://rme-shazfa-mounira-default-rtdb.firebaseio.com/token.json';
      const response = await axios.get(firebaseTokenUrl);
      const tokenFromFirebase = response.data.token;
  
      if (tokenFromFirebase) {
        console.log('Token dari Firebase:', tokenFromFirebase);
        return tokenFromFirebase;
      } else {
        console.error('Token tidak ditemukan dari Firebase.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching access token from Firebase:', error);
      return null;
    }
  };
  
  

  const [formData, setFormData] = useState(() => {
    // Initialize formData dynamically based on input fields
    const initialFormData = {
      identifierSystem: 'http://sys-ids.kemkes.go.id/encounter/dfd92855-8cec-4a10-be94-8edd8a097344',
      identifierValue: '',
      subjectReference: 'Patient/100000030005',
      subjectDisplay: 'Jiwa tangguh',
      participantReference: 'Practitioner/N10000001',
      participantDisplay: 'Dokter Bronsig',
      periodStart: '2022-06-14T07:00',
      statusHistoryStart: '2022-06-14T07:00',
      serviceProviderReference: 'Organization/dfd92855-8cec-4a10-be94-8edd8a097344',
      locationReference: 'Location/b017aa54-f1df-4ec2-9d84-8823815d7228',
      locationDisplay: 'Ruang 1A, Poliklinik Bedah Rawat Jalan Terpadu, Lantai 2, Gedung G',
      // ... (add other form fields)
    };
    return initialFormData;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(() => ({
      // Reset form data here
      // ...
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const tokenFromFirebase = await fetchTokenFromFirebase();
  
      if (!tokenFromFirebase) {
        console.error('Access token is not available.');
        return;
      }
  
      console.log('Access Token:', tokenFromFirebase);
  
      const response = await fetch('http://localhost:5000/fhir-r4/v1/Encounter', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenFromFirebase}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log('Data berhasil dikirim:', response);
        resetForm(); // Reset the form after successful submission
      } else {
        console.error('Gagal mengirim data:', response);
      }
    } catch (error) {
      console.error('Gagal mengirim data:', error);
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Identifier System:
          <input type="text" name="identifierSystem" value={formData.identifierSystem} onChange={handleChange} readOnly />
        </label>
        <label>
          Identifier Value:
          <input type="text" name="identifierValue" value={formData.identifierValue} onChange={handleChange} />
        </label>
        <label>
          Subject Reference:
          <input type="text" name="subjectReference" value={formData.subjectReference} onChange={handleChange} />
        </label>
        <label>
          Subject Display:
          <input type="text" name="subjectDisplay" value={formData.subjectDisplay} onChange={handleChange} />
        </label>
        <label>
          Participant Reference:
          <input type="text" name="participantReference" value={formData.participantReference} onChange={handleChange} />
        </label>
        <label>
          Participant Display:
          <input type="text" name="participantDisplay" value={formData.participantDisplay} onChange={handleChange} />
        </label>
        <label>
          Period Start:
          <input type="datetime-local" name="periodStart" value={formData.periodStart} onChange={handleChange} />
        </label>
        <label>
          Status History Start:
          <input
            type="datetime-local"
            name="statusHistoryStart"
            value={formData.statusHistoryStart}
            onChange={handleChange}
          />
        </label>

        <label>
          Service Provider Reference:
          <input
            type="text"
            name="serviceProviderReference"
            value={formData.serviceProviderReference}
            onChange={handleChange}
          />
        </label>

        <label>
          Location Reference:
          <input type="text" name="locationReference" value={formData.locationReference} onChange={handleChange} />
        </label>
        <label>
          Location Display:
          <input type="text" name="locationDisplay" value={formData.locationDisplay} onChange={handleChange} />
        </label>
        {/* ... (Input fields lainnya) */}
        <button type="submit" style={{ backgroundColor: '#2196F3', color: '#ffffff' }}>
          Kirim Data
        </button>
      </form>
    </div>
  );
};

export default EncounterForm;
