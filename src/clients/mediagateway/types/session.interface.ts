export interface InitSessionResponse {
  data: {
    initSession: null | Session
  }
  errors?: {
    extensions: {
      classification: string
      code: string
      executionId: string
    }
    location: string[]
    message: string
  }[]
}

export interface Session {
  clientExperience: string
  deviceId: string
  entitlements: {
    code: string
  }[]
  features: string[]
  location: {
    countryCode: string
    latitude: number
    longitude: number
    regionName: null | string
    zipCode: string
  }
  sessionId: string
}
