export const API_SATU_SEHAT =
  'https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1'

export const IS_DEV =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
