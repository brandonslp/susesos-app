import { map } from "nanostores"

export interface TravelStats {
  danger: number
  distance: string
}

export const $travelStats = map<TravelStats>({
  danger: 10,
  distance: "0"
})