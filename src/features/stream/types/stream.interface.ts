export interface Bitrate {
  '192'
  '450'
  '800'
  '1200'
  '1800'
  '2500'
  '3500'
  '5600'
}

export interface Stream {
  bitrate: Bitrate
  expiresAt: Date
  id: number
  mediaId: string
  title: string
  url: string
}
