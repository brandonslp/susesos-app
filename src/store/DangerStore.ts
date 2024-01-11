import { map } from "nanostores"

export interface Stats {
  danger: number
}

export const $danger = map<Stats>({
  danger: 10
})