import { Team } from '@/features/team'

export interface Game {
  approximateEndDate: Date
  blackedOut: boolean
  description: string
  freeGame: boolean
  mediaFeedType: 'AWAY' | 'HOME'
  mediaId: string
  mediaState: 'MEDIA_ARCHIVE' | 'MEDIA_OFF' | 'MEDIA_ON'
  opponent: Team
  startDate: Date
  team: string
  title: string
}
