import { map } from "nanostores"

export interface TravelStats {
  distance1: number
  distance2: number
  distance3: number
}

export const $travelStats = map<TravelStats>({
  distance1: 0,
  distance2: 0,
  distance3: 0,
})