import type { Bitrate } from './stream.interface'

export interface StreamEntity {
  bitrate: Bitrate
  created_at: Date
  expires_at: Date
  id: number
  media_id: string
  title: string
  url: string
}
