import type { Game } from '@/features/game'
import type { Team } from '@/features/team'

export type Program = {
  game: Game
  start: string
  stop: string
  team: Team
}
