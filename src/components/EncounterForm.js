import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

const EncounterForm = ({ datas }) => {
  const apiUrl = "https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1";
  const [accessToken, setAccessToken] = useState(null);
  const [formData, setFormData] = useState(() => {
    // Function to format the date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;
    };
    // Initialize formData dynamically based on input fields
    const initialFormData = {
      identifierSystem:
        "http://sys-ids.kemkes.go.id/encounter/dfd92855-8cec-4a10-be94-8edd8a097344",
      identifierValue: "",
      subjectReference: "Patient/100000030005",
      subjectDisplay: datas.patient,
      participantReference: "Practitioner/N10000001",
      participantDisplay: datas.participant,
      periodStart: formatDate(datas.periodeStart),
      statusHistoryStart: formatDate(datas.periodeStart),
      serviceProviderReference:
        "Organization/dfd92855-8cec-4a10-be94-8edd8a097344",
      locationReference: "Location/b017aa54-f1df-4ec2-9d84-8823815d7228",
      locationDisplay:
        "Ruang 1A, Poliklinik Bedah Rawat Jalan Terpadu, Lantai 2, Gedung G",
      // ... (add other form fields)
    };
    return initialFormData;
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchTokenFromFirebase();
  }, []);

  const fetchTokenFromFirebase = async () => {
    try {
      const firebaseTokenUrl =
        "https://rme-shazfa-mounira-default-rtdb.firebaseio.com/token.json";
      const response = await axios.get(firebaseTokenUrl);
      const tokenFromFirebase = response.data.token;

      if (tokenFromFirebase) {
        console.log("Token dari Firebase:", tokenFromFirebase);
        setAccessToken(tokenFromFirebase);
        // return tokenFromFirebase
      } else {
        console.error("Token tidak ditemukan dari Firebase.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching access token from Firebase:", error);
      return null;
    }
  };

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
    fetchTokenFromFirebase()
      .then((res) => saveData(res))
      .catch((err) => console.log(err));
  };
  const saveData = async () => {
    const data = {
      resourceType: "Encounter",
      status: "arrived",
      class: {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "AMB",
        display: "ambulatory",
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
                    "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                  code: "ATND",
                  display: "attender",
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
        start: formData.periodStart,
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
          status: "arrived",
          period: {
            start: formData.statusHistoryStart,
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
    };

    setLoading(true);
    axios({
      method: "post",
      url: `${apiUrl}/Encounter`,
      data: data,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      console.log("data: ", res);
      resetForm();
    })
    .catch((err) => console.error("Gagal mengirim data:", err.response))
    .finally(() => setLoading(false));
  };

  return (
    <>
      <section className=" py-1 bg-blueGray-50">
        <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-gray-700 text-xl font-bold">Encounter</h6>
                <Link to={"/satusehat"}>
                  <Button
                    className=" text-white bg-[#2196F3] border-0 rounded-md py-2 px-5 focus:outline-none hover:bg-2196F3 text-sm"
                    type="submit"
                  >
                    Back
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleSubmit}>
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Patient Information
                </h6>

                <div className="flex flex-wrap">
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Identifier System:
                      </label>
                      <input
                        name="identifierSystem"
                        value={formData.identifierSystem}
                        onChange={handleChange}
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Identifier Value:
                      </label>
                      <input
                        name="identifierValue"
                        value={formData.identifierValue}
                        onChange={handleChange}
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Subject Reference:
                      </label>
                      <input
                        name="subjectReference"
                        value={formData.subjectReference}
                        onChange={handleChange}
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Subject Display:
                      </label>
                      <input
                        disabled
                        type="text"
                        className="border-blue-gray-400 text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full rounded-[7px] border border-t-transparent px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0"
                        value={formData.subjectDisplay}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Participant Reference:
                      </label>
                      <input
                        type="text"
                        name="participantReference"
                        value={formData.participantReference}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Participant Display:
                      </label>
                      <input
                        disabled
                        name="participantDisplay"
                        value={formData.participantDisplay}
                        onChange={handleChange}
                        type="text"
                        className="border-blue-gray-400 text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full rounded-[7px] border border-t-transparent px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Period Start:
                      </label>
                      <input
                        disabled
                        name="periodStart"
                        value={formData.periodStart}
                        onChange={handleChange}
                        type="text"
                        className="border-blue-gray-400 text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full rounded-[7px] border border-t-transparent px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Status History Start:
                      </label>
                      <input
                        disabled
                        name="statusHistoryStart"
                        value={formData.statusHistoryStart}
                        onChange={handleChange}
                        type="text"
                        className="border-blue-gray-400 text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full rounded-[7px] border border-t-transparent px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Service Provider Reference:
                      </label>
                      <input
                        name="serviceProviderReference"
                        value={formData.serviceProviderReference}
                        onChange={handleChange}
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Location Reference:
                      </label>
                      <input
                        name="locationReference"
                        value={formData.locationReference}
                        onChange={handleChange}
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlfor="grid-password"
                      >
                        Location Display:
                      </label>
                      <input
                        name="locationDisplay"
                        value={formData.locationDisplay}
                        onChange={handleChange}
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="inline-flex ml-2 mt-2  text-white bg-[#2196F3] border-0 rounded-md py-3 px-5 focus:outline-none hover:bg-2196F3 text-sm"
                >
                  {loading ? "Loading..." : "Kirim Data"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EncounterForm;
