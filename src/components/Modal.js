import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Modal = ({ handleCloseModal, patientId, patientName, token }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token)
        .then(() => {
          console.log("Token berhasil dicopy");
          setCopySuccess(true);
          // Tambahkan logika atau tampilkan pesan sukses di sini jika diperlukan
        })
        .catch((err) => {
          console.error("Error copying token:", err);
          // Tambahkan logika atau tampilkan pesan error di sini jika diperlukan
        });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <div className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    {patientName}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Generate ID: {patientId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Generate Token: {token}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <Link to="/encounterform"> {/* Use Link component for navigation */}
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 sm:ml-3 sm:w-auto"
                >
                  Go to Encounter Form
                </button>
              </Link>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={handleCopyToken}
              >
                Copy Token
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
