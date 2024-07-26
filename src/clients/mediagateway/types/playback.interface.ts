export interface Playback {
  adExperience: {
    adEngineIdentifiers: any[]
    adExperienceTypes: string[]
    adsEnabled: boolean
  }
  adScenarios: any[]
  heartbeatInfo: {
    interval: number
    url: string
  }
  playback: {
    cdn: string
    expiration: string
    token: string
    url: string
  }
  playbackSessionId: string
  trackingObj: {
    adExperience: string
    assetName: string
    categoryType: string
    conid: string
    contentRestrictions: string
    contentType: string
    features: string
    fguid: string
    isLive: string
    locationName: string
    market: string
    med: string
    pbs: string
    plt: string
    productType: string
    prt: string
    state: string
    userid: string
  }
}

export interface InitPlaybackSessionResponse {
  data: {
    initPlaybackSession: Playback | null
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

export interface InitPlaybackSessionDto {
  accessToken: string
  deviceId: string
  mediaId: string
  sessionId: string
}
