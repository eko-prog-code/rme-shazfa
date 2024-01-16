import React, { useState, useEffect } from 'react'
import './EncounterForm.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const EncounterForm = () => {
  const navigate = useNavigate()
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    fetchTokenFromFirebase()
  }, [])

  const fetchTokenFromFirebase = async () => {
    try {
      const firebaseTokenUrl =
        'https://rme-shazfa-mounira-default-rtdb.firebaseio.com/token.json'
      const response = await axios.get(firebaseTokenUrl)
      const tokenFromFirebase = response.data.token

      if (tokenFromFirebase) {
        console.log('Token dari Firebase:', tokenFromFirebase)
        return tokenFromFirebase
      } else {
        console.error('Token tidak ditemukan dari Firebase.')
        return null
      }
    } catch (error) {
      console.error('Error fetching access token from Firebase:', error)
      return null
    }
  }

  const [formData, setFormData] = useState(() => {
    // Initialize formData dynamically based on input fields
    const initialFormData = {
      identifierSystem:
        'http://sys-ids.kemkes.go.id/encounter/dfd92855-8cec-4a10-be94-8edd8a097344',
      identifierValue: '',
      subjectReference: 'Patient/100000030005',
      subjectDisplay: 'Jiwa tangguh',
      participantReference: 'Practitioner/N10000001',
      participantDisplay: 'Dokter Bronsig',
      periodStart: '2022-06-14T07:00',
      statusHistoryStart: '2022-06-14T07:00',
      serviceProviderReference:
        'Organization/dfd92855-8cec-4a10-be94-8edd8a097344',
      locationReference: 'Location/b017aa54-f1df-4ec2-9d84-8823815d7228',
      locationDisplay:
        'Ruang 1A, Poliklinik Bedah Rawat Jalan Terpadu, Lantai 2, Gedung G',
      // ... (add other form fields)
    }
    return initialFormData
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData(() => ({
      // Reset form data here
      // ...
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    fetchTokenFromFirebase()
      .then((res) => saveData(res))
      .catch((err) => console.log(err))
  }

  const saveData = async (tokenFromFirebase) => {
    const data = {
      resourceType: 'Encounter',
      status: 'arrived',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'AMB',
        display: 'ambulatory',
      },
      subject: {
        reference: formData.subjectReference,
        display: formData.subjectDisplay,
      },
      participant: [
        {
          type: [
            {
              coding: [
                {
                  system:
                    'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                  code: 'ATND',
                  display: 'attender',
                },
              ],
            },
          ],
          individual: {
            reference: formData.participantReference,
            display: formData.participantDisplay,
          },
        },
      ],
      period: {
        start: formData.periodStart + ':00+07:00',
      },
      location: [
        {
          location: {
            reference: formData.locationReference,
            display: formData.locationDisplay,
          },
        },
      ],
      statusHistory: [
        {
          status: 'arrived',
          period: {
            start: formData.statusHistoryStart + ':00+07:00',
          },
        },
      ],
      serviceProvider: {
        reference: formData.serviceProviderReference,
      },
      identifier: [
        {
          system: formData.identifierSystem,
          value: formData.identifierValue,
        },
      ],
    }

    setLoading(true)
    axios
      .post('/Encounter', data, {
        headers: {
          Authorization: `Bearer ${tokenFromFirebase}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        console.log('data: ', res)
        resetForm()
      })
      .catch((err) => console.error('Gagal mengirim data:', err.response))
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Identifier System:
          <input
            type='text'
            name='identifierSystem'
            value={formData.identifierSystem}
            onChange={handleChange}
            readOnly
          />
        </label>
        <label>
          Identifier Value:
          <input
            type='text'
            name='identifierValue'
            value={formData.identifierValue}
            onChange={handleChange}
          />
        </label>
        <label>
          Subject Reference:
          <input
            type='text'
            name='subjectReference'
            value={formData.subjectReference}
            onChange={handleChange}
          />
        </label>
        <label>
          Subject Display:
          <input
            type='text'
            name='subjectDisplay'
            value={formData.subjectDisplay}
            onChange={handleChange}
          />
        </label>
        <label>
          Participant Reference:
          <input
            type='text'
            name='participantReference'
            value={formData.participantReference}
            onChange={handleChange}
          />
        </label>
        <label>
          Participant Display:
          <input
            type='text'
            name='participantDisplay'
            value={formData.participantDisplay}
            onChange={handleChange}
          />
        </label>
        <label>
          Period Start:
          <input
            type='datetime-local'
            name='periodStart'
            value={formData.periodStart}
            onChange={handleChange}
          />
        </label>
        <label>
          Status History Start:
          <input
            type='datetime-local'
            name='statusHistoryStart'
            value={formData.statusHistoryStart}
            onChange={handleChange}
          />
        </label>

        <label>
          Service Provider Reference:
          <input
            type='text'
            name='serviceProviderReference'
            value={formData.serviceProviderReference}
            onChange={handleChange}
          />
        </label>

        <label>
          Location Reference:
          <input
            type='text'
            name='locationReference'
            value={formData.locationReference}
            onChange={handleChange}
          />
        </label>
        <label>
          Location Display:
          <input
            type='text'
            name='locationDisplay'
            value={formData.locationDisplay}
            onChange={handleChange}
          />
        </label>
        {/* ... (Input fields lainnya) */}
        <button
          type='submit'
          style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
        >
          {loading ? 'Loading...' : 'Kirim Data'}
        </button>
      </form>
    </div>
  )
}

export default EncounterForm
